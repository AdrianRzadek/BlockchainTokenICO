import React, { Component, useEffect, useRef } from "react";
import { ethers } from "ethers";

import DappToken from "./contracts/DappToken.json";
import DappTokenSale from "./contracts/DappTokenSale.json";
import Transactions from "./contracts/Transactions.json";
import contractAddress from "./contracts/contract-address.json";
import "./App.scss";

// This is the default id used by the Hardhat Network

//stan początkowy

class App extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      account: "0x0",
      loading: false,
      tokenPrice: ethers.parseEther("1"),
      tokensSold: 0,
      tokensAvailable: ethers.toBigInt(1000000),
      dappTokenSale: null,
      dappToken: null,
      numberOfTokens: 0n,
      transaction: null,
      balance: null,
      tokenDecimals: 0,
      tokenSymbol: "FOSSA",
    };
    this.tokensSold = React.createRef();
    //this.buyTokens = this.buyTokens.bind(this);
    this.state = this.initialState;
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.loadLogo();
  }

  async loadWeb3() {
    if (typeof window.ethereum !== "undefined") {
      // Ethereum user detected. You can now use the provider.

      try {
        // Ethereum user detected. You can now use the provider.
        const provider = await new ethers.BrowserProvider(window.ethereum);

        // Request account access if needed
        await window.ethereum.request(await{ method: "eth_requestAccounts" });

        // We have access to the wallet
        const signer = await provider.getSigner();
        console.log(await signer.getAddress());
        // Get the address of the connected wallet
        const addressSigner = await signer.getAddress();
        console.log("Connected wallet address:", addressSigner);
        this.setState({ addressSigner, signer, provider });
        // Now you can do things like read balances, query smart contracts, etc.
        console.log(signer);
      } catch (error) {
        console.error("User denied account access");
        window.alert("User denied account access");
      }
    } else if (window.web3) {
      // Legacy dapp browsers (e.g., with web3.js)
      const provider = await new ethers.BrowserProvider(
        window.web3.currentProvider
      );
      this.setState({ web3: provider });
    } else {
      // Non-dapp browsers
      window.alert("No Ethereum browser extension detected, install MetaMask!");
    }
  }

  async loadBlockchainData() {
    if (typeof window.ethereum !== "undefined") {
      const {
        provider,
        signer,
        addressSigner,
        tokenPrice,
        dappToken,
        dappTokenSale,
        tokensAvailable,
      } = await this.state;
      console.log(signer);
      console.log(provider);
      console.log(addressSigner);
      console.log(tokenPrice);
      console.log(DappTokenSale.abi);

      if (DappTokenSale && DappToken && Transactions) {
        const addressDappTokenSale = contractAddress.DappTokenSale;
        const abiDappTokenSale = DappTokenSale.abi;
        this.provider = await new ethers.BrowserProvider(window.ethereum);
        this.dappTokenSale = new ethers.Contract(
          await addressDappTokenSale,
          await abiDappTokenSale,
          await this.provider.getSigner()
        );

        const addressDappToken = contractAddress.DappToken;
        const abiDappToken = DappToken.abi;
        this.provider = await new ethers.BrowserProvider(window.ethereum);
        this.dappToken = await new ethers.Contract(
          await addressDappToken,
          await abiDappToken,
          await this.provider.getSigner()
        );

        const addressTransactions = contractAddress.Transactions;
        const abiTransactions = Transactions.abi;
        this.provider = await new ethers.BrowserProvider(window.ethereum);
        this.transaction = await new ethers.Contract(
          await addressTransactions,
          await abiTransactions,
          await this.provider.getSigner()
        );
         // console.log(this.transaction.target)
        // console.log( await dappToken.transfer(dappTokenSale.target, this.state.tokensAvailable));

        // Load token sale data
        console.log(DappTokenSale.abi);
        console.log(this.dappTokenSale.target);
        console.log(await addressSigner);
        console.log(await this.dappToken.balanceOf(this.dappTokenSale.target));
        console.log(await this.dappToken.name());
        console.log(await this.dappToken.totalSupply());
        console.log(await this.dappToken.totalSupply(this.dappTokenSale));

        //  console.log(await this.tokensSold)

        const TokenPrice = await this.dappTokenSale.tokenPrice();

        console.log(TokenPrice);

        const tokensSold = await this.dappTokenSale.tokensSold();
        console.log(tokensSold.toString());
        console.log(tokensSold);

        // let Available =  ethers.toBigInt(tokensAvailable) - ethers.toBigInt(tokensSold);

        //console.log(signer.address);

        //ładowanie danych kontraktu transakcji
        // const transaction = await transactions.getTransactionsCount;

        await this.setState({
          dappTokenSale,
          Dapptoken: this.dappToken,
          Transactions: this.transaction,
          addressDappTokenSale,
          tokensSold,
          addressDappToken,
        });
      } else {
        window.alert("Smart contracts not deployed to the detected network.");
      }
    }
  }

  async loadLogo() {
    const tokenImage =
      "https://img.freepik.com/premium-zdjecie/akwarela-malarstwo-fossa_721965-64.jpg?w=826";
    console.log(this.state.addressDappToken);
    try {
      // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: this.state.addressDappToken, // The address of the token
            symbol: this.state.tokenSymbol, // A ticker symbol or shorthand, up to 5 characters.
            decimals: this.state.tokenDecimals,
            image: tokenImage, // A string URL of the token logo.
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  buyTokens = (event) => {
    event.preventDefault();
    // Prevent the default form submission behavior

    const { signer, dappTokenSale, tokenPrice, dappToken, Available } =
      this.state;

    try {
      // dappToken.transfer(dappTokenSale.target, tokensAvailable);
      const numberOfTokens = event.target.numberOfTokens.value;
      const numberOfTokensBigInt = ethers.toBigInt(numberOfTokens);
      console.log("Buy Tokens Info:");

      //  console.log("balance of dappTokenSale", this.dappToken.balanceOf(this.dappTokenSale));
      // console.log("From Account: " + addressFrom);
      console.log(tokenPrice);
      console.log("Value: " + numberOfTokensBigInt * tokenPrice);
      console.log("Number of Tokens: " + numberOfTokensBigInt);

      console.log(this.state.addressSigner);
      //const value = ethers.formatEther(tokenPrice) * numberOfTokens;

      const value = tokenPrice * numberOfTokensBigInt;
      this.dappTokenSale.buyTokens(numberOfTokensBigInt, {
        address: this.state.addressSigner,
        value: value,
        gasLimit: 2000000,
      });

      //this.setState({ loading: false, numberOfTokens: 0 }); // Reset the number of tokens
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
      console.log("blad");
    }
  };
 


  Transfer = (event) => {
    event.preventDefault();
    const reciver = event.target.reciver.value;
    const amount = event.target.amount.value;
    const message = event.target.message.value; 
   const value = ethers.toBigInt(amount)
     console.log(this.state.addressSigner);
     console.log(reciver);
    this.dappToken.approve(this.transaction.target, value);
    this.transaction.sendTransaction( reciver,
      value,
      message,
      {
        from: this.state.addressSigner,
        value: value,
        gas: 20000000
      }
      
    )
  }



  render() {
    const {
      account,
      addressSigner,
      loading,
      tokenPrice,
      tokensSold,
      tokensAvailable,
      transactio,
      dappTokenSale,
    } = this.state;

    return (
      <div className="App">
        <h1>Dapp</h1>
        <p>Current Account: {addressSigner}</p>

        <div className="container">
          <div className="row">
            <div className="col-md-8">
              {/* Token Sale Details */}
              <h2>Token Sale</h2>

              <p>Token Price: {tokenPrice.toString()} Wei</p>
              <p>Token Sold: {tokensSold.toString()} </p>
              <p>Tokens Available: {tokensAvailable.toString()}</p>
              {/* Buy Tokens Form */}
              <form onSubmit={this.buyTokens}>
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

        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <p>Transactions:</p>
              <form onSubmit={this.Transfer}>
                <input
                  type="text"
                  id="reciver"
                  className="form-control"
                  placeholder="Address of reciver"
                  required
                />

                <input
                  type="text"
                  id="amount"
                  className="form-control"
                  placeholder="Amount of Tokens"
                  required
                />
                <input
                  type="text"
                  id="message"
                  className="form-control"
                  placeholder="Message for reciver"
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Wyślij
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
