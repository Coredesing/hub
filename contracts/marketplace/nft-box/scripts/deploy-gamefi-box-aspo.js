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

  // We get the contract to deploy
  const signer = '0x2Af85Eae91074aa1DA6b3fEafFd5CD15a625c677'
  const fund = "0xB7cEd2807441B5c5FA7a40a97467F73275EdF73f";
  // gamefi mock
  const nft = "0x0000000000000000000000000000000000000000";
  // const externalRandom = zeroAddress;
  const externalRandom = "0x0000000000000000000000000000000000000000";

  const PRICE = "40000000000000"; // TODO: go go go
  const MaxSupply = 100;
  const limit = 10;

  const ContractFactory = await hre.ethers.getContractFactory("GameFiBoxASPO");
  const Contract = await upgrades.deployProxy(ContractFactory,[ "GameFiBox", "BOX",
      "https://gamefi.org/api/v1/boxes", signer, fund, externalRandom, externalRandom], { initializer: '__GameFiBox_init'});

  const contract = await Contract.deployed();
  console.log("Contract deployed to:", contract.address);

  let data = await contract.addSaleEvent(
      MaxSupply,
      1634011201,
      16351515570,
      limit,
      zeroAddress,
      0,
      0,
      false,
      true,
      true
  )
  console.log('add sale event', data.hash)

  data = await contract.setSubBox(0, [MaxSupply/5, MaxSupply/5, MaxSupply/5, MaxSupply/5, MaxSupply/5])
  console.log('set Sub box', data.hash)

  data = await contract.setExternalMinted('0xdb353798DE381690D4e5b58D995a728705C1996d')
  console.log('set external minted', data.hash)

  data = await contract.setPrices([zeroAddress], [4], [3])
  console.log('set price bnb', data.hash)
  // data = await contract.setSuperLimit([
  //     '0x539edd96b903c6bfDA5A54a28A74a85432309a88',
  //     '0x61E98B202DD547665951cB6468C2bDB3D880efC1',
  //     '0x996131EEd1fc6f83F8245602c8D171227311ceAf',
  //     '0xaC6dE9f16c7b9B44C4e5C9073C3a10fA45aB4d5a',
  //     '0x16CdDd6e47661DC4D709804A7f7f687CFa6eFca6',
  //     '0x9bA4C6e0594118bA0B9DfF300FaE795Bb1037311',
  //     '0x0C5D8C995C19af7d5691082cB5Cca2622b2cFa42',
  //     '0x3C69e20E4Ec8bb4148378f1e5Dfc1d6EA94AA22C',
  //     '0x57a36E40A540FB1744cC30D47D2C7E5888110C5D',
  //     '0xF91fec621564d1D9179Ce8d3FA47a80a3Bb4B0FD',
  //     '0x3506e5f79754e8aAd83152b8E6189b6c5508AAD4',
  //     '0xB67259BdE0E2C8204a1e12b0e164a2e5f536802F'
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
