import { useRouter, useSegments } from "expo-router";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth/react-native";
import { auth } from "../lib/firebase";
import { setStatusBarHidden } from "expo-status-bar";

const AuthContext = React.createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
	return React.useContext(AuthContext);
}

const unsub = onAuthStateChanged(auth, (user) => {
	console.log("onAuthStateChange", user);
	// AuthStore.update((store) => {
	// 	store.user = user;
	// 	store.isLoggedIn = user ? true : false;
	// 	store.initialized = true;
	// });
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
			console.log("Redirect away from the sign-in page.", user, inAuthGroup);

			router.replace("/");
		}
	}, [user, segments]);
}

export function AuthProvider(props) {
	const { getItem, setItem, removeItem } = useAsyncStorage("@USER");
	const [user, setAuth] = React.useState(null);

	useEffect(() => {
		getItem().then((json) => {
			if (json) {
				setAuth(JSON.parse(json));
			}
		});
	}, []);

	useProtectedRoute(user);

	return (
		<AuthContext.Provider
			value={{
				signIn: async (screenEmail, screenPassword, callback: loginError) => {
					try {
						console.log("signIn----", screenEmail, screenPassword);
						const resp = await signInWithEmailAndPassword(auth, screenEmail, screenPassword);
						console.log("setAuthBB-", auth.currentUser);
						const user = {
							id: auth.currentUser.uid,
							email: auth.currentUser.email,
							name: auth.currentUser.displayName,
							avatar: auth.currentUser.photoURL
						};

						setAuth(user);
						console.log("setAuthAA", user);

						setItem(JSON.stringify(user));
						console.log("stringifyBB:", user);
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
					console.log("signout XXXX:");
					setAuth(null);
					removeItem();
				},
				user
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}

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
		const resp = await createUserWithEmailAndPassword(auth, email, password);

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
