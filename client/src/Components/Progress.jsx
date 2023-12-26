import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import '../App.scss';

const ProgressLabel = ({ tokensSold, tokensAvailable, tokenSupply }) => {
  const valuePercentage = (tokensSold / tokensAvailable) * 100;

  return (
    <div className="progress-label">
      <div className="progress-label-text">Obecnie sprzedano: {valuePercentage}%</div>
      <ProgressBar now={valuePercentage} max={100} className="progress-bar" />
    </div>
  );
};

export default ProgressLabel;