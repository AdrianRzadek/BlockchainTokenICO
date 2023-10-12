const { ethers, artifacts } = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    console.log("Deploying the contracts with the account:", address);

    const DappToken = await ethers.getContractFactory("DappToken");
    const dappToken = await DappToken.deploy();
   
    console.log("Token address:", dappToken.target);

    const tokenPrice = ethers.parseEther("1"); // Convert 1 Ether to Wei

    const DappTokenSale = await ethers.getContractFactory("DappTokenSale");
    const dappTokenSale = await DappTokenSale.deploy(address, tokenPrice);
   
    console.log("DappTokenSale address:", dappTokenSale.target);
   // console.log("DappTokenSale token price:", dappTokenSale);
    const Transactions = await ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy();

    console.log("Transactions address:", transactions.target);

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
        JSON.stringify(contractAddresses, null, 2)
    );

    const DappTokenArtifact = require("../artifacts/contracts/DappToken.sol/DappToken.json");
    const DappTokenSaleArtifact = require("../artifacts/contracts/DappTokenSale.sol/DappTokenSale.json");
    const TransactionsArtifact = require("../artifacts/contracts/Transactions.sol/Transactions.json");

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

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
