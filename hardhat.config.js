require("@nomicfoundation/hardhat-toolbox");
require("ethers");
// Load dotenv to read environment variables from a .env file
require('dotenv').config();

 module.exports = {
  defaultNetwork: "localhost", // Set localhost as the default network
  networks: {
    localhost: {
      url: "http://localhost:8545", // URL of your local Ethereum node
      accounts: {
        mnemonic: process.env.MNEMONIC , 
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
      chainId: 31337, 
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/INFURA_API_KEY",
      accounts: {
        mnemonic:  process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
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
