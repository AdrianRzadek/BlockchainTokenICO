import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import "../App.css";

const ProgressLabel = ({ soldAmount, supply }) => {
  const valuePercentage = (soldAmount / supply) * 100;

  if (valuePercentage === 100) {
  
    return (<div><h5>Zakończono sprzedaż</h5></div>);
  }

  return (
    <div className="row align-items-center justify-content-center min-vh-10">
      <div className="col-md-10 col-lg-8 col-xl-6">
      <h5> Obecnie sprzedano: {valuePercentage}%</h5>
        <ProgressBar now={valuePercentage} />
      </div>
    </div>
  );
};

export default ProgressLabel;
