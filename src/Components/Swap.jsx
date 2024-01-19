import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Loading from "./Loading";
const Swap = ({ transactions, fossaToken, provider, price }) => {
  const [tokensExchange, setTokensExchange] = useState("");
  const [TokenPrice, setTokenPrice] = useState("");
  const [tokensValue, setTokensValue] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      if (price) {
        const price = await transactions.price();
        setTokenPrice(await price.toString());
      }
    }

    fetchData();
  }, [price, transactions]);

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
    const addressSigner = (await provider) && provider.addressSigner;
    const amount = ethers.toBigInt(tokensExchange) * ethers.toBigInt(TokenPrice);
    console.log(tokensExchange);
    console.log(amount);
    const value = ethers.toBigInt(tokensExchange);
    console.log(value.toString());
    setTokensValue(value.toString());
    console.log(tokensValue);

    try {
      await fossaToken.approve(transactions.target, value, {
        from: await addressSigner,
        gas: 20000000,
      });

      const txSell = await transactions.swap(value, {
        from: await addressSigner,
        value: value,
        gas: 20000000,
      });
      txSell.wait();
      setLoading(false);
      console.log("Sprzedano");
    } catch (error) {
      console.error("Błąd:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-4 offset-md-6">
          <p className="text-center">Wymień:</p>
          <form onSubmit={swap} className="text-center">
            <input
              type="text"
              id="tokensExchange"
              className="form-control"
              placeholder="Wymień"
              required
              value={tokensExchange}
              onChange={updateTokensValue}
            />
            <br />
            <span>Balans: {tokensValue}</span>
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
