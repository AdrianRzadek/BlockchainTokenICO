import React, { useEffect } from 'react';

const LoadLogo = (dappToken) => {

 // const dappToken = useSelector((state) => state.dappToken);

  const tokenImage =
    "https://img.freepik.com/premium-zdjecie/akwarela-malarstwo-fossa_721965-64.jpg?w=826";
  
  useEffect(() => {
const loadLogo = async () => {

  console.log(await dappToken.symbol);
  console.log(await dappToken.target);
  console.log(await dappToken.decimals);
  try {


    if (!window.ethereum || !window.ethereum.request) {
      console.error('MetaMask not found or not connected.');
      return;
    }
    const tokenAdded = localStorage.getItem("tokenAdded");
    const storedTokenAddress = localStorage.getItem("tokenAddress");
   if(dappToken.symbol && dappToken.target && dappToken.decimals){
    console.log(await dappToken.symbol);
    console.log(await dappToken.target);
    console.log(await dappToken.decimals);
  
    if (!tokenAdded || storedTokenAddress !== dappToken.target) {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: await dappToken.target,
            symbol:  await dappToken.symbol,
            decimals:  await dappToken.decimals,
            image: await tokenImage,
          },
        },
      });
    
      if (wasAdded) {
        console.log("Thanks for your interest!");
        localStorage.setItem("tokenAdded", "true");
        localStorage.setItem("tokenAddress", dappToken.target);
      } else {
        console.log("Your loss!");
      }
    } else {
      console.log("Token already added or the user was previously prompted.");
    }
  }
  } catch (error) {
    console.log(error);
  }
}

    loadLogo();
  }, [dappToken]); // Include blockchainData as a dependency

  return (
    <></>
  );
}

export default LoadLogo;