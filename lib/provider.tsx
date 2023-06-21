import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProjectContext from "./context";

const MyProvider = ({ children }) => {
	const INITIAL_PROJECT = {
		projectId: "",
		projectTitle: "",
		projectIcon: ""
	};

	const [sharedData, setSharedData] = useState(INITIAL_PROJECT);

	useEffect(() => {
		AsyncStorage.getItem("@PROJECT").then((jsonValue) => {
			if (jsonValue) {
				setSharedData(JSON.parse(jsonValue));
			}
		});
	}, []);

	const updateSharedData = (newData) => {
		try {
			const jsonValue = JSON.stringify({ ...sharedData, ...newData });
			setSharedData({ ...sharedData, ...newData });
			AsyncStorage.setItem("@PROJECT", jsonValue);
		} catch (e) {
			console.log("updateSharedData Error: ", e);
		}
	};

	return <ProjectContext.Provider value={{ sharedData, updateSharedData }}>{children}</ProjectContext.Provider>;
};

export default MyProvider;
