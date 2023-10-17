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

    tokenInstance = await DappToken.deploy({value: 1000000}); // Deploy your DappToken contract with an initial supply
    tokenSaleInstance = await DappTokenSale.deploy(tokenInstance.target, tokenPrice);
  });

  it("Should allow users to purchase tokens", async () => {
    // Add balance verification, etc. according to your contract's logic and structure
    await tokenSaleInstance.connect(buyer).buyTokens(numberOfTokens, { value: tokenPrice * numberOfTokens });

    const balance = await tokenInstance.balanceOf(buyer.address);
    expect(balance).to.equal(numberOfTokens);

    const tokensSold = await tokenSaleInstance.tokensSold();
    expect(tokensSold).to.equal(numberOfTokens);
  });


  it("facilitates token buying", async () => {
    // Provision 75% of all tokens for sale
    await tokenInstance.transfer(tokenSaleInstance.target, tokensAvailable);

    const transaction = await tokenSaleInstance.connect(buyer).buyTokens(numberOfTokens, { value: numberOfTokens * tokenPrice });
    const receipt = await transaction.wait();
   console.log(receipt.logs);
  
    expect(receipt.logs.length).to.equal(2);


    const amount = await tokenSaleInstance.tokensSold();
    const balance = await tokenInstance.balanceOf(await buyer.getAddress());

    expect(amount).to.equal(numberOfTokens);
    expect(balance).to.equal(numberOfTokens);
  });


   // expect(receipt.logs[1].event).to.equal("Sell");
    //expect(receipt.logs.args._buyer).to.equal(await buyer.getAddress());
   // expect(receipt.logs.args._amount).to.equal(numberOfTokens);


 

  it("ends token sale", async () => {
   await expect(tokenSaleInstance.connect(buyer).endSale()).to.be.revertedWith('Only the admin can end the sale');
  
 
 //  const adminBalance = await tokenInstance.balanceOf(await admin.getAddress());

  // expect(adminBalance).to.equal(tokensAvailable);
 // const newPrice = await tokenSaleInstance.tokenPrice();
 // expect(newPrice).to.equal(tokenPrice);
  
});
});