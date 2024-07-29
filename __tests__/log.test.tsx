import React from "react";
import Log from "../app/(app)/log";
import { renderRouter, screen } from "expo-router/testing-library";
import { UserContext } from "@/lib/UserContext";
import { getLogs } from "@/lib/APILog";

jest.mock("@/lib/APILog", () => ({
  getLogs: jest.fn(),
}));

describe("LogList", () => {
  const user = {
    uid: "1234567890",
    displayName: "John Doe",
    email: "john.doe@example.com",
    photoURL: "https://example.com/john-doe.jpg",
    project: "73JwAXeOEhLXUggpVKK9",
  };

  const mockLogs = [
    {
      key: 1,
      device: "Android",
      logLevel: "INFO",
      message: "Some Message",
      timestamp: null,
      version: "1",
    },
    {
      key: 2,
      device: "Android",
      logLevel: "INFO",
      message: "Some Message",
      timestamp: null,
      version: "1",
    },
    {
      key: 3,
      device: "Android",
      message: "Some Message",
      timestamp: null,
      version: "1",
    },
    {
      key: 4,
      device: "Android",
      timestamp: null,
      version: "1",
    },
    {
      key: 5,
      device: "Android",
      timestamp: null,
    },
    {
      key: 6,
      timestamp: null,
      version: "1",
    },
  ];

  beforeEach(() => {
    (getLogs as jest.Mock).mockImplementation((callback) => {
      callback(mockLogs);
    });
  });

  it("render log test", async () => {
    const setUser = jest.fn();

    const MockComponent = jest.fn(() => (
      <UserContext.Provider value={{ user, setUser }}>
        <Log />
      </UserContext.Provider>
    ));

    renderRouter(
      {
        index: MockComponent,
        "note?project=73JwAXeOEhLXUggpVKK9": MockComponent,
        "(group)/b": MockComponent,
      },
      {
        initialUrl: "/",
      },
    );

    expect(screen).toHavePathname("/");
    expect(screen).toMatchSnapshot();
  });
});
