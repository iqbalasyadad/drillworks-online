import React, { useState, useRef, useEffect } from "react";
import { getSessionProjects, getProjectDataStructure } from '../services/apiService.js';
import $ from "jquery";
import "jquery-ui/ui/widgets/dialog";
import "jquery-ui/themes/base/all.css";
import JsTreeTable from './jsTreeExample.js'

const LeftSidebar = ( { selectedProject } ) => {
  const [sidebarWidth, setSidebarWidth] = useState(200); // Initial width of sidebar
  const [dragging, setDragging] = useState(false);
  const [treeData, setTreeData] = useState({ core: { data: [{text: "Root"}] } }); // Initialize treeData state
  
  const treeDataManual = { core: { data: [{text: "Root Updated"}] } };

  // const treeDataManual = 
  const sidebarRef = useRef(null);

  // Handle sidebar dragging
  const startDragging = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const newWidth = e.clientX;
      setSidebarWidth(newWidth);
    }
  };

  const stopDragging = () => {
    setDragging(false);
  };

  // Event listeners for mouse move and up
  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDragging);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [dragging]);

  // Handle tab switching
  const openPexpTab = (evt, tabName) => {
    const tabcontent = document.querySelectorAll(".p-exp-tabcontent");
    tabcontent.forEach((content) => content.style.display = "none");

    const tablinks = document.querySelectorAll(".p-exp-tablinks");
    tablinks.forEach((link) => link.classList.remove("active"));

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
  };

  // Fetch and set project structure
  const getProjectStructure = async () => {
    try {
      const projectId = await getSessionProjects(); // Fetch current project ID
      if (!projectId) {
        alert("Failed to retrieve the selected project. Please try again.");
        return;
      }

      const projectStructure = await getProjectDataStructure(projectId); // Fetch project structure
      const resultData = { core: { data: [projectStructure] } };

      // Update tree data state
      // setTreeData(treeDataManual);

    } catch (error) {
      console.error("Failed to fetch project structure:", error.message);
    }
  };

  // Automatically click the default tab on mount
  useEffect(() => {
    $("#defaultOpen").click();
  }, []);

  

  return (
    <div id="sidebar-container" ref={sidebarRef} style={{ width: `${sidebarWidth}px` }}>
      <div id="p-exp-container">
        <div id="p-exp-tab-data-content" className="p-exp-tabcontent">
          <JsTreeTable selectedProject={selectedProject}/>
        </div>

        <div id="p-exp-tab-display-content" className="p-exp-tabcontent">
          <h3>Display</h3>
          <p>Show tree view</p>
        </div>

        <div className="p-exp-tab">
          <button
            className="p-exp-tablinks"
            onClick={(e) => openPexpTab(e, "p-exp-tab-data-content")}
            id="defaultOpen"
          >
            Data
          </button>
          <button
            className="p-exp-tablinks"
            onClick={(e) => openPexpTab(e, "p-exp-tab-display-content")}
          >
            Display
          </button>
        </div>
      </div>

      <div
        id="dragbar"
        onMouseDown={startDragging}
        style={{ cursor: "col-resize" }}
      ></div>
    </div>
  );
};

export default LeftSidebar;
