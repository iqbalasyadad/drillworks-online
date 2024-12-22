import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/dialog";
import "jquery-ui/themes/base/all.css";

import { getProjects, saveProject } from "../services/apiService.js";

function OpenProjectDialog({ isOpen, onClose, onProjectSelect }) {
  const fetchProjects = async () => {
    try {
      const projects = await getProjects();
      const projectSelect = $("#open-project-select");
      projectSelect.empty(); // Clear previous options
      projects.forEach((project) => {
        projectSelect.append(
          `<option value="${project._id}">${project.name}</option>`
        );
      });
    } catch (error) {
      console.error("Failed to fetch projects:", error.message);
    }
  };

  const saveSelectedProject = async (project) => {
    try {
      const result = await saveProject(project);
      console.log("Save result:", result);
      return result;
    } catch (error) {
      console.error("Failed to save project:", error.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }

    const dialog = $("#open-project-dialog2").dialog({
      autoOpen: isOpen,
      height: 400,
      width: 400,
      modal: true,
      buttons: {
        OK: function () {
          const projectId = $("#open-project-select").val();
          const projectName = $("#open-project-select option:selected").text();
          const projectDetail = { name: projectName, id: projectId };

          if (!projectId) {
            alert("Please select a project!");
            return;
          }

          saveSelectedProject(projectDetail);
          onProjectSelect(projectDetail); // Notify parent of selected project name
          dialog.dialog("close");
          onClose();
        },
        Cancel: function () {
          dialog.dialog("close");
          onClose();
        },
      },
      open: function () {
        $(".ui-dialog-buttonpane button")
          .addClass("small-dialog-button")
          .css({
            "font-size": "12px",
            padding: "4px 8px",
          });
        $(".ui-dialog-titlebar").addClass("small-dialog-title");
      },
      close: () => {
        onClose();
      },
    });

    if (!isOpen) {
      dialog.dialog("close");
    }

    return () => {
      dialog.dialog("destroy");
    };
  }, [isOpen, onClose, onProjectSelect]);

  return (
    <div id="open-project-dialog2" title="Open Project">
      <form>
        <select
          id="open-project-select"
          size="8"
          style={{
            width: "100%",
            height: "290px",
            fontSize: "10pt",
            padding: "2px",
          }}
        ></select>
      </form>
    </div>
  );
}

export default OpenProjectDialog;
