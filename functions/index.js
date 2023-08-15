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
	const title = req.query.title;
	const body = req.query.body;
	// Push the new message into Firestore using the Firebase Admin SDK.
	const writeResult = await getFirestore()
		.collection("messages")
		.add({ title: title, body: body });
	// Send back a message that we've successfully written the message
	res.json({ result: `Message with ID: ${writeResult.id} added.` });
});




// firebase deploy --only functions:sendPushNotificationFromQueue
exports.pushsend = onDocumentCreated("/messages/{documentId}", async (event) => {
	const original = event.data.data().original;
	const title = event.data.data().title;
	const body = event.data.data().body;
	var messages = [];

	messages.push({
		to: "ExponentPushToken[en5SSANZy96dpSJ302wi6z]",
		title: title,
		sound: "default",
		body: body,
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
		return event.data.ref.set({ complete: true, response: message }, { merge: true });

	}
	if (data.data[0].status === "ok") {
		const message = data.data[0];
		return event.data.ref.set({ complete: true, response: message }, { merge: true });

	}


});



