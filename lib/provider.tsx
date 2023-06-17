import React, { useState } from "react";
import MyContext from "./context";

const MyProvider = ({ children }) => {
	const [sharedData, setSharedData] = useState({
		username: "John Doe",
		age: 25
	});

	const updateSharedData = (newData) => {
		setSharedData({ ...sharedData, ...newData });
	};

	return <MyContext.Provider value={{ sharedData, updateSharedData }}>{children}</MyContext.Provider>;
};

export default MyProvider;
