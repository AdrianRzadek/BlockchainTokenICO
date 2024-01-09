import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoadingScreen from "./LoadingScreen";
import LoadContracts from "./LoadContracts";
import Background from "./Background";

const Web3Status = () => {
  const [addressProvider, setAddressProvider] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingInfo, setLoadingInfo] = useState("Ładowanie danych");

  useEffect(() => {
    const web3Status = async () => {
      //Sprawdza jakie konto jest podpięte przenieść niżej
      const checkAccountChange = () => {
        window.ethereum.on("accountsChanged", (accounts) => {
          // Handle account change here
          console.log("Account changed:", accounts[0]);
          setAddressProvider(accounts[0]);
        });
      };

      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = await new ethers.BrowserProvider(
            await window.ethereum
          );
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const signer = await provider.getSigner();
          const addressSigner = await signer.getAddress();
          setAddressProvider(addressSigner);
          setIsLoading(false);
          checkAccountChange();
        } catch (error) {
          console.error("Zaloguj się do zdecentralizowanej sieci");
          setLoadingInfo("Zaloguj się do zdecentralizowanej sieci");
          setIsLoading(true);
        }
      } else {
        setLoadingInfo(
          "W przeglądarce nie wykryto plugina by połączyć z Ethereum, zainstaluj MetaMask!"
        );
        setIsLoading(true);
      }
    };
    web3Status();
  }, []);

  console.log(addressProvider);
  if (isLoading) {
    return <LoadingScreen loadingInfo={loadingInfo} />;
  } else {
    return (
      <>
        <LoadContracts addressProvider={addressProvider} />
        <Background />
      </>
    );
  }
};

export default Web3Status;
