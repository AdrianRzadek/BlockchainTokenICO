const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DappToken", function () {
  let tokenInstance;
  let accounts;
  before(async function () {
    accounts = await ethers.getSigners();
    const DappToken = await ethers.getContractFactory("DappToken");
    tokenInstance = await DappToken.deploy(1000000);
    
  });
  it("sets total supply and allocates initial supply", async function () {
    const totalSupply = await tokenInstance.totalSupply();
    expect(totalSupply).to.equal(1000000);
  
    const adminBalance = await tokenInstance.balanceOf(accounts[0].address);
    expect(adminBalance).to.equal(1000000);
  });
  
  it("transfers token ownership", async function () {
    try {
      await tokenInstance.transfer(accounts[0].address, 99999999n);
      expect.fail("The transaction should have failed");
    } catch (error) {
      expect(error.message).to.include("revert");
    }
  
    const transferSuccess = await tokenInstance.transfer(accounts[1].address, 250000n);
    await transferSuccess.wait();
  
    const recipientBalance = await tokenInstance.balanceOf(accounts[1].address);
    expect(recipientBalance).to.equal(250000n);
  
    const senderBalance = await tokenInstance.balanceOf(accounts[0].address);
    expect(senderBalance).to.equal(750000n);
  });
  
  it("approves tokens for delegated transfer", async function () {
    const approvalSuccess = await tokenInstance.approve(accounts[1].address, 100);
    await approvalSuccess.wait();
  
    const allowance = await tokenInstance.allowance(accounts[0].address, accounts[1].address);
    expect(allowance).to.equal(100);
  });
  
  it("handles delegated token transfers", async function () {
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spendingAccount = accounts[4];
    await tokenInstance.connect(accounts[0]).transfer(fromAccount.address, 100);

    await tokenInstance.connect(fromAccount).approve(spendingAccount.address, 10);
    
    try {
        await tokenInstance.connect(spendingAccount).transferFrom(fromAccount.address, toAccount.address, 9999);
        expect.fail("The transaction should have failed due to insufficient balance");
    } catch (error) {
        expect(error.message).to.include("revert");
    }

    try {
        await tokenInstance.connect(spendingAccount).transferFrom(fromAccount.address, toAccount.address, 20);
        expect.fail("The transaction should have failed due to exceeding allowance");
    } catch (error) {
        expect(error.message).to.include("revert");
    }

    await tokenInstance.connect(spendingAccount).transferFrom(fromAccount.address, toAccount.address, 10);

    const recipientBalance = await tokenInstance.balanceOf(toAccount.address);
    expect(recipientBalance.toString()).to.equal("10");

    const senderBalance = await tokenInstance.balanceOf(fromAccount.address);
    expect(senderBalance.toString()).to.equal("90");

    const allowance = await tokenInstance.allowance(fromAccount.address, spendingAccount.address);
    expect(allowance.toString()).to.equal("0");
});

    });