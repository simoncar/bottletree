import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import ProjectList from "@/app/(app)/projectList";
import { getProjects } from "@/lib/APIproject";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";
import { UserContext } from "@/lib/UserContext";
import { useProject } from "@/lib/projectProvider";

// Mock the dependencies
jest.mock("@/lib/APIproject", () => ({
  getProjects: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock("@/lib/projectProvider", () => ({
  useProject: jest.fn(),
}));

describe("ProjectList", () => {
  const mockProjects = [
    {
      title: "Project 1",
      email: "john.doe@example.com",
      icon: "https://example.com/john-doe.jpg",
      project: "1111",
      key: "1111",
      postCount: 0,
    },
    {
      title: "Project 2",
      email: "john.doe@example.com",
      icon: "https://example.com/john-doe.jpg",
      project: "2222",
      key: "2222",
      postCount: 0,
    },
  ];

  beforeEach(() => {
    (getProjects as jest.Mock).mockImplementation((uid, flag, callback) => {
      callback(mockProjects);
    });
    (useLocalSearchParams as jest.Mock).mockReturnValue({ page: "1" });
    (useColorScheme as jest.Mock).mockReturnValue("light");
    (useProject as jest.Mock).mockReturnValue(mockProjects);
  });

  it("renders the project list and handles loading state", async () => {
    const user = {
      uid: "1234567890",
      displayName: "John Doe",
      email: "john.doe@example.com",
      photoURL: "https://example.com/john-doe.jpg",
      project: "73JwAXeOEhLXUggpVKK9",
    };

    const setUser = jest.fn();

    const { getByText, queryByText } = render(
      <UserContext.Provider value={{ user, setUser }}>
        <ProjectList />
      </UserContext.Provider>,
    );

    // Initially, the loading state should be true
    //expect(queryByText("Loading...")).toBeTruthy();

    // Wait for the projects to be loaded
    await waitFor(() => {
      expect(getProjects).toHaveBeenCalledWith(
        user.uid,
        true,
        expect.any(Function),
      );
      expect(queryByText("Loading...")).toBeNull();
      expect(getByText("Project 1")).toBeTruthy();
      expect(getByText("Project 2")).toBeTruthy();
    });
  });
});
