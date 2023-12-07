import React, { useState } from "react";
import { ethers } from "ethers";
import LoadBlockchainData from "./LoadBlockchainData";


const Swap = () => {
  const [tokensExchange, setTokensExchange] = useState('');
  const [etherExchange, setEtherExchange] = useState(LoadBlockchainData.tokenPrice);

  const swap = async (event) => {
    event.preventDefault();
    const amount = tokensExchange;
    const value = ethers.toBigInt(amount);

    try {
      await LoadBlockchainData.dappToken.approve(
        LoadBlockchainData.dappTokenSale.target,
        value,
        {
          from: LoadBlockchainData.addressSigner,
          gas: 20000000,
        }
      );

      await LoadBlockchainData.dappTokenSale.sellTokens(value, {
        from: LoadBlockchainData.addressSigner,
        value: value,
        gas: 20000000,
      });

      console.log("Tokens approved and sold successfully!");
    } catch (error) {
      console.error("Error during token approval and sale:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8">
          <p>Transactions:</p>
          <form onSubmit={swap}>
            <input
              type="text"
              id="tokensExchange"
              className="form-control"
              placeholder="TokensExchange"
              required
              value={tokensExchange}
              onChange={(event) => setTokensExchange(event.target.value)}
            />
            <br />
            <span className="float-right text-muted">
              Balance: {LoadBlockchainData.tokenPrice}
            </span>
            <br />
            <input
              type="text"
              id="etherExchange"
              className="form-control"
              placeholder="0"
              value={etherExchange}
              disabled
            />
            <br />
            <button type="submit" className="btn btn-primary">
              Wymień
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Swap;
