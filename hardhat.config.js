require("@nomicfoundation/hardhat-toolbox");
require("ethers");
// Ładuje dotenv do odczytania zmiennej środowsikowej pliku .env 
require('dotenv').config();

 module.exports = {
  defaultNetwork: "localhost", 
  networks: {
    localhost: {
      url: "http://localhost:8545", // lokalny node Ethereum 
      accounts: {
        mnemonic: process.env.MNEMONIC , 
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
      chainId: 31337, 
    },
    // mainnet: {
    //   url: "https://mainnet.infura.io/v3/INFURA_API_KEY",
    //   accounts: {
    //     mnemonic:  process.env.MNEMONIC,
    //     path: "m/44'/60'/0'/0",
    //     initialIndex: 0,
    //     count: 20,
    //     passphrase: "",
    //   },
    // },
  },
  solidity: {
    version: "0.8.23",
    settings: {
      evmVersion: "shanghai",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: './artifacts',
  },
};
