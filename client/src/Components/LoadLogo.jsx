import React, { useEffect } from 'react';
import LoadBlockchainData from './LoadBlockchainData';
const LoadLogo = () => {
  const tokenImage =
    "https://img.freepik.com/premium-zdjecie/akwarela-malarstwo-fossa_721965-64.jpg?w=826";
  
  useEffect(() => {
    const loadLogo = async () => {
      console.log(LoadBlockchainData.addressDappToken);

      try {
        const tokenAdded = localStorage.getItem("tokenAdded");
        const storedTokenAddress = localStorage.getItem("tokenAddress");

        if (!tokenAdded || storedTokenAddress !== LoadBlockchainData.addressDappToken) {
          const wasAdded = await window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20",
              options: {
                address: LoadBlockchainData.addressDappToken,
                symbol: LoadBlockchainData.tokenSymbol,
                decimals: LoadBlockchainData.tokenDecimals,
                image: tokenImage,
              },
            },
          });

          if (wasAdded) {
            console.log("Thanks for your interest!");
            localStorage.setItem("tokenAdded", "true");
            localStorage.setItem("tokenAddress", LoadBlockchainData.addressDappToken);
          } else {
            console.log("Your loss!");
          }
        } else {
          console.log("Token already added or user previously prompted.");
        }
      } catch (error) {
        console.log(error);
      }
    }

    loadLogo();
  }, []);

  return (<></>);
}

export default LoadLogo;