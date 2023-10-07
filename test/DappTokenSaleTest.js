const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe("DappTokenSale", () => {
  let tokenSaleInstance;
  let tokenInstance;
  let tokenPrice = 1000000000000000000; // in wei
  let admin;
  let buyer;
  let tokensAvailable = 1000000;
  let numberOfTokens = 10;

  before(async () => {
    const [adminSigner, buyerSigner] = await ethers.getSigners();
    admin = adminSigner;
    buyer = buyerSigner;

    const DappToken = await ethers.getContractFactory("DappToken");
    const DappTokenSale = await ethers.getContractFactory("DappTokenSale");

    tokenInstance = await DappToken.deploy(1000000); // Deploy your DappToken contract with an initial supply
    tokenSaleInstance = await DappTokenSale.deploy(tokenInstance.address, tokenPrice);
  });

  it("should allow a user to purchase tokens", async () => {
    const initialAdminBalance = await tokenInstance.balanceOf(await admin.getAddress());
    const initialBuyerBalance = await tokenInstance.balanceOf(await buyer.getAddress());

    // Ensure that the buyer has enough Ether to purchase tokens
    const etherAmount = numberOfTokens * tokenPrice;
    await tokenSaleInstance.connect(buyer).buyTokens(numberOfTokens, { value: etherAmount });

    // Check if the buyer received the tokens
    const finalAdminBalance = await tokenInstance.balanceOf(await admin.getAddress());
    const finalBuyerBalance = await tokenInstance.balanceOf(await buyer.getAddress());
    const tokensSold = await tokenSaleInstance.tokensSold();

    expect(finalAdminBalance).to.equal(initialAdminBalance.sub(numberOfTokens));
    expect(finalBuyerBalance).to.equal(initialBuyerBalance.add(numberOfTokens));
    expect(tokensSold).to.equal(numberOfTokens);
  });

  it("initializes the contract with the correct values", async () => {
    const address = await tokenSaleInstance.address;
    const tokenContract = await tokenSaleInstance.tokenContract();
    const price = await tokenSaleInstance.tokenPrice();

    expect(address).to.not.equal(ethers.constants.AddressZero);
    expect(tokenContract).to.not.equal(ethers.constants.AddressZero);
    expect(price).to.equal(tokenPrice);
  });

  it("facilitates token buying", async () => {
    // Provision 75% of all tokens for sale
    await tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable);

    const receipt = await tokenSaleInstance.connect(buyer).buyTokens(numberOfTokens, { value: numberOfTokens * tokenPrice });

    expect(receipt.logs.length).to.equal(1);
    expect(receipt.logs[0].event).to.equal("Sell");
    expect(receipt.logs[0].args._buyer).to.equal(await buyer.getAddress());
    expect(receipt.logs[0].args._amount).to.equal(numberOfTokens);

    const amount = await tokenSaleInstance.tokensSold();
    const balance = await tokenInstance.balanceOf(await buyer.getAddress());

    expect(amount).to.equal(numberOfTokens);
    expect(balance).to.equal(numberOfTokens);
  });

  it("rejects buying tokens with incorrect ether value", async () => {
    await expect(tokenSaleInstance.connect(buyer).buyTokens(numberOfTokens, { value: 1 })).to.be.revertedWith("msg.value must be equal to the number of tokens in wei");

    const balance = await tokenInstance.balanceOf(await buyer.getAddress());
    expect(balance).to.equal(numberOfTokens);
  });

  it("ends token sale", async () => {
    await tokenSaleInstance.endSale({ from: await buyer.getAddress() }).then(() => {
      expect.fail("Should not allow non-admin to end sale");
    }).catch((error) => {
      expect(error.message).to.contain("Only admin can end the sale");
    });

    await tokenSaleInstance.endSale({ from: await admin.getAddress() });
    const adminBalance = await tokenInstance.balanceOf(await admin.getAddress());

    expect(adminBalance).to.equal(tokensAvailable);
    const newPrice = await tokenSaleInstance.tokenPrice();
    expect(newPrice).to.equal(0);
  });
});
