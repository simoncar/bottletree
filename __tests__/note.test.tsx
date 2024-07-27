import React from "react";
import Note from "../app/(app)/note";
import { renderRouter, screen } from "expo-router/testing-library";

it("my-test", async () => {
  const MockComponent = jest.fn(() => <Note />);

  renderRouter(
    {
      index: MockComponent,
      "note?projectId=73JwAXeOEhLXUggpVKK9": MockComponent,
      "(group)/b": MockComponent,
    },
    {
      initialUrl: "/",
    },
  );

  expect(screen).toHavePathname("/");
  expect(screen).toMatchSnapshot();
});
