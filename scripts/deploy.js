const { ethers} = require("hardhat");
// const keccak256 = require("keccak256");
// const { MerkleTree } = require('merkletreejs');
const path = require("path");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    console.log("Deploying the contracts with the account:", address);

    const FossaToken = await ethers.getContractFactory("FossaToken");
    const fossaToken = await FossaToken.deploy(1000)
    await fossaToken.waitForDeployment()
    console.log("Token address:", fossaToken.target);

    const tokenPrice = ethers.parseEther("1"); // Convert 1 Ether to Wei

    const Transactions = await ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy(fossaToken.target, tokenPrice);
    await transactions.waitForDeployment()
    console.log("Transactions address:", transactions.target);
   // console.log("Transactions token price:", transactions);
    const Transfers = await ethers.getContractFactory("Transfers");
    const transfers = await Transfers.deploy(fossaToken.target);
    await transfers.waitForDeployment()
    console.log("Transfers address:", transfers.target);
    // AirDrop deploy
   // contractBlocknumber = await ethers.provider.getBlockNumber();
    //blockNumberEnd= 40;
   // const filter = transactions.filters.Buy();
   // const results = await transactions.queryFilter(filter, contractBlocknumber, blockNumberEnd);
   // console.log("blockNumberCutoff:", blockNumberEnd);
   // console.log("contractBlocknumber:", contractBlocknumber);
//     const signers = await ethers.getSigners();
//     const signersAddresses = await signers.map((s) => s.address);
//    // console.log('results: ',results)
//     //console.log(signers)
//     const leafBuffer = await signersAddresses.map(x => keccak256(x));
//     console.log("Leafs:", leafBuffer);
//     const leafNodes = await leafBuffer.map(buffer => '0x' + buffer.toString('hex'));
//     console.log("LeafNodes:", leafNodes);
//     const merkleTree = await new MerkleTree(leafNodes, keccak256, { sortPairs: true });
//     const root = merkleTree.getHexRoot();
//     console.log("Merkle Root:", root);
//     const rewardAmount= 500;
//     const AirDrop = await ethers.getContractFactory("AirDrop");
//     const airDrop = await AirDrop.deploy(fossaToken.target, root, rewardAmount);
//     await airDrop.waitForDeployment()
//     console.log("AirDrop address:", airDrop.target);
    //Token transfer to sale contract
    await fossaToken.transfer(transactions.target, '1000');

    saveClientFiles(fossaToken, transactions, transfers);

//     const indexedAddresses = {}
//     signers.map((s, index) => indexedAddresses[index] = s.address);

//   const serializedAddresses = JSON.stringify(indexedAddresses);

//   fs.writeFileSync("src/contracts/wallet-address.json", serializedAddresses);

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
       // AirDrop: airDrop.target,
    };

    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify(contractAddresses,  undefined, 2)
    );

    const FossaTokenArtifact = artifacts.readArtifactSync("FossaToken");
    const TransactionsArtifact = artifacts.readArtifactSync("Transactions");
    const TransfersArtifact = artifacts.readArtifactSync("Transfers");
    //const AirDropArtifact = artifacts.readArtifactSync("AirDrop");

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
    //  fs.writeFileSync(
    //      path.join(contractsDir, "AirDrop.json"),
    //      JSON.stringify(AirDropArtifact, null, 2)
    //  );
}


  
 
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
