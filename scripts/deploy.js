const { ethers} = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require('merkletreejs');
const path = require("path");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    console.log("Deploying the contracts with the account:", address);

    const DappToken = await ethers.getContractFactory("DappToken");
    const dappToken = await DappToken.deploy(1000)
    await dappToken.waitForDeployment()
    console.log("Token address:", dappToken.target);

    const tokenPrice = ethers.parseEther("1"); // Convert 1 Ether to Wei

    const DappTokenSale = await ethers.getContractFactory("DappTokenSale");
    const dappTokenSale = await DappTokenSale.deploy(dappToken.target, tokenPrice);
    await dappTokenSale.waitForDeployment()
    console.log("DappTokenSale address:", dappTokenSale.target);
   // console.log("DappTokenSale token price:", dappTokenSale);
    const Transactions = await ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy(dappToken.target);
    await transactions.waitForDeployment()
    console.log("Transactions address:", transactions.target);
    // AirDrop deploy
   // contractBlocknumber = await ethers.provider.getBlockNumber();
    //blockNumberEnd= 40;
   // const filter = dappTokenSale.filters.Buy();
   // const results = await dappTokenSale.queryFilter(filter, contractBlocknumber, blockNumberEnd);
   // console.log("blockNumberCutoff:", blockNumberEnd);
   // console.log("contractBlocknumber:", contractBlocknumber);
    const signers = await ethers.getSigners();
    const signersAddresses = await signers.map((s) => s.address);
   // console.log('results: ',results)
    //console.log(signers)
    const leafBuffer = await signersAddresses.map(x => keccak256(x));
    console.log("Leafs:", leafBuffer);
    const leafNodes = await leafBuffer.map(buffer => '0x' + buffer.toString('hex'));
    console.log("LeafNodes:", leafNodes);
    const merkleTree = await new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const root = merkleTree.getHexRoot();
    console.log("Merkle Root:", root);
    const rewardAmount= 500;
    const AirDrop = await ethers.getContractFactory("AirDrop");
    const airDrop = await AirDrop.deploy(dappToken.target, root, rewardAmount);
    await airDrop.waitForDeployment()
    console.log("AirDrop address:", airDrop.target);
    //Token transfer to sale contract
    await dappToken.transfer(dappTokenSale.target, '1000');

    saveClientFiles(dappToken, dappTokenSale, transactions, airDrop);

    const indexedAddresses = {}
    signers.map((s, index) => indexedAddresses[index] = s.address);

  const serializedAddresses = JSON.stringify(indexedAddresses);

  fs.writeFileSync("client/src/contracts/wallet-address.json", serializedAddresses);

}

function saveClientFiles(dappToken, dappTokenSale, transactions, airDrop) {
    const contractsDir = path.join(__dirname, "..", "client", "src", "contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    const contractAddresses = {
        DappToken: dappToken.target,
        DappTokenSale: dappTokenSale.target,
        Transactions: transactions.target,
        AirDrop: airDrop.target,
    };

    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify(contractAddresses,  undefined, 2)
    );

    const DappTokenArtifact = artifacts.readArtifactSync("DappToken");
    const DappTokenSaleArtifact = artifacts.readArtifactSync("DappTokenSale");
    const TransactionsArtifact = artifacts.readArtifactSync("Transactions");
    const AirDropArtifact = artifacts.readArtifactSync("AirDrop");

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
     fs.writeFileSync(
         path.join(contractsDir, "AirDrop.json"),
         JSON.stringify(AirDropArtifact, null, 2)
     );
}


  
 
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
