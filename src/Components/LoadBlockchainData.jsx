import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import FossaToken from "../contracts/FossaToken.json";
import Transactions from "../contracts/Transactions.json";
import Transfers from "../contracts/Transfers.json";
//import AirDrop from "../contracts/AirDrop.json";
import contractAddress from "../contracts/contract-address.json";
import BuyTokens from "./BuyTokens";
import Swap from "./Swap";
import Transfer from "./Transfer";
//import AirDropToken from "./AirDrop";
import LoadLogo from "./LoadLogo";

const LoadBlockchainData = (addressProvider) => {
  const [transactions, setTransactions] = useState();
  const [fossaToken, setFossaToken] = useState();
  const [fossaTokenSymbol, setFossaTokenSymbol] = useState();
  const [fossaTokenDecimals, setFossaTokenDecimals] = useState();
  const [fossaTokenTarget, setFossaTokenTarget] = useState();
  const [transactionsPrice, setTransactionsPrice] = useState();
  const [AddressSigner, setAddressSigner] = useState();
  const [TokensSold, setTokensSold] = useState();
  const [transfers, setTransfers] = useState();
  const [logoState, setLogoState] = useState(false);
  const [tokenSupply, setTokenSupply] = useState();
 // const [airDrop, setAirDrop] = useState();
  useEffect(() => {
    async function loadBlockchainData() {
      try {
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          if (Transactions && FossaToken && Transfers) {
            const addressTransactions = contractAddress.Transactions;
            const abiTransactions = Transactions.abi;
            const transactionsContract = new ethers.Contract(
              addressTransactions,
              abiTransactions,
              signer
            );

            const addressFossaToken = contractAddress.FossaToken;
            const abiFossaToken = FossaToken.abi;
            const fossaTokenContract = new ethers.Contract(
              addressFossaToken,
              abiFossaToken,
              signer
            );

            const addressTransfers = contractAddress.Transfers;
            const abiTransfers = Transfers.abi;
            const transfersContract = new ethers.Contract(
              addressTransfers,
              abiTransfers,
              signer
            );

            // const addressAirDrop = contractAddress.AirDrop;
            // const abiAirDrop = AirDrop.abi;
            // const airDropContract = new ethers.Contract(
            //   addressAirDrop,
            //   abiAirDrop,
            //   signer
            // );
            setTransfers(transfersContract);
            setTransactions(transactionsContract);
            setFossaToken(fossaTokenContract);
           // setAirDrop(airDropContract);
          } else {
            window.alert(
              "Smart contracts not deployed to the detected network."
            );
          }
        }
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    }

    loadBlockchainData();
  }, [transactions, fossaToken]);

  useEffect(() => {
    if (fossaToken) {
      if (
        fossaToken.symbol() !== undefined &&
        fossaToken.decimals() !== undefined &&
        fossaToken.target !== undefined
      ) {
        if (logoState === false) {
          setFossaTokenSymbol(fossaToken.symbol());
          setFossaTokenDecimals(fossaToken.decimals());
          setFossaTokenTarget(fossaToken.target);
          setLogoState(true);
        }
      }
    } else {
      return () => {};
    }
  }, [fossaToken]);

  useEffect(() => {
    if (transactions || transfers) {
      setAddressSigner(addressProvider);
      setTransactionsPrice(transactions.price());
      setTokensSold(transactions.purchased());
      setTokenSupply(fossaToken.totalSupply());
 
    }
  }, [transactions, addressProvider]);

  return (
    <>
      <LoadLogo
        logoState={logoState}
        target={fossaTokenTarget}
        symbol={fossaTokenSymbol}
        decimals={fossaTokenDecimals}
      />
      <BuyTokens
        fossaToken={fossaToken}
        transactions={transactions}
        provider={AddressSigner}
        price={transactionsPrice}
        sold={TokensSold}
        tokenSupply={tokenSupply}
      />
      <Swap
        transactions={transactions}
        fossaToken={fossaToken}
        provider={AddressSigner}
        price={transactionsPrice}
      />
      <Transfer
        transfers={transfers}
        fossaToken={fossaToken}
        provider={AddressSigner}
      />

    </>
  );
};

export default LoadBlockchainData;
