import React, { useEffect, useState } from "react";

const LoadLogo = ({ target, symbol, decimals, logoState }) => {
  const tokenImage =
    "https://github.com/AdrianRzadek/BlockchainTokenICO/blob/52105347ed36deaafb2f82a1b2b2c2e6a2cdce96/logo.png";

  const [tokenAdded, setTokenAdded] = useState(false);
  const [storedTokenAddress, setStoredTokenAddress] = useState("");

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const isFirstVisit = sessionStorage.getItem("firstVisit") !== "true";

        if (isFirstVisit) {
          if (
            target !== undefined &&
            symbol !== undefined &&
            decimals !== undefined
          ) {
            const Symbol = await symbol;
            const Decimals = await decimals;
            const Target = await target;
            const DecimalsInt = Number(Decimals);

            setTokenAdded(localStorage.getItem("tokenAdded") === "true");
            setStoredTokenAddress(localStorage.getItem("tokenAddress"));

            if (
              Symbol !== undefined &&
              !isNaN(DecimalsInt) &&
              Target !== undefined
            ) {
              if (!tokenAdded || storedTokenAddress !== Target) {
                const wasAdded = await window.ethereum.request({
                  method: "wallet_watchAsset",
                  params: {
                    type: "ERC20",
                    options: {
                      address: Target,
                      symbol: Symbol,
                      decimals: DecimalsInt,
                      image: tokenImage,
                    },
                  },
                });

                if (wasAdded) {
                  console.log("Dodano token");
                  localStorage.setItem("tokenAdded", "true");
                  localStorage.setItem("tokenAddress", target);
                } else {
                  console.log("Nie dodano tokenu");
                  return;
                }
              }
            } else {
              console.log(
                "Już dodano token."
              );
            }

            //Sprawdza które to jest wjeście na stone aby dodać token
            sessionStorage.setItem("firstVisit", "true");
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadLogo();
  }, [logoState]);

  return <></>;
};

export default LoadLogo;
