import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDappTokenSale, setDappToken, setTransactions } from './actions';
import { ethers } from 'ethers';
import DappToken from "../contracts/DappToken.json";
import DappTokenSale from "../contracts/DappTokenSale.json";
import Transactions from "../contracts/Transactions.json";
import AirDrop from "../contracts/AirDrop.json";
import contractAddress from "../contracts/contract-address.json";

const LoadBlockchainData = () => {
  const dispatch = useDispatch();
  const dappTokenSale = useSelector((state) => state.dappTokenSale);
  const dappToken = useSelector((state) => state.dappToken);
  const transactions = useSelector((state) => state.transactions);

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

            dispatch(setDappTokenSale(dappTokenSaleContract, dappTokenContract));
            dispatch(setDappToken(dappTokenContract));
            dispatch(setTransactions(transactionsContract));
            console.log(dappTokenContract)
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

    // console.log('Updated state values:', {
    //   dappTokenSale,
    //   dappToken,
    //   transactions,
    // });
  }, [dappTokenSale, dappToken, transactions,dispatch]);



  return <></>; // Replace with your desired JSX code
};

export default LoadBlockchainData;