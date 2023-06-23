import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export const demoData = async () => {
	//console.log("Skip demo data");
};

export const demoData2 = async () => {
	try {
		const projectRef1 = await addDoc(collection(db, "projects"), {
			title: "(Local) 106 Jolimont",
			icon: "https://"
		});

		console.log("Document written with ID: ", projectRef1.id);

		const postRef1 = await addDoc(collection(db, "projects", projectRef1.id, "posts"), {
			author: "John Doe",
			avatar: "https://",
			timestamp: Timestamp.now(),
			images: ["http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/profilePic.jpeg?alt=media&token=e71be59c-587d-4018-889f-7a81d2e440d3"]
		});

		console.log("Document written with ID: ", postRef1.id);

		const projectRef2 = await addDoc(collection(db, "projects"), {
			title: "(Local) Placa Rovira",
			icon: "https://"
		});

		console.log("Document written with ID: ", projectRef2.id);

		const postRef2 = await addDoc(collection(db, "projects", projectRef2.id, "posts"), {
			author: "John Doe",
			avatar: "https://",
			timestamp: Timestamp.now(),
			images: ["http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/rovira.jpg?alt=media&token=abceec3f-7a1c-4208-8233-59955e407d9b"]
		});

		console.log("Document written with ID: ", postRef2.id);
	} catch (e) {
		console.error("Error adding document: ", e);
	}
};

// {
//    "_redirectEventId":"undefined",
//    "apiKey":"AIzaSyA-u3kUGycFCQQC5S3r2p2nQAGPRhKiMpE",
//    "appName":"[DEFAULT]",
//    "createdAt":"1687501537057",
//    "displayName":"Simon",
//    "email":"simoncar@gmail.com",
//    "emailVerified":false,
//    "isAnonymous":false,
//    "lastLoginAt":"1687501558705",
//    "phoneNumber":"undefined",
//    "photoURL":"http://127.0.0.1:9199/v0/b/builder-403d5.appspot.com/o/profilePic.jpeg?alt=media&token=e71be59c-587d-4018-889f-7a81d2e440d3",
//    "providerData":[
//       [
//          "Object"
//       ]
//    ],
//    "stsTokenManager":{
//       "accessToken":"eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJuYW1lIjoiU2ltb24iLCJwaWN0dXJlIjoiaHR0cDovLzEyNy4wLjAuMTo5MTk5L3YwL2IvYnVpbGRlci00MDNkNS5hcHBzcG90LmNvbS9vL3Byb2ZpbGVQaWMuanBlZz9hbHQ9bWVkaWEmdG9rZW49ZTcxYmU1OWMtNTg3ZC00MDE4LTg4OWYtN2E4MWQyZTQ0MGQzIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJzaW1vbmNhckBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImF1dGhfdGltZSI6MTY4NzUwMTU1OCwidXNlcl9pZCI6ImpySW1vbUM2emV3NFNmakdyb3RKaE9mSWlYdEYiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInNpbW9uY2FyQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn0sImlhdCI6MTY4NzUwMTU1OCwiZXhwIjoxNjg3NTA1MTU4LCJhdWQiOiJidWlsZGVyLTQwM2Q1IiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2J1aWxkZXItNDAzZDUiLCJzdWIiOiJqckltb21DNnpldzRTZmpHcm90SmhPZklpWHRGIn0.",
//       "expirationTime":1687505158725,
//       "refreshToken":"eyJfQXV0aEVtdWxhdG9yUmVmcmVzaFRva2VuIjoiRE8gTk9UIE1PRElGWSIsImxvY2FsSWQiOiJqckltb21DNnpldzRTZmpHcm90SmhPZklpWHRGIiwicHJvdmlkZXIiOiJwYXNzd29yZCIsImV4dHJhQ2xhaW1zIjp7fSwicHJvamVjdElkIjoiYnVpbGRlci00MDNkNSJ9"
//    },
//    "tenantId":"undefined",
//    "uid":"jrImomC6zew4SfjGrotJhOfIiXtF"
// }
