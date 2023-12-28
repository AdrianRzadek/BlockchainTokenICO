import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import "../App.scss";

const ProgressLabel = ({ tokensSold, tokensAvailable, tokenSupply }) => {
  const valuePercentage = (tokensSold / tokenSupply) * 100;

  return (
    <div className="progress-label">
      <div className="progress-label-text">
        Obecnie sprzedano: {valuePercentage}%
      </div>
      <ProgressBar now={valuePercentage} />
    </div>
  );
};

export default ProgressLabel;
