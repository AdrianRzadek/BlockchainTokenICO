import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Loading from "./Loading";
const Swap = ({ dappTokenSale, dappToken, provider, price }) => {
  const [tokensExchange, setTokensExchange] = useState("");
  const [TokenPrice, setTokenPrice] = useState("");
  const [tokensValue, setTokensValue] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      if (price) {
        const price = await dappTokenSale.tokenPrice();
        setTokenPrice(await price.toString());
      }
    }

    fetchData();
  }, [price, dappTokenSale]);

  const updateTokensValue = (event) => {
    const newValue = event.target.value;
    setTokensExchange(newValue);
  
    if (newValue === "") {
      setTokensValue("");
    } else {
      const value = ethers.toBigInt(newValue) * ethers.toBigInt(TokenPrice);
      setTokensValue(value.toString());
    }
  };

  const swap = async (event) => {
    setLoading(true);
    event.preventDefault();
    console.log(price);
    const addressSigner = await provider && provider.addressSigner;
    const amount = ethers.toBigInt(tokensExchange) * ethers.toBigInt(TokenPrice);
    console.log(tokensExchange);
    console.log(amount);
    const value = ethers.toBigInt(tokensExchange);
    console.log(value.toString());
    setTokensValue(value.toString());
    console.log(tokensValue);

    try {
      await dappToken.approve(dappTokenSale.target, value, {
        from: await addressSigner,
        gas: 20000000,
      });

     const txSell = await dappTokenSale.sellTokens(value, {
        from: await addressSigner,
        value: value,
        gas: 20000000,
      });
      txSell.wait();
      setLoading(false);
      console.log("Tokens approved and sold successfully!");
    } catch (error) {
      console.error("Error during token approval and sale:", error);
      setLoading(false);
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
              onChange={updateTokensValue}
            />
            <br />
            <span className="float-right ">Balance: {tokensValue} wei</span>
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
            {loading && <Loading />}
          </form>
        </div>
      </div>
    </div>
  );
};
export default Swap;