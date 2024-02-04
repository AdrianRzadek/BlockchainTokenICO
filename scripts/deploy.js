const { ethers, artifacts } = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  console.log("Wdrożene przez konto:", address);

  const ForsaToken = await ethers.getContractFactory("ForsaToken");
  const forsaToken = await ForsaToken.deploy(1000);
  await forsaToken.waitForDeployment();
  console.log("Token address:", forsaToken.target);

  //Ustawia cenę tokena
  const tokenPrice = ethers.parseEther("1"); // Zmienia 1 Ether na Wei

  const Transactions = await ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy(forsaToken.target, tokenPrice);
  await transactions.waitForDeployment();
  console.log("Transactions address:", transactions.target);

  //Token transfer do kontraktu transactions
  await forsaToken.transfer(transactions.target, "1000");



  saveClientFiles(forsaToken, transactions);

  const signers = await ethers.getSigners();

  const indexedAddresses = {};
  signers.map((s, index) => (indexedAddresses[index] = s.address));

  const serializedAddresses = JSON.stringify(indexedAddresses);

  fs.writeFileSync("src/contracts/wallet-address.json", serializedAddresses);
}

function saveClientFiles(forsaToken, transactions) {
  const contractsDir = path.join(__dirname, "..", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const contractAddresses = {
    ForsaToken: forsaToken.target,
    Transactions: transactions.target,
  };

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(contractAddresses, undefined, 2)
  );

  const ForsaTokenArtifact = artifacts.readArtifactSync("ForsaToken");
  const TransactionsArtifact = artifacts.readArtifactSync("Transactions");

  fs.writeFileSync(
    path.join(contractsDir, "ForsaToken.json"),
    JSON.stringify(ForsaTokenArtifact, null, 2)
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
