// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const fund = "0xB7cEd2807441B5c5FA7a40a97467F73275EdF73f";
  const gafi = "0xCc6aB3DDd713a612649B5A64C63F73e8255048d1";
  const busd = "0x79c86934bE686B28b9aeeaFc42202907b06E3D7A";

  const ContractFactory = await hre.ethers.getContractFactory("Marketplace");
  const Contract = await upgrades.deployProxy(ContractFactory,
      [ fund ],
      { initializer: '__Marketplace_init'});

  const contract = await Contract.deployed();
  console.log("Contract deployed to:", contract.address);

  // set default
  let data = await contract.setDefaultCurrencyStatus(gafi, true)
  console.log('set default currency', data.hash)

  // set default BUSD
  data = await contract.setDefaultCurrencyStatus(busd, true)
  console.log('set default currency', data.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
