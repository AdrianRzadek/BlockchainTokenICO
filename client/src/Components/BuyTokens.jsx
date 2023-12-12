import React, { useState } from 'react';
import { ethers } from 'ethers';
import {  useSelector } from 'react-redux';

const BuyTokens = () => {

  const dappToken = useSelector((state) => state.dappToken);
  const dappTokenSale = useSelector((state) => state.dappTokenSale);
 const addressSigner = useSelector((state) => state.addressSigner);
  const [loading, setLoading] = useState(false);
  console.log(dappTokenSale.dappTokenSaleTokensAvailable);
  console.log(dappTokenSale.dappTokenSalePrice);
  console.log(dappToken)
  const buyTokens = async (event) => {
    event.preventDefault();

    try {
      const numberOfTokens = event.target.numberOfTokens.value;
      const numberOfTokensBigInt = ethers.toBigInt(numberOfTokens);
      console.log("Buy Tokens Info:");

      console.log(dappTokenSale.dappTokenSalePrice);
      console.log("Value: " + numberOfTokensBigInt * dappTokenSale.dappTokenSalePrice);
      console.log("Number of Tokens: " + numberOfTokensBigInt);

      const value = dappTokenSale.dappTokenSalePrice * numberOfTokensBigInt;

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
  <div>
  <p>Current Account: {addressSigner}</p>

<div className="container">
  <div className="row">
    <div className="col-md-8">
       Token Sale Details 
      <h2>Token Sale</h2>

      <p>Token Price: {dappTokenSale.dappTokenSalePrice} Wei</p>
      <p>Token Sold: {dappTokenSale.dappTokensSold} </p>
      <p>Tokens Available: {dappTokenSale.dappTokenSaleTokensAvailable}</p>
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