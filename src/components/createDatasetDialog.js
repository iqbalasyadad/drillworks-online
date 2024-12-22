import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/dialog";
import "jquery-ui/themes/base/all.css";
import { getSessionProjects, getWells, getWellbores} from '../services/apiService.js';
import { useTreeUpdate } from "./TreeUpdateContext";

function CreateDatasetModal ({ isOpen, onClose }) {

    const { triggerTreeUpdate } = useTreeUpdate();
  
    const apiUrl = process.env.REACT_APP_API_URL;
    

    function parseData(data, mode) {
      // Split the data into lines
      const lines = data.trim().split("\n");
    
      // Initialize arrays to hold parsed data
      const index = [];
      const value = [];
      const text = [];
    
      // Iterate over each line to extract values
      lines.forEach((line) => {
        const parts = line.trim().split(/\s+/); // Split by spaces or tabs
    
        // Extract index and value for all cases
        index.push(parseFloat(parts[0]));
        value.push(parseFloat(parts[1]));
    
        // Extract text if mode is 2 (data type 2)
        if (mode === "text" && parts.length === 3) {
          text.push(parts[2].replace(/"/g, "")); // Remove quotes if present
        }
      });
    
      // Return the parsed arrays
      return mode === "text" ? { index, value, text } : { index, value };
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
          const wellSelect = $('#modal-create-dataset-well-target-select');
          const wellboreSelect = $('#modal-create-dataset-wellbore-target-select');
          
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

    function addDatasetDatatypeUnit() {
      // Add event listener for data type selection
      const dataTypeSelect = $("#modal-create-dataset-data-type-select");
      const unitSelect = $("#modal-create-dataset-data-unit-select");
    
      // Define mapping between data types and units
      const dataTypeToUnits = {
        "PP": ["sg", "ppg", "psi/ft", "g/cc", "kPa/m", "Pa/m", "MPa/m"],
        "FG": ["sg", "ppg", "psi/ft", "g/cc", "kPa/m", "Pa/m", "MPa/m"],
        "OBG": ["sg", "ppg", "psi/ft", "g/cc", "kPa/m", "Pa/m", "MPa/m"],
        "Temperature": ["Celsius", "Fahrenheit"],
        "Unknown": ["unknown"],
        "POISSON": ["unitless"],
        "GR": ["API", "GAPI"],
        "RT": ["ohmm"],
        "DT": ["us/ft", "us/m"],
        "RHOB": ["gr/cc"]
      };
    
      // Attach event listener for the 'change' event
      dataTypeSelect.on('change', function () {
        const selectedDataType = $(this).val(); // Get the selected value
        unitSelect.empty(); // Clear previous options
    
        if (dataTypeToUnits[selectedDataType]) {
          dataTypeToUnits[selectedDataType].forEach(unit => {
            const option = $('<option></option>').val(unit).text(unit);
            unitSelect.append(option);
          });
        } else {
          const defaultOption = $('<option></option>').val('').text('-');
          unitSelect.append(defaultOption);
        }
      });
    }
    
  
    let currentPage = 1;
    const totalPages = 3;

    function showPage(page) {
        $(".page-modal-create-dataset").hide();
        $(`.page-modal-create-dataset[data-page="${page}"]`).show();

        // Dynamically update the dialog title with the current step
        const stepTitles = {
            1: "Step 1: Specify Data Source",
            2: "Step 2: Collect dataset Information",
            3: "Step 3: Edit datasets",
        };
        $("#pagination-modal-create-dataset").dialog("option", "title", stepTitles[page]);

        updateButtonStates();
    }

    function updateButtonStates() {
        $(".ui-dialog-buttonpane button:contains('< Back')").button("option", "disabled", currentPage === 1);
        $(".ui-dialog-buttonpane button:contains('Next >')").button("option", "disabled", currentPage === totalPages);
        $(".ui-dialog-buttonpane button:contains('Finish')").button("option", "disabled", currentPage !== totalPages);

    }

  useEffect(() => {
    if (isOpen) {
      fetchWellsWellbores();
      addDatasetDatatypeUnit();
    }
    const dialog = $("#pagination-modal-create-dataset").dialog({
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
            if (currentPage === totalPages) {
              // renderDataGridXLTable(hasTextColumn);
              $("#modal-create-dataset-review-target-well").val($("#modal-create-dataset-well-target-select option:selected").text());
              $("#modal-create-dataset-review-target-wellbore").val($("#modal-create-dataset-wellbore-target-select option:selected").text());
              $("#modal-create-dataset-review-name").val($("#modal-create-dataset-name").val());
              $("#modal-create-dataset-review-index-type").val($("#modal-create-dataset-index-type-select").val());
              $("#modal-create-dataset-review-reference-level").val($("#modal-create-dataset-reference-level-select").val());
              $("#modal-create-dataset-review-data-type").val($("#modal-create-dataset-data-type-select").val());
              $("#modal-create-dataset-review-data-unit").val($("#modal-create-dataset-data-unit-select").val());
            }
        },
        "Finish": async function () {

            try {
              // Fetch the selected project ID
              const project_session = await getSessionProjects(); // Assuming `getSessionProjects` fetches the current project ID
              const projectId = project_session;
              if (!projectId) {
                  alert("Failed to retrieve the selected project. Please try again.");
                  return;
              }
              // Get data text area
              const dataTextArea = $("#modal-create-dataset-data-input-text-area").val();
              const hasTextColumn = $('#modal-create-dataset-has-text-column-checkbox').prop('checked');
              const dataset = hasTextColumn? parseData(dataTextArea, "text"):parseData(dataTextArea, "notext") 
      
              // Gather form data
              const formData = {
                  project_id: projectId,
                  well_id: $("#modal-create-dataset-well-target-select").val(),
                  wellbore_id: $("#modal-create-dataset-wellbore-target-select").val(),
                  name: $("#modal-create-dataset-name").val(),
                  description: $("#modal-create-dataset-description").val(),
                  index_type: $("#modal-create-dataset-index-type-select").val(),
                  index_unit: $("#modal-create-dataset-index-unit-select").val(),
                  reference_level: $("#modal-create-dataset-reference-level-select").val(),
                  reference_date: $("#modal-create-dataset-reference-date").val(),
                  data_type: $("#modal-create-dataset-data-type-select").val(),
                  data_unit: $("#modal-create-dataset-data-unit-select").val(),
                  color: $("#modal-create-dataset-color-select").val(),
                  line_style: $("#modal-create-dataset-line-style-select").val(),
                  line_width: parseInt($("#modal-create-dataset-line-width-select").val()),
                  symbol: $("#modal-create-dataset-symbol-select").val(),
                  symbol_size: parseInt($("#modal-create-dataset-symbol-size-select").val()),
                  has_text: hasTextColumn,
                  datasets: dataset
              };
      
              // Validate required fields
              if (!formData.name) {
                  alert("Please enter a dataset name!");
                  return;
              }
      
              // console.log("Creating a new dataset with the following data:", formData);
      
              // Uncomment and use this section to send the data to your backend
              const response = await fetch(`${apiUrl}/api/datasets`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formData),
                  credentials: "include",
              });
      
              const result = await response.json();
              if (!response.ok) {
                  throw new Error(result.message || "Failed to add dataset");
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
            $("#pagination-form-create-dataset")[0].reset();
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
        $("#pagination-form-create-dataset")[0].reset();
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
    <div id="pagination-modal-create-dataset" title="Create a dataset">
      <form id="pagination-form-create-dataset">
        <div id="page-container-create-dataset">

          {/* Page 1 */}
            <div className="page-modal-create-dataset" data-page="1" style={{display: "none"}}>

              <div style={{marginBottom: "10px"}}>
                <p>Select a target well:</p>
                <select id="modal-create-dataset-well-target-select" size="8" style={{width: "100%", height: "100px", fontSize:"10pt", padding: "2px"}}></select>
              </div>
              <div>
                <p>Select a wellbore:</p>
                <select id="modal-create-dataset-wellbore-target-select" size="8" style={{width: "100%", height: "100px", fontSize:"10pt", padding: "2px"}}></select>
              </div>

          </div>
  
          {/* Page 2 */}
          <div className="page-modal-create-dataset" data-page="2">
            <table style={{width: "100%"}}>
              <tbody>
                <tr className="modal-input-table-tr">
                  <td style={{width:"30%"}}><label className="modal-label-input" htmlFor="modal-create-dataset-name">Dataset name:</label></td>
                  <td><input type="text" name="modal-create-dataset-name" className="modal-text-input" id="modal-create-dataset-name" required/></td>
                </tr>
                <tr className="modal-input-table-tr"> 
                  <td><label htmlFor="modal-create-dataset-description" className="modal-label-input">Description:</label></td>
                  <td><input type="text" name="modal-create-dataset-description" className="modal-text-input" id="modal-create-dataset-description"/></td>
                </tr>
              </tbody>
            </table>

            <table style={{width: "100%"}}>
              <tbody>
                <tr className="modal-input-table-tr">
                  <td style={{width:"30%"}}><label htmlFor="modal-create-dataset-index-type-select" className="modal-label-input">Index type:</label></td>
                  <td>
                      <select name="modal-create-dataset-index-type-select" id="modal-create-dataset-index-type-select">
                          <option value="TVD">True vertical depth</option>
                          <option value="MD">Measured depth</option>
                      </select>
                  </td>
                  <td style={{width:"15%"}}><label htmlFor="modal-create-dataset-index-unit-select" className="modal-label-input">Index unit:</label></td>
                  <td style={{width:"15%"}}>
                    <select name="modal-create-dataset-index-unit-select" id="modal-create-dataset-index-unit-select">
                      <option value="m">meters</option>
                      <option value="ft">feet</option>
                    </select>
                  </td> 
                </tr>
                <tr className="modal-input-table-tr">
                  <td style={{width:"150px"}}><label htmlFor="modal-create-dataset-reference-level-select" className="modal-label-input">Reference level:</label></td>
                  <td style={{width:"100px"}}>
                    <select name="modal-create-dataset-reference-level-select" id="modal-create-dataset-reference-level-select">
                      <option value="MSL">Mean sea level</option>
                      <option value="RT">Measured depth</option>
                    </select>
                  </td>
                  <td style={{width:"15%"}}><label htmlFor="modal-create-dataset-reference-date" className="modal-label-input">Reference date:</label></td>
                  <td style={{width:"50px"}}><input type="date" name="modal-create-dataset-reference-date" id="modal-create-dataset-reference-date"/></td>
                </tr>
              </tbody>
            </table>

            
            <div style={{display: "flex", flexDirection: "row"}}>
              <table>
                <tbody>
                  <tr>
                    <td>Datatype:</td>
                    <td>Unit:</td>
                  </tr>
                  <tr>
                    <td>
                      <select name="modal-create-dataset-data-type-select" id="modal-create-dataset-data-type-select" size="10" style={{width:"200px"}}>
                        <option value="GR">GR - Gamma Ray</option>
                        <option value="DT">DT - Sonic</option>
                        <option value="RT">RT - Resistivity</option>
                        <option value="RHOB">RHOB - Density</option>
                        <option value="PP">PP - Pore Pressure Gradient</option>
                        <option value="FG">FG - Fracture Gradient</option>
                        <option value="OBG">OBG - Overburden Gradient</option>
                        <option value="POISSON">POISSON - Poisson Ratio</option>
                      </select>
                    </td>
                    <td>
                      <select name="modal-create-dataset-data-unit-select" id="modal-create-dataset-data-unit-select" size="10" style={{width:"100px"}}></select>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr className="modal-input-table-tr" style={{width:"400px"}}>
                    <td style={{width:"80%"}}><label htmlFor="modal-create-dataset-color-select" className="modal-label-input">Color:</label></td>
                    <td style={{width:"30%"}}>
                        {/* <select name="modal-create-dataset-color-select" id="modal-create-dataset-color-select">
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select> */}
                        <input type="color" id="modal-create-dataset-color-select" style={{height:"22px", width:"40px"}}/>
                    </td> 
                  </tr>
                  <tr className="modal-input-table-tr">
                    <td><label htmlFor="modal-create-dataset-line-style-select" className="modal-label-input">Line style:</label></td>
                    <td>
                        <select name="modal-create-dataset-line-style-select" id="modal-create-dataset-line-style-select">
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                    </td> 
                  </tr>
                  <tr className="modal-input-table-tr">
                    <td><label htmlFor="modal-create-dataset-line-width-select" className="modal-label-input">Line width:</label></td>
                    <td>
                        <select name="modal-create-dataset-line-width-select" id="modal-create-dataset-line-width-select">
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                    </td> 
                  </tr>
                  <tr className="modal-input-table-tr">
                    <td><label htmlFor="modal-create-dataset-symbol-select" className="modal-label-input">Symbol:</label></td>
                    <td>
                        <select name="modal-create-dataset-symbol-select" id="modal-create-dataset-symbol-select">
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                    </td> 
                  </tr>
                  <tr className="modal-input-table-tr">
                    <td><label htmlFor="modal-create-dataset-symbol-size-select" className="modal-label-input">Symbol size:</label></td>
                    <td>
                        <select name="modal-create-dataset-symbol-size-select" id="modal-create-dataset-symbol-size-select">
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                    </td> 
                  </tr>
                  <tr className="modal-input-table-tr">
                    <td><label className="modal-label-input" htmlFor="modal-create-dataset-has-text-column-checkbox">Has text column</label></td>
                    <td><input type="checkbox" name="modal-create-dataset-has-text-column-checkbox" id="modal-create-dataset-has-text-column-checkbox"/></td>
                  </tr>
                  
                </tbody>
              </table>
            </div>
          </div>

          {/* Page 3 */}
          <div className="page-modal-create-dataset" data-page="3" style={{display: "none"}}>

            <div style={{marginBottom: "5px"}}>
              <table>
                <tbody>
                  <tr>
                    <td><label htmlFor="modal-create-dataset-review-target-well" className="modal-label-input">Well:</label></td>
                    <td><input type="text" name="modal-create-dataset-review-target-well" id="modal-create-dataset-review-target-well" size="8" disabled/></td>
                    <td><label htmlFor="modal-create-dataset-review-index-type" className="modal-label-input">Index:</label></td>
                    <td><input type="text" name="modal-create-dataset-review-index-type" id="modal-create-dataset-review-index-type" size="8" disabled/></td>
                    <td><label htmlFor="modal-create-dataset-review-data-unit" className="modal-label-input">Unit:</label></td>
                    <td><input type="text" name="modal-create-dataset-review-data-unit" id="modal-create-dataset-review-data-unit" size="8" disabled/></td>
                  </tr>
                  <tr>
                    <td><label htmlFor="modal-create-dataset-review-target-wellbore" className="modal-label-input">Wellbore:</label></td>
                    <td><input type="text" name="modal-create-dataset-review-target-wellbore" id="modal-create-dataset-review-target-wellbore" size="8" disabled/></td>
                    <td><label htmlFor="modal-create-dataset-review-reference-level" className="modal-label-input">Reference:</label></td>
                    <td><input type="text" name="modal-create-dataset-review-reference-level" id="modal-create-dataset-review-reference-level" size="8" disabled/></td>
                  </tr>                              
                  <tr>
                    <td><label htmlFor="modal-create-dataset-review-name" className="modal-label-input">Dataset:</label></td>
                    <td><input type="text" name="modal-create-dataset-review-name" id="modal-create-dataset-review-name" size="8" disabled/></td>
                    <td><label htmlFor="modal-create-dataset-review-data-type" className="modal-label-input">Data type:</label></td>
                    <td><input type="text" name="modal-create-dataset-review-data-type" id="modal-create-dataset-review-data-type" size="8" disabled/></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div id="grid" style={{width:"100%", height:"400px"}}>
              <textarea id="modal-create-dataset-data-input-text-area" name="modal-create-dataset-data-input-text-area" rows="15" style={{width: "100%"}}></textarea>

            </div>

          </div>

        </div>

      </form>
    </div>
  );
}

export default CreateDatasetModal;;
