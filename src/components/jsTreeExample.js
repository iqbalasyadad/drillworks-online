import React, { useEffect, useState } from "react";
import $ from "jquery";
import "jstree/dist/jstree.min.js";
import "jstree/dist/themes/default/style.min.css";
import { getProjectDataStructure } from "../services/apiService.js";
// import { ProjectIcon, FileIcon } from "../assets/icons";

const JsTreeTable = ({ selectedProject }) => {
  const [treeData, setTreeData] = useState([]);

  // Function to add icons based on the node type (project, well, wellbore, dataset, line group)
  const addIconsToNodes = (nodes, level = 0) => {
    return nodes.map((node) => {
      // Determine icon based on node type and level
      if (level === 0) {
        // Root node (Project)
        node.state = { "opened" : true };
        // node.icon = ProjectIcon; // Project icon
      } else if (node.type === "well") {
        // Well node
        // node.icon = "../assets/icons/backlog.png"; // Well icon
      } else if (node.type === "wellbore") {
        // Wellbore node
        // node.icon = "fa fa-pyramid"; // Wellbore icon
      } else if (node.type === "dataset") {
        // Dataset node
        // node.icon = FileIcon; // Dataset icon
      } else if (node.type === "lineGroup") {
        // Line Group node
        // node.icon = "fa fa-sitemap"; // Line Group icon
      }

      // Recursively add icons to child nodes
      if (node.children && node.children.length > 0) {
        node.children = addIconsToNodes(node.children, level + 1);
      }

      return node;
    });
  };

  // Initialize JsTree with the updated treeData
  const initializeTree = () => {
    $("#jstree")
      .jstree({
        core: {
          data: treeData,
        },
        plugins: ["table"],
        table: {
          columns: [
            { width: 200, header: "Node Name" },
            { width: 100, header: "Details" },
          ],
          resizable: true,
        },
        themes: {
          theme: "apple",
          dots: true,
          icons: true,
        },
      });
  };

  useEffect(() => {
    if (selectedProject?.id) {
      const fetchData = async () => {
        try {
          const projectStructure = await getProjectDataStructure(selectedProject.id);

          // Prepare the tree data structure with project name at the root
          const treeWithIcons = addIconsToNodes([
            {
              text: selectedProject.name,
              type: "project", // Mark as a project type for icon assignment
              children: projectStructure.children || [],
            },
          ]);

          setTreeData(treeWithIcons);
        } catch (error) {
          console.error("Failed to load project structure:", error.message);
        }
      };

      fetchData();
    }
  }, [selectedProject]);

  useEffect(() => {
    // Reinitialize the tree when treeData changes
    if (treeData.length > 0) {
      $("#jstree").jstree("destroy").empty();
      initializeTree();
    }
  }, [treeData]);

  return <div id="jstree"></div>;
};

export default JsTreeTable;
