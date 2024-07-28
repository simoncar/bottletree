import React from "react";
import { About } from "@/lib/about";
import { renderRouter, render, screen } from "expo-router/testing-library";
import { UserContext } from "@/lib/UserContext";
import { getLocales } from "expo-localization";
import { auth } from "@/lib/firebase";
import { getSession } from "@/lib/ctx";

// Mock expo-localization
jest.mock("expo-localization", () => ({
  getLocales: jest.fn().mockReturnValue([
    {
      country: "US",
      languageTag: "en-US",
      languageCode: "en",
      isRTL: false,
    },
  ]),
}));

// Mock Firebase Auth
jest.mock("@/lib/firebase", () => {
  const auth = {
    signInWithEmailAndPassword: jest.fn().mockResolvedValue({
      user: {
        uid: "1234567890",
        displayName: "John Doe",
        email: "john.doe@example.com",
        photoURL: "https://example.com/john-doe.jpg",
      },
    }),
    signOut: jest.fn().mockResolvedValue({}),
    onAuthStateChanged: jest.fn((callback) => {
      callback({
        uid: "1234567890",
        displayName: "John Doe",
        email: "john.doe@example.com",
        photoURL: "https://example.com/john-doe.jpg",
      });
    }),
  };
  return {
    auth: jest.fn(() => auth),
  };
});

// Mock session in @/lib/ctx
jest.mock("@/lib/ctx", () => ({
  useSession: jest.fn().mockResolvedValue({
    user: {
      uid: "1234567890",
      displayName: "John Doe",
      email: "john.doe@example.com",
      photoURL: "https://example.com/john-doe.jpg",
    },
    token: "mocked-token",
  }),
}));

it("about test", async () => {
  const user = {
    uid: "1234567890",
    displayName: "John Doe",
    email: "john.doe@example.com",
    photoURL: "https://example.com/john-doe.jpg",
    project: "73JwAXeOEhLXUggpVKK9",
  };

  const setUser = jest.fn();

  const { toJSON } = render(
    <UserContext.Provider value={{ user, setUser }}>
      <About />
    </UserContext.Provider>,
  );

  expect(toJSON()).toMatchSnapshot();
});
