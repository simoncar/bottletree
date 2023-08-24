const fetch = require("node-fetch");
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

exports.httphit_addmessage = onRequest(async (req, res) => {
	const title = req.query.title;
	const body = req.query.body;
	const writeResult = await getFirestore()
		.collection("notifications")
		.add({ title: title, body: body });
	res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

exports.onDocumentCreated_notifications = onDocumentCreated("/notifications/{documentId}", async (event) => {
	const original = event.data.data().original;
	const title = event.data.data().title;
	const body = event.data.data().body;
	var notifications = [];

	//retrieve all the tokens from firebase
	const tokens = await getFirestore().collection("tokens").get();

	//for each token, create a notification object and push it to the notifications array
	tokens.forEach((tokenDoc) => {
		if (tokenDoc.data().pushToken == "ExponentPushToken[vtgZnrL-rx5viXmTI19u0u]" || tokenDoc.data().pushToken == "ExponentPushToken[z-50OyGeRPth6nxZSWk_A4]") {
			notifications.push({
				to: tokenDoc.data().pushToken,
				title: title,
				sound: "default",
				body: body,
				data: { someData: 'goes here' },
			});
		} else {
			console.log("skipping: " + tokenDoc.data().token);
		}
	}
	);

	console.log("notifications: " + JSON.stringify(notifications));

	if (notifications.length > 0) {
		const response = await fetch("https://exp.host/--/api/v2/push/send", {
			method: "POST",
			headers: {
				Accept: "application/json",
				'Accept-encoding': 'gzip, deflate',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(notifications),
		});


		if (!response.ok) {
			console.log("response: " + JSON.stringify(response));
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();

		if (data.data[0].status === "error") {
			const message = data.data[0]
			return event.data.ref.set({ complete: true, response: message }, { merge: true });

		}
		if (data.data[0].status === "ok") {
			const message = data;
			return event.data.ref.set({ complete: true, response: message }, { merge: true });

		}

	} else {
		console.log("no notifications to send");
		return event.data.ref.set({ complete: true, response: "no notifications to send" }, { merge: true });
	}

});



