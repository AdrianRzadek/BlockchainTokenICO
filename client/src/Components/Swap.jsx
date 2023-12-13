import React, { useState } from "react";
import { ethers } from "ethers";
import {  useSelector, useDispatch } from 'react-redux';
import{setTokensValue} from './actions';

const Swap = () => {
  const [tokensExchange, setTokensExchange] = useState(null);

  const addressSigner = useSelector((state) => state.addressSigner);
  const dappToken = useSelector((state) => state.dappToken);
  const dappTokenSale = useSelector((state) => state.dappTokenSale);
  const tokensValue = useSelector((state) => state.tokensValue);
  const dispatch = useDispatch();
  const swap = async (event) => {
    event.preventDefault();
    
    const amount = tokensExchange * dappTokenSale.dappTokenSalePrice;
    const value = ethers.toBigInt(amount);
    dispatch(setTokensValue(value));
   console.log(value);
    try {
      await dappToken.approve(
       dappTokenSale.target,
        value,
        {
          from: addressSigner,
          gas: 20000000,
        }
      );

      await dappTokenSale.sellTokens(value, {
        from: addressSigner,
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
              Balance: {dappTokenSale.dappTokenSalePrice}
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
