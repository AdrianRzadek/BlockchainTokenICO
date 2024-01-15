const { ethers } = require("hardhat");
const { expect } = require("chai");
const {before} = require('mocha')
describe("FossaTokenTest1", function () {
  let FossaTokenContract;
  let accounts
  let owner;  
  let buyer;
  let user;
  let spender;
  let reciver;
  before(async function () {
   
    accounts = await ethers.getSigners();
    [owner, spender, reciver, buyer, user] = accounts;
    const FossaToken = await ethers.getContractFactory("FossaToken");
    FossaTokenContract = await FossaToken.deploy(1000000);

    
  });
  it("Test sprawdza zaopatrzenie", async function () {
    const totalSupply = await FossaTokenContract.totalSupply();
    expect(totalSupply).to.equal(1000000);
  
    const ownerBalance = await FossaTokenContract.balanceOf(owner.address);
    expect(ownerBalance).to.equal(1000000);
  });
  

  it("Test sprawdza poprawność podstawowych wartości tokenu", async () => {
    const name = await FossaTokenContract.name();
    const symbol = await FossaTokenContract.symbol();
    const decimals = await FossaTokenContract.decimals();
    const totalSupply = await FossaTokenContract.totalSupply();

    expect(name).to.equal("FossaToken");
    expect(symbol).to.equal("FOSSA");
    expect(decimals).to.equal(0);
    expect(totalSupply).to.equal(1000000n);
  });

  it("Test sprawdza funkcję transfer", async () => {

    let amount = 500n;
    let amountApprovwed = 1000n;
    await FossaTokenContract.connect(owner).approve(buyer.address, amountApprovwed);

    await FossaTokenContract.connect(owner).transfer(buyer.address, amount);


     const balanceBeforeBuyer = await FossaTokenContract.balanceOf(buyer.address);
    const balanceBeforeUser = await FossaTokenContract.balanceOf(user.address);

    await FossaTokenContract.connect(buyer).transfer(user.address, amount);

    const balanceAfterBuyer = await FossaTokenContract.balanceOf(buyer.address);
    const balanceAfterUser = await FossaTokenContract.balanceOf(user.address);

    expect(balanceBeforeBuyer - (amount)).to.equal(balanceAfterBuyer);
    expect(balanceBeforeUser + (amount)).to.equal(balanceAfterUser);
  });

  it("Test sprawdza funkcje approve i transferFrom ", async () => {

    let amount = 50n;

    const balanceOwnerBefore = await FossaTokenContract.balanceOf(owner.address);
    const balanceReceiverBefore = await FossaTokenContract.balanceOf(reciver.address);

    await FossaTokenContract.connect(owner).approve(spender.address, amount);
    const allowanceBefore = await FossaTokenContract.allowance(owner.address, spender.address);

    

    expect(allowanceBefore).to.equal(amount);
       
    try {
      await FossaTokenContract.connect(spender).transferFrom(owner.address, reciver.address, 9999);
      expect.fail("The transaction should have failed due to insufficient balance");
  } catch (error) {
      expect(error.message).to.include("revert");
  }
  
    await FossaTokenContract.connect(spender).transferFrom(owner.address, reciver.address, amount);

    const allowanceAfter = await FossaTokenContract.allowance(owner.address, spender.address);
    const balanceOwnerAfter = await FossaTokenContract.balanceOf(owner.address);
    const balanceReceiverAfter = await FossaTokenContract.balanceOf(reciver.address);

    expect(allowanceAfter).to.equal(0);
    expect(balanceOwnerAfter + (amount)).to.equal(balanceOwnerBefore);
    expect(balanceReceiverAfter - (amount)).to.equal(balanceReceiverBefore);
  });


});


