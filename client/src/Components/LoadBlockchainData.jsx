import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import DappToken from "../contracts/DappToken.json";
import DappTokenSale from "../contracts/DappTokenSale.json";
import Transactions from "../contracts/Transactions.json";
import AirDrop from "../contracts/AirDrop.json";
import contractAddress from "../contracts/contract-address.json";
const LoadBlockchainData = () =>{
  const [dappTokenSale, setDappTokenSale] = useState(null);
  const [dappToken, setDappToken] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [airDrop, setAirDrop] = useState(null);
  const [addressDappTokenSale, setAddressDappTokenSale] = useState(null);
  const [tokensSold, setTokensSold] = useState(null);
  const [addressDappToken, setAddressDappToken] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [tokensAvailable, setTokensAvailable] = useState(null);

  useEffect(() => {
    async function loadBlockchainData() {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const addressSigner = await signer.getAddress();
        const tokenPrice = await dappTokenSale.tokenPrice();

        if (DappTokenSale && DappToken && Transactions && AirDrop) {
          const addressDappTokenSale = contractAddress.DappTokenSale;
          const abiDappTokenSale = DappTokenSale.abi;
          const dappTokenSaleContract = new ethers.Contract(
            addressDappTokenSale,
            abiDappTokenSale,
            signer
          );
          setDappTokenSale(dappTokenSaleContract);

          const addressDappToken = contractAddress.DappToken;
          const abiDappToken = DappToken.abi;
          const dappTokenContract = new ethers.Contract(
            addressDappToken,
            abiDappToken,
            signer
          );
          setDappToken(dappTokenContract);

          const addressTransactions = contractAddress.Transactions;
          const abiTransactions = Transactions.abi;
          const transactionsContract = new ethers.Contract(
            addressTransactions,
            abiTransactions,
            signer
          );
          setTransactions(transactionsContract);

          const addressAirDrop = contractAddress.AirDrop;
          const abiAirDrop = AirDrop.abi;
          const airDropContract = new ethers.Contract(
            addressAirDrop,
            abiAirDrop,
            signer
          );
          setAirDrop(airDropContract);

          const tokensSold = await dappTokenSaleContract.tokensSold();
          const tokensAvailable = await dappTokenContract.balanceOf(
            dappTokenSaleContract.target
          );

          setAddressDappTokenSale(addressDappTokenSale);
          setAddressDappToken(addressDappToken);
          setTokensSold(tokensSold);
          setTokenPrice(tokenPrice);
          setTokensAvailable(tokensAvailable);
        } else {
          window.alert(
            'Smart contracts not deployed to the detected network.'
          );
        }
      }
    }

    loadBlockchainData();
  }, []);

  return (
 <></>
  );
};
export default LoadBlockchainData;