import { updateProfile } from "firebase/auth/react-native";
import { auth, db } from "../lib/firebase";
import {
    addDoc,
    doc,
    setDoc,
    updateDoc,
    collection,
    onSnapshot,
    query,
    Timestamp,
    where,
} from "firebase/firestore";

export const updateAccountName = (displayName: string) => {
    //const { sharedData, updateSharedData } = useContext(AuthContext);
    const ref = doc(db, "users", auth.currentUser.uid);

    updateProfile(auth.currentUser, {
        displayName: displayName,
    })
        .then(() => {
            setDoc(
                ref,
                {
                    displayName: displayName,
                    email: auth.currentUser.email,
                    photoURL: auth.currentUser.photoURL,
                },
                { merge: true },
            );
        })
        .catch((error) => {
            // An error occurred
            // ...
            console.log("user update ERROR updated", error);
        });
};

export const updateAccountPhotoURL = (photoURL: string) => {
    //const { sharedData, updateSharedData } = useContext(AuthContext);
    const ref = doc(db, "users", auth.currentUser.uid);

    updateProfile(auth.currentUser, {
        photoURL: photoURL,
    })
        .then(() => {
            setDoc(
                ref,
                {
                    photoURL: photoURL,
                    email: auth.currentUser.email,
                    displayName: auth.currentUser.displayName,
                },
                { merge: true },
            );
        })
        .then(() => {
            //callback(project.key);
            console.log("its done-  account update:", photoURL);
        })
        .catch((error) => {
            // An error occurred
            // ...
            console.log("user update ERROR updated", error);
        });
};
