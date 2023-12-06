import React from 'react';
import { ethers } from 'hardhat';
import {addressSigner, dappToken, transaction}from './LoadBlockchainData';
const Transfer = async (event) => {
  event.preventDefault();
  const reciver = await event.target.reciver.value;
  const amount = await event.target.amount.value;
  const message = await event.target.message.value;
  const value = await ethers.toBigInt(amount);
  console.log(addressSigner);
  console.log(reciver);
  await dappToken.approve(transaction.target, value);
  await transaction.sendTransaction(reciver, value, message, {
    from: addressSigner,
    value: value,
    gas: 200000000,
  });
};

const MyComponent = () => {
  return (
    <form onSubmit={Transfer}>
      {/* your form inputs here */}
      <button type="submit">Transfer</button>
    </form>
  );
};

export default MyComponent;