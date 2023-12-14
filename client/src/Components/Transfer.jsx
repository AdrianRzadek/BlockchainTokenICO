import React from 'react';
import { ethers } from 'ethers';

import { useSelector, useDispatch  } from "react-redux";

const Transfer = (transfers, dappToken) => {
  const addressSigner = useSelector((state) => state.addressSigner);

const transfer = async (event) => {
  event.preventDefault();
  const reciver = await event.target.reciver.value;
  const amount = await event.target.amount.value;
  const message = await event.target.message.value;
  const value = await ethers.toBigInt(amount);
  console.log(addressSigner);
  console.log(reciver);
  await dappToken.approve(transfer.transaction.target, value);
  await transfers.transaction.sendTransaction(reciver, value, message, {
    from: addressSigner,
    value: value,
    gas: 200000000,
  });
};


  return (
    <div className="container">
    <div className="row">
      <div className="col-md-8">
        <p>Transactions:</p>
        <form onSubmit={transfer}>
          <input
            type="text"
            id="reciver"
            className="form-control"
            placeholder="Address of reciver"
            required
          />

          <input
            type="text"
            id="amount"
            className="form-control"
            placeholder="Amount of Tokens"
            required
          />

          <button type="submit" className="btn btn-primary">
            Wyślij
          </button>
        </form>
      </div>
    </div>
    </div>  
  );

};

export default Transfer;