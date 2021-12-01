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

  // We get the contract to deploy: 0xF6805968E6412C3C514912815FE2f32336828399
  // pool 68 for community: 0x0866703DF4c264281B4ff89999cA9A708F851C6b
  // pool 61 for private: 0x84aF440fFa51b3DAcD065FD772F6d682D28C0A6d
  const signer = '0x0866703DF4c264281B4ff89999cA9A708F851C6b'
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
      4499, // max supply
      1638342000, // start
      1638455400, // end
      10, // limit
      zeroAddress, // nft
      0, // start nft
      true // sub event
  )
  console.log('add sale event', data.hash)

  // TODO: change
  const limit = 900;
  const PRICE = "400000000000000000";
  const BNB = "0x0000000000000000000000000000000000000000";
  data = await contract.setSubBox(0,
      [limit, limit, limit, limit, limit - 1],
      [PRICE, PRICE, PRICE, PRICE, PRICE],
      [BNB, BNB, BNB, BNB, BNB])
  console.log('set Sub box', data.hash)

  data = await contract.setExternalMinted('0xF481B6F511686E99e06F2C6508B0bC8b25c3a94A')
  console.log('set external minted', data.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
