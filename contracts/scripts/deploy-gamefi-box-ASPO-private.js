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

  // We get the contract to deploy: 0x1f7D87fDDd5fF0D26E07E12c91723CD077b523cC
  // pool 68 for community: 0x0866703DF4c264281B4ff89999cA9A708F851C6b
  // pool 61 for private: 0x84aF440fFa51b3DAcD065FD772F6d682D28C0A6d
  const signer = '0x84aF440fFa51b3DAcD065FD772F6d682D28C0A6d'
  const fund = "0xee2e35E2c25f7dB7AEB243c8716de38DF3f1Ac45";
  // gamefi mock
  const nft = "0x0000000000000000000000000000000000000000";
  // const externalRandom = zeroAddress;
  const externalRandom = "0x0000000000000000000000000000000000000000";

  const ContractFactory = await hre.ethers.getContractFactory("GameFiBox");
  const Contract = await upgrades.deployProxy(ContractFactory,[ "GF-ASPO", "GF-ASPO",
    "https://gamefi.org/api/v1/boxes/", signer, fund, externalRandom, externalRandom], { initializer: '__GameFiBox_init'});

  const contract = await Contract.deployed();
  console.log("Contract deployed to:", contract.address);

  let data = await contract.addSaleEvent(
      500, // max supply
      1638342000, // start
      1638455400, // end
      10, // limit
      zeroAddress, // nft
      0, // start nft
      true // sub event
  )
  console.log('add sale event', data.hash)

  // TODO: change
  const limit = 100;
  const PRICE = "360000000000000000";
  const BNB = "0x0000000000000000000000000000000000000000";
  data = await contract.setSubBox(0,
      [limit, limit, limit, limit, limit],
      [PRICE, PRICE, PRICE, PRICE, PRICE],
      [BNB, BNB, BNB, BNB, BNB])
  console.log('set Sub box', data.hash)

  data = await contract.setExternalMinted('0xAA130321FAcE41F687eEDA0960ac6DF25C5c72bD')
  console.log('set external minted', data.hash)

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
    "0x33b34ed6f2de26c2a413CaD15221A0FbA3545E60"
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
