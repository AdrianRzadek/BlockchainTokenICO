const { ethers } = require("hardhat");
const { expect } = require("chai");
const {before} = require('mocha')
describe("FossaTokenTest2", function () {
  let FossaTokenContract
  let accounts;
  before(async function () {
    accounts = await ethers.getSigners();
    const FossaToken = await ethers.getContractFactory("FossaToken");
    FossaTokenContract = await FossaToken.deploy(1000000);
    
  });
  it("Test sprawdza zaopatrzenie", async function () {
    const totalSupply = await FossaTokenContract.totalSupply();
    expect(totalSupply).to.equal(1000000);
  
    const adminBalance = await FossaTokenContract.balanceOf(accounts[0].address);
    expect(adminBalance).to.equal(1000000);
  });
  
  it("Test sprawdza poprawnośc transferu do właściciela", async function () {
    try {
      await FossaTokenContract.transfer(accounts[0].address, 99999999n);
      expect.fail("The transaction should have failed");
    } catch (error) {
      expect(error.message).to.include("revert");
    }
  
    const transferSuccess = await FossaTokenContract.transfer(accounts[1].address, 250000n);
    await transferSuccess.wait();
  
    const recipientBalance = await FossaTokenContract.balanceOf(accounts[1].address);
    expect(recipientBalance).to.equal(250000n);
  
    const senderBalance = await FossaTokenContract.balanceOf(accounts[0].address);
    expect(senderBalance).to.equal(750000n);
  });
  
  it("Test sprawdza funkcję zatwierdzenia", async function () {
    const approvalSuccess = await FossaTokenContract.approve(accounts[1].address, 100);
    await approvalSuccess.wait();
  
    const allowance = await FossaTokenContract.allowance(accounts[0].address, accounts[1].address);
    expect(allowance).to.equal(100);
  });
  
  it("Test sprawdza scenariusz transakcji", async function () {
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spendingAccount = accounts[4];
    await FossaTokenContract.connect(accounts[0]).transfer(fromAccount.address, 100);

    await FossaTokenContract.connect(fromAccount).approve(spendingAccount.address, 10);
    
    try {
        await FossaTokenContract.connect(spendingAccount).transferFrom(fromAccount.address, toAccount.address, 9999);
        expect.fail("The transaction should have failed due to insufficient balance");
    } catch (error) {
        expect(error.message).to.include("revert");
    }

    try {
        await FossaTokenContract.connect(spendingAccount).transferFrom(fromAccount.address, toAccount.address, 20);
        expect.fail("The transaction should have failed due to exceeding allowance");
    } catch (error) {
        expect(error.message).to.include("revert");
    }

    await FossaTokenContract.connect(spendingAccount).transferFrom(fromAccount.address, toAccount.address, 10);

    const recipientBalance = await FossaTokenContract.balanceOf(toAccount.address);
    expect(recipientBalance.toString()).to.equal("10");

    const senderBalance = await FossaTokenContract.balanceOf(fromAccount.address);
    expect(senderBalance.toString()).to.equal("90");

    const allowance = await FossaTokenContract.allowance(fromAccount.address, spendingAccount.address);
    expect(allowance.toString()).to.equal("0");
});

    });