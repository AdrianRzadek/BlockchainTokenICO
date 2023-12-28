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

    const DappTokenSale = await ethers.getContractFactory('DappTokenSale');
    tokenSaleInstance = await DappTokenSale.deploy(tokenInstance.target, tokenPrice);
    await tokenInstance.transfer(tokenSaleInstance.target, tokensAvailable);

    const etherAmount = ethers.toBigInt(numberOfTokens) * ethers.toBigInt(tokenPrice);

    contractBlocknumber = await ethers.provider.getBlockNumber();

    expect(await tokenInstance.balanceOf(tokenSaleInstance.target)).to.equal(TOKENS_IN_POOL);
   
    addrs = await ethers.getSigners();
    await Promise.all(this.shuffle.map(async (i, indx) => {
      const receipt = await (await tokenSaleInstance.connect(addrs[i]).buyTokens(ethers.toBigInt(numberOfTokens), { value: etherAmount }));
     // console.log('receipt.blockNumber:', receipt.blockNumber);
     // console.log('Expected:', indx + 4);
      expect(receipt.blockNumber).to.eq(indx + 4);
    }));

    const filter = tokenSaleInstance.filters.Buy();
    const results = await tokenSaleInstance.queryFilter(filter, contractBlocknumber, blockNumberCutoff);
  //  console.log("blockNumberCutoff:", blockNumberCutoff);
 //   console.log("contractBlocknumber:", contractBlocknumber);
    expect(results.length).to.eq(blockNumberCutoff - contractBlocknumber);

   
    const leaves = results.map(i => keccak256(i.args.account));
    console.log("Leaves:", leaves);
    const leafNodes = leaves.map(buffer => '0x' + buffer.toString('hex'));
    console.log("Leaf Nodes:", leafNodes);
    const  merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const rootHash = merkleTree.getRoot();
    console.log("Merkle Root:", rootHash);
  
    const AirDropFactory = await ethers.getContractFactory('AirDrop');
    airDrop = await AirDropFactory.deploy(tokenInstance.target, rootHash, REWARD_AMOUNT);
    
    for (let i = 0; i <20; i++) {
     console.log("i:", i)
      const addressToHash = await addrs[i].getAddress();
      console.log("Address Hash:", addressToHash);
      const leaf = keccak256(addressToHash);
      console.log("Leaf:", leaf)
      merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
      const proof = merkleTree.getProof(leaf);
      console.log("Proof:", proof)
    }
  
  });

  it("Only eligible accounts should be able to claim airdrop", async function () {
    for (let i = 0; i <20; i++) {
      console.log("i:", i)
      const addressToHash = await addrs[i].getAddress();
      console.log("Address Hash:", addressToHash);
      const leaf = keccak256(addressToHash);
      console.log("Leaf:", leaf)
      const proof = merkleTree.getHexProof(leaf);
      console.log("Proof:", proof)
      if (proof.length !== 0) {
        await airDrop.connect(addrs[i]).claim(proof, addrs[i]);
        expect(await airDrop.claimed(addrs[i].address)).to.equal(true);
        await expect(airDrop.connect(addrs[i]).claim(proof, addrs[i])).to.be.revertedWith("Already claimed AirDrop");
      } else {
        await expect(airDrop.connect(addrs[i]).claim(proof, addrs[i])).to.be.revertedWith("Invalid Merkle proof");
    
       //expect(await airDrop.balanceOf(addrs[i].getAddress())).to.eq(0);
    }
    expect(await airDrop.claim(addrs[i].address)).to.equal(false);
    }
  
  });

  // it("should allow a user to claim the AirDrop with a valid proof", async function () {
  //   const recipient = await addrs[0].getAddress();
  //   console.log('recipient:',recipient) // replace with the actual recipient
  //   const rewardAmount = 100;
  //   const leaf = keccak256(recipient, rewardAmount);
  //   const leaves = [leaf];
  //   console.log('leaves: ',leaves);
  //   const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  //   console.log('tree', tree)
  //   const proof = tree.getHexProof(leaf);
  //  // console.log('proof:', proof);
  //   await airDrop.connect(addrs[0]).claim(proof, addrs[0]);
  //   console.log('check')
  //   expect(await airDrop.claimed(recipient)).to.equal(true);
  
  //   const balance = await tokenInstance.balanceOf(recipient);
  //   expect(balance).to.equal(rewardAmount);
  // });

  // it("should not allow a user to claim the AirDrop twice", async function () {
  //   const recipient = addrs[1]; // replace with the actual recipient
  //   const rewardAmount = 100;
  //   const leaf = keccak256(recipient.target, rewardAmount);
  //   const elements = [leaf];
  //   const tree = new MerkleTree(elements, keccak256, { sortPairs: true });
  //   const proof = tree.getHexProof(leaf);
  //   await airDrop.connect(addrs[1]).claim(proof,addrs[1]);
  //   expect(await airDrop.claimed(recipient)).to.equal(true);

  //   await expect(airDrop.connect(addrs[1]).claim(proof,addrs[1])).to.be.revertedWith("Already claimed AirDrop");
  // });
});