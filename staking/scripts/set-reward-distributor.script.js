const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;

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

  const rewardDistributor = process.env.REWARD_DISTRIBUTOR;
  if (!rewardDistributor) {
    console.log("Reward distributor address not found");
    return;
  }

  let tx = await pool.linearSetRewardDistributor(rewardDistributor);
  await tx.wait(5)
  tx = await pool.allocSetRewardDistributor(rewardDistributor);
  await tx.wait(5)

  console.log("Reward distributor address:", rewardDistributor);
  console.log("One more step, you need to use the reward distributor account to call 'approve' to set an allowance for the staking pool contract to use/spend the rewards");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });