import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/dialog";
import "jquery-ui/themes/base/all.css";
import { getSessionProjects } from '../services/apiService.js';
import { useTreeUpdate } from "./TreeUpdateContext";


function CreateWellModal ({ isOpen, onClose }) {
  
    const { triggerTreeUpdate } = useTreeUpdate();
  
    const apiUrl = process.env.REACT_APP_API_URL;
  
    let currentPage = 1;
    const totalPages = 2;

    function showPage(page) {
        $(".page-modal-create-well").hide();
        $(`.page-modal-create-well[data-page="${page}"]`).show();

        // Dynamically update the dialog title with the current step
        const stepTitles = {
            1: "Step 1: Collect Well General Information",
            2: "Step 2: Well Notes",
        };
        $("#pagination-modal-create-well").dialog("option", "title", stepTitles[page]);

        updateButtonStates();
    }

    function updateButtonStates() {
        $(".ui-dialog-buttonpane button:contains('< Back')").button("option", "disabled", currentPage === 1);
        $(".ui-dialog-buttonpane button:contains('Next >')").button("option", "disabled", currentPage === totalPages);
        $(".ui-dialog-buttonpane button:contains('Finish')").button("option", "disabled", currentPage !== totalPages);
    }

  useEffect(() => {
    const dialog = $("#pagination-modal-create-well").dialog({
      autoOpen: isOpen,
      height: 400,
      width: 500,
      modal: true,
      buttons: {

        "< Back": function () {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
            }
        },
        "Next >": function () {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
            }
        },
        "Finish": async function () {

            try {
              // Fetch the selected project ID
              const project_session = await getSessionProjects(); // Assuming `getSessionProjects` fetches the current project ID
              const projectId = project_session.id;
              if (!projectId) {
                  alert("Failed to retrieve the selected project. Please try again.");
                  return;
              }
      
              // Gather form data
              const formData = {
                  project_id: projectId,
                  name: $("#modal-create-well-name").val(),
                  description: $("#modal-create-well-description").val(),
                  uid: $("#modal-create-well-uid").val(),
                  common_name: $("#modal-create-well-common-well-name").val(),
                  status: $("#modal-create-well-status-select").val(),
                  basin_name: $("#modal-create-well-basin-name").val(),
                  dominant_geology: $("#modal-create-well-dominan-geology-select").val(),
                  water_velocity: $("#modal-create-well-water-velocity").val(),
                  ground_elevation: parseFloat($("#modal-create-well-ground-elevation").val()),
                  water_depth: parseFloat($("#modal-create-well-water-depth").val()),
                  density_water: parseFloat($("#modal-create-well-density-water").val()) || null,
                  density_formation_fluid: parseFloat($("#modal-create-well-density-formation-fluid").val()) || null,
                  default_unit_depth: $("#modal-create-well-default-unit-depth-select").val(),
                  default_unit_density: $("#modal-create-well-default-unit-density-select").val(),
                  notes: $("#modal-create-well-notes").val(),
              };
      
              // Validate required fields
              if (!formData.name) {
                  alert("Please enter a well name!");
                  return;
              }
      
              console.log("Creating a new well with the following data:", formData);
      
              // Uncomment and use this section to send the data to your backend
              const response = await fetch(`${apiUrl}/api/wells`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formData),
                  credentials: "include",
              });
      
              const result = await response.json();
              if (!response.ok) {
                  throw new Error(result.message || "Failed to add well");
              }
              triggerTreeUpdate();
              $(this).dialog("close");
              onClose();
              
          } catch (error) {
              console.error("Error:", error);
              alert("An error occurred: " + error.message);
          }
        },
        Cancel: function () {
            $(this).dialog("close");
            $("#pagination-form-create-well")[0].reset();
            currentPage = 1;
            showPage(currentPage);
            onClose();
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
        showPage(currentPage);
      },
      close: () => {
        $("#pagination-form-create-well")[0].reset();
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
    <div id="pagination-modal-create-well" title="Create a Well">
      <form id="pagination-form-create-well">
        <div id="page-container-create-well">
  
          {/* Page 1 */}
          <div className="page-modal-create-well" data-page="1">
            <table>
              <tbody>
                <tr className="modal-input-table-tr">
                  <td style={{width:"230px"}}><label className="modal-label-input" htmlFor="modal-create-well-name">Well name:</label></td>
                  <td style={{width:"600px"}}><input type="text" name="modal-create-well-name" className="modal-text-input" id="modal-create-well-name" required style={{width:"100%"}}/></td>
                </tr>
                <tr className="modal-input-table-tr"> 
                  <td><label htmlFor="modal-create-well-description" className="modal-label-input">Description:</label></td>
                  <td><input type="text" name="modal-create-well-description" className="modal-text-input" id="modal-create-well-description"/></td>
                </tr>
                <tr className="modal-input-table-tr">
                    <td><label htmlFor="modal-create-well-uid" className="modal-label-input">Unique well identifier:</label></td>
                    <td><input type="text" name="modal-create-well-uid" className="modal-text-input" id="modal-create-well-uid"/></td>
                </tr>
                <tr className="modal-input-table-tr">
                    <td><label htmlFor="modal-create-well-common-well-name" className="modal-label-input">Common well name:</label></td>
                    <td><input type="text" name="modal-create-well-common-well-name" className="modal-text-input" id="modal-create-well-common-well-name"/></td>
                </tr>
              </tbody>
            </table>

            <div style={{display:"flex", flexDirection: "row"}}>
              <div>
                <table>
                  <tbody>
                    <tr className="modal-input-table-tr">
                      <td style={{width:"150px"}}><label htmlFor="modal-create-well-status-select" className="modal-label-input">Well status:</label></td>
                      <td style={{width:"100px"}}>
                          <select name="modal-create-well-status-select" id="modal-create-well-status-select">
                              <option value="post-mortem">Post-mortem</option>
                              <option value="pre-spud">Pre-spud</option>
                              <option value="abandoned">Abandoned</option>
                          </select>
                      </td> 
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td><label htmlFor="modal-create-well-basin-name" className="modal-label-input">Basin name:</label></td>
                      <td><input type="text" name="modal-create-well-basin-name" className="modal-text-input" id="modal-create-well-basin-name"/></td>
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td style={{width:"150px"}}><label htmlFor="modal-create-well-dominan-geology-select" className="modal-label-input">Dominant geology:</label></td>
                      <td style={{width:"100px"}}>
                          <select name="modal-create-well-dominan-geology-select" id="modal-create-well-dominan-geology-select">
                              <option value="sand">Sand</option>
                              <option value="shale">Shale</option>
                          </select>
                      </td> 
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td><label htmlFor="modal-create-well-water-velocity" className="modal-label-input">Water velocity:</label></td>
                      <td><input type="text" name="modal-create-well-water-velocity" className="modal-text-input" id="modal-create-well-water-velocity" defaultValue={5000}/></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{marginLeft: "30px"}}>
                <table>
                  <tbody>
                    {/* <caption>Depth Information</caption> */}
                    <tr className="modal-input-table-tr">
                      <td style={{width:"100px"}}><label htmlFor="modal-create-well-ground-elevation" className="modal-label-input">Elevation:</label></td>
                      <td style={{width:"50px"}}><input type="number" name="modal-create-well-ground-elevation" className="modal-text-input" id="modal-create-well-ground-elevation" defaultValue={0}/></td>
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td><label htmlFor="modal-create-well-water-depth" className="modal-label-input">Water depth:</label></td>
                      <td><input type="number" name="modal-create-well-water-depth" className="modal-text-input" id="modal-create-well-water-depth"  defaultValue={7.4}/></td>
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td><label htmlFor="modal-create-well-density-water" className="modal-label-input">Water:</label></td>
                      <td><input type="number" name="modal-create-well-density-water" className="modal-text-input" id="modal-create-well-density-water" defaultValue={1.03}/></td>
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td><label htmlFor="modal-create-well-density-formation-fluid" className="modal-label-input">Formation fluid:</label></td>
                      <td><input type="number" name="modal-create-well-density-formation-fluid" className="modal-text-input" id="modal-create-well-density-formation-fluid" defaultValue={1.05}/></td>
                    </tr>
                  </tbody>
                </table>

                <table>
                  <tbody>
                    {/* <caption>Default Units</caption> */}
                    <tr className="modal-input-table-tr">
                      <td style={{width:"100px"}}><label htmlFor="modal-create-well-default-unit-depth-select" className="modal-label-input">Depth:</label></td>
                      <td style={{width:"50px"}}>
                          <select name="modal-create-well-default-unit-depth-select" id="modal-create-well-default-unit-depth-select">
                              <option value="m">meters</option>
                              <option value="ft">feet</option>
                          </select>
                      </td> 
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td style={{width:"100px"}}><label htmlFor="modal-create-well-default-unit-density-select" className="modal-label-input">Density:</label></td>
                      <td style={{width:"50px"}}>
                          <select name="modal-create-well-default-unit-density-select" id="modal-create-well-default-unit-density-select">
                              <option value="sg">sg</option>
                              <option value="ppg">ppg</option>
                          </select>
                      </td> 
                    </tr>
                  </tbody>
                </table>

              </div>


            </div>
          </div>

          {/* Page 2 */}
          <div className="page-modal-create-well" data-page="2" style={{display: "none"}}>
            <textarea id="modal-create-well-notes" name="modal-create-well-notes" rows="15" style={{width: "100%"}}></textarea>
          </div>

        </div>

      </form>
    </div>
  );
}

export default CreateWellModal;;
