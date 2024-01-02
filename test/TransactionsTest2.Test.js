const { expect } = require("chai");
const { ethers } = require("hardhat");
const { before } = require("mocha");
describe("TransactionsTest2", () => {
  let tokenSaleInstance;
  let tokenInstance;
  let tokenPrice = 1n; // in wei
  let owner;
  let buyer;
  let accounts;
  let tokensAvailable = 10000000n;
  let amount = 10000n;
  let numberOfTokens = 1000n;

  before(async () => {
    accounts = await ethers.getSigners();
    [owner, buyer] = accounts;
    const FossaToken = await ethers.getContractFactory("FossaToken");
    const Transactions = await ethers.getContractFactory("Transactions");

    tokenInstance = await FossaToken.deploy(tokensAvailable); // Deploy your FossaToken contract with an initial supply
    tokenSaleInstance = await Transactions.deploy(
      tokenInstance.target,
      tokenPrice
    );
    tokenInstance.transfer(tokenSaleInstance.target, amount);
  });

  it("Should allow users to purchase tokens", async () => {
    // Add balance verification, etc. according to your contract's logic and structure
    const transaction = await tokenSaleInstance
      .connect(buyer)
      .buyTokens(numberOfTokens, { value: tokenPrice * numberOfTokens });

    const tokensSold = await tokenSaleInstance.tokensSold();
    expect(tokensSold).to.equal(numberOfTokens);

    const amount = await tokenSaleInstance.tokensSold();
    expect(amount).to.equal(numberOfTokens);

    const balance = await tokenInstance.balanceOf(await buyer.getAddress());
    expect(balance).to.equal(numberOfTokens);
  });

  it("should sell tokens and transfer ether to the buyer", async function () {
    // Approve the YourTokenSaleContract to spend tokens on behalf of the buyer
    await tokenInstance
      .connect(owner)
      .approve(tokenSaleInstance.target, numberOfTokens);

    const initialBuyerBalance = await tokenInstance.balanceOf(buyer.address);
    console.log(initialBuyerBalance);

    const initialContractBalance = await tokenInstance.balanceOf(
      tokenSaleInstance.target
    );
    console.log(initialContractBalance);

    await tokenSaleInstance.connect(owner).sellTokens(numberOfTokens);

    const finalBuyerBalance = await tokenInstance.balanceOf(buyer.address);
    const finalContractBalance = await tokenInstance.balanceOf(
      tokenSaleInstance.target
    );

    // Check that the ether was transferred to the buyer
    expect(initialBuyerBalance).to.be.equal(finalBuyerBalance);

    // Check that the tokens were transferred to the contract
    const contractTokenBalance = await tokenInstance.balanceOf(
      tokenSaleInstance.target
    );
    expect(contractTokenBalance).to.be.above(numberOfTokens);

    // Check that the ether was transferred to the contract
    const expectedContractBalance = initialContractBalance + numberOfTokens;
    expect(finalContractBalance).to.equal(expectedContractBalance);
  });

  it("facilitates token buying", async () => {
    const transaction = await tokenSaleInstance
      .connect(buyer)
      .buyTokens(numberOfTokens, { value: numberOfTokens * tokenPrice });
    const receipt = await transaction.wait();

    expect(receipt.logs.length).to.equal(2);

  });

  it("ends token sale", async () => {
    await expect(tokenSaleInstance.connect(buyer).endSale()).to.be.revertedWith(
      "Only the admin can call this function"
    );

    const adminBalance = await tokenInstance.balanceOf(
      await owner.getAddress()
    );

    expect(adminBalance).to.be.lessThanOrEqual(tokensAvailable);
    const newPrice = await tokenSaleInstance.tokenPrice();
    expect(newPrice).to.equal(tokenPrice);
  });
});
