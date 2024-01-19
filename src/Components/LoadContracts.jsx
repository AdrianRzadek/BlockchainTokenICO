import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import FossaToken from "../contracts/FossaToken.json";
import Transactions from "../contracts/Transactions.json";
import contractAddress from "../contracts/contract-address.json";
import Purchase from "./Purchase";
import Swap from "./Swap";
import Transfer from "./Transfer";
import LoadLogo from "./LoadLogo";

const LoadContracts = (addressProvider) => {
  const [transactions, setTransactions] = useState();
  const [fossaToken, setFossaToken] = useState();
  const [fossaTokenSymbol, setFossaTokenSymbol] = useState();
  const [fossaTokenDecimals, setFossaTokenDecimals] = useState();
  const [fossaTokenTarget, setFossaTokenTarget] = useState();
  const [transactionsPrice, setTransactionsPrice] = useState();
  const [AddressSigner, setAddressSigner] = useState();
  const [TokensSold, setTokensSold] = useState();
  const [logoState, setLogoState] = useState(false);
  const [Supply, setSupply] = useState();

  useEffect(() => {
    async function loadContracts() {
      try {
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          if (Transactions && FossaToken) {
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

           
            setTransactions(transactionsContract);
            setFossaToken(fossaTokenContract);
          } else {
            window.alert(
              "Brak kontraktów w sieci."
            );
          }
        }
      } catch (error) {
        console.error("Błąd:", error);
      }
    }

    loadContracts();
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
    if (transactions ) {
      setAddressSigner(addressProvider);
      setTransactionsPrice(transactions.price());
      setTokensSold(transactions.purchased());
      setSupply(fossaToken.totalSupply());
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
      <Purchase
        fossaToken={fossaToken}
        transactions={transactions}
        provider={AddressSigner}
        price={transactionsPrice}
        sold={TokensSold}
        supply={Supply}
      />

      <Transfer
       transactions={transactions}
        fossaToken={fossaToken}
        provider={AddressSigner}
      />

      <Swap
        transactions={transactions}
        fossaToken={fossaToken}
        provider={AddressSigner}
        price={transactionsPrice}
      />
    </>
  );
};

export default LoadContracts;
