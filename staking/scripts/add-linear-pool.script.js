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

  const tx = await pool.linearAddPool(
    0, // the maximum number of staking tokens the pool will receive
    0, // the minimum investment amount users need to use in order to join the pool
    0, // the maximum investment amount users can deposit to join the pool
    10, // the APR rate
    duration.days(1).toNumber(), // the duration users need to wait before being able to withdraw and claim the rewards
    0, // the duration users need to wait to receive the principal amount, after unstaking from the pool
    Math.floor((new Date()).getTime() / 1000), // the time when users can start to join the pool
    Math.floor((new Date()).getTime() / 1000) + duration.years(1).toNumber() // the time when users can no longer join the pool
  );
  console.log("Transaction Hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });