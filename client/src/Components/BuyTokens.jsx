import React, { useEffect, useState,useCallback} from "react";
import { ethers } from "ethers";
import { useSelector, useDispatch  } from "react-redux";

const BuyTokens = ({ dappTokenSale }) => {
  const addressSigner = useSelector((state) => state.addressSigner);
  const tokenSalePrice = useSelector((state) => state.TokenSale);
  const [loading, setLoading] = useState(false);
  const [useTokenPrice, setTokenPrice] = useState('');

const dispatch = useDispatch();


  const buyTokens = async (event) => {
    event.preventDefault();

    try {
      const numberOfTokens = event.target.numberOfTokens.value;
      const numberOfTokensBigInt = ethers.toBigInt(numberOfTokens);
      console.log("Buy Tokens Info:");
      const tokenPrice = await tokenSalePrice.Price
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

 

//   useEffect(() => {
//     const fetchTokenPrice = async () => {
//       try {
//       if (dappTokenSale) {
     
//       const newTokenPrice = await dappTokenSale.tokenPrice();
//       await updateTokenPrice(await newTokenPrice);
   
//     } 
//      }catch (error) {
//       console.error('Error fetching token price:', error);
//      }
//   };
  
//     fetchTokenPrice();
//   }, [dappTokenSale]);

//   const updateTokenPrice = (newTokenPrice) => {
//     setTokenPrice(newTokenPrice);
//   };
 const price=tokenSalePrice.Price
console.log(price)
  return (
    <div>
      <p>Current Account: {addressSigner}</p>

      <div className="container">
        <div className="row">
          <div className="col-md-8">
            Token Sale Details
            <h2>Token Sale</h2>
  
          <p>Token Price: {price}</p>
        
      
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
