import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const Swap = ({dappTokenSale, dappToken, provider, price}) => {
  const [tokensExchange, setTokensExchange] = useState('');
  const [TokenPrice, setTokenPrice] = useState("");
  const [tokensValue, setTokensValue] = useState('');

  





useEffect(() => {
  async function fetchData() {
    if (price) {
      const price = await dappTokenSale.tokenPrice();
      setTokenPrice(await price.toString());
    
    }
  }

  fetchData();
}, [price, dappTokenSale]);
    



 // console.log(TokenPrice)

  const swap = async (event) => {
    event.preventDefault();
    console.log(price)
    const addressSigner = await provider && provider.addressSigner;
    const amount = ethers.toBigInt(tokensExchange) * ethers.toBigInt(TokenPrice);
    console.log(tokensExchange)
    console.log(amount);
    const value = ethers.toBigInt(tokensExchange) ;
    console.log(value);
  setTokensValue(value);
   console.log(value);
    try {
      await dappToken.approve(
       dappTokenSale.target,
        value,
        {
          from: await addressSigner,
          gas: 20000000,
        }
      );

      await dappTokenSale.sellTokens(value, {
        from: await addressSigner,
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
              Balance: {}
            </span>
            <br />
            <input
              type="text"
              id="etherExchange"
              className="form-control"
              placeholder="0"
              value={tokensValue}
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
