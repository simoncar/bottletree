import { useRouter, useSegments } from "expo-router";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
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

const AuthContext = React.createContext(null);

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
            console.log("user undefined");

            return;
        }

        if (
            // If the user is not signed in and the initial segment is not anything in the auth group.

            !user &&
            !inAuthGroup
        ) {
            // Redirect to the sign-in page.
            console.log("// Redirect to the sign-in page.");
            router.replace("/signIn");
        } else if (user && inAuthGroup) {
            // Redirect away from the sign-in page.
            console.log(
                "Redirect away from the sign-in page.",
                user,
                inAuthGroup,
            );

            router.replace("/");
        }
    }, [user, segments]);
}

export function AuthProvider(props) {
    const INITIAL_USER = null;

    const { getItem, setItem, removeItem } = useAsyncStorage("@USER");
    const [user, setAuth] = React.useState(INITIAL_USER);

    useEffect(() => {
        getItem().then((json) => {
            if (json) {
                setAuth(JSON.parse(json));
            }
        });
    }, []);

    console.log("AuthProvider", user);

    useProtectedRoute(user);

    const updateSharedData = (newData) => {
        try {
            const jsonValue = JSON.stringify({ ...user, ...newData });
            setAuth({ ...user, ...newData });
            setItem(jsonValue);
        } catch (e) {
            console.log("updateSharedData Error: ", e);
        }
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
                signIn: async (
                    screenEmail: string,
                    screenPassword: string,
                    callback: loginError,
                ) => {
                    try {
                        console.log("signIn----", screenEmail, screenPassword);
                        const resp = await signInWithEmailAndPassword(
                            auth,
                            screenEmail,
                            screenPassword,
                        );
                        const user: IUser = {
                            uid: convertToString(auth.currentUser.uid),
                            email: convertToString(auth.currentUser.email),
                            displayName: convertToString(
                                auth.currentUser.displayName,
                            ),
                            photoURL: convertToString(
                                auth.currentUser.photoURL,
                            ),
                        };

                        console.log("PHOTO -", auth.currentUser.photoURL);

                        setAuth(user);
                        setItem(JSON.stringify(user));
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
                },
                signOut: () => {
                    removeItem();
                    setAuth(null);
                },

                resetPassword: (screenEmail: string, callback: resetError) => {
                    sendPasswordResetEmail(auth, screenEmail)
                        .then(() => callback("some stuff"))
                        .catch((error) => {
                            const errorMessage = error.message;
                            callback(errorMessage);
                        });
                    //setAuth(null);
                    //removeItem();
                },
                deleteAccount: (callback: resetError) => {
                    const user = auth.currentUser;

                    deleteUser(user)
                        .then(() => callback("deleting the user"))
                        .catch((error) => {
                            const errorMessage = error.message;
                            callback(errorMessage);
                        });
                    setAuth(null);
                    removeItem();
                },
                createAccount: (
                    screenName: string,
                    screenEmail: string,
                    screenPassword: string,
                    callback: createAccountCallback,
                ) => {
                    createUserWithEmailAndPassword(
                        auth,
                        screenEmail,
                        screenPassword,
                    )
                        .then(() => callback("Success"))
                        .catch((error) => {
                            const errorMessage = error.message;
                            callback(errorMessage);
                        });
                    //setAuth(null);
                    //removeItem();
                },
                user,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const updateAccount = (displayName: string) =>
{
    const newData = { displayName: displayName };


    updateProfile(auth.currentUser, {
        displayName: displayName,
        // photoURL:
        //     "https://firebasestorage.googleapis.com/v0/b/builder-403d5.appspot.com/o/demo%2Fprofile%2Fface10.jpeg?alt=media&token=ec4a6ece-d8a6-4d57-b960-622e451f5c18",
    })
        .then(() => {
            // Profile updated!
            // ...
            console.log("upser account update:", displayName);
            //updateSharedData({ displayName: displayName });
            const jsonValue = JSON.stringify({ ...auth.currentUser, ...newData });
            setAuth({ ...auth.currentUser, ...newData });
            setItem(jsonValue);
        })
        .catch((error) => {
            // An error occurred
            // ...
            console.log("user update ERROR updated");
        });
};

export const appSignIn = async (email, password) => {
    try {
        const resp = await signInWithEmailAndPassword(auth, email, password);

        //setAuth(user);

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
        // this will trigger onAuthStateChange to update the store..
        const resp = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );

        // add the displayName
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
