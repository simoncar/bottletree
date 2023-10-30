import React from "react";

const AuthContext = React.createContext({
  uid: "",
  displayName: "",
  email: "",
  photoURL: "",
  language: "en",
});

export default AuthContext;
