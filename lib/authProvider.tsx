import {
  router,
  useSegments,
  useRootNavigation,
  useNavigation,

} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../lib/notifications";
import * as Device from "expo-device";
import AuthContext from "./authContext";
import React, { useEffect, useState, useRef } from "react";

import { Platform } from "react-native";
import { auth } from "../lib/firebase";
import { IUser } from "./types";

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// const unsub = onAuthStateChanged(auth, (user) => {
//   const navigation = useNavigation();

//   console.log("onAuthStateChange", user);

//   if (!user) {
//     //@ts-ignore
//     navigation?.navigate("(auth)");
//   } else {
//     //@ts-ignore
//     navigation?.navigate("(tabs)");
//   }
// });

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
  const [isNavigationReady, setNavigationReady] = useState(false);
  const [isUserReady, setUserReady] = useState(false);
  const rootNavigation = useRootNavigation();
  const segments = useSegments();

  const navigation = useNavigation();

  const useEffectDebugger = (
    effectHook,
    dependencies,
    dependencyNames = [],
  ) => {
    const previousDeps = usePrevious(dependencies, []);

    const changedDeps = dependencies.reduce((accum, dependency, index) => {
      if (dependency !== previousDeps[index]) {
        const keyName = dependencyNames[index] || index;
        return {
          ...accum,
          [keyName]: {
            before: previousDeps[index],
            after: dependency,
          },
        };
      }

      return accum;
    }, {});

    if (Object.keys(changedDeps).length) {
      // console.log("[use-effect-debugger] ", changedDeps);
    }

    useEffect(effectHook, dependencies);
  };

  const usePrevious = (value, initialValue) => {
    const ref = useRef(initialValue);
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  useEffectDebugger(() => {
    const unsubscribe = auth().onAuthStateChanged((user: any) => {
      if (!user) {
        //@ts-ignore
        setUserReady(true);

        //navigation?.navigate("(auth)");
        //router.replace("/signIn");
        //SplashScreen.hideAsync();
      } else {
        //console.log("onAuthStateChange We have a User: ", user);
        setUserReady(true);
        if (Device.isDevice) {
          registerForPushNotificationsAsync();
        }
        //console.log("onAuthStateChange We have a User: ", user);
        //@ts-ignore
        //navigation?.navigate("(tabs)");
        router.replace("/");
        //SplashScreen.hideAsync();
      }
    });

    return unsubscribe;
  }, []);

  useEffectDebugger(() => {
    const unsubscribe = rootNavigation?.addListener("state", (event) => {
      // console.log("INFO: rootNavigation?.addListener('state')", event);
      setNavigationReady(true);
    });
    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [rootNavigation]);

  useEffectDebugger(() => {
    if (!isNavigationReady) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (!isNavigationReady || !isUserReady) {
      return;
    }

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.

      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      if (Platform.OS === "ios") {
        setTimeout(() => {
          router.replace("/signIn");
        }, 1);
      } else {
        setImmediate(() => {
          router.replace("/signIn");
        });
      }
    } else if (user && inAuthGroup && isUserReady) {
      // Redirect away from the sign-in page.
      //router.replace("/");

      if (Platform.OS === "ios") {
        setTimeout(() => {
          router.replace("/(tabs)/");
        }, 1);
      } else {
        setImmediate(() => {
          router.replace("/(tabs)/");
        });
      }
    } else {
      SplashScreen.hideAsync();
    }
  }, [user, isUserReady, segments, isNavigationReady]);
}

