import React from "react";
import "./App.scss";
import LoadWeb3 from "./Components/LoadWeb3";
import BuyTokens from "./Components/BuyTokens";
import Transfer from "./Components/Transfer";
import Swap from "./Components/Swap"
import LoadLogo from "./Components/LoadLogo"
import AirDropComponent from "./Components/AirDrop";
function App() {

  return (
    <div className="App">
      {/* <LoadWeb3 /> */}
      <LoadLogo/>
      <h1>Dapp</h1>
       <BuyTokens />
      <br />
      <br />
       <Transfer />
      <br />
      <br />
      <Swap/>
      <br />
      <br />
       {/* <AirDropComponent />    */}
    </div>
  );
}

export default App;
