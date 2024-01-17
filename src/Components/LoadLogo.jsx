import React, { useEffect, useState } from "react";

const LoadLogo = ({ target, symbol, decimals, logoState }) => {
  const tokenImage =
    "https://raw.githubusercontent.com/AdrianRzadek/Dapp/main/logo.png?token=GHSAT0AAAAAACMVBPHVN262RD6HAWWKQOCCZNHBNMQ";

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
                  console.log("Thanks for your interest!");
                  localStorage.setItem("tokenAdded", "true");
                  localStorage.setItem("tokenAddress", target);
                } else {
                  console.log("Your loss!");
                  return;
                }
              }
            } else {
              console.log(
                "Token already added or the user was previously prompted."
              );
            }

            // Set the session variable to indicate the user has visited the site
            sessionStorage.setItem("firstVisit", "true");
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call loadLogo on each entry to the site
    loadLogo();
  }, [logoState]);

  return <></>;
};

export default LoadLogo;
