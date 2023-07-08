import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "./authContext";
import React, { useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    deleteUser,
} from "firebase/auth/react-native";
import { auth } from "../lib/firebase";
import { IUser } from "./types";

// This hook can be used to access the user info.
export function useAuth() {
    return React.useContext(AuthContext);
}

const unsub = onAuthStateChanged(auth, (user) => {
    //console.log("onAuthStateChange", user);
});

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
    const segments = useSegments();
    const router = useRouter();

    React.useEffect(() => {
        const inAuthGroup = segments[0] === "(auth)";

        if (user === undefined) {
            return;
        }

        if (
            // If the user is not signed in and the initial segment is not anything in the auth group.

            !user &&
            !inAuthGroup
        ) {
            // Redirect to the sign-in page.
            router.replace("/signIn");
        } else if (user && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace("/editCalendar");
        }
    }, [user, segments]);
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
            if (errorCode === "auth/wrong-password") {
                callback("Wrong password.");
            } else {
                callback(errorMessage);
            }
            //setLoading(false);
            console.log(error);

            return { error: error };
        }
    };

    const signOut = async () => {
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
        const resp = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );

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
