import React, { useEffect, useState } from "react";
import LoadBlockchainData from "./LoadBlockchainData";
const Polling = () => {
    const [tokensSold, setTokensSold] = useState(0);
    const [tokensAvailable, setTokensAvailable] = useState(0);
    const [pollingInterval, setPollingInterval] = useState(0); 
const polling = async () => {
 setPollingInterval(1000);
  while (true) {
    const [tokensAvailable, tokensSold] = await Promise.all([
     LoadBlockchainData.dappToken.balanceOf(LoadBlockchainData.dappTokenSale.target),
     LoadBlockchainData.dappTokenSale.tokensSold(),
    ]);
    setTokensSold(tokensSold);
    setTokensAvailable(tokensAvailable);
    await new Promise((resolve) => setTimeout(resolve, pollingInterval));
  }
};
  
    useEffect(() => {
      polling(); // Start the polling when the component mounts
      return () => clearInterval(pollingInterval); // Clean up the interval when the component unmounts
    }, []);
  
    return (
    <></>
    );
  };
  export default Polling;