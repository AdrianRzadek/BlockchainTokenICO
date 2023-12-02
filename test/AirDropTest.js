const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

describe("AirDrop", function () {
  const TOKENS_IN_POOL = 1000000000;
  const REWARD_AMOUNT = 500;
  let addrs;
  let airDrop;
  let contractBlocknumber;
  let tokenSaleInstance;
  let tokenInstance;
  let tokenPrice = 1000000000000000000n; // in wei
  let admin;
  let buyer;
  let tokensAvailable = 1000000000;
  let numberOfTokens = 10n;
  let merkleTree; // Declare merkleTree at the suite level

  const blockNumberCutoff = 11;

  before(async function () {
    this.shuffle = [];
    while (this.shuffle.length < 20) {
      let r = Math.floor(Math.random() * 20);
      if (this.shuffle.indexOf(r) === -1) {
        this.shuffle.push(r);
      }
    }

    const DappToken = await ethers.getContractFactory("DappToken");
    tokenInstance = await DappToken.deploy(1000000000);

    addrs = await ethers.getSigners();

    const DappTokenSale = await ethers.getContractFactory('DappTokenSale');
    tokenSaleInstance = await DappTokenSale.deploy(tokenInstance.target, tokenPrice);
    await tokenInstance.transfer(tokenSaleInstance.target, tokensAvailable);

    const etherAmount = ethers.toBigInt(numberOfTokens) * ethers.toBigInt(tokenPrice);

    contractBlocknumber = await ethers.provider.getBlockNumber();

    expect(await tokenInstance.balanceOf(tokenSaleInstance.target)).to.equal(TOKENS_IN_POOL);

    await Promise.all(this.shuffle.map(async (i, indx) => {
      const receipt = await (await tokenSaleInstance.connect(addrs[i]).buyTokens(ethers.toBigInt(numberOfTokens), { value: etherAmount }));
      console.log('receipt.blockNumber:', receipt.blockNumber);
      console.log('Expected:', indx + 4);
      expect(receipt.blockNumber).to.eq(indx + 4);
    }));

    const filter = tokenSaleInstance.filters.Sell();
    const results = await tokenSaleInstance.queryFilter(filter, contractBlocknumber, blockNumberCutoff);
    console.log("blockNumberCutoff:", blockNumberCutoff);
    console.log("contractBlocknumber:", contractBlocknumber);
    expect(results.length).to.eq(blockNumberCutoff - contractBlocknumber);

    const leafs = results.map(i => keccak256(i.args.account));
    console.log("Leaf Nodes:", leafs);
    const leafNodes = leafs.map(buffer => '0x' + buffer.toString('hex'));

    merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const rootHash = merkleTree.getRoot();
    console.log("Merkle Root:", rootHash);

    const AirDropFactory = await ethers.getContractFactory('AirDrop');
    airDrop = await AirDropFactory.deploy(tokenInstance.target, rootHash, REWARD_AMOUNT);
  });

  it("Only eligible accounts should be able to claim airdrop", async function () {
    for (let i = 0; i < 20; i++) {
      const addressHash = keccak256(addrs[i].target);
      console.log("Address Hash:", addressHash);
      const proof = merkleTree.getHexProof(addressHash);
      console.log("Proof:", proof);
      if (proof.length !== 0) {
        await airDrop.connect(addrs[i]).claim(proof, addrs[i]);
        expect(await airDrop.balanceOf(addrs[i].target)).to.eq(REWARD_AMOUNT);
        await expect(airDrop.connect(addrs[i]).claim(proof)).to.be.revertedWith("Already claimed air drop");
      } else {
        await expect(airDrop.connect(addrs[i]).claim(proof)).to.be.revertedWith("Incorrect merkle proof");
        expect(await airDrop.balanceOf(addrs[i].target)).to.eq(0);
      }
    }
  });

  it("should allow a user to claim the AirDrop with a valid proof", async function () {
    const recipient = addrs[0]; // replace with the actual recipient
    const rewardAmount = 100;
    const leaf = keccak256(abi.encodePacked(recipient.target, rewardAmount));
    const elements = [leaf];
    const tree = new MerkleTree(elements, keccak256, { sortPairs: true });
    const proof = tree.getHexProof(leaf);

    expect(await airDrop.claimed(recipient.target)).to.equal(false);
    await airDrop.connect(recipient).claim(proof, recipient.target, rewardAmount);
    expect(await airDrop.claimed(recipient.target)).to.equal(true);

    const balance = await tokenInstance.balanceOf(recipient.target);
    expect(balance).to.equal(rewardAmount);
  });

  it("should not allow a user to claim the AirDrop twice", async function () {
    const recipient = addrs[1]; // replace with the actual recipient
    const rewardAmount = 100;
    const leaf = keccak256(abi.encodePacked(recipient.target, rewardAmount));
    const elements = [leaf];
    const tree = new MerkleTree(elements, keccak256, { sortPairs: true });
    const proof = tree.getHexProof(leaf);

    await airDrop.connect(recipient).claim(proof, recipient.target, rewardAmount);
    expect(await airDrop.claimed(recipient.target)).to.equal(true);

    await expect(airDrop.connect(recipient).claim(proof, recipient.target, rewardAmount)).to.be.revertedWith(
      "Already claimed AirDrop"
    );
  });

  it("should not allow claiming with an invalid proof", async function () {
    const recipient = addrs[2]; // replace with the actual recipient
    const invalidProof = ["0x789abc"]; // Replace with an invalid proof

    expect(await airDrop.claimed(recipient.target)).to.equal(false);

    await expect(
      airDrop.connect(recipient).claim(invalidProof, recipient.target, 100)
    ).to.be.revertedWith("Invalid proof");

    expect(await airDrop.claimed(recipient.target)).to.equal(false);
  });
});
