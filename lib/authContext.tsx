import React from "react";

const AuthContext = React.createContext({
  uid: "",
  displayName: "",
  email: "",
  photoURL: "",
});

export default AuthContext;
