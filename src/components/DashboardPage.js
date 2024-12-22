import React, { useState } from "react";
import Header from "./Header";
import MenuBar from "./MenuBar";
import QuickMenu from "./QuickMenu";

import LeftSidebar from "./LeftSidebar";
import TracksContainer from "./TracksContainer";
import { TreeUpdateProvider } from "./TreeUpdateContext";

import "../assets/styles/styles.css";
import "../assets/styles/track-styles.css";

const DashboardPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Callback to update selected project
  const handleProjectSelect = (project) => {
    setSelectedProject(project); // project contains both id and name
    console.log(project);
  };
  

  return (
    <TreeUpdateProvider>
      <div id="app-container">
        <Header project={selectedProject} />
        <MenuBar onProjectSelect={handleProjectSelect} />
        <QuickMenu/>
        <div id="project-container">
          <LeftSidebar selectedProject={selectedProject}/>
          {/* <TracksContainer /> */}
        </div>
      </div>
    </TreeUpdateProvider>
  );
}

export default DashboardPage;
