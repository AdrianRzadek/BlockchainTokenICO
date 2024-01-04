import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Loading from "./Loading";
import ProgressLabel from "./Progress";
import "../App.css";
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
        const price = await transactions.price();
        setTokenPrice(await price.toString());
      }
    }

    fetchData();
  }, [price, TokenPrice, transactions]);

  useEffect(() => {
    async function fetchData() {
      if (sold) {
        const tokensSold = await transactions.purchased();
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
      const txBuy = await transactions.purchase(numberOfTokensBigInt, {
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


  return (
    <div>
       <div className="container-fluid text-center">
      <div className="row align-items-center justify-content-center min-vh-10">
        <div className="col-md-5">
            <p>Obecnie podłączone konto: {AddressProvider}</p>
            
            <h2>Żeton FOSSA ICO</h2>
            <p>Cena żetonu: {TokenPrice} Wei</p>
            <p>Całkowita ilość żetonów: {tokenSupply}</p>
            {/* <p>Sprzedano: {TokensSold}</p> */}
            <p>Dostępne żetony: {tokensAvailable}</p>
          <p>Zakup</p>  
            
            <form onSubmit={buyTokens}>
              <div className="form-group">
                <input
                  type="number"
                  id="numberOfTokens"
                  className="form-control"
                  placeholder="Ilość żetonów"
                  required
                />
              </div>
              <br/>
              <button type="submit" className="btn btn-primary">
                Kup
              </button>
              {loading && <Loading />}
            </form>
            <br/>
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
