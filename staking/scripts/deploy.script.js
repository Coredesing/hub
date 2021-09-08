const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();

  // The reward token address for both allocation and linear pools. This will also be used as staking token in linear pools.
  const rewardToken = process.env.REWARD_TOKEN;
  // The number of reward tokens that got unlocked each block (allocation) 
  const allocRewardPerBlock = "1";
  // The block number when farming start (allocation). 
  // It's ok to set this to zero, the farming will start immediately after adding the first allocation pool.
  const allocStartBlockNumber = "0";

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get contract factory
  const StakingPool = await ethers.getContractFactory(
    'StakingPool',
  );

  // Deploy contract proxy
  const Pool = await upgrades.deployProxy(StakingPool,
    [
      rewardToken, // the reward token address
      ethers.utils.parseEther(allocRewardPerBlock), // the number of reward tokens that got unlocked each block (allocation)
      allocStartBlockNumber // the block number when farming start (allocation)
    ],
    {
      initializer: '__StakingPool_init'
    });
  const pool = await Pool.deployed();

  console.log("StakingPool address:", pool.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });