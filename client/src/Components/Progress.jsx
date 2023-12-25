import { Progress } from "@material-tailwind/react";
import '../App.scss';

const ProgressLabel = ({ tokensSold, tokensAvailable }) => {
  const valuePercentage = (tokensSold / tokensAvailable) * 100;

  return (
    <Progress
      value={valuePercentage}
      max={100}
      size="lg"
      label="Completed"
      className="align-middle w-1/2 object-center"
    />
  );
};

export default ProgressLabel;