import React, { Component} from 'react';
import { ethers } from 'ethers';
//import DappTokenSale from './artifacts/contracts/DappTokenSale.sol/DappTokenSale.json';
//import DappToken from './artifacts/contracts/DappToken.sol/DappToken.json';
//import Transactions from './artifacts/contracts/Transactions.sol/Transactions.json';

import DappToken from "./contracts/DappToken.json";
import DappTokenSale from "./contracts/DappTokenSale.json";
import Transactions from "./contracts/Transactions.json";
import contractAddress from "./contracts/contract-address.json";
import './App.scss';
import { TransactionProvider } from './Components/TransactionProvider';

// This is the default id used by the Hardhat Network

//stan początkowy

class App extends Component {

  constructor(props) {
    super(props);
    this.initialState = {
    
      account: '0x0',
      loading: false,
      tokenPrice: ethers.parseEther("1"),
      tokensSold: 0,
      tokensAvailable: 1000000,
      dappTokenSale: null,
      dappToken: null,
      numberOfTokens: 0n,
      transaction:null,
      balance: null
      
    };
   //this.buyTokens = this.buyTokens.bind(this);
   this.state=this.initialState;
  }

  

  async componentDidMount() {
    await this.loadWeb3();
   await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      // Ethereum user detected. You can now use the provider.
     
      try {
         // Ethereum user detected. You can now use the provider.
        //const provider = await new ethers.BrowserProvider(window.ethereum);
      
        const provider = await new ethers.JsonRpcProvider('http://localhost:8545')  
        // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // We have access to the wallet
          const signer = await provider.getSigner();
        console.log(await signer.getAddress());
          // Get the address of the connected wallet
          const addressSigner = await signer.getAddress();
          console.log("Connected wallet address:", addressSigner);
          this.setState({addressSigner, signer,provider});
          // Now you can do things like read balances, query smart contracts, etc.
          console.log(signer);
        } catch (error) {
          console.error(error);
      }
      } else {
      console.log('No Ethereum browser extension detected, install MetaMask!');
      }
    /*if (window.ethereum ) {
      // Modern dapp browsers with MetaMask or similar
      try {
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = await new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        this.setState({ web3: provider, signer });
        console.log('Polaczon');
        // const provider = new ethers.BrowserProvider(window.ethereum);
       // this.setState({web3: provider});
      } catch (error) {
        console.error('User denied account access');
      }
    } else if (window.web3) {
      // Legacy dapp browsers (e.g., with web3.js)
      const provider = await new ethers.BrowserProvider(window.web3.currentProvider);
      this.setState({web3: provider});
    } else {
      // Non-dapp browsers
      window.alert('Non-Ethereum browser detected. You should consider using MetaMask or similar.');
    }*/
  }


  async loadBlockchainData() {
    if (typeof window.ethereum !== 'undefined') {
      // Use this.state.web3 to interact with Ethereum
      //const prov = this.state.web3;
     // const provider = ethers.getDefaultProvider();
      // Load account data
     // const accounts = await provider.listAccounts();
      //const account = accounts[0]; // Get the account address
    //  this.setState({ account });
    const {provider, signer,addressSigner, tokenPrice,dappToken, dappTokenSale}= await this.state;
      console.log(signer);
      console.log(provider);
      console.log(addressSigner)
      console.log(tokenPrice)
      
      //const signer = await this.setState({ account: accounts[0] });
     // const signer = await provider.();
    //  console.log(signer);
    //  this.setState(signer);
    // console.log(signer);
    // Load smart contracts
   // const networkId = await web3.eth.net.getId();
   // console.log('66l ' + contractAddress.DappTokenSale);
   // const dappTokenSaleData = DappTokenSale;
   // const dappTokenData = DappToken;
  //  const transactionsData = Transactions;
    console.log(DappTokenSale.abi);
   // console.log(account.address);



    if (DappTokenSale && DappToken && Transactions) {
      
      const addressDappTokenSale = contractAddress.DappTokenSale;
    const abiDappTokenSale = DappTokenSale.abi;
    this.provider = await new ethers.BrowserProvider(window.ethereum);
    this.dappTokenSale = new ethers.Contract(
     await addressDappTokenSale,
     await abiDappTokenSale,
     await this.provider.getSigner(0)
    );

    const addressDappToken = contractAddress.DappToken;
    const abiDappToken =  DappToken.abi;
    this.provider = await new ethers.BrowserProvider(window.ethereum);
    this.dappToken = await new ethers.Contract(
     await   addressDappToken,
     await   abiDappToken,
     await  this.provider.getSigner(0)
        
   );

     const addressTransactions = contractAddress.Transactions;
     const abiTransactions =  Transactions.abi;         
      const transactions = new ethers.Contract(
        addressTransactions,
        abiTransactions ,
        signer
       
      );
      
    // console.log( await dappToken.transfer(dappTokenSale.target, this.state.tokensAvailable));
     
      // Load token sale data
      console.log(DappTokenSale.abi);
      console.log(this.dappTokenSale.target);
      console.log(await addressSigner);
      console.log(await this.dappToken.balanceOf(this.dappTokenSale.target));
     console.log(await this.dappToken.name())
      console.log(await this.dappToken.totalSupply())
      console.log(await this.dappToken.totalSupply(this.dappTokenSale))

   
     //console.log(await dappToken.balanceOf(dappTokenSale.target))
    // console.log(await dappTokenSale.buyTokens(2,{address:dappTokenSale.target ,value: ethers.parseEther("2"), gasLimit: 1000000 }));
      //const TokenPrice = await dappTokenSale.tokenPrice();
     // console.log(tokenPrice.toString());
     // console.log(TokenPrice); 
      
    //  const tokensSold = await dappTokenSale.tokensSold();
    //  console.log(tokensSold.toString());
     // console.log(tokensSold); 

         
      //console.log(signer.address); 
      
      //ładowanie danych kontraktu transakcji
     // const transaction = await transactions.getTransactionsCount;
    await this.setState({ dappTokenSale, Dapptoken: this.dappToken, transactions, addressDappTokenSale});
    
      } else {
      window.alert('Smart contracts not deployed to the detected network.');
      }
      }
    };

   
     
   buyTokens = (event) => {

    event.preventDefault();
    // Prevent the default form submission behavior
   
    const { signer, dappTokenSale, tokenPrice, dappToken, tokensAvailable} = this.state;
   //console.log(this.dappTokenSale.target);
  // console.log(signer)
   //console.log(tokenPrice); 
  // const addressFrom = this.dappTokenSale.target;
    
  //console.log(Signer);
    try {
     // dappToken.transfer(dappTokenSale.target, tokensAvailable);
     const numberOfTokens = (event.target.numberOfTokens.value);
     const numberOfTokensBigInt = ethers.toBigInt(numberOfTokens);
      console.log("Buy Tokens Info:");
      
    //  console.log("balance of dappTokenSale", this.dappToken.balanceOf(this.dappTokenSale));
     // console.log("From Account: " + addressFrom);
      console.log(tokenPrice);
      console.log("Value: " + (numberOfTokensBigInt * tokenPrice));
      console.log("Number of Tokens: " + numberOfTokensBigInt);

      console.log(this.state.addressSigner)
      //const value = ethers.formatEther(tokenPrice) * numberOfTokens;
      
      const value = tokenPrice * numberOfTokensBigInt;
       this.dappTokenSale.buyTokens(numberOfTokensBigInt,{ address: this.state.addressSigner, value: value, gasLimit: 2000000 });
        // this.dappToken.transfer({ address: this.state.addressSigner, value: value, gasLimit: 2000000 });
     
        console.log("Tokens bought..." );
        console.log("Tokens sold" +  this.dappTokenSale.tokensSold());
      //this.setState({ loading: false, numberOfTokens: 0 }); // Reset the number of tokens
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
      console.log('blad');
    }
  };
  

 

 
  render() {
    const {account,addressSigner, loading, tokenPrice, tokensSold, tokensAvailable, transaction } =
      this.state;
    
    return (
      
      <div className="App">
        <h1>Your Dapp</h1>
          <p>Current Account: {addressSigner}</p> 

        <div className="container">
          <div className="row">
            <div className="col-md-8">
              {/* Token Sale Details */}
              <h2>Token Sale</h2>
              
               { <p>Token Price: {tokenPrice.toString()} Wei</p> }
              { <p>Tokens Sold: {tokensSold.toString()}</p> }
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
        {/* <p>Transactions: {transaction}</p>  */}
   
      </div>
    );
  } 
}



export default App;
