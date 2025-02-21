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
	const projectId = event.data.data().projectId;

	if (!projectId || projectId === "demo") {
		console.log('Project ID not specified or Demo Project. Exiting function.');
		return;
	}

	var notifications = [];

	//for the specified project, retrieve all the users in the accessList collection under the project
	const accessList = await getFirestore().collection("projects").doc(projectId).collection("accessList").get();
	console.log('Getting Access List for project Id : ', projectId);


	//for each user in the accessList, retrieve the token from the tokens collection where the token uid matches the accessList uid
	accessList.forEach(async (accessDoc) => {
		const token = await getFirestore().collection("tokens").where("uid", "==", accessDoc.data().uid).get();
		console.log('Getting Token for user Id : ', accessDoc.data().uid);

		token.forEach((tokenDoc) => {
			//create a notification object and push it to the notifications array
			console.log('Token : ', tokenDoc.data().pushToken);
			console.log('Token UID : ', tokenDoc.data().uid);

			notifications.push({
				to: tokenDoc.data().pushToken,
				title: title,
				sound: "default",
				body: body,
				data: {
					uid: tokenDoc.data().uid,
					project: projectId
				},
			});
		});

		if (notifications.length > 0) {
			console.log('Sending Notifications to expo servers : ', notifications);

			const response = await fetch("https://exp.host/--/api/v2/push/send", {
				method: "POST",
				headers: {
					Accept: "application/json",
					'Accept-encoding': 'gzip, deflate',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(notifications),
			});

			await event.data.ref.set({ notifications: notifications }, { merge: true })


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

});


exports.onDocumentCreated_post = onDocumentCreated("/projects/{projectId}/posts/{postId}", async (event) => {
	const timestamp = event.data.data().timestamp;
	const projectId = event.data.projectId;

	if (!projectId || projectId === "demo") {
		console.log('Project ID not specified or Demo Project. Exiting function.');
		return;
	}

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


