import { useRouter, useSegments } from "expo-router";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";

const AuthContext = React.createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
	return React.useContext(AuthContext);
}

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
				signIn: (user) => {
					setAuth(user);
					setItem(JSON.stringify(user));
				},
				signOut: () => {
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
