import React, { useReducer, useCallback, useEffect, createContext } from "react";
import Web3 from "web3";
import actions from "./actions";
import reducer from "./reducer";
import initialState from "./initialState"; 

function DappTokenSaleProvider({ children }) {
  const Web3Context = createContext();
  
  
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async (artifact) => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        let address, contract;
        
        try {
          if (artifact.networks && artifact.networks[networkID]) {
            address = artifact.networks[networkID].address;
            contract = new web3.eth.Contract(abi, address);
          } else {
            console.error(`Contract not deployed on network with ID: ${networkID}`);
          }

        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract }
        });
      }
      
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../build/contracts/DappTokenSale.json");
        init(artifact);
        console.log(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <Web3Context.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export default DappTokenSaleProvider;
