import React from "react";

function Header({ project }) {
  return (
    <div id="app-header">
      <p>{project || "WellForce"}</p>
    </div>
  );
}

export default Header;
