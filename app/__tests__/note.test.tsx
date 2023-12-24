import React from "react";
import Note from "../(dashboard)/note";
import renderer from "react-test-renderer";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("../../lib/firebase");

test("show album note screen", () => {
  const tree = renderer.create(<Note />).toJSON();

  expect(tree).toMatchSnapshot();
});
