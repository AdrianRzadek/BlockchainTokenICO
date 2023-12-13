import React, { useEffect, useState,useCallback } from "react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";

const BuyTokens = ({ dappTokenSale }) => {
  const addressSigner = useSelector((state) => state.addressSigner);
  const [loading, setLoading] = useState(false);
  const [useTokenPrice, setTokenPrice] = useState(null);


  const buyTokens = async (event) => {
    event.preventDefault();

    try {
      const numberOfTokens = event.target.numberOfTokens.value;
      const numberOfTokensBigInt = ethers.toBigInt(numberOfTokens);
      console.log("Buy Tokens Info:");
      const tokenPrice = await dappTokenSale.tokenPrice();
      setTokenPrice(tokenPrice);
      console.log(await tokenPrice);
      console.log("Value: " + numberOfTokensBigInt * tokenPrice);
      //  console.log("Number of Tokens: " + numberOfTokensBigInt);

      const value = tokenPrice * numberOfTokensBigInt;

      await dappTokenSale.buyTokens(numberOfTokensBigInt, {
        address: addressSigner,
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

 

  useEffect(() => {
    const fetchTokenPrice = async () => {
      const newTokenPrice = await dappTokenSale.tokenPrice();
      updateTokenPrice(newTokenPrice);
    };
  
    fetchTokenPrice();
  }, [dappTokenSale]);

  const updateTokenPrice = (newTokenPrice) => {
    setTokenPrice(newTokenPrice);
  };

  return (
    <div>
      <p>Current Account: {addressSigner}</p>

      <div className="container">
        <div className="row">
          <div className="col-md-8">
            Token Sale Details
            <h2>Token Sale</h2>
  
          <p>Token Price: {useTokenPrice.toString()}</p>
        
      
            <p>Token Sold: </p>
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
