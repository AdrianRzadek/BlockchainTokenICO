import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const BuyTokens = ({ dappTokenSale, price, provider, sold }) => {

  const [loading, setLoading] = useState(false);
const [usetokenPrice, setTokenPrice] = useState('');
const [usePrice, setPrice] = useState('');
const [TokensSold, setTokensSold] = useState('');
  useEffect(() => {
    async function fetchData() {
      if(price) {
      const price = await dappTokenSale.tokenPrice();
      setTokenPrice(await price);
     const Price = await usetokenPrice.toString();
      setPrice(Price);
      }
    }
  
    fetchData();
  }, [price, usetokenPrice]);

  useEffect(() => {
    async function fetchData() {
      if(sold) {
      const tokensSold = await dappTokenSale.tokensSold();
      await setTokensSold(await tokensSold.toString());
   
      }
    }
  
    fetchData();
  }, [sold]);

 // console.log( tp);

  const buyTokens = async (event) => {
    event.preventDefault();

    try {
      const numberOfTokens = event.target.numberOfTokens.value;
      const numberOfTokensBigInt = ethers.toBigInt(numberOfTokens);
      console.log("Buy Tokens Info:");
      const tokenPrice = await ethers.toBigInt(price);
      setTokenPrice(tokenPrice);
      console.log(await tokenPrice);
      console.log(await numberOfTokens);
      console.log("Value: " + numberOfTokensBigInt * tokenPrice);
      //  console.log("Number of Tokens: " + numberOfTokensBigInt);
      console.log("address signer " + provider);
      const value = tokenPrice * numberOfTokensBigInt;

      await dappTokenSale.buyTokens(numberOfTokensBigInt, {
        address: provider,
        value: value,
        gasLimit: 2000000,
      });

      //this.setState({ loading: false, numberOfTokens: 0 });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      console.log("blad");
    }
  };
 

//console.log(TokensSold)


  const addressProvider = provider && provider.addressProvider;

  return (
    <div>
      <p>Current Account: {addressProvider}</p>

      <div className="container">
        <div className="row">
          <div className="col-md-8">
            Token Sale Details
            <h2>Token Sale</h2>
            <p>Token Price: {usePrice}</p>
            <p>Token Sold:{TokensSold} </p>
            <p>Tokens Available: </p>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTokens;
