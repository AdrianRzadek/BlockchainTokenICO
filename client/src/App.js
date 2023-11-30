import React, { Component} from "react";
import { ethers } from "ethers";

import DappToken from "./contracts/DappToken.json";
import DappTokenSale from "./contracts/DappTokenSale.json";
import Transactions from "./contracts/Transactions.json";

import contractAddress from "./contracts/contract-address.json";
import "./App.scss";


//stan początkowy

class App extends Component {

  //konstruktor wartości kontraktu
  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      loading: false,
      tokenPrice: ethers.parseEther("0"),
      tokensSold: 0,
      tokensAvailable: ethers.toBigInt(0),
      dappTokenSale: null,
      dappToken: null,
      numberOfTokens: 0n,
      transaction: null,
      balance: null,
      tokenDecimals: 0,
      tokenSymbol: "FOSSA",
    };   
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.loadLogo();
    await this.polling();

  }

  async loadWeb3() {
    if (typeof window.ethereum !== "undefined") {
      // Ethereum user detected. You can now use the provider.

      try {
        // Ethereum user detected. You can now use the provider.
        const provider = await new ethers.BrowserProvider(await window.ethereum);

        // Request account access if needed
        await window.ethereum.request(await{method: "eth_requestAccounts" });

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
      } = await this.state;

      console.log(signer);
      console.log(provider);
      console.log(addressSigner);
      console.log(tokenPrice);
      console.log(DappTokenSale.abi);

      if (DappTokenSale && DappToken && Transactions ) {
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

      /*  const addressExchange = contractAddress.Exchange;
        const abiExchange = Exchange.abi;
        this.provider = await new ethers.BrowserProvider(window.ethereum);
        this.exchange = await new ethers.Contract(
          await addressExchange,
          await abiExchange,
          await this.provider.getSigner()
        );
         console.log(this.exchange)*/
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

        const TokensAvailable = await this.dappToken.balanceOf(this.dappTokenSale.target);

        console.log(TokensAvailable);

       const TokensSold = await this.dappTokenSale.tokensSold();
     //   console.log(TokensSold.toString());
     //   console.log(TokensSold);

        //console.log(signer.address);

        //ładowanie danych kontraktu transakcji
        // const transaction = await transactions.getTransactionsCount;

        await this.setState({
          dappTokenSale: this.dappTokenSale,
          Dapptoken: this.dappToken,
          Transactions: this.transaction,
          Exchange: this.exchange,
          addressDappTokenSale,
          tokensSold: TokensSold,
          addressDappToken,
          tokenPrice: TokenPrice,
          tokensAvailable:TokensAvailable,
        });
     
      } else {
        window.alert("Smart contracts not deployed to the detected network.");
      }
    }
  }

  async loadLogo() {
    const tokenImage = "https://img.freepik.com/premium-zdjecie/akwarela-malarstwo-fossa_721965-64.jpg?w=826";
    console.log(this.state.addressDappToken);

    try {
        // Check local storage
        
        const tokenAdded = localStorage.getItem('tokenAdded');
        const storedTokenAddress = localStorage.getItem('tokenAddress');
        // If the token hasn't been added yet, prompt the user to add it
        if (!tokenAdded || storedTokenAddress !== this.state.addressDappToken) {
            const wasAdded = await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: this.state.addressDappToken,
                        symbol: this.state.tokenSymbol,
                        decimals: this.state.tokenDecimals,
                        image: tokenImage,
                    },
                },
            });

            if (wasAdded) {
                console.log("Thanks for your interest!");
                // Update local storage
                localStorage.setItem('tokenAdded', 'true');
                localStorage.setItem('tokenAddress', this.state.addressDappToken);
              } else {
                console.log("Your loss!");
            }
        } else {
            // Here you can add code to check if the token is already added
            console.log("Token already added or user previously prompted.");
        }
    } catch (error) {
        console.log(error);
    }
}

  buyTokens = async (event) => {
    event.preventDefault();
    // Prevent the default form submission behavior

    const { tokenPrice} =
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

    await this.dappTokenSale.buyTokens(numberOfTokensBigInt, {
        address: this.state.addressSigner,
        value: value,
        gasLimit: 2000000,
      })
       
      
      //this.setState({ loading: false, numberOfTokens: 0 }); // Reset the number of tokens
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
      console.log("blad");
    }

  };
 


  Transfer = async (event) => {
    event.preventDefault();
    const reciver = await event.target.reciver.value;
    const amount =  await event.target.amount.value;
    const message =  await event.target.message.value; 
   const value = await ethers.toBigInt(amount)
     console.log(this.state.addressSigner);
     console.log(reciver);
     await this.dappToken.approve(this.transaction.target, value);
     await this.transaction.sendTransaction( reciver,
      value,
      message,
      {
        from: this.state.addressSigner,
        value: value,
        gas: 200000000,
      }
      
    )
  }

  Swap = async (event) =>{
    event.preventDefault();
  //  console.log(this.exchange)
    const amount = event.target.tokensExchange.value;
   const value = ethers.toBigInt(amount);

   try {
    // Approve the exchange to spend tokens on behalf of the user
    await this.dappToken.approve(this.dappTokenSale.target, value, {
        from: this.state.addressSigner,
       
        gas: 20000000,
    });

    // Sell tokens on the exchange
    await this.dappTokenSale.sellTokens(value, {
        from: this.state.addressSigner,
        value: value,
        gas: 20000000,
    });

    console.log("Tokens approved and sold successfully!");
} catch (error) {
    console.error("Error during token approval and sale:", error);
}
      
    
  
  }

  polling = () => {
    this.pollingInterval = setInterval(async () => {
     
      const tokensAvailable = await this.dappToken.balanceOf(this.dappTokenSale.target);
      const tokensSold = await this.dappTokenSale.tokensSold();
        this.setState({ tokensSold });
        this.setState({tokensAvailable});
    }, 1000); // Poll every 1 second
};



  componentWillUnmount() {
    // Remove the event listener when the component unmounts
   this.loadLogo();
   this.polling();
  }

  render() {
    const {
      addressSigner,
      loading,
      tokenPrice,
      tokensSold,
      tokensAvailable,
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
                <button type="submit"  className="btn btn-primary">
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
        <br/>
        <br/>
       
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <p>Transactions:</p>
              <form onSubmit={this.Swap}>
          <input  type="text"
                  id="tokensExchange"
                  className="form-control"
                  placeholder="TokensExchange"
                  required/>
                  <br/>
                  <span className="float-right text-muted">
            Balance: {(this.tokenPrice)}
          </span>
          <br/>
          <input
           type="text"
           id="etherExchange"
           className="form-control"
           placeholder="0"
           value={this.tokenPrice}
            disabled
           />
            <br/>
             <button type="submit" className="btn btn-primary">
                 Wymień
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
