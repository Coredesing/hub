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
  // Deployed: 0x1084484C7c29c5082DEaeE9B3c01a369ca56f585
  const zeroAddress = "0x0000000000000000000000000000000000000000" // testnet-mumbai
  // We get the contract to deploy
  // pool private 0xBf7a69184E3aF70aba27437f7938f4Ae314d3dA0 // pool 80
  // pool community 0x75FeAE09f43F06E05a527C05AA9c0a29A4335C2e // pool 75
  const signer = '0x75FeAE09f43F06E05a527C05AA9c0a29A4335C2e' // pool 75
  const fund = "0xee2e35E2c25f7dB7AEB243c8716de38DF3f1Ac45";  //

  const ContractFactory = await hre.ethers.getContractFactory("GameFiBox");
  const Contract = await upgrades.deployProxy(ContractFactory,[ "GF-LFW", "GF-LFW",
    "https://gamefi.org/api/v1/boxes", signer, fund, zeroAddress, "0x454D77123D73dE31EE1913C006723b7E2baD77f0"], { initializer: '__GameFiBox_init'});

  const contract = await Contract.deployed();
  console.log("Contract deployed to:", contract.address);

  let data = await contract.addSaleEvent(
      3200, // max supply
      1638774000, // start
      1639144800, // end
      20, // max per batch
      zeroAddress, // nft
      0, // start nft
      true // sub event
  )
  console.log('add sale event', data.hash)

  const limit = 3200;
  const PRICE = "400000000000000000";
  const BNB = "0x0000000000000000000000000000000000000000"
  data = await contract.setSubBox(0, [limit], [PRICE], [BNB])
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
