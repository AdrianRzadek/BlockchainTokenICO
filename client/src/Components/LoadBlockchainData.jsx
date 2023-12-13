import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import DappToken from "../contracts/DappToken.json";
import DappTokenSale from "../contracts/DappTokenSale.json";
import Transactions from "../contracts/Transactions.json";
import AirDrop from "../contracts/AirDrop.json";
import contractAddress from "../contracts/contract-address.json";
import BuyTokens from './BuyTokens';
import { useState } from 'react';

const LoadBlockchainData = () => {

  const [dappTokenSale, setDappTokenSale]= useState(null);
  useEffect(() => {
    async function loadBlockchainData() {
      try {
        if (typeof window.ethereum !== 'undefined') {
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

          await setDappTokenSale(await dappTokenSaleContract);
        console.log(dappTokenSaleContract.tokenPrice())
              console.log(await dappTokenSale.tokenPrice())
      
          } else {
            window.alert(
              'Smart contracts not deployed to the detected network.'
            );
          }
        }
      } catch (error) {
        console.error('Error loading blockchain data:', error);
      }
    }

    loadBlockchainData();

 
  }, [dappTokenSale]);
 console.log(dappTokenSale)

  return (  <div>
  
   
  
     <BuyTokens dappTokenSale={dappTokenSale}/>
    <Swap/>
    {/* <Transfer/> */}


  </div>);

};

export default LoadBlockchainData;