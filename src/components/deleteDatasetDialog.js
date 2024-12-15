import React, { useEffect, useState } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/dialog";
import "jquery-ui/themes/base/all.css";

import { getSessionProjects, getWells, getWellbores, getDatasetsName} from '../services/apiService.js';

function DeleteDatasetDialog({ isOpen, onClose }) {

  const apiUrl = process.env.REACT_APP_API_URL;

  let lastSelectedWellboreId = "";

  function clearDeleteDatasetDialogSelect() {
    const wellSelect = $('#modal-delete-dataset-well-target-select');
    const wellboreSelect = $('#modal-delete-dataset-wellbore-target-select');
    const datasetsSelect = $('#modal-delete-dataset-datasets-select');
    wellSelect.empty();
    wellboreSelect.empty();
    datasetsSelect.empty();
  }
  const fetchDatasets = async (selectedWellboreId) => {
    const datasetsSelect = $('#modal-delete-dataset-datasets-select');
    datasetsSelect.empty();
    try {
      const datasets = await getDatasetsName(selectedWellboreId);  
      datasets.forEach(dataset => {
        datasetsSelect.append(`<option value="${dataset._id}">${dataset.name}</option>`);
      });

      // Convert datasets select to a checklist
      datasetsSelect.attr('multiple', true);
      datasetsSelect.css({ 'height': 'auto' }); // Ensure it's styled for multiple selections
    } catch (error) {
      console.error("Error populating datasets:", error);
    }
  }

  const fetchWellsWellbores = async () => {
    try {
  
        // Fetch the selected project ID
        const project_session = await getSessionProjects(); // Assuming `getSessionProjects` fetches the current project ID
        const projectId = project_session.id;
        if (!projectId) {
            alert("Failed to retrieve the selected project. Please try again.");
            return;
        }
  
        const wells = await getWells(projectId);
        const wellSelect = $('#modal-delete-dataset-well-target-select');
        const wellboreSelect = $('#modal-delete-dataset-wellbore-target-select');
  
        // Clear and populate the wells dropdown
        wellSelect.empty();
        wells.forEach(well => {
          wellSelect.append(`<option value="${well._id}">${well.name}</option>`);
        });
  
        // Add a single event listener for changes on the well dropdown
        wellSelect.off('change').on('change', async function () {
          const selectedWellId = $(this).val(); // Get the selected well ID
          wellboreSelect.empty(); // Clear existing Dataset options
        
          if (selectedWellId) {
            try {
              const wellbores = await getWellbores(selectedWellId);
  
              wellbores.forEach(wellbore => {
                wellboreSelect.append(`<option value="${wellbore._id}">${wellbore.name}</option>`);
              });
  
              // Set default selected wellbore to the first one and trigger change
              if (wellbores.length > 0) {
                wellboreSelect.val(wellbores[0]._id).trigger('change');
              }
            } catch (error) {
              console.error("Error populating wellbores:", error);
            }
          }
        });
  
        // Add a single event listener for changes on the wellbore dropdown
        wellboreSelect.off('change').on('change', async function () {
          const selectedWellboreId = $(this).val(); // Get the selected wellbore ID
        
          if (selectedWellboreId) {
            lastSelectedWellboreId = selectedWellboreId;
            fetchDatasets(selectedWellboreId);
          }
        });
  
        // Set default selected well to the first one and trigger change
        if (wells.length > 0) {
          wellSelect.val(wells[0]._id).trigger('change');
        }
  
    } catch (error) {
        console.error("Failed to fetch wells/wellbores/datasets:", error.message);
    }
  };
  
  const deleteDatasets = async (wellboreId, datasetIds) => {
    try {
      const response = await fetch(`${apiUrl}/api/datasets`, {
        method: "DELETE",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          wellbore_id: wellboreId,
          dataset_ids: datasetIds
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete datasets");
      }
      console.log(result.message);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
    fetchDatasets(lastSelectedWellboreId);
    // fetchWellsWellbores();
  };
  


  useEffect(() => {
    if (isOpen) {
      fetchWellsWellbores();
    }

    const dialog = $("#delete-dataset-dialog").dialog({
      autoOpen: isOpen,
      height: 400,
      width: 400,
      modal: true,
      buttons: {
        Delete: async function () {
          try {
            const wellId = $("#modal-delete-dataset-well-target-select").val();
            if (!wellId) {
              alert("Please select a well!");
              return;
            }
            const wellboreId = $("#modal-delete-dataset-wellbore-target-select").val();
            if (!wellboreId) {
              alert("Please select a wellbore!");
              return;
            }
            const datasetsIds = $("#modal-delete-dataset-datasets-select").val();
            if (!datasetsIds) {
              alert("Please select datasets!");
              return;
            }
            deleteDatasets(wellId, datasetsIds);

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
        clearDeleteDatasetDialogSelect();
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
    <div id="delete-dataset-dialog" title="Delete a dataset">
      <form>
        <div style={{marginBottom: "10px"}}>
          <p>Select a well:</p>
          <select id="modal-delete-dataset-well-target-select" style={{width: "100%", fontSize:"10pt", padding: "2px"}}></select>
        </div>
        <div style={{marginBottom: "10px"}}>
          <p>Select a wellbore:</p>
          <select id="modal-delete-dataset-wellbore-target-select" style={{width: "100%", fontSize:"10pt", padding: "2px"}}></select>
        </div>
        <div>
          <p>Datasets:</p>
          <select id="modal-delete-dataset-datasets-select" size="8" style={{width: "100%", height: "100px", fontSize:"10pt", padding: "2px"}}></select>
        </div>
      </form>
    </div>
  );
}

export default DeleteDatasetDialog;
