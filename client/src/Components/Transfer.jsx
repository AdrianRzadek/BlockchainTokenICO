import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Loading from './Loading';


const Transfer = ({transfers, dappToken, provider}) => {
  const [loading, setLoading] = useState(false);

//console.log(transfers)
//console.log(dappToken)
//console.log(provider) 
const addressSigner = provider && provider.addressProvider;
//console.log(addressSigner)
const transfersTarget = transfers && transfers.target;
//console.log(transfersTarget);

const transfer = async (event) => {
  setLoading(true);
  event.preventDefault();
  const reciver = await event.target.reciver.value;
  const amount = await event.target.amount.value;
  const value = await ethers.toBigInt(amount);
  console.log(addressSigner);
  console.log(reciver);
  await dappToken.approve(transfersTarget, value);
  await transfers.sendTransaction(reciver, value, {
    from: await addressSigner,
    value: value,
    gas: 200000000,
  });
  setLoading(false);
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
          {loading && <Loading />}
        </form>
      </div>
    </div>
    </div>  
  );

};

export default Transfer;