import React from "react";
import Note from "../app/(app)/note";
import { renderRouter, screen } from "expo-router/testing-library";
import { UserContext } from "@/lib/UserContext";

it("note test", async () => {
  const user = {
    uid: "1234567890",
    displayName: "John Doe",
    email: "john.doe@example.com",
    photoURL: "https://example.com/john-doe.jpg",
    project: "73JwAXeOEhLXUggpVKK9",
  };

  const setUser = jest.fn();

  const MockComponent = jest.fn(() => (
    <UserContext.Provider value={{ user, setUser }}>
      <Note />
    </UserContext.Provider>
  ));

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
