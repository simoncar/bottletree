import React from "react";

const ProjectContext = React.createContext({
  key: "",
  title: "",
  icon: "",
  archived: false,
});

export default ProjectContext;
