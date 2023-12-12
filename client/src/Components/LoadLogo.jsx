import React, { useEffect } from 'react';
import {useSelector} from 'react-redux';  

const LoadLogo = () => {
  // Call LoadBlockchainData to get the blockchain data
 
  const dappToken = useSelector((state) => state.dappToken);



  const tokenImage =
    "https://img.freepik.com/premium-zdjecie/akwarela-malarstwo-fossa_721965-64.jpg?w=826";
  
  useEffect(() => {
const loadLogo = async () => {


  try {
    const tokenAdded = localStorage.getItem("tokenAdded");
    const storedTokenAddress = localStorage.getItem("tokenAddress");
   
    if (!tokenAdded || storedTokenAddress !== dappToken.dappTokenAddress) {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: await dappToken.dappTokenAddress,
            symbol:  await dappToken.dappTokenSymbol,
            decimals:  await dappToken.dappTokenDecimals,
            image: await tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
        localStorage.setItem("tokenAdded", "true");
        localStorage.setItem("tokenAddress", dappToken.dappTokenAddress);
      } else {
        console.log("Your loss!");
      }
    } else {
      console.log("Token already added or the user was previously prompted.");
    }
  } catch (error) {
    console.log(error);
  }
}

    loadLogo();
  }, [ dappToken.dappTokenAddress, dappToken.dappTokenDecimals, dappToken.dappTokenSymbol]); // Include blockchainData as a dependency

  return (
    <></>
  );
}

export default LoadLogo;
