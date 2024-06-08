import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useStorageState } from "./useStorageState";
import { auth } from "@/lib/firebase";
import { IUser } from "./types";
import { getUser } from "@/lib/APIuser";
import { removeFirebaseWord } from "@/lib/util";

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
  const router = useRouter();
  const [[isLoading, session], setSession] = useStorageState("session");
  const [sharedDataUser, setSharedDataUser] = useState<IUser | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      console.log("WWWWW AuthProvider onAuthStateChanged: ", user);

      if (user) {
        getUser(auth().currentUser?.uid, (dbuser) => {
          if (dbuser) {
            const usr: IUser = {
              key: auth().currentUser?.uid,
              uid: auth().currentUser?.uid,
              email: auth().currentUser?.email,
              displayName: auth().currentUser?.displayName,
              photoURL: auth().currentUser?.photoURL,
              project: dbuser.project,
              postCount: dbuser.postCount,
              language: dbuser.language,
            };
            console.log("WWWWW AuthProvider setSharedDataUser: ", usr);

            setSharedDataUser(usr);
            setSession(user.uid);

            if (usr.project) {
              router.replace({
                pathname: "/" + usr.project,
                params: {},
              });
            } else {
              router.replace({
                pathname: "welcome",
                params: {},
              });
            }
          } else {
            router.replace({
              pathname: "welcome",
              params: {},
            });
          }
        });
      } else {
        setSession(null);
        setSharedDataUser(null);

        router.replace({
          pathname: "/signIn",
          params: {},
        });
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const updateSharedDataUser = (newData) => {
    try {
      console.log("updateSharedDataUser (auth provider): ", newData);

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
          project: "",
        };
        console.log("createAccount success: ", user);

        callback(user, "Success");
      })
      .catch((error) => {
        const errorMessage = removeFirebaseWord(error.message);
        console.log("createAccount failure: ", error);
        callback({}, errorMessage);
      });
  };

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
