import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl)


const getProjects = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/projects`, {
      withCredentials: true,  // Include cookies with the request
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error.message);
    throw error;
  }
};

const saveProject = async (project) => {
  try {
    const response = await axios.post(`${apiUrl}/api/save_selected_project`, {
      project_id: project.id,
      project_name: project.name
    }, {
      withCredentials: true,  // Include cookies with the request
    });
    return response.data;
  } catch (error) {
    console.error("Error saving project:", error.response?.data || error.message);
    throw error;
  }
};

const getSessionProjects = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/get_session_project`, {
      withCredentials: true,  // Include cookies with the request
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error.message);
    throw error;
  }
};

const getWells = async (projectId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/wells?project_id=${projectId}`, {
      withCredentials: true,  // Include cookies with the request
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error.message);
    throw error;
  }
};

const getWellbores = async (wellId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/wellbores?well_id=${wellId}`, {
      withCredentials: true,  // Include cookies with the request
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error.message);
    throw error;
  }
};

const getDatasetsName = async (wellboreId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/datasets?wellbore_id=${wellboreId}`, {
      withCredentials: true, 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error.message);
    throw error;
  }
};

const getProjectDataStructure = async (projectId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/project_data_structure?project_id=${projectId}`, {
      withCredentials: true,  // Include cookies with the request
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error.message);
    throw error;
  }
};

export { 
  getProjects, 
  saveProject, 
  getSessionProjects, 
  getWells, getWellbores, 
  getDatasetsName, 
  getProjectDataStructure
};
