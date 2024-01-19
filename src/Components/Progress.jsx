import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import "../App.css";

const ProgressLabel = ({ soldAmount, supply }) => {
  const valuePercentage = (soldAmount / supply) * 100;

  if (valuePercentage === 100) {
  
    return (<div>Zakończono sprzedaż</div>);
  }

  return (
    <div className="row align-items-center justify-content-center min-vh-10">
      <div className="col-md-10 col-lg-8 col-xl-6">
        Obecnie sprzedano: {valuePercentage}%
        <ProgressBar now={valuePercentage} />
      </div>
    </div>
  );
};

export default ProgressLabel;
