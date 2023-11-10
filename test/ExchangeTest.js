const { ethers } = require("hardhat");
const { expect } = require("chai")
describe("Exchange", function () {
    let tokenInstance;
    let accounts;
    let exchangeInstance;
    before(async function () {
      accounts = await ethers.getSigners();
      [owner, buyer] = await ethers.getSigners();
      const Exchange = await ethers.getContractFactory("Exchange");
      const DappToken = await ethers.getContractFactory("DappToken");
      tokenInstance = await DappToken.deploy(ethers.parseEther("1000")); 
    exchangeInstance = await Exchange.deploy(tokenInstance.target);
    await tokenInstance.transfer(buyer.address, ethers.parseEther("1000"));
        
 const allowanceAmount = ethers.parseEther("100")// calculate the necessary allowance
        tokenInstance.approve(exchangeInstance.target, allowanceAmount);

});

    
    it("should sell tokens and transfer ether to the buyer", async function () {
        const amountToSell = ethers.parseEther("1");
        const allowanceAmount = ethers.parseEther("100")// calculate the necessary allowance
        tokenInstance.approve(exchangeInstance.target, allowanceAmount);
        // Approve the YourTokenSaleContract to spend tokens on behalf of the buyer
        await tokenInstance.connect(buyer).approve(exchangeInstance.target, amountToSell);
      
        const initialBuyerBalance = await tokenInstance.balanceOf(buyer.address);
   
        const initialContractBalance = await tokenInstance.balanceOf(exchangeInstance.target);

        await exchangeInstance.connect(buyer).sellTokens(amountToSell, { value: amountToSell });
    
        const finalBuyerBalance = await tokenInstance.balanceOf(buyer.address);
        const finalContractBalance = await tokenInstance.balanceOf(exchangeInstance.target);
    
        // Check that the ether was transferred to the buyer
        expect(initialBuyerBalance).to.be.above(finalBuyerBalance);
      
        // Check that the tokens were transferred to the contract
        const contractTokenBalance = await tokenInstance.balanceOf(exchangeInstance.target);
        expect(contractTokenBalance).to.equal(amountToSell);
    
        // Check that the ether was transferred to the contract
        const expectedContractBalance = initialContractBalance + (amountToSell);
        expect(finalContractBalance).to.equal(expectedContractBalance);
      });
});