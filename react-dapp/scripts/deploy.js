const hre = require("hardhat");

async function main() {
    // We get the contract to deploy
    const Token = await hre.ethers.getContractFactory("Token");
    // Deploy the contract passing in the initial value to the constructor
    const token = await Token.deploy();
  
    await token.deployed();
  
    console.log("New token deployed to:", token.address);
  }

  main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
