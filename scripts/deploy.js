const { ethers} = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    console.log("Deploying the contracts with the account:", address);

    const DappToken = await ethers.getContractFactory("DappToken");
    const dappToken = await DappToken.deploy(1000000)
    await dappToken.waitForDeployment()
    console.log("Token address:", dappToken.target);

    const tokenPrice = ethers.parseEther("1"); // Convert 1 Ether to Wei

    const DappTokenSale = await ethers.getContractFactory("DappTokenSale");
    const dappTokenSale = await DappTokenSale.deploy(dappToken.target, tokenPrice);
    await dappTokenSale.waitForDeployment()
    console.log("DappTokenSale address:", dappTokenSale.target);
   // console.log("DappTokenSale token price:", dappTokenSale);
    const Transactions = await ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy();
    await transactions.waitForDeployment()
    console.log("Transactions address:", transactions.target);

    await dappToken.transfer(dappTokenSale.target, '1000000');

    saveClientFiles(dappToken, dappTokenSale, transactions);
}

function saveClientFiles(dappToken, dappTokenSale, transactions) {
    const contractsDir = path.join(__dirname, "..", "client", "src", "contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    const contractAddresses = {
        DappToken: dappToken.target,
        DappTokenSale: dappTokenSale.target,
        Transactions: transactions.target,
    };

    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify(contractAddresses,  undefined, 2)
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
