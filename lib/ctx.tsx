import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useStorageState } from "./useStorageState";
import { auth } from "@/lib/firebase";
import { IUser } from "@/lib/types";
import { getUser, updateAccountName } from "@/lib/APIuser";
import { removeFirebaseWord } from "@/lib/util";

interface AuthContextType {
  session?: string | null;
  isAuthLoading: boolean;
  resetPassword: (email: string, callback: (message: string) => void) => void;
  deleteAccount: (callback: (message: string) => void) => void;
  signIn: (email: string, password: string) => void;
  signUp: (
    screenName: string,
    screenEmail: string,
    screenPassword: string,
    callback: (user: IUser, message: string) => void,
  ) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthLoading: true,
  resetPassword: () => null,
  deleteAccount: () => null,
  signIn: () => null,
  signUp: () => null,
  signOut: () => null,
});

// This hook can be used to access the user info.
export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within a Provider");
  }
  return context;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isAuthLoading, session], setSession] = useStorageState("session");

  const signIn = async (email: string, password: string) => {
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);
      setSession(response.user.uid);
      console.log("Sign In Success", session);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    callback: (user: IUser, message: string) => void,
  ) => {
    console.log("signUp email: ", email);

    try {
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      console.log("signUp createUserWithEmailAndPassword response: ", response);

      setSession(response.user.uid);

      const user: IUser = {
        uid: auth().currentUser.uid,
        email: email,
        displayName: convertToString(name),
        photoURL: convertToString(""),
        project: "",
      };

      console.log("signUp createUserWithEmailAndPassword 2222: ", user);

      updateAccountName(name);

      callback(user, "Success");
    } catch (error) {
      console.log("signUp Error: ", error);
      callback({}, error);
    }
  };

  const signOut = () => {
    setSession(null);
    auth().signOut();
  };

  // useEffect(() => {
  //   const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
  //     if (user) {
  //       getUser(auth().currentUser?.uid, (dbuser) => {
  //         if (dbuser) {
  //           const usr: IUser = {
  //             key: auth().currentUser?.uid,
  //             uid: auth().currentUser?.uid,
  //             email: auth().currentUser?.email,
  //             displayName: auth().currentUser?.displayName,
  //             photoURL: auth().currentUser?.photoURL,
  //             project: dbuser.project,
  //             postCount: dbuser.postCount,
  //             language: dbuser.language,
  //           };
  //           setSharedDataUser(usr);
  //           setAuthLoading(false);
  //         }
  //       });
  //     } else {
  //       setSharedDataUser(null);
  //       setAuthLoading(false);
  //     }
  //   });
  //   return () => unsubscribeAuth();
  // }, []);

  const resetPassword = (screenEmail: string, callback: resetError) => {
    auth()
      .sendPasswordResetEmail(screenEmail)
      .then(() => callback("Password reset email sent.  Check your inbox."))
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
        console.log("deleteAccount failure: ", error);

        callback(errorMessage);
      });
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
        isAuthLoading,
        session,
        resetPassword,
        deleteAccount,
        signIn,
        signUp,
        signOut,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
