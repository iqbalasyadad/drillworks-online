import React from "react";

function TracksContainer() {
  return (
    <div id="project-tracks-container">
      <div id="track-custom-context-menu" className="track-context-menu">
        <div id="track-add-dataset">Add last dataset</div>
        <div id="track-advanced-menu">
          Advanced
          <div id="track-advanced-options">
            <div id="track-insert-track-before">Insert track before</div>
            <div id="track-insert-track-after">Insert track after</div>
            <div id="track-delete-track">Delete this track</div>
          </div>
        </div>
        <div id="track-properties">Properties</div>
      </div>
    </div>
  );
}

export default TracksContainer;
