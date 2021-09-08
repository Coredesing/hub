# RedKite Staking Smart Contract

Smart constracts for staking on RedKite platform

## Deploy staking smart contract

Project currently use hardhat for deployment. The variable should import from process.env or similar datasource.

## Plugins

RedKite is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.
Plugin should import from hardhat.config.js

| Plugin | npm |
| ------ | ------ |
| hardhat-ethers | <https://www.npmjs.com/package/@nomiclabs/hardhat-ethers>|
| hardhat-upgrades | <https://www.npmjs.com/package/@openzeppelin/hardhat-upgrades> |
| hardhat-waffle |  <https://www.npmjs.com/package/@nomiclabs/hardhat-waffle>|
| hardhat-web3 | <https://www.npmjs.com/package/@nomiclabs/hardhat-web3> |
| hardhat-etherscan | <https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan> |
| hardhat-gas-reporter | <https://www.npmjs.com/package/hardhat-gas-reporter> |

## Deploy RedKite Staking contract

1. Import hardhat library, embed ethers, upgrades modules

```javascript
const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;
```

2. Configure your reward token, reward per block (allocation), start block number (allocation) before deploy. This reward token will also be used as staking token in linear pools.

```javascript
  // The reward token address for both allocation and linear pools. This will also be used as staking token in linear pools.
  const rewardToken = process.env.REWARD_TOKEN;
  // The number of reward tokens that got unlocked each block (allocation) 
  const allocRewardPerBlock = "1";
  // The block number when farming start (allocation). 
  // It's ok to set this to zero, the farming will start immediately after adding the first allocation pool.
  const allocStartBlockNumber = "0";
```

3. Get contract factory prototype

```javascript
  // Get contract factory
  const StakingPool = await ethers.getContractFactory(
    'StakingPool',
  );
```

4. Wait for deploy success

```javascript
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
```

5. Full example code blocks - don't reuse immediately

```javascript
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
```

## Post-Deployment Note

OpenZeppelin Upgrades will generate a file for each of the networks you work on (`goerli`, `mainnet`, etc). The naming of the file will be `<network_name>.json`.

Public network files like `mainnet.json` or `goerli.json` should be tracked in version control. These contain valuable information about your project’s status in the corresponding network, like the addresses of the contract versions that have been deployed. Such files should be identical for all the contributors of a project.

However, local network files like `unknown-<chain_id>.json` only represent a project’s deployment in a temporary local network such as `ganache-cli` that are only relevant to a single contributor of the project and should not be tracked in version control.

## Script / Config

| Scripts | github |
| ------ | ------ |
| Deploy |  ./scripts/deploy.script.js|
| Upgrade | ./scripts/upgrade.script.js|
| Set Reward Distributor | ./scripts/set-reward-distributor.script.js|
| Add Allocation Pool | ./scripts/add-allocation-pool.script.js|
| Add Linear Pool | ./scripts/add-linear-pool.script.js|
| Config file | ./hardhat.config.js|

## Components

- AllocationPool is a smart contract for staking and earning rewards. The rewards will be based on the amount of token that user staked in and the total amount of token in the pool.

- LinearPool is a smart contract for staking and earning rewards. The APR will be fixed for each pool and will not be based on how much token user staked in.

- StakingPool is a smart contract that inherited 2 kinds of pools from AllocationPool and LinearPool. This contract also allows user to switch from AllocationPool to LinearPool.

## License

MIT
