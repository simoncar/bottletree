import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProjectContext from "./projectContext";
import { IUser } from "./types";

export function useProject() {
  return React.useContext(ProjectContext);
}

const ProjectProvider = ({ children }) => {
  const INITIAL_PROJECT: IUser = {
    uid: "",
    displayName: "",
    email: "",
    photoURL: "",
    project: "",
  };

  const [sharedDataProject, setSharedDataProject] = useState(INITIAL_PROJECT);

  useEffect(() => {
    AsyncStorage.getItem("@PROJECT").then((jsonValue) => {
      if (jsonValue) {
        setSharedDataProject(JSON.parse(jsonValue));
      }
    });
  }, []);

  async function updateStoreSharedDataProject(newData) {
    const jsonValue = JSON.stringify({
      ...sharedDataProject,
      ...newData,
    });
    if (newData === null) {
      AsyncStorage.removeItem("@PROJECT").then(() => {
        setSharedDataProject(null);
        return null;
      });
    }

    setSharedDataProject({ ...sharedDataProject, ...newData });
    AsyncStorage.setItem("@PROJECT", jsonValue).then(() => {
      return jsonValue;
    });
  }

  return (
    <ProjectContext.Provider
      value={{ sharedDataProject, updateStoreSharedDataProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
