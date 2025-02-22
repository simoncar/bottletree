import { db, firestore, auth } from "./firebase";
import { IUser } from "./types";

export const demoData2 = async () => {
  //console.log("Skip demo data");
};

const setCalendarData = async (docId: string, data: any) => {
  await db
    .collection("projects")
    .doc("demo")
    .collection("calendar")
    .doc(docId)
    .set(data, { merge: true });
};

const createCalendarEntry = (
  title: string,
  description: string,
  daysFromTodayBegin: number,
  daysFromTodayEnd: number,
  color: string,
  colorName: string,
) => {
  const now = new Date();
  const dateBegin = new Date(now);
  dateBegin.setDate(now.getDate() + daysFromTodayBegin);
  const dateEnd = new Date(now);
  dateEnd.setDate(now.getDate() + daysFromTodayEnd);

  return {
    description,
    title,
    dateBegin: firestore.Timestamp.fromDate(dateBegin),
    dateEnd: firestore.Timestamp.fromDate(dateEnd),
    uid: "3whGasgLCJbo3NUMt19dE8D6DmV2",
    projectId: "demo",
    color,
    colorName,
  };
};

export const demoDataForDemoProject = async () => {
  console.log("DEMO Project SEEDING");
  1;
  try {
    const calendarData = [
      {
        docId: "demoAAAA",
        data: createCalendarEntry(
          "Onsite meeting",
          "",
          -21,
          -21,
          "#6172BA",
          "Aubergine",
        ),
      },
      {
        docId: "demoBBBB",
        data: createCalendarEntry(
          "Initial quote",
          "",
          -18,
          -18,
          "#30A7E2",
          "Blue",
        ),
      },
      {
        docId: "demo0000",
        data: createCalendarEntry("Costings", "", -15, -15, "#30A7E2", "Blue"),
      },
      {
        docId: "demo11111",
        data: createCalendarEntry("Plans", "", -8, -10, "#49B382", "Grass"),
      },
      {
        docId: "demo22222",
        data: createCalendarEntry("Permits", "", -8, -3, "#DB4545", "Red"),
      },
      {
        docId: "demo3333",
        data: createCalendarEntry("Clear site", "", -1, -1, "#49B382", "Grass"),
      },
      {
        docId: "demo4444",
        data: createCalendarEntry(
          "Mark locations",
          "",
          0,
          0,
          "#49B382",
          "Grass",
        ),
      },
      {
        docId: "demo55555a",
        data: createCalendarEntry(
          "Place order for wood",
          "",
          2,
          4,
          "#F16D44",
          "Orange",
        ),
      },
      {
        docId: "demo5555",
        data: createCalendarEntry(
          "Dig post holes",
          "",
          6,
          6,
          "#49B382",
          "Grass",
        ),
      },
      {
        docId: "demo6666",
        data: createCalendarEntry(
          "Post & pour concrete",
          "",
          11,
          11,
          "#49B382",
          "Grass",
        ),
      },
      {
        docId: "demo7777",
        data: createCalendarEntry(
          "Secure bearers",
          "",
          12,
          19,
          "#DB4545",
          "Red",
        ),
      },
      {
        docId: "demo8888",
        data: createCalendarEntry("Fix joists", "", 18, 20, "#49B382", "Grass"),
      },
      {
        docId: "demo999",
        data: createCalendarEntry(
          "Lay decking boards",
          "",
          22,
          23,
          "#49B382",
          "Grass",
        ),
      },
      {
        docId: "demo999b",
        data: createCalendarEntry(
          "Sand rough edges & clean surface",
          "",
          25,
          25,
          "#E085D2",
          "Dragon Fruit",
        ),
      },
      {
        docId: "demo999a",
        data: createCalendarEntry("Apply stain", "", 6, 6, "#49B382", "Grass"),
      },
      {
        docId: "demo10101",
        data: createCalendarEntry(
          "Attach handrails",
          "",
          27,
          29,
          "#30A7E2",
          "Blue",
        ),
      },
      {
        docId: "demo11111",
        data: createCalendarEntry("Cleanup", "", 31, 31, "#49B382", "Grass"),
      },
    ];

    for (const { docId, data } of calendarData) {
      await setCalendarData(docId, data);
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
