import React, { useEffect, useState } from "react";
import $ from "jquery";
import "jstree/dist/jstree.min.js";
import "jstree/dist/themes/default/style.min.css";
import { getProjectDataStructure } from "../services/apiService.js";
import { useTreeUpdate } from "./TreeUpdateContext";

const JsTreeTable = ({ selectedProject }) => {
  const { updateTrigger } = useTreeUpdate(); // Get update trigger from context
  const [treeData, setTreeData] = useState([]);

  const initializeTree = () => {
    $("#jstree")
      .jstree({
        core: { data: treeData },
        plugins: ["table"],
        table: {
          columns: [
            { width: 200, header: "Node Name" },
            { width: 100, header: "Details" },
          ],
          resizable: true,
        },
        themes: { theme: "apple", dots: true, icons: true },
      });
  };

  const fetchTreeData = async () => {
    if (selectedProject?.id) {
      try {
        const projectStructure = await getProjectDataStructure(selectedProject.id);
        const formattedData = {
          text: selectedProject.name,
          children: projectStructure.children || [],
        };
        setTreeData([formattedData]);
      } catch (error) {
        console.error("Failed to load project structure:", error.message);
      }
    }
  };

  useEffect(() => {
    console.log("Fetching data for tree update:", updateTrigger);
    fetchTreeData();
  }, [selectedProject, updateTrigger]);

  useEffect(() => {
    if (treeData.length > 0) {
      $("#jstree").jstree("destroy").empty(); // Clear old tree
      initializeTree(); // Initialize with updated data
    }
  }, [treeData]);

  return <div id="jstree"></div>;
};

export default JsTreeTable;
