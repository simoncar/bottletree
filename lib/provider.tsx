import React, { useState } from "react";
import ProjectContext from "./context";

const MyProvider = ({ children }) => {
	const [sharedData, setSharedData] = useState({
		projectId: "",
		projectTitle: "",
		projectIcon: ""
	});

	const updateSharedData = (newData) => {
		setSharedData({ ...sharedData, ...newData });
	};

	return <ProjectContext.Provider value={{ sharedData, updateSharedData }}>{children}</ProjectContext.Provider>;
};

export default MyProvider;
