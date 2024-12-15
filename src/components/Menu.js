import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import "../assets/styles/menu-bar-styles.css";
import '../assets/styles/dialog-box.css';

import 'jquery-ui/ui/widgets/dialog'; // Import dialog widget from jQuery UI
import 'jquery-ui/themes/base/all.css'; // Import jQuery UI CSS (optional)

import { getSessionProjects} from '../services/apiService.js';

// for dialog box
import OpenProjectDialog from "./openProjectDialog";
import CreateProjectModal from "./createProjectDialog";
import DeleteProjectDialog from "./deleteProjectDialog";

import CreateWellModal from "./createWellDialog";
import DeleteWellDialog from "./deleteWellDialog";

import CreateWellboreModal from "./createWellboreDialog";
import DeleteWellboreDialog from "./deleteWellboreDialog";

import CreateDatasetModal from "./createDatasetDialog";
import DeleteDatasetDialog from "./deleteDatasetDialog";

function Menu({ onProjectSelect }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleClickOpenProjectSession = async () => { 
    const projectSession = await getSessionProjects();
    console.log(projectSession);
  };

  // const handleProjectSelect = (project) => {
  //   onProjectSelect(project); // Pass both project ID and name
  //   handleDialogClose();
  // };

  // Project
  const [isDialogOpenProjectOpen, setisDialogOpenProjectOpen] = useState(false);
  const handleOpenProjectClick = () => { setisDialogOpenProjectOpen(true); };
  const handleOpenProjectDialogClose = () => { setisDialogOpenProjectOpen(false); };

  const [isDialogCreateProjectOpen, setisDialogCreateProjectOpen] = useState(false);
  const handleCreateProjectClick = () => { setisDialogCreateProjectOpen(true); };
  const handleCreateProjectDialogClose = () => { setisDialogCreateProjectOpen(false); };

  const [isDialogDeleteProjectOpen, setisDialogDeleteProjectOpen] = useState(false);
  const handleDeleteProjectClick = () => { setisDialogDeleteProjectOpen(true); };
  const handleDeleteProjectDialogClose = () => { setisDialogDeleteProjectOpen(false); };


  // Well
  const [isDialogCreateWellOpen, setisDialogCreateWellOpen] = useState(false);
  const handleCreateWellClick = () => { setisDialogCreateWellOpen(true); };
  const handleCreateWellDialogClose = () => { setisDialogCreateWellOpen(false); };

  const [isDialogDeleteWellOpen, setisDialogDeleteWellOpen] = useState(false);
  const handleDeleteWellClick = () => { setisDialogDeleteWellOpen(true); };
  const handleDeleteWellDialogClose = () => { setisDialogDeleteWellOpen(false); };

  // Wellbore
  const [isDialogCreateWellboreOpen, setisDialogCreateWellboreOpen] = useState(false);
  const handleCreateWellboreClick = () => { setisDialogCreateWellboreOpen(true); };
  const handleCreateWellboreDialogClose = () => { setisDialogCreateWellboreOpen(false); };

  const [isDialogDeleteWellboreOpen, setisDialogDeleteWellboreOpen] = useState(false);
  const handleDeleteWellboreClick = () => { setisDialogDeleteWellboreOpen(true); };
  const handleDeleteWellboreDialogClose = () => { setisDialogDeleteWellboreOpen(false); };

  // Dataset
  const [isDialogCreateDatasetOpen, setisDialogCreateDatasetOpen] = useState(false);
  const handleCreateDatasetClick = () => { setisDialogCreateDatasetOpen(true); };
  const handleCreateDatasetDialogClose = () => { setisDialogCreateDatasetOpen(false); };

  const [isDialogDeleteDatasetOpen, setisDialogDeleteDatasetOpen] = useState(false);
  const handleDeleteDatasetClick = () => { setisDialogDeleteDatasetOpen(true); };
  const handleDeleteDatasetDialogClose = () => { setisDialogDeleteDatasetOpen(false); };

  // Handle logout functionality
  const handleLogout = async () => {
    console.log("logout clicked");
    try {
      await fetch(`${apiUrl}/logout`, {
            method: "GET",
            credentials: 'include',  // Include cookies for session
        });
        // After successful logout, redirect to login page
        navigate("/login");
    } catch (error) {
        console.error("Error logging out:", error);
    }
  };

  return (
    <div className="nav-menu-bar-container">
      <ul className="dropdown">
        <li>
          <a >Project</a>
          <ul className="sub_menu">
            <li><a onClick={handleCreateProjectClick}>Create....</a></li>
            <li><a onClick={handleOpenProjectClick}>Open....</a></li>
            <li><a >Save</a></li>
            <li><a >Close</a></li>
            <li><a onClick={handleDeleteProjectClick}>Delete....</a></li>
            <li><a >Properties</a></li>
            <li><a >Import....</a></li>
            <li><a >Export....</a></li>
            <li><a  onClick={handleClickOpenProjectSession}>Test</a></li>
            <li><a  onClick={handleLogout}>Logout</a></li>
          </ul>
        </li>
        <li>
          <a >Well</a>
          <ul className="sub_menu">
            <li><a onClick={handleCreateWellClick}>Create....</a></li>
            <li><a onClick={handleDeleteWellClick}>Delete....</a></li>
            <li><a >Properties</a></li>
            <li><a >Import....</a></li>
            <li><a >Export....</a></li>
          </ul>
        </li>

        <li>
          <a >Wellbore</a>
          <ul className="sub_menu">
            <li><a onClick={handleCreateWellboreClick}>Create....</a></li>
            <li><a onClick={handleDeleteWellboreClick}>Delete....</a></li>
            <li><a >Properties</a></li>
            <li><a >Edit Survey Data....</a></li>
            <li><a >Import Survey Data....</a></li>
            <li><a >Export Survey Data....</a></li>
            <li><a >Create a Top Table....</a></li>
            <li><a >Top Table Properties....</a></li>
            <li><a >Delete Top Tables....</a></li>
            <li><a >Create Temperature Profile....</a></li>
          </ul>
        </li>

        <li>
          <a >Data</a>
          <ul className="sub_menu">
            <li><a onClick={handleCreateDatasetClick}>Create a Dataset....</a></li>
            <li><a onClick={handleDeleteDatasetClick}>Delete Datasets....</a></li>
            <li><a >Dataset Properties...</a></li>
            <li><a >Import From a File....</a></li>
            <li><a >Export to a File....</a></li>
            <li><a >Average....</a></li>
            <li><a >Composite....</a></li>
            <li><a >MWA Filter....</a></li>
            <li><a >Create a Lithology Column....</a></li>
            <li><a >Edit a Lithology Column....</a></li>
            <li>
                <a >Utilites</a>
                <ul>
                    <li><a >Sub-menu 1</a></li>
                    <li><a >Sub-menu 2</a></li>
                </ul>
            </li>

            <li>
                <a >Line Groups</a>
                <ul>
                    <li><a >Sub-menu 1</a></li>
                    <li><a >Sub-menu 2</a></li>
                </ul>
            </li>
          </ul>
        </li>

        <li>
          <a >View</a>
          <ul className="sub_menu">
            <li><a >Create....</a></li>
            <li><a >Option 1....</a></li>
            <li><a >Option 2....</a></li>
          </ul>
        </li>

        <li>
          <a >Analysis</a>
          <ul className="sub_menu">
            <li><a >Density....</a></li>
            <li><a >Porosity....</a></li>
            <li><a >Shale Point....</a></li>
            <li><a >Overburden Gradient....</a></li>
            <li><a >Normal Compaction Trend....</a></li>
            <li><a >Pore Pressure Gradient....</a></li>
            <li><a >Overlay....</a></li>
            <li><a >Fracture Gradient....</a></li>
            <li><a >Minimum Horizontal Stress Gradient....</a></li>
            <li><a >Maximum Horizontal Stress Gradient....</a></li>
            <li><a >Shear Failure Stress Gradient....</a></li>
            <li><a >Start Geostress</a></li>
            <li>
                <a >Velocity</a>
                <ul>
                    <li><a >Sub-menu 1</a></li>
                    <li><a >Sub-menu 2</a></li>
                </ul>
            </li>
            <li>
                <a >Advanced</a>
                <ul>
                    <li><a >Sub-menu 1</a></li>
                    <li><a >Sub-menu 2</a></li>
                </ul>
            </li>
          </ul>
        </li>

        <li>
          <a >Tools</a>
          <ul className="sub_menu">
            <li><a >Option 0....</a></li>
            <li><a >Option 1....</a></li>
            <li><a >Option 2....</a></li>
          </ul>
        </li>

        <li>
          <a >Help</a>
          <ul className="sub_menu">
            <li><a >Option 1....</a></li>
            <li><a >Option 2....</a></li>
            <li><a >About</a></li>
          </ul>
        </li>

      </ul>

      {/* Dialog Component */}
      <OpenProjectDialog 
        isOpen={isDialogOpenProjectOpen} 
        onClose={handleOpenProjectDialogClose}
        onProjectSelect={onProjectSelect} // Forward callback
      />
      <CreateProjectModal 
        isOpen={isDialogCreateProjectOpen} 
        onClose={handleCreateProjectDialogClose}
        onCreateProject={onProjectSelect}
      />
      <DeleteProjectDialog isOpen={isDialogDeleteProjectOpen} onClose={handleDeleteProjectDialogClose} />

      <CreateWellModal isOpen={isDialogCreateWellOpen} onClose={handleCreateWellDialogClose} />
      <DeleteWellDialog isOpen={isDialogDeleteWellOpen} onClose={handleDeleteWellDialogClose} />

      <CreateWellboreModal isOpen={isDialogCreateWellboreOpen} onClose={handleCreateWellboreDialogClose} />
      <DeleteWellboreDialog isOpen={isDialogDeleteWellboreOpen} onClose={handleDeleteWellboreDialogClose} />

      <CreateDatasetModal isOpen={isDialogCreateDatasetOpen} onClose={handleCreateDatasetDialogClose} />
      <DeleteDatasetDialog isOpen={isDialogDeleteDatasetOpen} onClose={handleDeleteDatasetDialogClose} />

    </div>
  );
}

export default Menu;
