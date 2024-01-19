const { expect } = require("chai");
const { ethers } = require("hardhat");
const { before } = require("mocha");
describe("TransactionsTest1", () => {
  let TransactionsContract;
  let FossaTokenContract;
  let Price = 1000000000000000000n; // in wei
  let owner;
  let buyer;
  let user;
  let accounts;
  let Available = 1000000;
  let TokensAmount = 10n;

  before(async () => {
    accounts = await ethers.getSigners();
    [owner, buyer, user] = accounts;
    const FossaToken = await ethers.getContractFactory("FossaToken");
    const Transactions = await ethers.getContractFactory("Transactions");

    FossaTokenContract = await FossaToken.deploy(Available); // Zaopatrzenie kontraktu w tokeny
    TransactionsContract = await Transactions.deploy(
      FossaTokenContract.target,
      Price
    );
  });

  it("Test sprawdza poprawność danych", async () => {
    const price = await TransactionsContract.price();
    const address = await TransactionsContract.address;
    const tokenContract = await TransactionsContract.tokenContract();

    expect(price).to.equal(Price);
    expect(address).to.not.equal(ethers.ZeroAddress);
    expect(tokenContract).to.not.equal(ethers.ZeroAddress);
  });

  it("Test sprawdza czy użytkownik może kupić tokeny", async () => {
    const initialOwnerBalance = await FossaTokenContract.balanceOf(
      await owner.getAddress()
    );
    const initialBuyerBalance = await FossaTokenContract.balanceOf(
      await buyer.getAddress()
    );

    // Transfer tokenów na kontrakt transakcji
    await FossaTokenContract.transfer(TransactionsContract.target, Available);

    const etherAmount = ethers.toBigInt(TokensAmount) * ethers.toBigInt(Price);
    await TransactionsContract.connect(buyer).purchase(
      ethers.toBigInt(TokensAmount),
      { value: etherAmount }
    );

    // Sprawdza czy kupujący otrzymał tokeny
    const finalOwnerBalance = await FossaTokenContract.balanceOf(
      await TransactionsContract.target
    );
    const finalBuyerBalance = await FossaTokenContract.balanceOf(
      await buyer.getAddress()
    );
    const tokensSold = await TransactionsContract.purchased();

    expect(finalOwnerBalance).to.equal(initialOwnerBalance - TokensAmount);
    expect(finalBuyerBalance).to.equal(initialBuyerBalance + TokensAmount);
    expect(tokensSold).to.equal(TokensAmount);
    await expect(
      TransactionsContract.connect(buyer).purchase(TokensAmount, { value: 1 })
    ).to.be.reverted;
  });
  it("Test sprawdza poprawność przeprowadzenia transferu", async () => {
    await FossaTokenContract.connect(buyer).approve(
      TransactionsContract.target,
      TokensAmount
    );
    await TransactionsContract.connect(buyer).transfer(user, TokensAmount, {
      value: TokensAmount * Price,
    });
    const userBalance = await FossaTokenContract.balanceOf(
      await user.getAddress()
    );
    expect(userBalance).to.equal(TokensAmount);
  });
});
