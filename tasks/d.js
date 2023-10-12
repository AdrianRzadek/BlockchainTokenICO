const {hardhat} = require("hardhat");
const {Web3} = require("web3")

const path = require("path");

async function main() {
   
    const [ deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    console.log(
      "Deploying the contracts with the account:",
      await address
    );
    const DappToken = await ethers.getContractFactory("DappToken");
    const dappToken = await DappToken.deploy();

    //const deployDappToken = await dappToken.deployTransaction;
    //await deployDappToken.wait();
    //await dappToken.deployed();
    console.log("Token address:", dappToken.target);
  
    const tokenPrice =  Web3.utils.toWei("1", "ether") // Convert 1 Ether to Wei
   
    const DappTokenSale = await ethers.getContractFactory("DappTokenSale");
    console.log();
    const dappTokenSale = await DappTokenSale.deploy(address, tokenPrice);
  //  await dappTokenSale.deployTransaction.wait();
  //  console.log('DappTokenSale contract deployed to:', dappTokenSale.address);
  /*  await deploy("DappTokenSale", {
      from: deployer,
      args: [deployments.DappToken.address, tokenPrice],
      log: true,
    });
  */

    const Transactions = await ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy();
   // await transactions.deployTransaction.wait();
  

    saveClientFiles(dappToken, dappTokenSale, transactions);
};

function saveClientFiles(dappToken,dappTokenSale,transactions) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "client", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
/*
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ DappToken: dappToken.address }, undefined, 2),
    JSON.stringify({ DappTokenSale: dappTokenSale.address }, undefined, 2),
    JSON.stringify({ Transactions: transactions.address }, undefined, 2),
  );
*/
const contractAddresses = {
 DappToken: dappToken.target,
  DappTokenSale: dappTokenSale.target,
  Transactions: transactions.target,
};
console.log(contractAddresses)
// Serialize the object to JSON and write it to the file
fs.writeFileSync(
  //console.log({DappToken: dappToken.address}),
  path.join(contractsDir, "contract-address.json"),
  JSON.stringify(contractAddresses) // Serialize the single object
  
);




  const DappTokenArtifact = artifacts.readArtifactSync("DappToken");
  const DappTokenSaleArtifact = artifacts.readArtifactSync("DappTokenSale");
  const TransactionsArtifact = artifacts.readArtifactSync("Transactions");
  fs.writeFileSync(
    path.join(contractsDir, "DappToken.json"),
    JSON.stringify(DappTokenArtifact, null, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "DappTokenSale.json"),
    JSON.stringify(DappTokenSaleArtifact, null, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "Transactions.json"),
    JSON.stringify(TransactionsArtifact, null, 2)
  );
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
