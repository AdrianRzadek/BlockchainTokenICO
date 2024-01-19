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

    FossaTokenContract = await FossaToken.deploy(Available); // Zaopatrzenie kontraktu w tokeny
    TransactionsContract = await Transactions.deploy(
      FossaTokenContract.target,
      Price
    );
    FossaTokenContract.transfer(TransactionsContract.target, amount);
  });

  it("Test sprawdza kupno tokenów przez użytkownika ", async () => {
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
    await FossaTokenContract.connect(buyer).approve(
      TransactionsContract.target,
      TokensAmount
    );

    const initialBuyerBalance = await FossaTokenContract.balanceOf(
      buyer.address
    );

    const initialContractBalance = await FossaTokenContract.balanceOf(
      TransactionsContract.target
    );

    await TransactionsContract.connect(buyer).swap(TokensAmount);

    const finalBuyerBalance = await FossaTokenContract.balanceOf(buyer.address);
    const finalContractBalance = await FossaTokenContract.balanceOf(
      TransactionsContract.target
    );

    // Sprawdza czy tokeny zostały wysłane
    expect(initialBuyerBalance).to.be.equal(TokensAmount);
    expect(finalBuyerBalance).to.be.lessThan(initialBuyerBalance);

    const contractTokenBalance = await FossaTokenContract.balanceOf(
      TransactionsContract.target
    );
    //Sprawdza czy kontrakt otrzymał Ether
    expect(contractTokenBalance).to.be.above(TokensAmount);
    const expectedContractBalance = initialContractBalance + TokensAmount;
    expect(finalContractBalance).to.equal(expectedContractBalance);
  });

  it("Test sprawdza czy sprzedaż istnieje", async () => {
    const ownerBalance = await FossaTokenContract.balanceOf(
      await owner.getAddress()
    );
    const icoState = await TransactionsContract.icoState();

    expect(icoState).to.equal(0);
    expect(ownerBalance).to.be.lessThanOrEqual(Available);
  });
});
