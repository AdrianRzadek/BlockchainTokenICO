import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import LoadingScreen from "./LoadingScreen"
import "../App.scss";
import LoadLogo from './LoadLogo';
import BuyTokens from './BuyTokens';
import Swap from './Swap';
import Transfer from './Transfer';
import LoadBlockchainData from './LoadBlockchainData';
import { Provider } from 'react-redux';
import store from './store';

const LoadWeb3 = () => {
  const [addressSigner, setAddressSigner] = useState('');
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    const timer = setTimeout(() => {
      !isLoading && setDataLoaded(true);
    }, 2000);

    // Cleanup function to clear the timer in case the component unmounts before loading is complete
    return () => clearTimeout(timer);
  }, []);


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
          setIsLoading(false);
        } catch (error) {
          console.error("Zaloguj się do zdecentralizowanej sieci");
          setLoadingInfo("Zaloguj się do zdecentralizowanej sieci");
          setIsLoading(true);
        }
      } else if (window.web3) {
        const provider = await new ethers.BrowserProvider(
          window.web3.currentProvider);
        setWeb3(provider);
        setIsLoading(false);
      } else {
        setLoadingInfo("W przeglądarce nie wykryto plugina by połączyć z Ethereum , zainstaluj MetaMask!");
        setIsLoading(true);
      }
      setDataLoaded(true);
    };
    loadWeb3();
    
  }, []);

  

  if (isLoading) {
 
 return <LoadingScreen loadingInfo={loadingInfo} />;


  } else {

    return <MainComponent />;

  }
   };  
   
   const MainComponent = () => {
    // Your actual main component logic and content go here
    return (
      <div>
        <Provider store={store}>
        <LoadLogo/>
        <BuyTokens/>
        <Swap/>
        <Transfer/>
        </Provider>
    
      </div>
    );
  };
     
  


export default LoadWeb3;
