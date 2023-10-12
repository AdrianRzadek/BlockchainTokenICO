import React, { Component, useEffect, useState } from 'react';
import Web3 from 'web3';

import DappTokenSale from './artifacts/contracts/DappTokenSale.sol/DappTokenSale.json';
import DappToken from './artifacts/contracts/DappToken.sol/DappToken.json';
import Transactions from './artifacts/contracts/Transactions.sol/Transactions.json';
import './App.scss';
//import { TransactionProvider } from './Components/TransactionProvider';

//stan początkowy
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      account: '0x0',
      loading: false,
      tokenPrice: Web3.utils.toWei("1", "ether"),
      tokensSold: 0,
      tokensAvailable: 750000,
      dappTokenSale: null,
      dappToken: null,
      numberOfTokens: 0,
      transaction:0,
    };
    this.buyTokens = this.buyTokens.bind(this);
   
  }

   async componentDidMount() {
     await this.loadWeb3();
     await this.loadBlockchainData();
   }

   async loadWeb3() {
     if (window.ethereum) {
  //     // Modern dapp browsers
       const web3 = new Web3(window.ethereum);
       try {
  //       // Request account access
        await window.ethereum.request('eth_requestAccounts');
        this.setState({ web3 });
       } catch (error) {
         console.error('User denied account access');
       }
     } else if (window.web3) {
       // Legacy dapp browsers
       this.setState({ web3: new Web3(window.web3.currentProvider) });
     } else {
  //     // Non-dapp browsers
       window.alert(
         'Non-Ethereum browser detected. You should consider trying MetaMask!'
       );
     }
   }

   async loadBlockchainData() {
    const web3 = new Web3(window.ethereum);


    // Load account data
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Load smart contracts
    const networkId = await web3.eth.net.getId();
    const dappTokenSaleData = DappTokenSale.networks[networkId];
    const dappTokenData = DappToken.networks[networkId];
    const transactionsData = Transactions.networks[networkId];
    if (dappTokenSaleData && dappTokenData && transactionsData) {
      const dappTokenSale = new web3.eth.Contract(
        DappTokenSale.abi,
        dappTokenSaleData.address,
        console.log(dappTokenSaleData.address)
      );
      const dappToken = new web3.eth.Contract(
        DappToken.abi,
        dappTokenData.address,
        console.log(dappTokenData.address)
      );
      const transactions = new web3.eth.Contract(
        Transactions.abi,
        transactionsData.address,
        //transactionsData.signer,
        console.log(transactionsData.address)
      );

      this.setState({ dappTokenSale, dappToken, transactions });

      // Load token sale data
      const tokenPrice = await dappTokenSale.methods.tokenPrice().call();
      const tokensSold = await dappTokenSale.methods.tokensSold().call();
      //ładowanie danych kontraktu transakcji
      const transaction = await transactions.methods.getTransactionsCount().call();
      this.setState({ tokenPrice, tokensSold, transaction });
    } else {
      window.alert('Smart contracts not deployed to the detected network.');
    }
  }
  
  
   async buyTokens(event) {
     event.preventDefault();
  //   // Prevent the default form submission behavior
     const { account, dappTokenSale, tokenPrice } = this.state;
     const numberOfTokens = event.target.numberOfTokens.value; // Get the value from the input field
     this.setState({ loading: true });
  
     try {
       console.log("Buy Tokens Info:");
      console.log("From Account: " + account);
       console.log("Value: " + (numberOfTokens * tokenPrice));
       console.log("Number of Tokens: " + numberOfTokens);
      await dappTokenSale.methods
         .buyTokens(numberOfTokens)
       // .send({ from: this.state.account, value: numberOfTokens * tokenPrice, gas:500000});
      
       
        console.log("Tokens bought...");
       console.log("Tokens bought...");
  //     //this.setState({ loading: false, numberOfTokens: 0 }); // Reset the number of tokens
       } catch (error) {
       console.error(error);
       this.setState({ loading: false });
       console.log('blad');
     }
   };

  render() {
    const { account, loading, tokenPrice, tokensSold, tokensAvailable, transaction } = this.state;

    return (
      <div className="App">
        <h1>Your Dapp</h1>
        <p>Current Account: {account}</p>

        <div className="container">
          <div className="row">
            <div className="col-md-8">
              {/* Token Sale Details */}
              <h2>Token Sale</h2>
              <p>Token Price: {tokenPrice} Wei</p>
               <p>Tokens Sold: {tokensSold}</p>
               <p>Tokens Available: {tokensAvailable}</p>
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
         <p>Transactions: {transaction}</p>
      
      </div>
     ); 
   }
//do wywalenia
 // render() {
 //   return( <div className="App"></div>); */}
//  }
}

export default App;
