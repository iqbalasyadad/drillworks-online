import React, { useState } from "react";
import Header from "./Header";
import Menu from "./Menu";
import QuickMenu from "./QuickMenu";

import LeftSidebar from "./LeftSidebar";
import TracksContainer from "./TracksContainer";
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
