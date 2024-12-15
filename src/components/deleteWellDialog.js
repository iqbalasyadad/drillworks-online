import React, { useEffect, useState } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/dialog";
import "jquery-ui/themes/base/all.css";

import { getSessionProjects, getWells} from '../services/apiService.js';

function DeleteWellDialog({ isOpen, onClose }) {

  const apiUrl = process.env.REACT_APP_API_URL;
  const fetchWells = async () => {
    console.log("fetch wells called");
    try {

        // Fetch the selected project ID
        const project_session = await getSessionProjects();
        const projectId = project_session.id; // Assuming `getSessionProjects` fetches the current project ID
        if (!projectId) {
            alert("Failed to retrieve the selected project. Please try again.");
            return;
        }

        const wells = await getWells(projectId);
        const wellSelect = $('#modal-delete-well-select');
        wellSelect.empty(); // Clear previous options
        wells.forEach(well => {
          wellSelect.append(`<option value="${well._id}">${well.name}</option>`);
        });

    } catch (error) {
        console.error("Failed to fetch wells:", error.message);
    }
  };

  const deleteWell = async (projectId, wellId) => {
    try {
      const response = await fetch(`${apiUrl}/api/wells/${wellId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete project");
      }
      console.log(result.message);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
    fetchWells();
  };


  useEffect(() => {
    if (isOpen) {
      fetchWells();
    }

    const dialog = $("#delete-well-dialog").dialog({
      autoOpen: isOpen,
      height: 400,
      width: 400,
      modal: true,
      buttons: {
        Delete: async function () {
          try {
            const wellId = $("#modal-delete-well-select").val();
            if (!wellId) {
              alert("Please select a well!");
              return;
            }
            const project_session = await getSessionProjects();
            const projectId = project_session.id;
            deleteWell(projectId, wellId);

            console.log("Deleted: ", wellId);
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred: " + error.message);
          }
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
    <div id="delete-well-dialog" title="Delete a Well">
      <form>
        <select id="modal-delete-well-select" size="8" style={{width: "100%", height: "240px", fontSize:"10pt", padding: "5px"}}></select>
      </form>
    </div>
  );
}

export default DeleteWellDialog;
