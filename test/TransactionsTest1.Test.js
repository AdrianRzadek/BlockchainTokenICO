const { expect } = require("chai");
const { ethers } = require("hardhat");
const {before} = require('mocha')
describe("TransactionsTest1", () => {
  let TransactionsContract;
  let FossaTokenContract;
  let tokenPrice = 1000000000000000000n; // in wei
  let admin;
  let buyer;
  let tokensAvailable = 1000000;
  let numberOfTokens = 10n;


  before(async () => {

    const [adminSigner, buyerSigner] = await ethers.getSigners();
    admin = adminSigner;
    buyer = buyerSigner;

    const FossaToken = await ethers.getContractFactory("FossaToken");
    const Transactions = await ethers.getContractFactory("Transactions");

    FossaTokenContract = await FossaToken.deploy(1000000); // Deploy your FossaToken contract with an initial supply
    TransactionsContract = await Transactions.deploy(FossaTokenContract.target, tokenPrice);
  });

  it("Test sprawdza czy użytkownik może kupić tokeny", async () => {
    const initialAdminBalance = await FossaTokenContract.balanceOf(await admin.getAddress());
    const initialBuyerBalance = await FossaTokenContract.balanceOf(await buyer.getAddress());
    
    //console.log("initial Admin Balance:", initialAdminBalance.toString());
    //console.log("initial Buyer Balance:", initialBuyerBalance.toString());
    // Transfer tokens to the token sale contract
    await FossaTokenContract.transfer(TransactionsContract.target, tokensAvailable);
    //sprawdzic w kodzie czy kontrakt ma dostepne tokeny????? !!!!!!!!!!!!!!!!!

    // Ensure that the buyer has enough Ether to purchase tokens
    const etherAmount = ethers.toBigInt(numberOfTokens) * ethers.toBigInt(tokenPrice);
    await TransactionsContract.connect(buyer).purchase(ethers.toBigInt(numberOfTokens), { value: etherAmount });

    // Check if the buyer received the tokens
    const finalAdminBalance = await FossaTokenContract.balanceOf(await TransactionsContract.target);
    const finalBuyerBalance = await FossaTokenContract.balanceOf(await buyer.getAddress());
    const tokensSold = await TransactionsContract.purchased();

    //console.log("Final Admin Balance:", finalAdminBalance.toString());
    //console.log("Final Buyer Balance:", finalBuyerBalance.toString());
   // console.log("Tokens Sold:", tokensSold.toString());

    expect(finalAdminBalance).to.equal(initialAdminBalance - (numberOfTokens));
    expect(finalBuyerBalance).to.equal(initialBuyerBalance + (numberOfTokens));
    expect(tokensSold).to.equal(numberOfTokens);
  });

  it("Test sprawdza poprawność adresów", async () => {
    const address = await TransactionsContract.address;
    const tokenContract = await TransactionsContract.tokenContract();
    const price = await TransactionsContract.price();

    expect(address).to.not.equal(ethers.ZeroAddress);
    expect(tokenContract).to.not.equal(ethers.ZeroAddress);
    expect(price).to.equal(tokenPrice);
  });
  it("Test sprawdza czy zostanie transakcja odrzucona z niepoprawną wartością", async () => {
    await expect(TransactionsContract.connect(buyer).purchase(numberOfTokens, { value: 1 })).to.be.reverted;

    const balance = await FossaTokenContract.balanceOf(await buyer.getAddress());
    expect(balance).to.equal(numberOfTokens);
  });
  
  
});
