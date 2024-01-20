import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Loading from "./Loading";
import ProgressLabel from "./Progress";
import "../App.css";
const Purchase = ({ fossaToken, transactions, price, provider, sold }) => {
  const [loading, setLoading] = useState(false);
  const [Price, setPrice] = useState("");
  const [SoldAmount, setSoldAmount] = useState("");
  const [Available, setAvailable] = useState("");
  const [AddressProvider, setAddressProvider] = useState("");
  const [Supply, setSupply] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (price) {
        const price = await transactions.price();
        setPrice(await price.toString());
      }
    }

    fetchData();
  }, [price, Price, transactions]);

  useEffect(() => {
    async function fetchData() {
      if (sold) {
        const Sold = await transactions.purchased();
        await setSoldAmount(await Sold.toString());
      }
    }

    fetchData();
  }, [sold, SoldAmount, transactions]);

  useEffect(() => {
    async function fetchData() {
      if (fossaToken) {
        const Available = await fossaToken.balanceOf(transactions.target);
        setAvailable(await Available.toString());
        const tokensSupply = await fossaToken.totalSupply();
        setSupply(await tokensSupply.toString());
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

  const purchase = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const amount = event.target.amount.value;
      const amountBigInt = ethers.toBigInt(amount);
      console.log("Info:");
      const priceBigInt = await ethers.toBigInt(Price);

      console.log(await priceBigInt);
      console.log(await amountBigInt);

      console.log("Wartośc: " + amountBigInt * priceBigInt);
      console.log("Liczba tokenów: " + amountBigInt);
      console.log("Adres kupującego " + AddressProvider);
      const value = priceBigInt * amountBigInt;
      console.log(value);
      const txBuy = await transactions.purchase(amountBigInt, {
        address: await AddressProvider,
        value: value,
        gasLimit: 2000000,
      });
      txBuy.wait();

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
            
            <h2>Żeton FOSSA</h2>
            <p>Cena żetonu: {Price} Wei</p>
            <p>Całkowita ilość żetonów: {Supply}</p>
            <p>Dostępne żetony: {Available}</p>
          <p>Zakup</p>  
            
            <form onSubmit={purchase}>
              <div className="form-group">
                <input
                  type="number"
                  id="amount"
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
            soldAmount={SoldAmount}
            supply={Supply}
          
          />
        </div>
      </div>
    </div>
  );
};

export default Purchase;
