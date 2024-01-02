import React from "react";
import "../App.css";

function Loading() {
  return (
    <div className="loading-container">
      
      <div className="loading-spinner">
      <span className="sr-only">Ładowanie...</span>
        <div className="spinner-border" role="status">
         
        </div>
      </div>
    </div>
  );
}

export default Loading;
