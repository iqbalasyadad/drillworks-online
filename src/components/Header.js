import React from "react";

function Header({ project }) {
  return (
    <div id="app-header">
      <p>{project?.name ? `Project: ${project.name}` : "RocknRock"}</p>
    </div>
  );
}

export default Header;
