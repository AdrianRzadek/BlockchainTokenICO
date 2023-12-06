import React from "react";
import { ethers } from "ethers";
import {addressSigner, dappToken, dappTokenSale}from './LoadBlockchainData';
const Swap = async (event) => {
  event.preventDefault();
  //  console.log(this.exchange)
  const amount = event.target.tokensExchange.value;
  const value = ethers.toBigInt(amount);

  try {
    // Approve the exchange to spend tokens on behalf of the user
    await dappToken.approve(dappTokenSale.target, value, {
      from: addressSigner,
      gas: 20000000,
    });

    // Sell tokens on the exchange
    await dappTokenSale.sellTokens(value, {
      from: addressSigner,
      value: value,
      gas: 20000000,
    });

    console.log("Tokens approved and sold successfully!");
  } catch (error) {
    console.error("Error during token approval and sale:", error);
  }

  // Return any JSX or component structure you desire
  return <div>{/* Place your component JSX here */}</div>;
};
export default Swap;
