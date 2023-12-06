import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import LoadingScreen from "./LoadingScreen"
import "../App.scss";
const LoadWeb3 = () => {
  const [addressSigner, setAddressSigner] = useState('');
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState("Loading...");
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
          setAddressSigner(addressSigner);
          setSigner(signer);
          setProvider(provider);
          console.log(signer);
        } catch (error) {
          console.error("Zaloguj się do zdecentralizowanej sieci");
          setLoadingInfo("Zaloguj się do zdecentralizowanej sieci");
        }
      } else if (window.web3) {
        const provider = await new ethers.BrowserProvider(
          window.web3.currentProvider
        );
        setWeb3(provider);
      } else {
        // window.alert(
        //   "No Ethereum browser extension detected, install MetaMask!"
        // );
        setLoadingInfo("W przeglądarce nie wykryto pugina by połączyć z Ethereum , zainstaluj MetaMask!");
      }
      setDataLoaded(true);
    };
    loadWeb3();
  }, []);

  // Conditionally render LoadingScreen or actual content
  return (
    <LoadingScreen loadingInfo={loadingInfo} />
    
     
  );
};

export default LoadWeb3;
