// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  // Deployed: 0xE38493044dA511fd5734A7C6bDeb380A21Cc69F1
  const zeroAddress = "0x0000000000000000000000000000000000000000" // testnet-mumbai
  // We get the contract to deploy
  const signer = '0xc7BD5EaF5b45AF4A6bF880c22BEA652BFbda20cC' // pool 87
  const fund = "0xee2e35E2c25f7dB7AEB243c8716de38DF3f1Ac45";  //

  const ContractFactory = await hre.ethers.getContractFactory("GameFiBox");
  const Contract = await upgrades.deployProxy(ContractFactory,[ "GF-TWL", "GF-TWL",
    "https://gamefi.org/api/v1/boxes", signer, fund, zeroAddress, "0xdeE71419bC45c11D28F9106cbb4923c7038Ed594"], { initializer: '__GameFiBox_init'});

  const contract = await Contract.deployed();
  console.log("Contract deployed to:", contract.address);

  let data = await contract.addSaleEvent(
      1500, // max supply
      1639306800, // start
      1639576800, // end
      100, // max per batch
      zeroAddress, // nft
      0, // start nft
      true // sub event
  )
  console.log('add sale event', data.hash)

  const limit = 1000;
  const PRICE = "36000000000000";
  const BNB = "0x0000000000000000000000000000000000000000"
  data = await contract.setSubBox(0,
      [575, 575, 200, 150],
      ["150000000000000000", "250000000000000000", "400000000000000000", "1000000000000000000"],
      [BNB, BNB, BNB, BNB]
  )
  console.log('set sub box', data.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
