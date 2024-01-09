import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useStorageState } from "./useStorageState";
import { auth } from "../lib/firebase";
import { IUser } from "./types";

const AuthContext = createContext<
  | (IUser & { sharedDataUser?: IUser } & {
      updateSharedDataUser: (user: IUser) => void;
    })
  | undefined
  | null
>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a Provider");
  }

  return context;
}

export function AuthProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [sharedDataUser, setSharedDataUser] = useState<IUser | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      console.log("onAuthStateChanged1111: ", user?.toJSON());
      console.log("onAuthStateChanged2222: ", sharedDataUser);
      console.log("onAuthStateChanged3333: ", session);

      if (user) {
        const usr: IUser = {
          uid: auth().currentUser?.uid,
          email: auth().currentUser?.email,
          displayName: auth().currentUser?.displayName,
          photoURL: auth().currentUser?.photoURL,
        };

        setSession(user.uid);
        setSharedDataUser(usr);

        console.log("DO NOT NAVIGATE - ALREADY LOGGED IN");

        //router.navigate("/(tabs)");
      } else {
        setSession(null);
        setSharedDataUser(null);
        console.log("NAVIGATE TO SIGNIN - NOT LOGGED IN");
        router.replace("(auth)/signIn");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const updateSharedDataUser = (newData) => {
    try {
      const jsonValue = JSON.stringify({ ...sharedDataUser, ...newData });
      setSharedDataUser({ ...sharedDataUser, ...newData });
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
        isLoading,
        sharedDataUser,
        resetPassword,
        deleteAccount,
        updateSharedDataUser,
        createAccount,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
