import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const BuyTokens = ({ dappToken, dappTokenSale, price, provider, sold }) => {

  const [loading, setLoading] = useState(false);
const [TokenPrice, setTokenPrice] = useState('');
//const [usePrice, setPrice] = useState('');
const [TokensSold, setTokensSold] = useState('');
const [tokensAvaiable, setTokensAvaiable] = useState('');
const [AddressProvider, setAddressProvider] = useState('');
useEffect(() => {
    async function fetchData() {
      if(price) {
      const price = await dappTokenSale.tokenPrice();
      setTokenPrice(await price.toString());

      }
    }
  
    fetchData();
  }, [price, TokenPrice]);

  useEffect(() => {
    async function fetchData() {
      if(sold) {
      const tokensSold = await dappTokenSale.tokensSold();
      await setTokensSold(await tokensSold.toString());
   
      }
    }
  
    fetchData();
  }, [sold]);

  useEffect(() => {
    async function fetchData() {
      if(dappToken) {
  const tokensAvailable = await dappToken.balanceOf(
    dappTokenSale.target);
    setTokensAvaiable(await tokensAvailable.toString());
  }
}
fetchData();
}, [dappToken]);


useEffect(() => {
  async function fetchData() {
    if(provider) {
      const addressProvider = provider && provider.addressProvider;
  setAddressProvider(await addressProvider.toString());
}
}
fetchData();
}, [provider]);

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
 

//console.log(tokensAvaiable)

console.log(AddressProvider)
  //const addressProvider = provider && provider.addressProvider;

  return (
    <div>
      <p>Current Account: {AddressProvider}</p>

      <div className="container">
        <div className="row">
          <div className="col-md-8">
            Token Sale Details
            <h2>Token Sale</h2>
            <p>Token Price: {TokenPrice}</p>
            <p>Token Sold:{TokensSold} </p>
            <p>Tokens Available: {tokensAvaiable}</p>
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
