const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();

  const poolAddress = process.env.POOL_PROXY_ADDRESS || '0x10B95B7B86F7128613277ACB1be89fbc4AFfdEAc';
  if (!poolAddress) {
    console.log("Pool address not found");
    return;
  }

  console.log("Upgrading contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log("Proxy address:", poolAddress);

  // Get contract factory
  const NewPoolFactory = await ethers.getContractFactory(
      'Marketplace',
  );
  // Upgrade contract proxy
  const tx = await upgrades.upgradeProxy(poolAddress, NewPoolFactory);

  console.log("Upgraded Marketplace, transaction: ", tx.deployTransaction.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });