const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DappToken", function () {
  let tokenInstance;
 
  before(async function () {
   
    const DappToken = await ethers.getContractFactory("DappToken");
    tokenInstance = await DappToken.deploy();
    
  });
  
  

  it("should initialize the contract with correct values", async () => {
    const name = await tokenInstance.name();
    const symbol = await tokenInstance.symbol();
    const decimals = await tokenInstance.decimals();
    const totalSupply = await tokenInstance.totalSupply();

    expect(name).to.equal("DAppToken");
    expect(symbol).to.equal("DAPP");
    expect(decimals).to.equal(18);
    expect(totalSupply).to.equal(1000000n);
  });

  it("should transfer tokens", async () => {
    const [sender, receiver] = await ethers.getSigners();
    const amount = 100n;

    const balanceBeforeSender = await tokenInstance.balanceOf(sender.address);
    const balanceBeforeReceiver = await tokenInstance.balanceOf(receiver.address);

    await tokenInstance.connect(sender).transfer(receiver.address, amount);

    const balanceAfterSender = await tokenInstance.balanceOf(sender.address);
    const balanceAfterReceiver = await tokenInstance.balanceOf(receiver.address);

    expect(balanceBeforeSender -(amount)).to.equal(balanceAfterSender);
    expect(balanceBeforeReceiver +(amount)).to.equal(balanceAfterReceiver);
  });

  it("should approve and transferFrom tokens", async () => {
    const [owner, spender, receiver] = await ethers.getSigners();
    const amount =50n;

    const balanceOwnerBefore = await tokenInstance.balanceOf(owner.address);
    const balanceReceiverBefore = await tokenInstance.balanceOf(receiver.address);

    await tokenInstance.connect(owner).approve(spender.address, amount);
    const allowanceBefore = await tokenInstance.allowance(owner.address, spender.address);

    expect(allowanceBefore).to.equal(amount);

    await tokenInstance.connect(spender).transferFrom(owner.address, receiver.address, amount);

    const allowanceAfter = await tokenInstance.allowance(owner.address, spender.address);
    const balanceOwnerAfter = await tokenInstance.balanceOf(owner.address);
    const balanceReceiverAfter = await tokenInstance.balanceOf(receiver.address);

    expect(allowanceAfter).to.equal(0);
    expect(balanceOwnerAfter + (amount)).to.equal(balanceOwnerBefore);
    expect(balanceReceiverAfter - (amount)).to.equal(balanceReceiverBefore);
  });


});


