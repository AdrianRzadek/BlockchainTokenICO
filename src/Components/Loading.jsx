import React from "react";
import "../App.css";

function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default Loading;
