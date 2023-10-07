import { Progress } from "@material-tailwind/react";
import '../App.scss';

function ProgressLabel() {
  return(

   <Progress  value={50} size="lg" label="Completed" className="align-middle w-1/2 object-center "/>

  );
  }
export default  ProgressLabel;