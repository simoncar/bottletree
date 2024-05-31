import React from "react";
import { IProject } from "@/lib/types";

const ProjectContext = React.createContext<IProject>({
  key: "",
  title: "",
  icon: "",
  archived: false,
  postCount: 0,
  project: ""
});

export default ProjectContext;
