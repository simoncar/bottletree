const fetch = require("node-fetch");
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const {
  onDocumentCreated,
  onDocumentWritten,
} = require("firebase-functions/v2/firestore");
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

exports.onDocumentCreated_notifications = onDocumentCreated(
  "/notifications/{documentId}",
  async (event) => {
    const original = event.data.data().original;
    const title = event.data.data().title;
    const body = event.data.data().body;
    const uid = event.data.data().uid;
    const projectId = event.data.data().projectId;

    if (!projectId || projectId === "demo") {
      console.log(
        "Project ID not specified or Demo Project. Exiting function.",
      );
      return;
    }

    var notifications = [];

    //for the specified project, retrieve all the users in the accessList collection under the project
    const accessList = await getFirestore()
      .collection("projects")
      .doc(projectId)
      .collection("accessList")
      .get();
    console.log("Getting Access List for project Id : ", projectId, accessList);

    await Promise.all(
      accessList.docs.map(async (accessDoc) => {
        const tokenDoc = await getFirestore()
          .collection("users")
          .doc(accessDoc.data().uid)
          .get();
        console.log("Getting Token for user Id : ", accessDoc.data().uid);

        if (tokenDoc.exists) {
          const pushToken = tokenDoc.data().pushToken;

          console.log("Token : ", pushToken);
          console.log("Token UID : ", tokenDoc.data().uid);

          if (
            pushToken &&
            pushToken.trim() !== "" &&
            tokenDoc.data().uid !== uid
          ) {
            notifications.push({
              to: pushToken,
              title: title,
              sound: "default",
              body: body,
              data: {
                uid: tokenDoc.data().uid,
                project: projectId,
                url: "/" + projectId,
              },
            });
          }
        }
      }),
    );

    if (notifications.length > 0) {
      console.log("Sending Notifications to expo servers : ", notifications);

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notifications),
      });

      await event.data.ref.set(
        { notifications: notifications },
        { merge: true },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.data[0].status === "error") {
        const message = data.data[0];
        return event.data.ref.set(
          { complete: true, response: message },
          { merge: true },
        );
      }
      if (data.data[0].status === "ok") {
        const message = data;
        return event.data.ref.set(
          { complete: true, response: message },
          { merge: true },
        );
      }
    } else {
      return event.data.ref.set(
        { complete: true, response: "no notifications to send" },
        { merge: true },
      );
    }
  },
);

exports.onDocumentCreated_post = onDocumentWritten(
  "/projects/{projectId}/posts/{postId}",
  async (event) => {
    const projectId = event.params.projectId;

    if (!projectId) {
      console.log("Project ID not specified. Exiting function: ", projectId);
      console.log("Event params: ", event.params);
      return;
    }

    console.log("projectId: ", event.params.projectId);

    const collPosts = getFirestore()
      .collection("projects")
      .doc(event.params.projectId)
      .collection("posts");
    const snapshotPosts = await collPosts.count().get();
    console.log("count of posts for project Id : ", snapshotPosts.data().count);

    const writeResult = await getFirestore()
      .collection("projects")
      .doc(event.params.projectId)
      .set(
        {
          postCount: snapshotPosts.data().count,
        },
        { merge: true },
      );
  },
);

exports.onDocumentCreated_task = onDocumentWritten(
  "/projects/{projectId}/tasks/{postId}",
  async (event) => {
    const projectId = event.params.projectId;

    if (!projectId) {
      console.log("Project ID not specified. Exiting function: ", projectId);
      console.log("Event params: ", event.params);
      return;
    }

    console.log("projectId: ", event.params.projectId);

    const collTasks = getFirestore()
      .collection("projects")
      .doc(event.params.projectId)
      .collection("tasks")
      .where("completed", "==", false);
    const snapshotTasks = await collTasks.count().get();
    console.log("count of tasks for project Id : ", snapshotTasks.data().count);

    const writeResult = await getFirestore()
      .collection("projects")
      .doc(event.params.projectId)
      .set(
        {
          taskCount: snapshotTasks.data().count,
        },
        { merge: true },
      );
  },
);
exports.onDocumentCreated_file = onDocumentWritten(
  "/projects/{projectId}/files/{postId}",
  async (event) => {
    const projectId = event.params.projectId;

    if (!projectId) {
      console.log("Project ID not specified. Exiting function: ", projectId);
      console.log("Event params: ", event.params);
      return;
    }

    console.log("projectId: ", event.params.projectId);

    const collFiles = getFirestore()
      .collection("projects")
      .doc(event.params.projectId)
      .collection("files");
    const snapshotFiles = await collFiles.count().get();
    console.log("count of files for project Id : ", snapshotFiles.data().count);

    const writeResult = await getFirestore()
      .collection("projects")
      .doc(event.params.projectId)
      .set(
        {
          fileCount: snapshotFiles.data().count,
        },
        { merge: true },
      );
  },
);

exports.updateAllowedUsers = onRequest(async (req, res) => {
  try {
    const db = getFirestore();
    const projectsSnapshot = await db.collection("projects").get();

    const updates = [];

    for (const projectDoc of projectsSnapshot.docs) {
      const projectId = projectDoc.id;
      console.log(`Processing project: ${projectId}`);

      const accessListSnapshot = await db
        .collection("projects")
        .doc(projectId)
        .collection("accessList")
        .get();

      const allowedUsers = accessListSnapshot.docs
        .map((doc) => doc.data().uid)
        .filter((uid) => uid); // Filter out any null/undefined uids

      if (allowedUsers.length > 0) {
        updates.push(
          db.collection("projects").doc(projectId).update({
            allowedUsers: allowedUsers,
          }),
        );
        console.log(
          `Updating project ${projectId} with allowedUsers: ${allowedUsers}`,
        );
      } else {
        console.log(`No accessList found for project ${projectId}, skipping.`);
      }
    }

    await Promise.all(updates);
    console.log(`Migration completed. Updated ${updates.length} projects.`);

    res.json({
      success: true,
      message: `Migration completed. Updated ${updates.length} projects.`,
    });
  } catch (error) {
    console.error("Error during migration:", error);
    res.status(500).json({
      success: false,
      message: "Migration failed.",
      error: error.message,
    });
  }
});
