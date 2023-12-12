import React, {  useEffect } from 'react';
import { ethers } from 'ethers';

import LoadingScreen from "./LoadingScreen"
import "../App.scss";
import LoadLogo from './LoadLogo';
import BuyTokens from './BuyTokens';
import Swap from './Swap';
//import AirDropComponent from './AirDropComponent';
import { Provider } from 'react-redux';
import store from './store';
import { useDispatch, useSelector } from 'react-redux';
import { setAddressSigner,  setIsLoading, setLoadingInfo } from './actions';

const LoadWeb3 = () => {

  const isLoading = useSelector(state => state.isLoading);
  const loadingInfo = useSelector(state => state.loadingInfo);

  const dispatch = useDispatch();

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
          dispatch(setAddressSigner(addressSigner));
          
         
          console.log(signer);
          dispatch(setIsLoading(false));
        } catch (error) {
          console.error("Zaloguj się do zdecentralizowanej sieci");
          dispatch(setLoadingInfo("Zaloguj się do zdecentralizowanej sieci"));
          dispatch(setIsLoading(true));
        }
      
      } else {
        dispatch(setLoadingInfo("W przeglądarce nie wykryto plugina by połączyć z Ethereum , zainstaluj MetaMask!"));
        dispatch(setIsLoading(true));
      }
    };
    loadWeb3();
  }, [dispatch]);

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
        {/* <Transfer/> */}
        </Provider>
    
      </div>
    );
  };
     
  


export default LoadWeb3;
