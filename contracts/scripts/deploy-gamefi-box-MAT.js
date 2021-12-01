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
  const zeroAddress = "0x0000000000000000000000000000000000000000" // testnet-mumbai

  // Deployed: 0x03D97D4E3CD3EE6BD6449466E2fc485C73b7104c
  const signer = '0x903468eF8BC73cd15F31Ee5486D190f1a113318c'
  const fund = "0xee2e35E2c25f7dB7AEB243c8716de38DF3f1Ac45";
  // gamefi mock
  const nft = "0xf2cfA33c194F1772294b3B0fB183d1907654f835";
  // const externalRandom = zeroAddress;
  const externalRandom = "0x0000000000000000000000000000000000000000";

  const ContractFactory = await hre.ethers.getContractFactory("GameFiBox");
  const Contract = await upgrades.deployProxy(ContractFactory,[ "GF-MAT", "GF-MAT",
      "https://gamefi.org/api/v1/boxes/", signer, fund, externalRandom, externalRandom], { initializer: '__GameFiBox_init'});

  const contract = await Contract.deployed();
  console.log("Contract deployed to:", contract.address);

  let data = await contract.addSaleEvent(
      1000, // max suply
      1638174600, // start
      1638624600, // end
      1000, // limit
      nft, // nft
      7501, // start nft
      true // sub event
  )
  console.log('add sale event', data.hash)

  // TODO: change
  const limit = 1000;
  const PRICE = "600000000000000000000";
  const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
  data = await contract.setSubBox(0, [limit], [PRICE], [BUSD])
  console.log('set Sub box', data.hash)

  data = await contract.setMatWhitelist("0xD591beF3B9fa47570F2f07a90961f1c839f77Cfd")
  console.log('set Mat whitelist', data.hash)

  data = await contract.setAllowTransfer(true)
  console.log('set Allow Transfer', data.hash)

  // // set super limit for legends
  // data = await contract.setSuperLimit([
  //   "0x539edd96b903c6bfDA5A54a28A74a85432309a88",
  //   "0x61E98B202DD547665951cB6468C2bDB3D880efC1",
  //   "0xaC6dE9f16c7b9B44C4e5C9073C3a10fA45aB4d5a",
  //   "0x9bA4C6e0594118bA0B9DfF300FaE795Bb1037311",
  //   "0x3C69e20E4Ec8bb4148378f1e5Dfc1d6EA94AA22C",
  //   "0x57a36E40A540FB1744cC30D47D2C7E5888110C5D",
  //   "0xF91fec621564d1D9179Ce8d3FA47a80a3Bb4B0FD",
  //   "0x3506e5f79754e8aAd83152b8E6189b6c5508AAD4",
  //   "0xc924df9194e93dffbb4bdb386e13062a0217476f",
  //   "0x67f46a8e9d98ccb298aa630d779b0ae7c1e00023",
  //   "0x59699cDbf6519042D6074FdbE2408ad993435bD8",
  //   "0x33b34ed6f2de26c2a413CaD15221A0FbA3545E60"
  // ], 20)
  // console.log('set super limit', data.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
