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
  // Deployed: 0x3c413c27c58d95F20054563B217b2afaf6C3370E
  const zeroAddress = "0x0000000000000000000000000000000000000000" // testnet-mumbai
  // We get the contract to deploy
  // pool 67 for community: 0x2942823557C65AC02F031A2A4aaa9C140b3B5637
  // pool 60 for private: 0x86cdCE76a66e5088911694D2A914102084Cdc808
  const signer = '0x2942823557C65AC02F031A2A4aaa9C140b3B5637' // pool 67
  const fund = "0x15060FE59AC2e67739eE53a1606341D5765e9632";  //

  const ContractFactory = await hre.ethers.getContractFactory("GameFiBox");
  const Contract = await upgrades.deployProxy(ContractFactory,[ "GF-MONS", "GF-MONS",
    "https://gamefi.org/api/v1/boxes", signer, fund, zeroAddress, zeroAddress], { initializer: '__GameFiBox_init'});

  const contract = await Contract.deployed();
  console.log("Contract deployed to:", contract.address);

  let data = await contract.addSaleEvent(
      11428, // max supply
      1637672400, // start
      1638190800, // end
      10, // max per batch
      zeroAddress, // nft
      0, // start nft
      true // sub event
  )
  console.log('add sale event', data.hash)

  const limit = 11428;
  const PRICE = "35000000000000000000";
  const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
  data = await contract.setSubBox(0, [limit], [PRICE], [BUSD])
  console.log('set subbox', data.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
