const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;
const { BigNumber } = ethers;

const duration = {
  seconds: function (val) {
    return BigNumber.from(val);
  },
  minutes: function (val) {
    return BigNumber.from(val).mul(this.seconds("60"));
  },
  hours: function (val) {
    return BigNumber.from(val).mul(this.minutes("60"));
  },
  days: function (val) {
    return BigNumber.from(val).mul(this.hours("24"));
  },
  weeks: function (val) {
    return BigNumber.from(val).mul(this.days("7"));
  },
  years: function (val) {
    return BigNumber.from(val).mul(this.days("365"));
  },
};

async function main() {
  const [deployer] = await ethers.getSigners();

  const poolAddress = process.env.POOL_PROXY_ADDRESS;
  if (!poolAddress) {
    console.log("Pool address not found");
    return;
  }

  console.log("Calling contract with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get contract factory
  const PoolFactory = await ethers.getContractFactory(
    'StakingPool',
  );
  const pool = await PoolFactory.attach(poolAddress);
  console.log("StakingPool address:", pool.address);

  // Set the token which this pool will accept
  const acceptedToken = 'staking-token-address';

  const tx = await pool.allocAddPool(
    "100", // the allocation point of the pool, used when calculating total reward the whole pool will receive each block
    acceptedToken, // the token which this pool will accept
    duration.days(0) // the duration user need to wait when withdraw
  );
  console.log("Transaction Hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });