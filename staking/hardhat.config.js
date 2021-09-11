// hardhat.config.js
require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("hardhat-gas-reporter");

const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
const alchemyKey = process.env.ALCHEMY_API_KEY || '';
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${alchemyKey}`,
      accounts: [privateKey],
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${alchemyKey}`,
      accounts: [privateKey],
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`,
      accounts: [privateKey],
      gasPrice: 80000000000,
    },
    bsc_testnet: {
      url: `https://data-seed-prebsc-1-s2.binance.org:8545/`,
      chainId: 97,
      gasPrice: 80000000000,
      accounts: [privateKey]
    },
    bsc: {
      url: `https://bsc-dataseed.binance.org/`,
      chainId: 56,
      gasPrice: 80000000000,
      accounts: [privateKey]
    },
    polygon_testnet: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      chainId: 80001,
      gasPrice: 80000000000,
      accounts: [privateKey],
    },
    polygon: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      chainId: 137,
      gasPrice: 80000000000,
      accounts: [privateKey],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    enabled: process.env.REPORT_GAS === "true",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },
};