import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/dialog";
import "jquery-ui/themes/base/all.css";
import { getSessionProjects, getWells} from '../services/apiService.js';


function CreateWellboreModal ({ isOpen, onClose }) {
  
    const apiUrl = process.env.REACT_APP_API_URL;
    
    const fetchWells = async () => {
      console.log("fetch wells called");
      try {
  
          // Fetch the selected project ID
          const project_session = await getSessionProjects(); // Assuming `getSessionProjects` fetches the current project ID
          const projectId = project_session.id;
          if (!projectId) {
              alert("Failed to retrieve the selected project. Please try again.");
              return;
          }
  
          const wells = await getWells(projectId);
          const wellSelect = $('#modal-create-wellbore-well-target-select');
          wellSelect.empty(); // Clear previous options
          wells.forEach(well => {
            wellSelect.append(`<option value="${well._id}">${well.name}</option>`);
          });
  
      } catch (error) {
          console.error("Failed to fetch wells:", error.message);
      }
    };
  
    let currentPage = 1;
    const totalPages = 3;

    function showPage(page) {
        $(".page-modal-create-wellbore").hide();
        $(`.page-modal-create-wellbore[data-page="${page}"]`).show();

        // Dynamically update the dialog title with the current step
        const stepTitles = {
            1: "Step 1: Specify Data Source",
            2: "Step 2: Collect Wellbore Information",
            3: "Step 3: Wellbore Notes",
        };
        $("#pagination-modal-create-wellbore").dialog("option", "title", stepTitles[page]);

        updateButtonStates();
    }

    function updateButtonStates() {
        $(".ui-dialog-buttonpane button:contains('< Back')").button("option", "disabled", currentPage === 1);
        $(".ui-dialog-buttonpane button:contains('Next >')").button("option", "disabled", currentPage === totalPages);
        $(".ui-dialog-buttonpane button:contains('Finish')").button("option", "disabled", currentPage !== totalPages);

    }

  useEffect(() => {
    if (isOpen) {
      fetchWells();
    }
    const dialog = $("#pagination-modal-create-wellbore").dialog({
      autoOpen: isOpen,
      height: 450,
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
                  well_id: $("#modal-create-wellbore-well-target-select").val(),
                  name: $("#modal-create-wellbore-name").val(),
                  description: $("#modal-create-wellbore-description").val(),
                  uid: $("#modal-create-wellbore-uid").val(),
                  operator: $("#modal-create-wellbore-operator").val(),
                  analyst: $("#modal-create-wellbore-analyst").val(),
                  status: $("#modal-create-wellbore-status-select").val(),
                  purpose: $("#modal-create-wellbore-purpose-select").val(),
                  analysis_type: $("#modal-create-wellbore-analysis-type-select").val(),
                  trajectory_shape: $("#modal-create-wellbore-trajectory-shape-select").val(),
                  rig_name: $("#modal-create-wellbore-rig-name").val(),
                  objective_information: $("#modal-create-wellbore-objective-information").val(),
                  air_gap: parseFloat($("#modal-create-wellbore-air-gap").val()),
                  total_md: parseFloat($("#modal-create-wellbore-total-md").val()),
                  total_tvd: parseFloat($("#modal-create-wellbore-total-tvd").val()),
                  spud_date: $("#modal-create-wellbore-spud-date").val(),
                  completion_date: $("#modal-create-wellbore-completion-date").val(),
                  notes: $("#modal-create-wellbore-notes").val(),
              };
      
              // Validate required fields
              if (!formData.name) {
                  alert("Please enter a wellbore name!");
                  return;
              }
      
              console.log("Creating a new wellbore with the following data:", formData);
      
              // Uncomment and use this section to send the data to your backend
              const response = await fetch(`${apiUrl}/api/wellbores`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formData),
                  credentials: "include",
              });
      
              const result = await response.json();
              if (!response.ok) {
                  throw new Error(result.message || "Failed to add well");
              }      
              $(this).dialog("close");
              onClose();
              
          } catch (error) {
              console.error("Error:", error);
              alert("An error occurred: " + error.message);
          }
        },
        Cancel: function () {
            $(this).dialog("close");
            $("#pagination-form-create-wellbore")[0].reset();
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
        $("#pagination-form-create-wellbore")[0].reset();
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
    <div id="pagination-modal-create-wellbore" title="Create a Wellbore">
      <form id="pagination-form-create-wellbore">
        <div id="page-container-create-wellbore">

          {/* Page 1 */}
            <div className="page-modal-create-wellbore" data-page="1" style={{display: "none"}}>

              <table>
                <tbody>
                  <tr className="modal-input-table-tr">
                    <td style={{width:"230px"}}><label className="modal-label-input" htmlFor="modal-create-wellbore-well-target-select">Existing well:</label></td>
                    <td style={{width:"600px"}}>
                      <select id="modal-create-wellbore-well-target-select" size="1" style={{width: "100%", fontSize:"10pt"}}></select>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
  
          {/* Page 2 */}
          <div className="page-modal-create-wellbore" data-page="2">
            <table>
              <tbody>
                <tr className="modal-input-table-tr">
                  <td style={{width:"230px"}}><label className="modal-label-input" htmlFor="modal-create-wellbore-name">Wellbore name:</label></td>
                  <td style={{width:"600px"}}><input type="text" name="modal-create-wellbore-name" className="modal-text-input" id="modal-create-wellbore-name" required style={{width:"100%"}}/></td>
                </tr>
                <tr className="modal-input-table-tr"> 
                  <td><label htmlFor="modal-create-wellbore-description" className="modal-label-input">Description:</label></td>
                  <td><input type="text" name="modal-create-wellbore-description" className="modal-text-input" id="modal-create-wellbore-description"/></td>
                </tr>
              </tbody>
            </table>
            <div style={{display:"flex", flexDirection: "row"}}>
              <div>
                <table>
                  <tbody>
                    <tr className="modal-input-table-tr">
                        <td><label htmlFor="modal-create-wellbore-uid" className="modal-label-input">Unique wellbore identifier:</label></td>
                        <td><input type="text" name="modal-create-wellbore-uid" className="modal-text-input" id="modal-create-wellbore-uid"/></td>
                    </tr>
                    <tr className="modal-input-table-tr">
                        <td><label htmlFor="modal-create-wellbore-operator" className="modal-label-input">Operator:</label></td>
                        <td><input type="text" name="modal-create-wellbore-operator" className="modal-text-input" id="modal-create-wellbore-operator"/></td>
                    </tr>
                    <tr className="modal-input-table-tr">
                        <td><label htmlFor="modal-create-wellbore-analyst" className="modal-label-input">Analyst:</label></td>
                        <td><input type="text" name="modal-create-wellbore-analyst" className="modal-text-input" id="modal-create-wellbore-analyst"/></td>
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td style={{width:"150px"}}><label htmlFor="modal-create-wellbore-status-select" className="modal-label-input">Wellbore status:</label></td>
                      <td style={{width:"100px"}}>
                          <select name="modal-create-wellbore-status-select" id="modal-create-wellbore-status-select">
                              <option value="abandoned">Abandoned</option>
                              <option value="production">Production</option>
                          </select>
                      </td> 
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td style={{width:"150px"}}><label htmlFor="modal-create-wellbore-purpose-select" className="modal-label-input">Wellbore purpose:</label></td>
                      <td style={{width:"100px"}}>
                          <select name="modal-create-wellbore-purpose-select" id="modal-create-wellbore-purpose-select">
                              <option value="development">Development</option>
                              <option value="exploration">Exploration</option>
                          </select>
                      </td> 
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td style={{width:"150px"}}><label htmlFor="modal-create-wellbore-analysis-type-select" className="modal-label-input">Analysis type:</label></td>
                      <td style={{width:"100px"}}>
                          <select name="modal-create-wellbore-analysis-type-select" id="modal-create-wellbore-analysis-type-select">
                              <option value="post-mortem">Post-mortem</option>
                              <option value="pre-drill">Pre-drill</option>
                          </select>
                      </td> 
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td style={{width:"150px"}}><label htmlFor="modal-create-wellbore-trajectory-shape-select" className="modal-label-input">Trajectory shape:</label></td>
                      <td style={{width:"100px"}}>
                          <select name="modal-create-wellbore-trajectory-shape-select" id="modal-create-wellbore-trajectory-shape-select">
                              <option value="s-shape">S-shape</option>
                              <option value="j-shape">J-shape</option>
                          </select>
                      </td> 
                    </tr>
                    <tr className="modal-input-table-tr">
                        <td><label htmlFor="modal-create-well-bore-rig-name" className="modal-label-input">Rig name:</label></td>
                        <td><input type="text" name="modal-create-wellbore-rig-name" className="modal-text-input" id="modal-create-wellbore-rig-name"/></td>
                    </tr>
                    <tr className="modal-input-table-tr">
                        <td><label htmlFor="modal-create-well-bore-objective-information" className="modal-label-input">Objective information:</label></td>
                        <td><input type="text" name="modal-create-wellbore-objective-information" className="modal-text-input" id="modal-create-wellbore-objective-information"/></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{marginLeft: "30px"}}>
                <table>
                  <tbody>
                    {/* <caption>Depth Information</caption> */}
                    <tr className="modal-input-table-tr">
                      <td style={{width:"100px"}}><label htmlFor="modal-create-wellbore-air-gap" className="modal-label-input">Air gap:</label></td>
                      <td style={{width:"50px"}}><input type="number" name="modal-create-wellbore-air-gap" className="modal-text-input" id="modal-create-wellbore-air-gap" defaultValue={0}/></td>
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td style={{width:"100px"}}><label htmlFor="modal-create-wellbore-total-md" className="modal-label-input">Total MD:</label></td>
                      <td style={{width:"50px"}}><input type="number" name="modal-create-wellbore-total-md" className="modal-text-input" id="modal-create-wellbore-total-md" defaultValue={0}/></td>
                    </tr>
                    <tr className="modal-input-table-tr">
                      <td style={{width:"100px"}}><label htmlFor="modal-create-wellbore-total-tvd" className="modal-label-input">Total TVD:</label></td>
                      <td style={{width:"50px"}}><input type="number" name="modal-create-wellbore-total-tvd" className="modal-text-input" id="modal-create-wellbore-total-tvd" defaultValue={0}/></td>
                    </tr>
                  </tbody>
                </table>

                <table>
                  <tbody>
                    {/* <caption>Date</caption> */}
                    <tr className="modal-input-table-tr">
                      <td style={{width:"100px"}}><label htmlFor="modal-create-wellbore-spud-date" className="modal-label-input">Spud date:</label></td>
                      <td style={{width:"50px"}}><input type="date" name="modal-create-wellbore-spud-date" className="modal-text-input" id="modal-create-wellbore-spud-date"/></td>
                    </tr>

                    <tr className="modal-input-table-tr">
                      <td style={{width:"100px"}}><label htmlFor="modal-create-wellbore-completion-date" className="modal-label-input">Completion date:</label></td>
                      <td style={{width:"50px"}}><input type="date" name="modal-create-wellbore-completion-date" className="modal-text-input" id="modal-create-wellbore-completion-date"/></td>
                    </tr>
                  </tbody>
                </table>

              </div>


            </div>
          </div>

          {/* Page 3 */}
          <div className="page-modal-create-wellbore" data-page="3" style={{display: "none"}}>
            <textarea id="modal-create-wellbore-notes" name="modal-create-wellbore-notes" rows="15" style={{width: "100%"}}></textarea>
          </div>

        </div>

      </form>
    </div>
  );
}

export default CreateWellboreModal;;
