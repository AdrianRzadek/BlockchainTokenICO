const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DappTokenSale", () => {
  let tokenSaleInstance;
  let tokenInstance;
  let tokenPrice = 1000000000000000000n; // in wei
  let admin;
  let buyer;
  let tokensAvailable = 1000000;
  let numberOfTokens = 10n;


  before(async () => {

    const [adminSigner, buyerSigner] = await ethers.getSigners();
    admin = adminSigner;
    buyer = buyerSigner;

    const DappToken = await ethers.getContractFactory("DappToken");
    const DappTokenSale = await ethers.getContractFactory("DappTokenSale");

    tokenInstance = await DappToken.deploy(1000000); // Deploy your DappToken contract with an initial supply
    tokenSaleInstance = await DappTokenSale.deploy(tokenInstance.target, tokenPrice);
  });

  it("should allow a user to purchase tokens", async () => {
    const initialAdminBalance = await tokenInstance.balanceOf(await admin.getAddress());
    const initialBuyerBalance = await tokenInstance.balanceOf(await buyer.getAddress());
    
    console.log("initial Admin Balance:", initialAdminBalance.toString());
    console.log("initial Buyer Balance:", initialBuyerBalance.toString());
    // Transfer tokens to the token sale contract
    await tokenInstance.transfer(tokenSaleInstance.target, tokensAvailable);
    //sprawdzic w kodzie czy kontrakt ma dostepne tokeny????? !!!!!!!!!!!!!!!!!

    // Ensure that the buyer has enough Ether to purchase tokens
    const etherAmount = ethers.toBigInt(numberOfTokens) * ethers.toBigInt(tokenPrice);
    await tokenSaleInstance.connect(buyer).buyTokens(ethers.toBigInt(numberOfTokens), { value: etherAmount });

    // Check if the buyer received the tokens
    const finalAdminBalance = await tokenInstance.balanceOf(await tokenSaleInstance.target);
    const finalBuyerBalance = await tokenInstance.balanceOf(await buyer.getAddress());
    const tokensSold = await tokenSaleInstance.tokensSold();

    console.log("Final Admin Balance:", finalAdminBalance.toString());
    console.log("Final Buyer Balance:", finalBuyerBalance.toString());
    console.log("Tokens Sold:", tokensSold.toString());

    expect(finalAdminBalance).to.equal(initialAdminBalance - (numberOfTokens));
    expect(finalBuyerBalance).to.equal(initialBuyerBalance + (numberOfTokens));
    expect(tokensSold).to.equal(numberOfTokens);
  });

  it("initializes the contract with the correct values", async () => {
    const address = await tokenSaleInstance.address;
    const tokenContract = await tokenSaleInstance.tokenContract();
    const price = await tokenSaleInstance.tokenPrice();

    expect(address).to.not.equal(ethers.ZeroAddress);
    expect(tokenContract).to.not.equal(ethers.ZeroAddress);
    expect(price).to.equal(tokenPrice);
  });
  it("rejects buying tokens with incorrect ether value", async () => {
    await expect(tokenSaleInstance.connect(buyer).buyTokens(numberOfTokens, { value: 1 })).to.be.reverted;

    const balance = await tokenInstance.balanceOf(await buyer.getAddress());
    expect(balance).to.equal(numberOfTokens);
  });
  
  
});
