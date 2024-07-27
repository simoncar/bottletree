import React from "react";
import UserList from "../app/(app)/userList";
import { getUsers } from "@/lib/APIuser";
import { renderRouter, screen } from "expo-router/testing-library";

jest.mock("@/lib/APIuser", () => ({
  getUsers: jest.fn(),
}));

it("user list test", async () => {
  const MockComponent = jest.fn(() => <UserList />);

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
