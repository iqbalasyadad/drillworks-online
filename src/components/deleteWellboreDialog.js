import React, { useEffect, useState } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/dialog";
import "jquery-ui/themes/base/all.css";

import { getSessionProjects, getWellbores, getWells} from '../services/apiService.js';
import { useTreeUpdate } from "./TreeUpdateContext";

function DeleteWellboreDialog({ isOpen, onClose }) {
  const { triggerTreeUpdate } = useTreeUpdate();

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchWellsWellbores = async () => {
    console.log("fetch wells wellbores called");
    try {

        // Fetch the selected project ID
        const project_session = await getSessionProjects(); // Assuming `getSessionProjects` fetches the current project ID
        const projectId = project_session.id;
        if (!projectId) {
            alert("Failed to retrieve the selected project. Please try again.");
            return;
        }

        const wells = await getWells(projectId);
        const wellSelect = $('#modal-delete-wellbore-well-target-select');
        const wellboreSelect = $('#modal-delete-wellbore-wellbore-select');
        
        // Clear and populate the wells dropdown
        wellSelect.empty();
        wells.forEach(well => {
          wellSelect.append(`<option value="${well._id}">${well.name}</option>`);
        });
        
        // Add a single event listener for changes on the well dropdown
        wellboreSelect.empty(); // Clear existing wellbore options
        wellSelect.off('change').on('change', async function () {
          const selectedWellId = $(this).val(); // Get the selected well ID
          wellboreSelect.empty(); // Clear existing wellbore options
        
          if (selectedWellId) {
            try {
              const wellbores = await getWellbores(selectedWellId); // Fetch wellbores for the selected well
              wellbores.forEach(wellbore => {
                wellboreSelect.append(`<option value="${wellbore._id}">${wellbore.name}</option>`);
              });
            } catch (error) {
              console.error("Error populating wellbores:", error);
            }
          }
        });
    } catch (error) {
        console.error("Failed to fetch wells:", error.message);
    }
  };


  const deleteWellbore = async (wellId, wellboreId) => {
    try {
      const response = await fetch(`${apiUrl}/api/wellbores/${wellboreId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ well_id: wellId })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete wellbore");
      }
      console.log(result.message);
      triggerTreeUpdate();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
    fetchWellsWellbores();
  };


  useEffect(() => {
    if (isOpen) {
      fetchWellsWellbores();
    }

    const dialog = $("#delete-wellbore-dialog").dialog({
      autoOpen: isOpen,
      height: 400,
      width: 400,
      modal: true,
      buttons: {
        Delete: async function () {
          try {
            const wellId = $("#modal-delete-wellbore-well-target-select").val();
            if (!wellId) {
              alert("Please select a well!");
              return;
            }
            const wellboreId = $("#modal-delete-wellbore-wellbore-select").val();
            if (!wellboreId) {
              alert("Please select a wellbore!");
              return;
            }
            deleteWellbore(wellId, wellboreId);
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
    <div id="delete-wellbore-dialog" title="Delete a Wellbore">
      <form>
        <div style={{marginBottom: "10px"}}>
          <p>Select a target well:</p>
          <select id="modal-delete-wellbore-well-target-select" size="8" style={{width: "100%", height: "100px", fontSize:"10pt", padding: "2px"}}></select>
        </div>
        <div>
          <p>Select a wellbore:</p>
          <select id="modal-delete-wellbore-wellbore-select" size="8" style={{width: "100%", height: "100px", fontSize:"10pt", padding: "2px"}}></select>
        </div>
      </form>
    </div>
  );
}

export default DeleteWellboreDialog;
