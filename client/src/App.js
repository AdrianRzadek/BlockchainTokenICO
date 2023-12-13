import React from "react";
import "./App.scss";
import LoadWeb3 from "./Components/LoadWeb3";
import BuyTokens from "./Components/BuyTokens";
import Transfer from "./Components/Transfer";
import Swap from "./Components/Swap"
import LoadLogo from "./Components/LoadLogo"
import AirDropComponent from "./Components/AirDrop";
import { Provider } from 'react-redux';
import store from './Components/store';
import LoadBlockchainData from "./Components/LoadBlockchainData";
function App() {

  return (
    <div className="App">
       <Provider store={store}>
        
      <LoadWeb3 />  


   </Provider>
       {/*   <h1>Dapp</h1>
       <BuyTokens />
      <br />
      <br />
       <Transfer />
      <br />
      <br />
      <Swap/>
      <br />
      <br />
       <AirDropComponent />    */} 
    </div>
  );
}

export default App;
