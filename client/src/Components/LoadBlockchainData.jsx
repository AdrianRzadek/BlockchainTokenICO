import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import DappToken from "../contracts/DappToken.json";
import DappTokenSale from "../contracts/DappTokenSale.json";
import Transactions from "../contracts/Transactions.json";
import AirDrop from "../contracts/AirDrop.json";
import contractAddress from "../contracts/contract-address.json";
import BuyTokens from "./BuyTokens";
import Swap from "./Swap";
import Transfer from "./Transfer";


import LoadLogo from "./LoadLogo";

const LoadBlockchainData = (addressProvider) => {
  const [dappTokenSale, setDappTokenSale] = useState();
  const [dappToken, setDappToken] = useState();
  const [dappTokenSymbol, setDappTokenSymbol] = useState();
  const [dappTokenDecimals, setDappTokenDecimals] = useState();
  const [dappTokenTarget, setDappTokenTarget] = useState();
  const [dappTokenSalePrice, setDappTokenSalePrice] = useState();
  const [AddressSigner, setAddressSigner] = useState();
  const [TokensSold, setTokensSold] = useState();
  const [transfers, setTransfers] = useState();
 // const dispatch = useDispatch();
  useEffect(() => {
    async function loadBlockchainData() {
      try {
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
     
          if (DappTokenSale && DappToken && Transactions && AirDrop) {
            const addressDappTokenSale = contractAddress.DappTokenSale;
            const abiDappTokenSale = DappTokenSale.abi;
            const dappTokenSaleContract = new ethers.Contract(
              addressDappTokenSale,
              abiDappTokenSale,
              signer
            );

            const addressDappToken = contractAddress.DappToken;
            const abiDappToken = DappToken.abi;
            const dappTokenContract = new ethers.Contract(
              addressDappToken,
              abiDappToken,
              signer
            );

            const addressTransactions = contractAddress.Transactions;
            const abiTransactions = Transactions.abi;
            const transactionsContract = new ethers.Contract(
              addressTransactions,
              abiTransactions,
              signer
            );
            setTransfers(transactionsContract);
            setDappTokenSale(dappTokenSaleContract);
            //dispatch(setTokenSale(dappTokenSaleContract));

            const loadedDappToken = dappTokenContract; // Store in a local variable
            setDappToken(loadedDappToken);

           // console.log(await dappToken.symbol());
            // console.log(dappTokenSaleContract.tokenPrice())
            //  console.log(await dappTokenSale.tokenPrice())
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
  }, [dappTokenSale, dappToken]);

  useEffect(() => {
    if (dappToken) {
      // Check if dappToken and symbol property are defined
     // console.log("DappToken symbol:", dappToken.symbol()); // Access dappToken directly
      setDappTokenSymbol(dappToken.symbol());
      setDappTokenDecimals(dappToken.decimals());
      setDappTokenTarget(dappToken.target);
    }
  }, [dappToken]);


  
  useEffect(() => {
    if (dappTokenSale) {
      setAddressSigner(addressProvider);
      setDappTokenSalePrice(dappTokenSale.tokenPrice());
      setTokensSold(dappTokenSale.tokensSold());
    }
  }, [dappTokenSale, addressProvider]);


  return (
    <>
  
        <LoadLogo target={dappTokenTarget} symbol={dappTokenSymbol} decimals={dappTokenDecimals} />
        <BuyTokens dappTokenSale={dappTokenSale} provider={AddressSigner} price={dappTokenSalePrice} sold={TokensSold}/>
        <Swap dappTokenSale={dappTokenSale} dappToken={dappToken} />
        <Transfer transfers={transfers} dappToken={dappToken} />
     
    </>
  );
};

export default LoadBlockchainData;
