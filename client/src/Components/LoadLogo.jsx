import React, { useEffect } from "react";

const LoadLogo = ({ target, symbol, decimals }) => {
  const tokenImage =
    "https://img.freepik.com/premium-zdjecie/akwarela-malarstwo-fossa_721965-64.jpg?w=826";


  useEffect(() => {
    const loadLogo = async () => {
      try {
        localStorage.clear();
       // 
        // if (!window.ethereum || !window.ethereum.request) {
        //   console.error("MetaMask not found or not connected.");
        //   return;
        // }
        const Symbol = await symbol;
        const Decimals = await decimals;
        const Target = await target;
        const DecimalsInt = Decimals.toString();
        if(Symbol !== undefined && Decimals !== undefined && Target !== undefined) {
          console.log("Token Details:", Symbol, Target, Decimals);
         
          const tokenAdded = localStorage.getItem("tokenAdded") === "true";
          const storedTokenAddress = localStorage.getItem("tokenAddress");

          console.log("LocalStorage Values:", tokenAdded, storedTokenAddress);
          console.log("Condition:", !tokenAdded, storedTokenAddress !== Target);

          if (!tokenAdded || storedTokenAddress !== Target) {
            
          console.log("Token Details:", Symbol, Target, Decimals);
            console.log("Condition:", !tokenAdded, storedTokenAddress !== Target);
            const wasAdded = await window.ethereum.request({
              method: "wallet_watchAsset",
              params: {
                type: "ERC20",
                options: {
                  address: Target,
                  symbol: Symbol,
                  decimals:  DecimalsInt,
                  image: tokenImage,
                },
              },
            });
            console.log(wasAdded)

            if (wasAdded) {
              console.log("Thanks for your interest!");
              localStorage.clear();
              localStorage.setItem("tokenAdded", "true");
              localStorage.setItem("tokenAddress", target);
            } else {
              console.log("Your loss!");
            }
          } else {
            localStorage.clear();
            console.log("Token already added or the user was previously prompted.");
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadLogo();
  }, []);

  return <></>;
};

export default LoadLogo;
