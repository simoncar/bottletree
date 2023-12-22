import React from "react";

const AuthContext = React.createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  language: string;
} | null>({
  signIn: () => {},
  signOut: () => {},
  session: null,
  isLoading: false,
  uid: "",
  displayName: "",
  email: "",
  photoURL: "",
  language: "en",
});

export default AuthContext;
