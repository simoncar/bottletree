import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProjectContext from "./context";
import { INITIAL_TRANSACTION_CONTEXT_V4 } from "@sentry/react-native/dist/js/tracing/reactnavigationv4";

const MyProvider = ({ children }) => {
	const INITIAL_PROJECT = {
		projectId: "",
		projectTitle: "",
		projectIcon: ""
	};

	const [sharedData, setSharedData] = useState(INITIAL_PROJECT);

	useEffect(() => {
		AsyncStorage.getItem("@PROJECT").then((jsonValue) => {
			console.log("Getting1 Use Effect: jsonValue: ", jsonValue);

			if (jsonValue) {
				setSharedData(JSON.parse(jsonValue));
				console.log("Getting2 Use Effect: jsonValue: ", jsonValue);
			}
		});
	}, []);

	const updateSharedData = (newData) => {
		try {
			const jsonValue = JSON.stringify({ ...sharedData, ...newData });
			setSharedData({ ...sharedData, ...newData });
			AsyncStorage.setItem("@PROJECT", jsonValue);
			console.log("Setting: jsonValue: ", jsonValue);
		} catch (e) {
			console.log("updateSharedData Error: ", e);
		}
	};

	return <ProjectContext.Provider value={{ sharedData, updateSharedData }}>{children}</ProjectContext.Provider>;
};

export default MyProvider;
