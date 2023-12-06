import React, { useState } from 'react';
import { ethers } from 'hardhat';
import {dappTokenSale, addressSigner}from './LoadBlockchainData';
const BuyTokens = () => {
  const [tokenPrice, setTokenPrice] = useState('');
  //const [addressSigner, setAddressSigner] = useState('');
  const [loading, setLoading] = useState(false);

  const buyTokens = async (event) => {
    event.preventDefault();

    try {
      const numberOfTokens = event.target.numberOfTokens.value;
      const numberOfTokensBigInt = ethers.toBigInt(numberOfTokens);
      console.log("Buy Tokens Info:");

      console.log(tokenPrice);
      console.log("Value: " + numberOfTokensBigInt * tokenPrice);
      console.log("Number of Tokens: " + numberOfTokensBigInt);

      const value = tokenPrice * numberOfTokensBigInt;

      await dappTokenSale.buyTokens(numberOfTokensBigInt, {
        address: addressSigner,
        value: value,
        gasLimit: 2000000,
      });

      //this.setState({ loading: false, numberOfTokens: 0 });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      console.log("blad");
    }
  };

  return (
    <form onSubmit={buyTokens}>
      {/* Rest of the JSX code */}
    </form>
  );
};

export default BuyTokens;