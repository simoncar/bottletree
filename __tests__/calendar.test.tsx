import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import Calendar from "@/app/(app)/(tabs)/calendar";
import { useNavigation } from "expo-router";
import { screen } from "expo-router/testing-library";
import { useColorScheme } from "react-native";
import { UserContext } from "@/lib/UserContext";
import { useProject } from "@/lib/projectProvider";
import { getItemsBigCalendar } from "@/lib/APIcalendar";

jest.mock("@/lib/APIproject", () => ({
  getProjects: jest.fn(),
}));

jest.mock("@/lib/APIcalendar", () => ({
  getItemsBigCalendar: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock("@/lib/projectProvider", () => ({
  useProject: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useNavigation: jest.fn(),
}));

describe("Calendar", () => {
  const mockCalendar = [
    {
      key: "1111",
      start: new Date(),
      end: new Date(),
      title: "Calendar 1",
      color: "red",
      colorName: "red",
      description: "Description 1",
      projectId: "1111",
      uid: "1111",
    },
    {
      key: "1111",
      start: new Date(),
      end: new Date(),
      title: "Calendar 2",
      color: "red",
      colorName: "red",
      description: "Description 2",
      projectId: "1111",
      uid: "1111",
    },
  ];

  const mockNavigate = jest.fn();
  const mockSetOptions = jest.fn();
  const mockSetNavOptions = jest.fn();

  beforeEach(() => {
    (getItemsBigCalendar as jest.Mock).mockImplementation(
      (project, callback) => {
        callback(mockCalendar);
      },
    );

    (useNavigation as jest.Mock).mockReturnValue({
      setOptions: mockSetOptions,
    });

    (useColorScheme as jest.Mock).mockReturnValue("light");

    (useProject as jest.Mock).mockReturnValue(mockCalendar);
  });

  it("renders the calendar", async () => {
    const user = {
      uid: "1234567890",
      displayName: "John Doe",
      email: "john.doe@example.com",
      photoURL: "https://example.com/john-doe.jpg",
      project: "73JwAXeOEhLXUggpVKK9",
      anonymous: false,
    };

    const setUser = jest.fn();

    const { getByText, queryByText } = render(
      <UserContext.Provider value={{ user, setUser }}>
        <Calendar />
      </UserContext.Provider>,
    );

    // Wait for the projects to be loaded
    await waitFor(() => {
      expect(getItemsBigCalendar).toHaveBeenCalledWith(
        "",
        expect.any(Function),
      );

      expect(queryByText("Loading...")).toBeNull();
      expect(getByText("Calendar 1")).toBeTruthy();
      expect(getByText("Calendar 2")).toBeTruthy();
      expect(screen).toMatchSnapshot();
    });
  });
});
