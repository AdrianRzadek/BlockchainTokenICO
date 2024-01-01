import React, { useEffect, useState } from "react";

const LoadLogo = ({ target, symbol, decimals, logoState }) => {
  const tokenImage =
    "https://img.freepik.com/premium-zdjecie/akwarela-malarstwo-fossa_721965-64.jpg?w=826";

  const [tokenAdded, setTokenAdded] = useState(false);
  const [storedTokenAddress, setStoredTokenAddress] = useState("");

  useEffect(() => {
    const loadLogo = async () => {
      try {
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
                localStorage.clear();
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
