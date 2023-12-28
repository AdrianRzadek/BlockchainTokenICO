import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Loading from "./Loading";
import ProgressLabel from "./Progress";
const BuyTokens = ({ fossaToken, transactions, price, provider, sold }) => {
  const [loading, setLoading] = useState(false);
  const [TokenPrice, setTokenPrice] = useState("");
  const [TokensSold, setTokensSold] = useState("");
  const [tokensAvailable, setTokensAvailable] = useState("");
  const [AddressProvider, setAddressProvider] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (price) {
        const price = await transactions.tokenPrice();
        setTokenPrice(await price.toString());
      }
    }

    fetchData();
  }, [price, TokenPrice, transactions]);

  useEffect(() => {
    async function fetchData() {
      if (sold) {
        const tokensSold = await transactions.tokensSold();
        await setTokensSold(await tokensSold.toString());
      }
    }

    fetchData();
  }, [sold, TokensSold, transactions]);

  useEffect(() => {
    async function fetchData() {
      if (fossaToken) {
        const tokensAvailable = await fossaToken.balanceOf(transactions.target);
        setTokensAvailable(await tokensAvailable.toString());
        const tokensSupply = await fossaToken.totalSupply();
        setTokenSupply(await tokensSupply.toString());
      }
    }
    fetchData();
  }, [fossaToken, transactions]);

  useEffect(() => {
    async function fetchData() {
      if (provider) {
        const addressProvider = provider && provider.addressProvider;
        setAddressProvider(await addressProvider.toString());
      }
    }
    fetchData();
  }, [provider]);

  const buyTokens = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const numberOfTokens = event.target.numberOfTokens.value;
      const numberOfTokensBigInt = ethers.toBigInt(numberOfTokens);
      console.log("Buy Tokens Info:");
      const tokenPrice = await ethers.toBigInt(TokenPrice);

      console.log(await tokenPrice);
      console.log(await numberOfTokensBigInt);

      console.log("Value: " + numberOfTokensBigInt * tokenPrice);
      console.log("Number of Tokens: " + numberOfTokensBigInt);
      console.log("address signer " + AddressProvider);
      const value = tokenPrice * numberOfTokensBigInt;
      console.log(value);
      const txBuy = await transactions.buyTokens(numberOfTokensBigInt, {
        address: await AddressProvider,
        value: value,
        gasLimit: 2000000,
      });
      txBuy.wait();

      //this.setState({ loading: false, numberOfTokens: 0 });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      console.log("blad");
    }
  };

  //console.log(tokensAvaiable)

  //console.log(AddressProvider)
  //const addressProvider = provider && provider.addressProvider;

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <p>Current Account: {AddressProvider}</p>
            Token Sale Details
            <h2>Token Sale</h2>
            <p>Token Price: {TokenPrice}</p>
            <p>Token Supply: {tokenSupply}</p>
            <p>Token Sold:{TokensSold} </p>
            <p>Tokens Available: {tokensAvailable}</p>
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
              {loading && <Loading />}
            </form>
          </div>
          <ProgressLabel
            tokensSold={TokensSold}
            tokensAvailable={tokensAvailable}
            tokenSupply={tokenSupply}
          />
        </div>
      </div>
    </div>
  );
};

export default BuyTokens;
