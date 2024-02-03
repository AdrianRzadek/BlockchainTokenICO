import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ForsaToken from "../contracts/ForsaToken.json";
import Transactions from "../contracts/Transactions.json";
import contractAddress from "../contracts/contract-address.json";
import Purchase from "./Purchase";
import Swap from "./Swap";
import Transfer from "./Transfer";
import LoadLogo from "./LoadLogo";

const LoadContracts = (addressProvider) => {
  const [transactions, setTransactions] = useState();
  const [forsaToken, setForsaToken] = useState();
  const [forsaTokenSymbol, setForsaTokenSymbol] = useState();
  const [forsaTokenDecimals, setForsaTokenDecimals] = useState();
  const [forsaTokenTarget, setForsaTokenTarget] = useState();
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

          if (Transactions && ForsaToken) {
            const addressTransactions = contractAddress.Transactions;
            const abiTransactions = Transactions.abi;
            const transactionsContract = new ethers.Contract(
              addressTransactions,
              abiTransactions,
              signer
            );

            const addressForsaToken = contractAddress.ForsaToken;
            const abiForsaToken = ForsaToken.abi;
            const forsaTokenContract = new ethers.Contract(
              addressForsaToken,
              abiForsaToken,
              signer
            );

           
            setTransactions(transactionsContract);
            setForsaToken(forsaTokenContract);
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
  }, [transactions, forsaToken]);

  useEffect(() => {
    if (forsaToken) {
      if (
        forsaToken.symbol() !== undefined &&
        forsaToken.decimals() !== undefined &&
        forsaToken.target !== undefined
      ) {
        if (logoState === false) {
          setForsaTokenSymbol(forsaToken.symbol());
          setForsaTokenDecimals(forsaToken.decimals());
          setForsaTokenTarget(forsaToken.target);
          setLogoState(true);
        }
      }
    } else {
      return () => {};
    }
  }, [forsaToken]);

  useEffect(() => {
    if (transactions ) {
      setAddressSigner(addressProvider);
      setTransactionsPrice(transactions.price());
      setTokensSold(transactions.purchased());
      setSupply(forsaToken.totalSupply());
    }
  }, [transactions, addressProvider]);

  return (
    <>
      <LoadLogo
        logoState={logoState}
        target={forsaTokenTarget}
        symbol={forsaTokenSymbol}
        decimals={forsaTokenDecimals}
      />
      <Purchase
        forsaToken={forsaToken}
        transactions={transactions}
        provider={AddressSigner}
        price={transactionsPrice}
        sold={TokensSold}
        supply={Supply}
      />

      <Transfer
       transactions={transactions}
        forsaToken={forsaToken}
        provider={AddressSigner}
      />

      <Swap
        transactions={transactions}
        forsaToken={forsaToken}
        provider={AddressSigner}
        price={transactionsPrice}
      />
    </>
  );
};

export default LoadContracts;
