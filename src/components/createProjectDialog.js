import React, { useEffect } from "react";
import $ from "jquery";
import { getSessionProjects } from '../services/apiService.js';
import "jquery-ui/ui/widgets/dialog";
import "jquery-ui/themes/base/all.css";

function CreateProjectModal ({ isOpen, onClose, onCreateProject }) {
  
    const apiUrl = process.env.REACT_APP_API_URL;
  
    let currentPage = 1;
    const totalPages = 2;

    function showPage(page) {
        $(".page-modal-create-project").hide();
        $(`.page-modal-create-project[data-page="${page}"]`).show();

        // Dynamically update the dialog title with the current step
        const stepTitles = {
            1: "Step 1: Basic Details",
            2: "Step 2: Project Notes",
        };
        $("#pagination-modal-create-project").dialog("option", "title", stepTitles[page]);

        updateButtonStates();
    }

    function updateButtonStates() {
        $(".ui-dialog-buttonpane button:contains('< Back')").button("option", "disabled", currentPage === 1);
        $(".ui-dialog-buttonpane button:contains('Next >')").button("option", "disabled", currentPage === totalPages);
        $(".ui-dialog-buttonpane button:contains('Finish')").button("option", "disabled", currentPage !== totalPages);

    }

  useEffect(() => {
    const dialog = $("#pagination-modal-create-project").dialog({
      autoOpen: isOpen,
      height: 400,
      width: 400,
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
            const formData = {
                name: $("#modal-create-project-name").val(),
                description: $("#modal-create-project-description").val(),
                analyst: $("#modal-create-project-analyst").val(),
                default_depth_unit: $("#modal-create-project-default-depth-unit").val(),
                notes: $("#modal-create-project-notes").val(),
            };
            if (!formData.name) {
                alert("Please enter a project name!");
                return;
            }

            try {
                console.log("create project clicked");
                const response = await fetch(`${apiUrl}/api/projects`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                    credentials: 'include'
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || "Failed to add project");
                }
                // alert(result.message);
                $(this).dialog("close");
                onClose();
            } catch (error) {
                console.error("Error:", error);
                alert(error.message);
            }
            try {
              const project_session = await getSessionProjects();
              onCreateProject(project_session);
            }
            catch (error) {
              console.error("Error:", error);
              alert(error.message);
            }

        },
        Cancel: function () {
            $(this).dialog("close");
            $("#pagination-form-create-project")[0].reset();
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
        $("#pagination-form-create-project")[0].reset();
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
    <div id="pagination-modal-create-project" title="Create a Project">
      <form id="pagination-form-create-project">
        <div id="page-container-create-project">
  
          {/* Page 1 */}
          <div className="page-modal-create-project" data-page="1">
            <table>
              <tbody>
                <tr className="modal-input-table-tr">
                  <td style={{width:"230px"}}><label className="modal-label-input" htmlFor="modal-create-project-name">Project name:</label></td>
                  <td style={{width:"600px"}}><input type="text" name="modal-create-project-name" className="modal-text-input" id="modal-create-project-name" required style={{width:"100%"}}/></td>
                </tr>
                <tr className="modal-input-table-tr"> 
                  <td><label htmlFor="modal-create-project-description" className="modal-label-input">Description:</label></td>
                  <td><input type="text" name="modal-create-project-description" className="modal-text-input" id="modal-create-project-description"/></td>
                </tr>
                <tr className="modal-input-table-tr">
                  <td><label htmlFor="modal-create-project-analyst" className="modal-label-input">Analyst:</label></td>
                  <td><input type="text" name="modal-create-project-analyst" className="modal-text-input" id="modal-create-project-analyst"/></td>
                </tr>
                <tr className="modal-input-table-tr">
                  <td><label htmlFor="modal-create-project-default-depth-unit" className="modal-label-input">Default depth unit:</label></td>
                  <td>
                      <select name="modal-create-project-default-depth-unit" className="modal-text-input" id="modal-create-project-default-depth-unit" style={{width:"100%"}}>
                          <option value={"m"} defaultChecked>meters</option>
                          <option value={"ft"}>feet</option>
                      </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Page 2 */}
          <div className="page-modal-create-project" data-page="2" style={{display: "none"}}>
            <textarea id="modal-create-project-notes" name="modal-create-project-notes" rows="15" style={{width: "100%"}}></textarea>
          </div>

        </div>

      </form>
    </div>
  );
}

export default CreateProjectModal;;
