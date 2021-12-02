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

  // deploy: 0x10B95B7B86F7128613277ACB1be89fbc4AFfdEAc
  const fund = "0x2EE206A3872b17f91071A003dA20c345bD0488d1";
  const gafi = "0x89af13a10b32f1b2f8d1588f93027f69b6f4e27e";
  const busd = "0xe9e7cea3dedca5984780bafc599bd69add087d56";

  const ContractFactory = await hre.ethers.getContractFactory("Marketplace");
  const Contract = await upgrades.deployProxy(ContractFactory,
      [ fund ],
      { initializer: '__Marketplace_init'});

  const contract = await Contract.deployed();
  console.log("Contract deployed to:", contract.address);

  // set default
  let data = await contract.setDefaultCurrencyStatus(gafi, true)
  console.log('set default gafi currency', data.hash)

  // set default BUSD
  data = await contract.setDefaultCurrencyStatus(busd, true)
  console.log('set default busd currency', data.hash)

  // set ranking GAFI
  data = await contract.setRankings(["1000000000000000000"], ["0"])
  console.log('set rankings', data.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
