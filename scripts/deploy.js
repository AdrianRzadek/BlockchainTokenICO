const { ethers, artifacts } = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  console.log("Deploying the contracts with the account:", address);

  const FossaToken = await ethers.getContractFactory("FossaToken");
  const fossaToken = await FossaToken.deploy(1000);
  await fossaToken.waitForDeployment();
  console.log("Token address:", fossaToken.target);

  //Ustawia cenę tokena
  const tokenPrice = ethers.parseEther("1"); // Convert 1 Ether to Wei

  const Transactions = await ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy(fossaToken.target, tokenPrice);
  await transactions.waitForDeployment();
  console.log("Transactions address:", transactions.target);

  //Token transfer to sale contract
  await fossaToken.transfer(transactions.target, "1000");

  const Transfers = await ethers.getContractFactory("Transfers");
  const transfers = await Transfers.deploy(fossaToken.target);
  await transfers.waitForDeployment();
  console.log("Transfers address:", transfers.target);

  saveClientFiles(fossaToken, transactions, transfers);

  const signers = await ethers.getSigners();

  const indexedAddresses = {};
  signers.map((s, index) => (indexedAddresses[index] = s.address));

  const serializedAddresses = JSON.stringify(indexedAddresses);

  fs.writeFileSync("src/contracts/wallet-address.json", serializedAddresses);
}

function saveClientFiles(fossaToken, transactions, transfers) {
  const contractsDir = path.join(__dirname, "..", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const contractAddresses = {
    FossaToken: fossaToken.target,
    Transactions: transactions.target,
    Transfers: transfers.target,
  };

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(contractAddresses, undefined, 2)
  );

  const FossaTokenArtifact = artifacts.readArtifactSync("FossaToken");
  const TransactionsArtifact = artifacts.readArtifactSync("Transactions");
  const TransfersArtifact = artifacts.readArtifactSync("Transfers");

  fs.writeFileSync(
    path.join(contractsDir, "FossaToken.json"),
    JSON.stringify(FossaTokenArtifact, null, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "Transactions.json"),
    JSON.stringify(TransactionsArtifact, null, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "Transfers.json"),
    JSON.stringify(TransfersArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
