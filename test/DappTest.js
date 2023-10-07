const { ethers, deployments } = require("hardhat");
const { expect } = require("chai");

describe("DappToken", async () => {
  let tokenInstance ;

  before(async () => {
    const { deploy } = deployments;
    await deploy("DappToken", {
      from: (await ethers.getSigners())[0].address,
      args: [1000000], // Initial supply
    });
    tokenInstance = await ethers.getContract("DappToken");
  });

  it("should initialize the contract with correct values", async () => {
    const name = await tokenInstance.name();
    const symbol = await tokenInstance.symbol();
    const decimals = await tokenInstance.decimals();
    const totalSupply = await tokenInstance.totalSupply();

    expect(name).to.equal("DApp Token");
    expect(symbol).to.equal("DAPP");
    expect(decimals).to.equal(18);
    expect(totalSupply).to.equal(ethers.utils.parseUnits("1000000", 18));
  });

  it("should transfer tokens", async () => {
    const [sender, receiver] = await ethers.getSigners();
    const amount = ethers.utils.parseUnits("100", 18);

    const balanceBeforeSender = await tokenInstance.balanceOf(sender.address);
    const balanceBeforeReceiver = await tokenInstance.balanceOf(receiver.address);

    await tokenInstance.connect(sender).transfer(receiver.address, amount);

    const balanceAfterSender = await tokenInstance.balanceOf(sender.address);
    const balanceAfterReceiver = await tokenInstance.balanceOf(receiver.address);

    expect(balanceBeforeSender.sub(amount)).to.equal(balanceAfterSender);
    expect(balanceBeforeReceiver.add(amount)).to.equal(balanceAfterReceiver);
  });

  it("should approve and transferFrom tokens", async () => {
    const [owner, spender, receiver] = await ethers.getSigners();
    const amount = ethers.utils.parseUnits("50", 18);

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
    expect(balanceOwnerAfter.sub(amount)).to.equal(balanceOwnerBefore);
    expect(balanceReceiverAfter.add(amount)).to.equal(balanceReceiverBefore);
  });
});
