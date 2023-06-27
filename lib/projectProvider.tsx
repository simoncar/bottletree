import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProjectContext from "./projectContext";
import { IUser } from "./types";

const ProjectProvider = ({ children }) => {
    const INITIAL_PROJECT: IUser = {
        uid: "",
        displayName: "",
        email: "",
        photoURL: "",
    };

    const [sharedData, setSharedDataProject] = useState(INITIAL_PROJECT);

    useEffect(() => {
        AsyncStorage.getItem("@PROJECT").then((jsonValue) => {
            if (jsonValue) {
                setSharedDataProject(JSON.parse(jsonValue));
            }
        });
    }, []);

    const updateSharedDataProject = (newData) => {
        try {
            const jsonValue = JSON.stringify({ ...sharedData, ...newData });
            setSharedDataProject({ ...sharedData, ...newData });
            AsyncStorage.setItem("@PROJECT", jsonValue);
        } catch (e) {
            console.log("updateSharedDataProject Error: ", e);
        }
    };

    return (
        <ProjectContext.Provider
            value={{ sharedData, updateSharedDataProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export default ProjectProvider;