const AuthProvider = ({ children }) => {
  const INITIAL_USER = null;
  const [sharedDataUser, setSharedDataUser] = useState(INITIAL_USER);

  useEffect(() => {
    AsyncStorage.getItem("@USER").then((jsonValue) => {
      if (jsonValue) {
        const user = JSON.parse(jsonValue);
        if (user && user.uid) {
          setSharedDataUser(user);
        } else {
          setSharedDataUser(null);
        }
      }
    });
  }, []);

  useProtectedRoute(sharedDataUser);

  const updateSharedDataUser = (newData) => {
    try {
      const jsonValue = JSON.stringify({ ...sharedDataUser, ...newData });
      setSharedDataUser({ ...sharedDataUser, ...newData });
      AsyncStorage.setItem("@USER", jsonValue);
    } catch (e) {
      console.log("updateSharedDataUser Error: ", e);
    }
  };

  const createAccount = async (
    screenName: string,
    screenEmail: string,
    screenPassword: string,
    callback: createAccountCallback,
  ) => {
    auth()
      .createUserWithEmailAndPassword(screenEmail, screenPassword)
      .then(() => {
        const user: IUser = {
          uid: auth().currentUser.uid,
          email: screenEmail,
          displayName: convertToString(screenName),
          photoURL: convertToString(""),
        };
        callback(user, "Success");
      })
      .catch((error) => {
        const errorMessage = error.message;
        callback({}, errorMessage);
      });
  };

  const signIn = async (
    screenEmail: string,
    screenPassword: string,
    callback: loginError,
  ) => {
    try {
      const resp = await auth().signInWithEmailAndPassword(
        screenEmail,
        screenPassword,
      );

      // const resp_js = await signInWithEmailAndPassword(
      //   auth_js,
      //   screenEmail,
      //   screenPassword,
      // );

      const user: IUser = {
        uid: convertToString(auth().currentUser.uid),
        email: convertToString(auth().currentUser.email),
        displayName: convertToString(auth().currentUser.displayName),
        photoURL: convertToString(auth().currentUser.photoURL),
      };

      setSharedDataUser(user);

      AsyncStorage.setItem("@USER", JSON.stringify(user));

      return { user: auth().currentUser };
    } catch (error: any) {
      // Handle Errors here.
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.log(errorMessage);
      }

      callback(errorMessage);
      console.log(error);

      return { error: error };
    }
  };

  const signOut = async () => {
    console.log("signOut");

    AsyncStorage.removeItem("@USER");
    setSharedDataUser(null);

    auth().signOut(); //sign out of firebase
  };

  const resetPassword = (screenEmail: string, callback: resetError) => {
    auth()
      .sendPasswordResetEmail(screenEmail)
      .then(() => callback("sendPasswordResetEmail"))
      .catch((error) => {
        const errorMessage = error.message;
        callback(errorMessage);
      });
    //setSharedDataUser(null);
    //removeItem();
  };

  const deleteAccount = async (callback: resetError) => {
    const user = auth().currentUser;

    user
      .delete()
      .then(() => callback("deleting the user"))
      .catch((error) => {
        const errorMessage = error.message;
        callback(errorMessage);
      });
    setSharedDataUser(null);
    AsyncStorage.removeItem("@USER");
  };

  function convertToString(value: string | null): string {
    if (value === null) {
      return "";
    } else {
      return value;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        sharedDataUser,
        signIn,
        signOut,
        resetPassword,
        deleteAccount,
        updateSharedDataUser,
        createAccount,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const appSignIn = async (email, password) => {
  try {
    const resp = await auth().signInWithEmailAndPassword(email, password);

    //setSharedDataUser(user);

    // AuthStore.update((store) => {
    // 	store.user = resp.user;
    // 	store.isLoggedIn = resp.user ? true : false;
    // });
    return { user: auth().currentUser };
  } catch (e) {
    return { error: e };
  }
};

export const appSignOut = async () => {
  try {
    auth().signOut();
    return { user: null };
  } catch (e) {
    return { error: "appSignOut:" + e };
  }
};

export const appSignUp = async (email, password, displayName) => {
  try {
    const resp = await auth().createUserWithEmailAndPassword(email, password);

    await resp.user.updateProfile({ displayName });

    return { user: auth().currentUser };
  } catch (e) {
    return { error: e };
  }
};

export default AuthProvider;
