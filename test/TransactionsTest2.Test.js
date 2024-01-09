const { expect } = require("chai");
const { ethers } = require("hardhat");
const { before } = require("mocha");
describe("TransactionsTest2", () => {
  let TransactionsContract;
  let FossaTokenContract;
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

    FossaTokenContract = await FossaToken.deploy(tokensAvailable); // Deploy your FossaToken contract with an initial supply
    TransactionsContract = await Transactions.deploy(
      FossaTokenContract.target,
      tokenPrice
    );
    FossaTokenContract.transfer(TransactionsContract.target, amount);
  });

  it("Test sprzedaży ", async () => {
    // Add balance verification, etc. according to your contract's logic and structure
    const transaction = await TransactionsContract
      .connect(buyer)
      .purchase(numberOfTokens, { value: tokenPrice * numberOfTokens });

    const tokensSold = await TransactionsContract.purchased();
    expect(tokensSold).to.equal(numberOfTokens);

    const amount = await TransactionsContract.purchased();
    expect(amount).to.equal(numberOfTokens);

    const balance = await FossaTokenContract.balanceOf(await buyer.getAddress());
    expect(balance).to.equal(numberOfTokens);
  });

  it("Test sprawdza poprawność przesłanych wartości", async function () {
    // Approve the YourTokenSaleContract to spend tokens on behalf of the buyer
    await FossaTokenContract
      .connect(owner)
      .approve(TransactionsContract.target, numberOfTokens);

    const initialBuyerBalance = await FossaTokenContract.balanceOf(buyer.address);
    //console.log(initialBuyerBalance);

    const initialContractBalance = await FossaTokenContract.balanceOf(
      TransactionsContract.target
    );
   // console.log(initialContractBalance);

    await TransactionsContract.connect(owner).swap(numberOfTokens);

    const finalBuyerBalance = await FossaTokenContract.balanceOf(buyer.address);
    const finalContractBalance = await FossaTokenContract.balanceOf(
      TransactionsContract.target
    );

    // Check that the ether was transferred to the buyer
    expect(initialBuyerBalance).to.be.equal(finalBuyerBalance);

    // Check that the tokens were transferred to the contract
    const contractTokenBalance = await FossaTokenContract.balanceOf(
      TransactionsContract.target
    );
    expect(contractTokenBalance).to.be.above(numberOfTokens);

    // Check that the ether was transferred to the contract
    const expectedContractBalance = initialContractBalance + numberOfTokens;
    expect(finalContractBalance).to.equal(expectedContractBalance);
  });

  it("Test sprawdza poprawność transakcji", async () => {
    const transaction = await TransactionsContract
      .connect(buyer)
      .purchase(numberOfTokens, { value: numberOfTokens * tokenPrice });
    const receipt = await transaction.wait();

    expect(receipt.logs.length).to.equal(2);

  });

  it("Test sprawdza czy sprzedaż istnieje", async () => {
    await expect(TransactionsContract.connect(buyer).end()).to.be.revertedWith(
      "Only the admin can call this function"
    );

    const adminBalance = await FossaTokenContract.balanceOf(
      await owner.getAddress()
    );

    expect(adminBalance).to.be.lessThanOrEqual(tokensAvailable);
    const newPrice = await TransactionsContract.price();
    expect(newPrice).to.equal(tokenPrice);
  });
});
