import React from "react";
import Note from "../note";
import renderer from "react-test-renderer";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("../../lib/firebase", () => {
  return {
    firebaseFunction1: jest.fn(),
    firebaseFunction2: jest.fn(),
    // Add other functions as needed
  };
});

jest.mock("@react-native-firebase/app", () => ({
  // Mocked return of the default export
  default: jest.fn(),
  // Mocked return of a named export
  someNamedExport: jest.fn(),
}));

jest.mock("@react-native-firebase/auth", () => {
  return () => ({
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
    // Add other methods as needed
  });
});

jest.mock("@react-native-firebase/firestore", () => {
  return () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(() => Promise.resolve()),
        get: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve()),
      })),
      get: jest.fn(() => Promise.resolve()),
      where: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve()),
      })),
    })),
  });
});

jest.mock("@react-native-firebase/storage", () => {
  return () => ({
    ref: jest.fn(() => ({
      putFile: jest.fn(() => Promise.resolve()),
      getDownloadURL: jest.fn(() => Promise.resolve("mockedUrl")),
    })),
  });
});

test("show album note screen", () => {
  const tree = renderer.create(<Note />).toJSON();

  expect(tree).toMatchSnapshot();
});
