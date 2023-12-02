const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');


describe("AirDrop", function () {
  const TOKENS_IN_POOL = 1000000000
  const REWARD_AMOUNT = 500
  let addrs
  let airDrop;
  let contractBlocknumber;
  let tokenSaleInstance;
  let tokenInstance;
  let tokenPrice = 1000000000000000000n; // in wei
  let admin;
  let buyer;
  let tokensAvailable = 1000000000;
  let numberOfTokens = 10n;

  const blockNumberCutoff = 11 // Any account that used ethSwap before or including this blocknumber are eligible for airdrop.
  before(async function () {
    // Create an array that shuffles the numbers 0 through 19.
    // The elements of the array will represent the develeopment account number
    // and the index will represent the order in which that account will use ethSwap to buyTokens
    this.shuffle = []
    while (this.shuffle.length < 20) {
      let r = Math.floor(Math.random() * 20)
      if (this.shuffle.indexOf(r) === -1) {
        this.shuffle.push(r)
      }
    }

    const DappToken = await ethers.getContractFactory("DappToken");
    tokenInstance = await DappToken.deploy(1000000000);
    
    // Get all signers
    addrs = await ethers.getSigners();
    // Deploy eth swap
    const DappTokenSale = await ethers.getContractFactory('DappTokenSale');
    tokenSaleInstance = await DappTokenSale.deploy(tokenInstance.target, tokenPrice);
    await tokenInstance.transfer(tokenSaleInstance.target, tokensAvailable);

    const etherAmount = ethers.toBigInt(numberOfTokens) * ethers.toBigInt(tokenPrice);
    // Instantiate token
    contractBlocknumber = await ethers.provider.getBlockNumber();

    // Check that all 1 million tokens are in the pool
    expect(
      await tokenInstance.balanceOf(tokenSaleInstance.target)
    ).to.equal(TOKENS_IN_POOL);

    // Every development account buys Tokens from the ethSwap exchange in a random order
    await Promise.all(this.shuffle.map(async (i, indx) => {
    
      const receipt = await (await tokenSaleInstance.connect(addrs[i]).buyTokens(ethers.toBigInt(numberOfTokens), { value: etherAmount }));
      console.log('receipt.blockNumber:', receipt.blockNumber);
      console.log('Expected:', indx + 4);
  
      // Each account buys 10,000 tokens worth 10 eth
      expect(receipt.blockNumber).to.eq(indx + 4)
    }))

    // Query all tokensPruchases events between contract block number to block number cut off on the ethSwap contract 
    // to find out all the accounts that have interacted with it
    const filter = tokenSaleInstance.filters.Sell()
    const results = await tokenSaleInstance.queryFilter(filter, contractBlocknumber, blockNumberCutoff)
    console.log("blockNumberCutoff:", blockNumberCutoff);
console.log("contractBlocknumber:", contractBlocknumber);
    expect(results.length).to.eq(blockNumberCutoff - contractBlocknumber)

    // Get elligble addresses from events and then hash them to get leaf nodes
    leafNodes = results.map(i => keccak256(i.args.account))
    // Generate merkleTree from leafNodes
    merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    // Get root hash from merkle tree
    const rootHash = merkleTree.getRoot()

    // Deploy the Air Drop contract
    const AirDropFactory = await ethers.getContractFactory('AirDrop');
   
    airDrop = await AirDropFactory.deploy(tokenInstance.target, rootHash, REWARD_AMOUNT);
    console.log(airDrop.target);
  });

  it("Only eligible accounts should be able to claim airdrop", async function () {
    // Every eligible account claims their airdrop
    for (let i = 0; i < 20; i++) {
    
      const proof = merkleTree.getHexProof(keccak256(addrs[i].target))
      if (proof.length !== 0) {
        await airDrop.connect(addrs[i]).claim(proof)
        expect(await airDrop.balanceOf(addrs[i].target)).to.eq(REWARD_AMOUNT)
        // Fails when user tries to claim tokens again.
        await expect(airDrop.connect(addrs[i]).claim(proof)).to.be.revertedWith("Already claimed air drop")
      } else {
        await expect(airDrop.connect(addrs[i]).claim(proof)).to.be.revertedWith("Incorrect merkle proof")
        expect(await airDrop.balanceOf(addrs[i].target)).to.eq(0)
      }
    }
  });

  it("should allow a user to claim the AirDrop with a valid proof", async function () {
    const rewardAmount = 100;
    const leaf = keccak256(abi.encodePacked(recipient.target, rewardAmount));
    const elements = [leaf];
    const tree = new MerkleTree(elements, keccak256, { sortPairs: true });
    const proof = tree.getHexProof(leaf);

    // Ensure the user hasn't claimed before
    expect(await airDrop.claimed(recipient.target)).to.equal(false);

    // Attempt to claim the AirDrop
    await airDrop.connect(recipient).claim(proof, recipient.target, rewardAmount);

    // Ensure the user has now claimed
    expect(await airDrop.claimed(recipient.target)).to.equal(true);

    // Check the recipient's token balance after claiming
    const balance = await dappToken.balanceOf(recipient.target);
    expect(balance).to.equal(rewardAmount);
  });

  it("should not allow a user to claim the AirDrop twice", async function () {
    const rewardAmount = 100;
    const leaf = keccak256(abi.encodePacked(recipient.target, rewardAmount));
    const elements = [leaf];
    const tree = new MerkleTree(elements, keccak256, { sortPairs: true });
    const proof = tree.getHexProof(leaf);

    // Attempt to claim the AirDrop
    await airDrop.connect(recipient).claim(proof, recipient.target, rewardAmount);

    // Ensure the user has claimed
    expect(await airDrop.claimed(recipient.target)).to.equal(true);

    // Attempt to claim again
    await expect(airDrop.connect(recipient).claim(proof, recipient.target, rewardAmount)).to.be.revertedWith(
      "Already claimed AirDrop"
    );
  });

  it("should not allow claiming with an invalid proof", async function () {
    const invalidProof = ["0x789abc"]; // Replace with an invalid proof

    // Ensure the user hasn't claimed before
    expect(await airDrop.claimed(recipient.target)).to.equal(false);

    // Attempt to claim the AirDrop with an invalid proof
    await expect(
      airDrop.connect(recipient).claim(invalidProof, recipient.target, 100)
    ).to.be.revertedWith("Invalid proof");

    // Ensure the user still hasn't claimed
    expect(await airDrop.claimed(recipient.target)).to.equal(false);
  });
});
