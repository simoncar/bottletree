import {
  router,
  useSegments,
  useRootNavigation,
  useNavigation,
  SplashScreen,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../lib/notifications";
import AuthContext from "./authContext";
import React, { useEffect, useState, useRef } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
} from "firebase/auth/react-native";
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
      console.log("[use-effect-debugger] ", changedDeps);
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
    console.log("AUTH PROVIDER INITIAL [] useEffect", auth.currentUser);

    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (!user) {
        //@ts-ignore
        console.log("onAuthStateChange USEEFFET", user);
        setUserReady(true);

        //navigation?.navigate("(auth)");
        //router.replace("/signIn");
        //SplashScreen.hideAsync();
      } else {
        //console.log("onAuthStateChange We have a User: ", user);
        setUserReady(true);
        registerForPushNotificationsAsync();
        console.log("onAuthStateChange We have a User: ", user);
        //@ts-ignore
        //navigation?.navigate("(tabs)");
        //router.replace("/");
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
          router.replace("/");
        }, 1);
      } else {
        setImmediate(() => {
          router.replace("/");
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
          setSharedDataUser("");
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
    } catch (e) {}
  };

  const createAccount = async (
    screenName: string,
    screenEmail: string,
    screenPassword: string,
    callback: createAccountCallback,
  ) => {
    createUserWithEmailAndPassword(auth, screenEmail, screenPassword)
      .then(() => {
        const user: IUser = {
          uid: auth.currentUser.uid,
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
      const resp = await signInWithEmailAndPassword(
        auth,
        screenEmail,
        screenPassword,
      );

      const user: IUser = {
        uid: convertToString(auth.currentUser.uid),
        email: convertToString(auth.currentUser.email),
        displayName: convertToString(auth.currentUser.displayName),
        photoURL: convertToString(auth.currentUser.photoURL),
      };

      setSharedDataUser(user);

      AsyncStorage.setItem("@USER", JSON.stringify(user));

      return { user: auth.currentUser };
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;

      callback(errorMessage);
      console.log(error);

      return { error: error };
    }
  };

  const signOut = async () => {
    console.log("signOut");
    auth.signOut(); //sign out of firebase
    AsyncStorage.removeItem("@USER");
    setSharedDataUser(null);
  };

  const resetPassword = (screenEmail: string, callback: resetError) => {
    sendPasswordResetEmail(auth, screenEmail)
      .then(() => callback("some stuff"))
      .catch((error) => {
        const errorMessage = error.message;
        callback(errorMessage);
      });
    //setSharedDataUser(null);
    //removeItem();
  };

  const deleteAccount = async (callback: resetError) => {
    const user = auth.currentUser;

    deleteUser(user)
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
    const resp = await signInWithEmailAndPassword(auth, email, password);

    //setSharedDataUser(user);

    // AuthStore.update((store) => {
    // 	store.user = resp.user;
    // 	store.isLoggedIn = resp.user ? true : false;
    // });
    return { user: auth.currentUser };
  } catch (e) {
    return { error: e };
  }
};

export const appSignOut = async () => {
  try {
    await signOut(auth);
    // AuthStore.update((store) => {
    // 	store.user = null;
    // 	store.isLoggedIn = false;
    // });
    return { user: null };
  } catch (e) {
    return { error: e };
  }
};

export const appSignUp = async (email, password, displayName) => {
  try {
    const resp = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(resp.user, { displayName });

    // AuthStore.update((store) => {
    // 	store.user = auth.currentUser;
    // 	store.isLoggedIn = true;
    // });

    return { user: auth.currentUser };
  } catch (e) {
    return { error: e };
  }
};

export default AuthProvider;
