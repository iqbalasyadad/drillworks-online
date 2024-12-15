import React from "react";
import "../css/quick-menu-styles.css";


function QuickMenu() {
  return (
    <div id="app-quick-menu-container">
      <div>
        <label htmlFor="project-view-select"></label>
        <select name="project-view-select" id="project-view-select">
            <option value="well-1">Well 1 - Input</option>
            <option value="well-2">Well 2 - Input</option>
            <option value="well-3">Well 3 - Input</option>
            <option value="well-4">Well 4 - Input</option>
        </select>
      </div>
    </div>
  );
}

export default QuickMenu;
