import React, { useEffect, useState } from "react";
import $ from "jquery";
import "jstree/dist/jstree.min.js";
import "jstree/dist/themes/default/style.min.css";
import { getProjectDataStructure } from "../services/apiService.js";

const JsTreeTable = ({ selectedProject }) => {
  const [treeData, setTreeData] = useState([]);

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
      });
  };

  useEffect(() => {
    if (selectedProject?.id) {
      const fetchData = async () => {
        try {
          const projectStructure = await getProjectDataStructure(selectedProject.id);
          setTreeData([
            {
              text: selectedProject.name,
              children: projectStructure.children || [],
            },
          ]);
        } catch (error) {
          console.error("Failed to load project structure:", error.message);
        }
      };

      fetchData();
    }
  }, [selectedProject]);

  useEffect(() => {
    $("#jstree").jstree("destroy").empty();
    initializeTree();
  }, [treeData]);

  return <div id="jstree"></div>;
};

export default JsTreeTable;
