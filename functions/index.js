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
	const uid = event.data.data().uid;
	var notifications = [];

	//retrieve all the tokens from firebase
	const tokens = await getFirestore().collection("tokens").get();

	//for each token, create a notification object and push it to the notifications array
	tokens.forEach((tokenDoc) => {
		if (tokenDoc.data().uid !== uid) {   //dont send notification to the user who created the notification
			notifications.push({
				to: tokenDoc.data().pushToken,
				title: title,
				sound: "default",
				body: body,
				data: { uid: uid },
			});
		}
	}
	);

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
		return event.data.ref.set({ complete: true, response: "no notifications to send" }, { merge: true });
	}

});


exports.onDocumentCreated_post = onDocumentCreated("/projects/{projectId}/posts/{postId}", async (event) => {
	const timestamp = event.data.data().timestamp;
	const projectId = event.data.projectId;

	console.log('timestamp: ', timestamp);
	console.log('projectId: ', event.params.projectId);


	const coll = getFirestore().collection("projects").doc(event.params.projectId).collection("posts");
	const snapshot = await coll.count().get();
	console.log('count of posts for project Id : ', snapshot.data().count);

	const writeResult = await getFirestore()
		.collection("projects")
		.doc(event.params.projectId)
		.set({ postCount: snapshot.data().count }, { merge: true });

}
);


