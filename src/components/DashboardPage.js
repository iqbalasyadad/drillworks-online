import React, { useState } from "react";
import Header from "./Header";
import Menu from "./Menu";
import QuickMenu from "./QuickMenu";

import LeftSidebar from "./LeftSidebar";
import TracksContainer from "./TracksContainer";
import "../css/styles.css";
import "../css/track-styles.css";



const DashboardPage = () => {
  // const [selectedProjectId, setSelectedProjectId] = useState(null);
  // const [projectName, setProjectName] = useState("");
  // const handleProjectSelect = (name) => {
  //   setProjectName(name); // Update the project name
  //   setSelectedProjectId(projectId);
  // };
  const [selectedProject, setSelectedProject] = useState(null);

  // Callback to update selected project
  const handleProjectSelect = (project) => {
    setSelectedProject(project); // project contains both id and name
    console.log(project);
  };
  

  return (
    <div id="app-container">
      <Header projectName={selectedProject} />
      <Menu onProjectSelect={handleProjectSelect} />
      <QuickMenu/>
      <div id="project-container">
        <LeftSidebar selectedProject={selectedProject}/>
        {/* <TracksContainer /> */}
      </div>
    </div>
  );
}

export default DashboardPage;
