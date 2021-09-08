const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();

  const poolAddress = process.env.POOL_PROXY_ADDRESS;
  if (!poolAddress) {
    console.log("Pool address not found");
    return;
  }

  console.log("Upgrading contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get contract factory
  const NewPoolFactory = await ethers.getContractFactory(
    'StakingPool',
  );
  // Upgrade contract proxy
  const tx = await upgrades.upgradeProxy(poolAddress, NewPoolFactory);

  console.log("Upgraded StakingPool, transaction: ", tx.deployTransaction && tx.deployTransaction.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });