const { ethers } = require("hardhat");
const { expect } = require("chai");
const {before} = require('mocha')
describe("FossaTokenTest1", function () {
  let FossaTokenContract;
 
  before(async function () {
   
    const FossaToken = await ethers.getContractFactory("FossaToken");
    FossaTokenContract = await FossaToken.deploy(1000000);
    
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
    const [sender, receiver] = await ethers.getSigners();
    const amount = 100n;

    const balanceBeforeSender = await FossaTokenContract.balanceOf(sender.address);
    const balanceBeforeReceiver = await FossaTokenContract.balanceOf(receiver.address);

    await FossaTokenContract.connect(sender).transfer(receiver.address, amount);

    const balanceAfterSender = await FossaTokenContract.balanceOf(sender.address);
    const balanceAfterReceiver = await FossaTokenContract.balanceOf(receiver.address);

    expect(balanceBeforeSender -(amount)).to.equal(balanceAfterSender);
    expect(balanceBeforeReceiver +(amount)).to.equal(balanceAfterReceiver);
  });

  it("Test sprawdza funkcje approve i transferFrom ", async () => {
    const [owner, spender, receiver] = await ethers.getSigners();
    const amount =50n;

    const balanceOwnerBefore = await FossaTokenContract.balanceOf(owner.address);
    const balanceReceiverBefore = await FossaTokenContract.balanceOf(receiver.address);

    await FossaTokenContract.connect(owner).approve(spender.address, amount);
    const allowanceBefore = await FossaTokenContract.allowance(owner.address, spender.address);

    expect(allowanceBefore).to.equal(amount);

    await FossaTokenContract.connect(spender).transferFrom(owner.address, receiver.address, amount);

    const allowanceAfter = await FossaTokenContract.allowance(owner.address, spender.address);
    const balanceOwnerAfter = await FossaTokenContract.balanceOf(owner.address);
    const balanceReceiverAfter = await FossaTokenContract.balanceOf(receiver.address);

    expect(allowanceAfter).to.equal(0);
    expect(balanceOwnerAfter + (amount)).to.equal(balanceOwnerBefore);
    expect(balanceReceiverAfter - (amount)).to.equal(balanceReceiverBefore);
  });


});


