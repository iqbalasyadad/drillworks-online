import React, { useEffect, useState } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/dialog";
import "jquery-ui/themes/base/all.css";

import { getProjects} from '../services/apiService.js';

function DeleteProjectDialog({ isOpen, onClose }) {
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchProjects = async () => {
    console.log("fetch clicked");
    try {
        const projects = await getProjects();
        const projectSelect = $('#modal-delete-project-select');
        projectSelect.empty(); // Clear previous options
        projects.forEach(project => {
          projectSelect.append(`<option value="${project._id}">${project.name}</option>`);
        });

    } catch (error) {
        console.error("Failed to fetch projects:", error.message);
    }
  };

  const deleteProject = async (projectId, deleteWells) => {
    try {
      const response = await fetch(`${apiUrl}/api/projects/${projectId}?delete_wells=${deleteWells}`, {
        method: "DELETE",
        credentials: "include",
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete project");
      }
  
      console.log(result.message);
      if (deleteWells) {
        console.log(`${result.wells_deleted} wells were deleted.`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
    fetchProjects();

  };


  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }

    const dialog = $("#delete-project-dialog").dialog({
      autoOpen: isOpen,
      height: 400,
      width: 400,
      modal: true,
      buttons: {
        Delete: function () {
          const projectId = $("#modal-delete-project-select").val();
          if (!projectId) {
            alert("Please select a project!");
            return;
          }

          let deleteWellsChecked = $("#modal-delete-project-delete-wells-checkbox").prop("checked");
          console.log(projectId, deleteWellsChecked);
          deleteProject(projectId, deleteWellsChecked);
          // dialog.dialog("close");
          // onClose();
        },
        Cancel: function () {
          dialog.dialog("close");
          onClose(); // Notify parent to close
        },
      },
      open: async function () {
        $(".ui-dialog-buttonpane button")
        .addClass("small-dialog-button")
        .css({
            "font-size": "12px",
            "padding": "4px 8px",
        });
        $(".ui-dialog-titlebar").addClass("small-dialog-title");
      },
      close: () => {
        onClose();
      }
    });

    // Close dialog if `isOpen` changes to false
    if (!isOpen) {
      dialog.dialog("close");
    }

    return () => {
      dialog.dialog("destroy");
    };
  }, [isOpen]);

  return (
    <div id="delete-project-dialog" title="Delete a Project">
      <form>
        <select id="modal-delete-project-select" size="8" style={{width: "100%", height: "240px", fontSize:"10pt", padding: "5px"}}></select>
        <div style={{marginTop: "10px"}}>
          <input type="checkbox" id="modal-delete-project-delete-wells-checkbox" value="delete-wells" style={{marginRight: "5px"}}></input>
          <label htmlFor="modal-delete-project-delete-wells-checkbox" className="modal-label-input">Delete all wells in this project that are not shared by other projects</label>
        </div>
      </form>
    </div>
  );
}

export default DeleteProjectDialog;
