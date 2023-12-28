const { expect } = require("chai");
const { ethers } = require("hardhat");
const { abi } = require('ethers'); 
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

    const filter = tokenSaleInstance.filters.Buy();
    const results = await tokenSaleInstance.queryFilter(filter, contractBlocknumber, blockNumberCutoff);
    console.log("blockNumberCutoff:", blockNumberCutoff);
    console.log("contractBlocknumber:", contractBlocknumber);
    expect(results.length).to.eq(blockNumberCutoff - contractBlocknumber);
    //console.log('results: ',results)
    const leafBuffer = await results.map(i => keccak256(i.args[0]));
    //console.log("Leafs:", leafBuffer);
    const leafNodes = await leafBuffer.map(buffer => '0x' + buffer.toString('hex'));
    console.log("LeafNodes:", leafNodes);
    merkleTree = await new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const rootHash = merkleTree.getRoot();
    console.log("Merkle Root:", rootHash);

    const AirDropFactory = await ethers.getContractFactory('AirDrop');
    airDrop = await AirDropFactory.deploy(tokenInstance.target, rootHash, REWARD_AMOUNT);
  });

  it("Only eligible accounts should be able to claim airdrop", async function () {
    for (let i = 0; i < 20; i++) {
      console.log('i', i)
      console.log(addrs[i].address)
      const proof = await merkleTree.getHexProof(keccak256(addrs[i].address));
      console.log("Proof:", proof);
      if (proof.length !== 0) {
        await airDrop.claim(proof,addrs[i].address); // Pass addrs[i].target as the recipient address
        expect(await airDrop.balanceOf(addrs[i].address)).to.eq(REWARD_AMOUNT);
        await expect(airDrop.connect(addrs[i]).claim(proof)).to.be.revertedWith("Already claimed air drop");
      } else {
       
        await expect(airDrop.connect(addrs[i]).claim(proof,  addrs[i].getAddress())).to.be.revertedWith("Invalid Merkle proof");
       //expect(await airDrop.balanceOf(addrs[i].getAddress())).to.eq(0);
    }
    
    }
   // expect(await airDrop.claim(recipient)).to.equal(false);
  });
});