import { updateProfile } from "firebase/auth/react-native";
import { auth } from "../lib/firebase";
import { IProject, IUser } from "./types";

export const updateAccount = (displayName: string) => {
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
            console.log("user update ERROR updated");
        });
};
