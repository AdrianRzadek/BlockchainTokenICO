const hre = require("hardhat");

async function main(getNamedAccounts, deployments) {
   
    const { deployer } = await getNamedAccounts();
    const { deploy} = deployments;
  
    await deploy("DappToken", {
      from: deployer,
      args: [1000000],
      log: true,
    });
  
    const tokenPrice = hre.ethers.utils.parseEther("1"); // Convert 1 Ether to Wei
    await deploy("DappTokenSale", {
      from: deployer,
      args: [deployments.DappToken.address, tokenPrice],
      log: true,
    });
  
    await deploy("Transactions", {
      from: deployer,
      log: true,
    });
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
