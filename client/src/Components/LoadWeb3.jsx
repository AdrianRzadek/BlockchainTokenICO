import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import LoadingScreen from "./LoadingScreen";
import "../App.scss";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading, setLoadingInfo } from "./actions";
import LoadBlockchainData from "./LoadBlockchainData";
import Background from "./Background";

const LoadWeb3 = () => {
  const isLoading = useSelector((state) => state.isLoading);
  const loadingInfo = useSelector((state) => state.loadingInfo);
  const [addressProvider, setAddressProvider] = useState(null);
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
          setAddressProvider(addressSigner);

          console.log(signer);
          dispatch(setIsLoading(false));
        } catch (error) {
          console.error("Zaloguj się do zdecentralizowanej sieci");
          dispatch(setLoadingInfo("Zaloguj się do zdecentralizowanej sieci"));
          dispatch(setIsLoading(true));
        }
      } else {
        dispatch(
          setLoadingInfo(
            "W przeglądarce nie wykryto plugina by połączyć z Ethereum , zainstaluj MetaMask!"
          )
        );
        dispatch(setIsLoading(true));
      }
    };
    loadWeb3();
  }, [addressProvider, dispatch]);

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
