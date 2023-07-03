import { updateProfile } from "firebase/auth/react-native";
import { auth } from "../lib/firebase";

export const updateAccountName = (displayName: string) => {
    //const { sharedData, updateSharedData } = useContext(AuthContext);
    const newData = { displayName: displayName };
    console.log("upser account update:", displayName, auth);

    updateProfile(auth.currentUser, {
        displayName: displayName,
    })
        .then(() => {
            // Profile updated!
            // ...
            console.log("upser account update:", displayName);
            //updateSharedData({ displayName: displayName });
            // const jsonValue = JSON.stringify({
            //     ...auth.currentUser,
            //     ...newData,
            // });
            // setAuth({ ...auth.currentUser, ...newData });
            // setItem(jsonValue);
        })
        .catch((error) => {
            // An error occurred
            // ...
            console.log("user update ERROR updated", error);
        });
};

export const updateAccountPhotoURL = (photoURL: string) => {
    //const { sharedData, updateSharedData } = useContext(AuthContext);
    const newData = { photoURL: photoURL };
    console.log("upser account updatephotoURL:", photoURL, auth);

    updateProfile(auth.currentUser, {
        photoURL: photoURL,
    })
        .then(() => {
            // Profile updated!
            // ...
            console.log("upser account update:", photoURL);
            //updateSharedData({ displayName: displayName });
            // const jsonValue = JSON.stringify({
            //     ...auth.currentUser,
            //     ...newData,
            // });
            // setAuth({ ...auth.currentUser, ...newData });
            // setItem(jsonValue);
        })
        .catch((error) => {
            // An error occurred
            // ...
            console.log("user update ERROR updated", error);
        });
};
