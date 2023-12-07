import React, { useState } from 'react';
import { ethers } from 'ethers';
import LoadBlockchainData from './LoadBlockchainData';
const BuyTokens = () => {
  const [tokenPrice, setTokenPrice] = useState('');
  const [addressSigner, setAddressSigner] = useState('');
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

      await LoadBlockchainData.dappTokenSale.buyTokens(numberOfTokensBigInt, {
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
  <div>
  <p>Current Account: {addressSigner}</p>

<div className="container">
  <div className="row">
    <div className="col-md-8">
       Token Sale Details 
      <h2>Token Sale</h2>

      <p>Token Price: {tokenPrice} Wei</p>
      <p>Token Sold: {LoadBlockchainData.tokensSold} </p>
      <p>Tokens Available: {LoadBlockchainData.tokensAvailable}</p>
       Buy Tokens Form
      <form onSubmit={buyTokens}>
        <div className="form-group">
          <input
            type="number"
            id="numberOfTokens"
            className="form-control"
            placeholder="Number of Tokens"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Buy Tokens
        </button>
      </form>
    </div>
  </div>
</div>
  </div>
  );
};

export default BuyTokens;