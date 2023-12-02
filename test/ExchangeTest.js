const { ethers } = require("hardhat");
const { expect } = require("chai")
describe("Exchange", function () {
    let tokenInstance;
    let accounts;
    let tokenSaleInstance;
    let tokenPrice = 1000000000000000000n;
    let tokensAvailable = ethers.parseEther("10000")
    before(async function () {
      accounts = await ethers.getSigners();
      [owner, buyer] = await ethers.getSigners();
      const DappTokenSale = await ethers.getContractFactory("DappTokenSale");
      const DappToken = await ethers.getContractFactory("DappToken");
      tokenInstance = await DappToken.deploy(ethers.parseEther("1000")); 
      tokenSaleInstance = await DappTokenSale.deploy(tokenInstance.target, tokenPrice);
    await tokenInstance.transfer(buyer.address, ethers.parseEther("1000"));
        
 const allowanceAmount = ethers.parseEther("10000")// calculate the necessary allowance
        tokenInstance.approve(tokenSaleInstance.target, allowanceAmount);
        await tokenInstance.transfer(tokenSaleInstance.target, tokensAvailable);
});

    
    it("should sell tokens and transfer ether to the buyer", async function () {
        const amountToSell = ethers.parseEther("10000");
        const allowanceAmount = ethers.parseEther("10000");// calculate the necessary allowance
        tokenInstance.approve(tokenSaleInstance.target, allowanceAmount);
        // Approve the YourTokenSaleContract to spend tokens on behalf of the buyer
        await tokenInstance.connect(buyer).approve(tokenSaleInstance.target, amountToSell);
      
        const initialBuyerBalance = await tokenInstance.balanceOf(buyer.address);
   
        const initialContractBalance = await tokenInstance.balanceOf(tokenSaleInstance.target);

        await tokenSaleInstance.connect(buyer).sellTokens( amountToSell);

    /*
        const finalBuyerBalance = await tokenInstance.balanceOf(buyer.address);
        const finalContractBalance = await tokenInstance.balanceOf(tokenSaleInstance.target);
    
        // Check that the ether was transferred to the buyer
        expect(initialBuyerBalance).to.be.above(finalBuyerBalance);
      
        // Check that the tokens were transferred to the contract
        const contractTokenBalance = await tokenInstance.balanceOf(tokenSaleInstance.target);
        expect(contractTokenBalance).to.equal(amountToSell);
    
        // Check that the ether was transferred to the contract
        const expectedContractBalance = initialContractBalance + (amountToSell);
        expect(finalContractBalance).to.equal(expectedContractBalance);
*/

      });

   
});