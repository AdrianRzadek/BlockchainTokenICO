import React, { useState } from "react";
import { ethers } from "ethers";
import Loading from "./Loading";

const Transfer = ({ transfers, fossaToken, provider }) => {
  const [loading, setLoading] = useState(false);

  const addressSigner = provider && provider.addressProvider;

  const transfersTarget = transfers && transfers.target;

  const transfer = async (event) => {
    setLoading(true);
    event.preventDefault();
    const reciver = await event.target.reciver.value;
    const amount = await event.target.amount.value;
    const value = await ethers.toBigInt(amount);
    console.log(addressSigner);
    console.log(reciver);
    await fossaToken.approve(transfersTarget, value);
    await transfers.transfer(reciver, value, {
      from: await addressSigner,
      value: value,
      gas: 200000000,
    });
    setLoading(false);
  };

  return (
   
    <div className="container-fluid">
       <br/><br/>
    <div className="row justify-content-left">
      <div className="col-md-4 text-center offset-md-1">
        <p>Transfer:</p>
        <form onSubmit={transfer}>
          <div className="form-group">
            <input
              type="text"
              id="reciver"
              className="form-control"
              placeholder="Adres odbiorcy"
              required
            />
          </div>
          <br />
          <div className="form-group">
            <input
              type="text"
              id="amount"
              className="form-control"
              placeholder="Ilość żetonów"
              required
            />
          </div>
          <br />
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
