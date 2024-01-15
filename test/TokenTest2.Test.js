const { ethers } = require("hardhat");
const { expect } = require("chai");
const {before} = require('mocha')
describe("FossaTokenTest2", function () {
  let FossaTokenContract
  let accounts;
  let owner;
  let spender;
  let reciver;
  before(async function () {
    accounts = await ethers.getSigners();
    
    [owner, spender, reciver] = accounts;
    const FossaToken = await ethers.getContractFactory("FossaToken");
    FossaTokenContract = await FossaToken.deploy(1000000);
    
  });

  
  it("Test sprawdza poprawność transferu do właściciela", async function () {
    try {
      await FossaTokenContract.transfer(owner.address, 99999999n);
      expect.fail("The transaction should have failed");
    } catch (error) {
      expect(error.message).to.include("revert");
    }
  
   const transfer = await FossaTokenContract.transfer(reciver.address, 250000n);
    await transfer.wait();
  
    const reciverBalance = await FossaTokenContract.balanceOf(reciver.address);
    expect(reciverBalance).to.equal(250000n);
  
    const spenderBalance = await FossaTokenContract.balanceOf(owner.address);
    expect(spenderBalance).to.equal(750000n);
  });
  

  
    });