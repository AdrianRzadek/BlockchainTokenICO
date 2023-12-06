import React, { useEffect } from 'react';
import {addressDappToken, tokenSymbol, tokenDecimals}from './LoadBlockchainData';
const LoadLogo = () => {
  const tokenImage =
    "https://img.freepik.com/premium-zdjecie/akwarela-malarstwo-fossa_721965-64.jpg?w=826";
  
  useEffect(() => {
    const loadLogo = async () => {
      console.log(addressDappToken);

      try {
        const tokenAdded = localStorage.getItem("tokenAdded");
        const storedTokenAddress = localStorage.getItem("tokenAddress");

        if (!tokenAdded || storedTokenAddress !== addressDappToken) {
          const wasAdded = await window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20",
              options: {
                address: addressDappToken,
                symbol: tokenSymbol,
                decimals: tokenDecimals,
                image: tokenImage,
              },
            },
          });

          if (wasAdded) {
            console.log("Thanks for your interest!");
            localStorage.setItem("tokenAdded", "true");
            localStorage.setItem("tokenAddress", addressDappToken);
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

  return <div></div>;
}

export default LoadLogo;