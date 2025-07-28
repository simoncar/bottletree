import { updateAccountName, updateUser } from "@/lib/APIuser";
import {
  auth,
  firestore,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
} from "@/lib/firebase";
import { IUser } from "@/lib/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext } from "react";
import { useStorageState } from "./useStorageState";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";

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
  signInAnonymously: (callback: (user: IUser, message: string) => void) => void;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthLoading: true,
  resetPassword: () => null,
  deleteAccount: () => null,
  signIn: () => null,
  signUp: () => null,
  signOut: () => null,
  signInAnonymously: () => null,
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

  const handleSignInAnonymously = async (
    callback: (session, message: string) => void,
  ) => {
    try {
      const response = await signInAnonymously(auth);
      await setSession(response.user.uid);
      updateAccountName(response.user.uid, "");
      console.log(
        "Sign In  auth().signInAnonymously Success",
        response.user.uid,
      );
      callback(response.user.uid, "Success");
      return response.user.uid;
    } catch (error) {
      setSession(null);
      console.log(error);
      callback(null, error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      setSession(response.user.uid);
      //updateAccountName(response.user.uid, "");

      console.log("Sign In Success", session, response.user.uid);
    } catch (error) {
      setSession(null);
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
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      setSession(response.user.uid);

      const user: IUser = {
        uid: auth.currentUser.uid,
        email: email,
        displayName: convertToString(name),
        photoURL: convertToString(""),
        project: "",
        anonymous: auth.currentUser.isAnonymous,
        created: serverTimestamp(),
      };

      console.log("signUp user: ", user);
      updateUser(user);
      //setUser(user);
      //updateAccountName(response.user.uid, name);

      callback(user, "SignUp Success");
    } catch (error) {
      console.log("signUp Error: ", error);
      callback(null, error);
    }
  };

  const signOut = async () => {
    try {
      setSession(null);
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared");
    } catch (e) {
      console.error("Failed to clear Session, auth or AsyncStorage:", e);
    }
  };

  const resetPassword = (screenEmail: string, callback: any) => {
    sendPasswordResetEmail(auth, screenEmail)
      .then(() => callback("Password reset email sent.  Check your inbox."))
      .catch((error) => {
        const errorMessage = error.message;
        callback(errorMessage);
      });
    //setSharedDataUser(null);
    //removeItem();
  };

  const deleteAccount = async (callback: any) => {
    const user = auth.currentUser;

    user
      .delete()
      .then(() => callback(null))
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
        signInAnonymously: handleSignInAnonymously,
        signIn,
        signUp,
        signOut,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
