import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import LoadingScreen from "./LoadingScreen";
import "../App.scss";


import LoadBlockchainData from "./LoadBlockchainData";
import Background from "./Background";

const LoadWeb3 = () => {

  const [addressProvider, setAddressProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingInfo, setLoadingInfo] = useState("Ładowanie danych");

  useEffect(() => {
    const loadWeb3 = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = await new ethers.BrowserProvider(
            await window.ethereum
          );
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const signer = await provider.getSigner();
          const addressSigner = await signer.getAddress();
          setAddressProvider(addressSigner);

          console.log(signer);
       setIsLoading(false);
        } catch (error) {
          console.error("Zaloguj się do zdecentralizowanej sieci");
         (setLoadingInfo("Zaloguj się do zdecentralizowanej sieci"));
        (setIsLoading(true));
        }
      } else {
        (
          setLoadingInfo(
            "W przeglądarce nie wykryto plugina by połączyć z Ethereum , zainstaluj MetaMask!"
          )
        );
        (setIsLoading(true));
      }
    };
    loadWeb3();
  }, [addressProvider]);

  if (isLoading) {
    return <LoadingScreen loadingInfo={loadingInfo} />;
  } else {
    return (
      <>
        <LoadBlockchainData addressProvider={addressProvider} />
        <Background />
      </>
    );
  }
};

export default LoadWeb3;
