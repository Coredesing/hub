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
  // Deployed: 0xD7E79a96ab11a4eDa6DC4BB3eD30337a8e9BD70B
  const zeroAddress = "0x0000000000000000000000000000000000000000" // testnet-mumbai
  // We get the contract to deploy
  // pool 67 for community: 0x2942823557C65AC02F031A2A4aaa9C140b3B5637
  // pool 60 for private: 0x86cdCE76a66e5088911694D2A914102084Cdc808
  const signer = '0x86cdCE76a66e5088911694D2A914102084Cdc808' // pool 60
  const fund = "0x15060FE59AC2e67739eE53a1606341D5765e9632";  //

  const ContractFactory = await hre.ethers.getContractFactory("GameFiBox");
  const Contract = await upgrades.deployProxy(ContractFactory,[ "GF-MONS", "GF-MONS",
    "https://gamefi.org/api/v1/boxes", signer, fund, zeroAddress, zeroAddress], { initializer: '__GameFiBox_init'});

  const contract = await Contract.deployed();
  console.log("Contract deployed to:", contract.address);

  let data = await contract.addSaleEvent(
      2857, // max supply
      1637636400, // start
      1638190800, // end
      10, // max per batch
      zeroAddress, // nft
      0, // start nft
      true // sub event
  )
  console.log('add sale event', data.hash)

  const limit = 2857;
  const PRICE = "32000000000000000000";
  const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
  data = await contract.setSubBox(0, [limit], [PRICE], [BUSD])
  console.log('set sub box', data.hash)

  // set super limit for legends
  data = await contract.setSuperLimit([
    "0x539edd96b903c6bfDA5A54a28A74a85432309a88",
    "0x61E98B202DD547665951cB6468C2bDB3D880efC1",
    "0xaC6dE9f16c7b9B44C4e5C9073C3a10fA45aB4d5a",
    "0x9bA4C6e0594118bA0B9DfF300FaE795Bb1037311",
    "0x3C69e20E4Ec8bb4148378f1e5Dfc1d6EA94AA22C",
    "0x57a36E40A540FB1744cC30D47D2C7E5888110C5D",
    "0xF91fec621564d1D9179Ce8d3FA47a80a3Bb4B0FD",
    "0x3506e5f79754e8aAd83152b8E6189b6c5508AAD4",
    "0xc924df9194e93dffbb4bdb386e13062a0217476f",
    "0x67f46a8e9d98ccb298aa630d779b0ae7c1e00023",
    "0x59699cDbf6519042D6074FdbE2408ad993435bD8",
    "0x420376e2fb2fF7Ce680C435b9c928a3A58BF1A79"
  ], 20)
  console.log('set super limit', data.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
