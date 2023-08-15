/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.

const fetch = require("node-fetch");
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
	// Grab the text parameter.
	const original = req.query.text;
	// Push the new message into Firestore using the Firebase Admin SDK.
	const writeResult = await getFirestore()
		.collection("messages")
		.add({ original: original });
	// Send back a message that we've successfully written the message
	res.json({ result: `Message with ID: ${writeResult.id} added.` });
});


// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
	// Grab the current value of what was written to Firestore.
	const original = event.data.data().original;

	// Access the parameter `{documentId}` with `event.params`
	logger.log("Uppercasing", event.params.documentId, original);

	const uppercase = original.toUpperCase();

	// You must return a Promise when performing
	// asynchronous tasks inside a function
	// such as writing to Firestore.
	// Setting an 'uppercase' field in Firestore document returns a Promise.
	return event.data.ref.set({ uppercase }, { merge: true });
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
	logger.info("Hello logs!", { structuredData: true });
	response.send("Hello from Firebase!");
});


// firebase deploy --only functions:sendPushNotificationFromQueue
exports.pushsend = onDocumentCreated("/messages/{documentId}", async (event) => {
	const original = event.data.data().original;
	logger.log("sending", event.params.documentId, original);
	const uppercase = original.toUpperCase();
	var messages = [];

	messages.push({
		to: "ExponentPushToken[en5SSANZy96dpSJ302wi6z]",
		title: "Some Title",
		sound: "default",
		body: "Some Body",
		data: { someData: 'goes here' },
	});


	const response = await fetch("https://exp.host/--/api/v2/push/send", {
		method: "POST",
		headers: {
			Accept: "application/json",
			'Accept-encoding': 'gzip, deflate',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(messages),
	});

	console.log("Send Push 4444444 > ", JSON.stringify(response));


	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	const data = await response.json();
	console.log("Send Push 555555 > ", data);

	if (data.data[0].status === "error") {
		const message = data.data[0]
		return event.data.ref.set({ response: message }, { merge: true });

	}
	if (data.data[0].status === "ok") {
		const message = data.data[0];
		return event.data.ref.set({ response: message }, { merge: true });

	}


});



