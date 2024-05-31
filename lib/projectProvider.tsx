import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProjectContext from "./projectContext";
import { IUser } from "./types";

// This hook can be used to access the user info.
export function useProject() {
  return React.useContext(ProjectContext);
}

const ProjectProvider = ({ children }) => {
  const INITIAL_PROJECT: IUser = {
    uid: "",
    displayName: "",
    email: "",
    photoURL: "",
  };

  const [sharedDataProject, setSharedDataProject] = useState(INITIAL_PROJECT);

  useEffect(() => {
    AsyncStorage.getItem("@PROJECT").then((jsonValue) => {
      if (jsonValue) {
        setSharedDataProject(JSON.parse(jsonValue));
      }
    });
  }, []);

  async function updateSharedDataProject(newData) {
    console.log("updateSharedDataProject: ", newData);

    const jsonValue = JSON.stringify({
      ...sharedDataProject,
      ...newData,
    });
    setSharedDataProject({ ...sharedDataProject, ...newData });
    AsyncStorage.setItem("@PROJECT", jsonValue).then(() => {
      return jsonValue;
    });
  }

  return (
    <ProjectContext.Provider
      value={{ sharedDataProject, updateSharedDataProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
