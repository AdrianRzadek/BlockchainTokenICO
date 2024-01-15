const { expect } = require("chai");
const { ethers } = require("hardhat");
const { before } = require("mocha");
describe("TransactionsTest2", () => {
  let TransactionsContract;
  let FossaTokenContract;
  let Price = 1n; // wei
  let owner;
  let buyer;
  let accounts;
  let Available = 10000000n;
  let amount = 10000n;
  let TokensAmount = 1000n;

  before(async () => {
    accounts = await ethers.getSigners();
    [owner, buyer] = accounts;
    const FossaToken = await ethers.getContractFactory("FossaToken");
    const Transactions = await ethers.getContractFactory("Transactions");

    FossaTokenContract = await FossaToken.deploy(Available); // Deploy your FossaToken contract with an initial supply
    TransactionsContract = await Transactions.deploy(
      FossaTokenContract.target,
      Price
    );
    FossaTokenContract.transfer(TransactionsContract.target, amount);
  });

  it("Test sprawdza kupno tokenów przez użytkownika ", async () => {
    // Add balance verification, etc. according to your contract's logic and structure
    await TransactionsContract.connect(buyer).purchase(TokensAmount, {
      value: Price * TokensAmount,
    });

    const tokensSold = await TransactionsContract.purchased();
    expect(tokensSold).to.equal(TokensAmount);

    const amount = await TransactionsContract.purchased();
    expect(amount).to.equal(TokensAmount);

    const balance = await FossaTokenContract.balanceOf(
      await buyer.getAddress()
    );
    expect(balance).to.equal(TokensAmount);
  });

  it("Test sprawdza sprzedaż tokenów przez użytkownika", async function () {
    // Approve the YourTokenSaleContract to spend tokens on behalf of the buyer
    await FossaTokenContract.connect(buyer).approve(
      TransactionsContract.target,
      TokensAmount
    );

    const initialBuyerBalance = await FossaTokenContract.balanceOf(
      buyer.address
    );
    //console.log(initialBuyerBalance);

    const initialContractBalance = await FossaTokenContract.balanceOf(
      TransactionsContract.target
    );
    // console.log(initialContractBalance);

    await TransactionsContract.connect(buyer).swap(TokensAmount);

    const finalBuyerBalance = await FossaTokenContract.balanceOf(buyer.address);
    const finalContractBalance = await FossaTokenContract.balanceOf(
      TransactionsContract.target
    );

    // Check that the ether was transferred to the buyer
    expect(initialBuyerBalance).to.be.equal(TokensAmount);
    expect(finalBuyerBalance).to.be.lessThan(initialBuyerBalance);
    // Check that the tokens were transferred to the contract
    const contractTokenBalance = await FossaTokenContract.balanceOf(
      TransactionsContract.target
    );
    expect(contractTokenBalance).to.be.above(TokensAmount);

    // Check that the ether was transferred to the contract
    const expectedContractBalance = initialContractBalance + TokensAmount;
    expect(finalContractBalance).to.equal(expectedContractBalance);
  });

  it("Test sprawdza czy sprzedaż istnieje", async () => {
    await expect(TransactionsContract.connect(buyer).end()).to.be.revertedWith(
      "Only the admin can call this function"
    );

    const ownerBalance = await FossaTokenContract.balanceOf(
      await owner.getAddress()
    );

    expect(ownerBalance).to.be.lessThanOrEqual(Available);
  });
});
