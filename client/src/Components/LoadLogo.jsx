import React, { useEffect, useState } from "react";

const LoadLogo = ({ target, symbol, decimals }) => {
  const tokenImage =
    "https://img.freepik.com/premium-zdjecie/akwarela-malarstwo-fossa_721965-64.jpg?w=826";

  const [pageRefreshed, setPageRefreshed] = useState(false);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        console.log("try");
        const Symbol = await symbol;
        const Decimals = await decimals;
        const Target = await target;
        const DecimalsInt = Number(Decimals);

        const tokenAdded = localStorage.getItem("tokenAdded") === "true";
        const storedTokenAddress = localStorage.getItem("tokenAddress");
        console.log(Symbol, Target, DecimalsInt);
        if (
          Symbol !== undefined &&
          !isNaN(DecimalsInt) &&
          Target !== undefined
        ) {
          console.log("if");
          console.log("Token Details:", Symbol, Target, DecimalsInt);

          console.log("LocalStorage Values:", tokenAdded, storedTokenAddress);
          console.log("Condition:", !tokenAdded, storedTokenAddress !== Target);

          if (!tokenAdded || storedTokenAddress !== Target) {
            console.log(
              "Condition:",
              !tokenAdded,
              storedTokenAddress !== Target
            );
            // Check if the page was refreshed
            if (pageRefreshed) {
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
              console.log(wasAdded);

              if (wasAdded) {
                console.log("Thanks for your interest!");
                localStorage.clear();
                localStorage.setItem("tokenAdded", "true");
                localStorage.setItem("tokenAddress", target);
              } else {
                console.log("Your loss!");
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
  }, [pageRefreshed, target, symbol, decimals]);

  useEffect(() => {
    const handleRefresh = () => {
      setPageRefreshed(true);
    };

    window.addEventListener("beforeunload", handleRefresh);
    window.addEventListener("load", handleRefresh);

    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
      window.removeEventListener("load", handleRefresh);
    };
  }, []);

  return <></>;
};

export default LoadLogo;
