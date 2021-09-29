'use strict'

const RateSetting = use('App/Models/RateSetting');

const crypto = use('crypto');
const BigNumber = use('bignumber.js');
const axios = use('axios');
const moment = use('moment');

const Const = use('App/Common/Const');
const ErrorFactory = use('App/Common/ErrorFactory');
const RedisUtils = use('App/Common/RedisUtils')
const RedisStakingPoolUtils = use('App/Common/RedisStakingPoolUtils')
const StakingPoolModel = use('App/Models/StakingPool');

const CONFIGS_FOLDER = '../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.CAMPAIGN];
const STAKING_CONTRACT_CONFIGS = NETWORK_CONFIGS.contracts[Const.CONTRACTS.STAKING_POOL];
const { abi: STAKING_POOL_CONTRACT_ABI } = STAKING_CONTRACT_CONFIGS.CONTRACT_DATA;
const ERC721_ABI = require('../../blockchain_configs/contracts/Erc721');
const { abi: CONTRACT_ABI } = CONTRACT_CONFIGS.CONTRACT_DATA;
const { abi: CONTRACT_CLAIM_ABI } = CONTRACT_CONFIGS.CONTRACT_CLAIMABLE;

const GAFI_SMART_CONTRACT_ADDRESS = process.env.GAFI_SMART_CONTRACT_ADDRESS
const UNI_LP_GAFI_SMART_CONTRACT_ADDRESS = process.env.UNI_LP_GAFI_SMART_CONTRACT_ADDRESS
const STAKING_POOL_SMART_CONTRACT = process.env.STAKING_POOL_SMART_CONTRACT
const LEGEND_DATA = NETWORK_CONFIGS.contracts[Const.CONTRACTS.Legend].DATA;
const BONUS_DATA = NETWORK_CONFIGS.contracts[Const.CONTRACTS.STAKING_POOL].BONUS;
const ONE_UNIT = new BigNumber(Math.pow(10, 18))

/**
 * Switch Link Web3
 */
const isDevelopment = process.env.NODE_ENV === 'development';
console.log('isDevelopment:===========>', isDevelopment, process.env.NODE_ENV);
const getWeb3ProviderLink = () => {
  if (isDevelopment) {
    const WEB3_API_URLS = [
      'https://goerli.infura.io/v3/c745d07314904c539668b553dbd6b670',
      'https://goerli.infura.io/v3/f1464dc327c64a93a31220b50334bf78',
      'https://goerli.infura.io/v3/2bf3314408cb41fe9e6e34f706d30d22',
      'https://goerli.infura.io/v3/1462716938c549688773a726a3f3114f',
      'https://goerli.infura.io/v3/25fd6f14fda14ae2b14c4176d0794509',
      'https://goerli.infura.io/v3/cc59d48c26f54ab58d831f545eda2bb7',
      'https://goerli.infura.io/v3/3a18fd787c2342c4915364de4955bcf5',
    ];
    const randomElement = WEB3_API_URLS[Math.floor(Math.random() * WEB3_API_URLS.length)];
    console.log('Random WEB3_API_URL: ===============> ', randomElement);
    return randomElement;
  } else {
    return NETWORK_CONFIGS.WEB3_API_URL;
  }
};
const getWeb3BscProviderLink = () => {
  if (isDevelopment) {
    const WEB3_API_URLS = [
      'https://data-seed-prebsc-1-s1.binance.org:8545',
    ];
    const randomElement = WEB3_API_URLS[Math.floor(Math.random() * WEB3_API_URLS.length)];
    return randomElement;
  } else {
    return NETWORK_CONFIGS.WEB3_BSC_API_URL;
  }
};
const getWeb3PolygonProviderLink = () => {
  if (isDevelopment) {
    const WEB3_API_URLS = [
      'https://rpc-mumbai.maticvigil.com/'
    ];
    const randomElement = WEB3_API_URLS[Math.floor(Math.random() * WEB3_API_URLS.length)];
    return randomElement;
  } else {
    return NETWORK_CONFIGS.WEB3_POLYGON_API_URL;
  }
};

const Web3 = require('web3');
// const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
// const web3Bsc = new Web3(NETWORK_CONFIGS.WEB3_BSC_API_URL);
const web3 = new Web3(getWeb3ProviderLink());
const web3Bsc = new Web3(getWeb3BscProviderLink());
const web3Polygon = new Web3(getWeb3PolygonProviderLink());

const networkToWeb3 = {
  [Const.NETWORK_AVAILABLE.ETH]: web3,
  [Const.NETWORK_AVAILABLE.BSC]: web3Bsc,
  [Const.NETWORK_AVAILABLE.POLYGON]: web3Polygon
}

// Tier Smart contract
const { abi: CONTRACT_TIER_ABI } = require('../../blockchain_configs/contracts/Normal/Tier.json');
const TIER_SMART_CONTRACT = process.env.TIER_SMART_CONTRACT;
const { abi: CONTRACT_ERC20_ABI } = require('../../blockchain_configs/contracts/Normal/Erc20.json');
const ETH_SMART_CONTRACT_USDT_ADDRESS = process.env.ETH_SMART_CONTRACT_USDT_ADDRESS;
const ETH_SMART_CONTRACT_USDC_ADDRESS = process.env.ETH_SMART_CONTRACT_USDC_ADDRESS;
const BSC_SMART_CONTRACT_USDT_ADDRESS = process.env.BSC_SMART_CONTRACT_USDT_ADDRESS;
const BSC_SMART_CONTRACT_USDC_ADDRESS = process.env.BSC_SMART_CONTRACT_USDC_ADDRESS;
const BSC_SMART_CONTRACT_BUSD_ADDRESS = process.env.BSC_SMART_CONTRACT_BUSD_ADDRESS;
const EPKF_BONUS_LINK = process.env.EPKF_BONUS_LINK || '';
const POLYGON_SMART_CONTRACT_USDT_ADDRESS = process.env.POLYGON_SMART_CONTRACT_USDT_ADDRESS;
const POLYGON_SMART_CONTRACT_USDC_ADDRESS = process.env.POLYGON_SMART_CONTRACT_USDC_ADDRESS;

const PoolStatus = Const.POOL_STATUS;

/**
 * Generate "random" alpha-numeric string.
 *
 * @param  {int}      length - Length of the string
 * @return {string}   The result
 */
const randomString = async (length = 40) => {
  let string = ''
  let len = string.length

  if (len < length) {
    let size = length - len
    let bytes = await crypto.randomBytes(size)
    let buffer = new Buffer(bytes)

    string += buffer
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substr(0, size)
  }

  return string
};

const doMask = (obj, fields) => {
  for (const prop in obj) {
    if (!obj.hasOwnProperty(prop)) continue;
    if (fields.indexOf(prop) !== -1) {
      obj[prop] = this.maskEmail(obj[prop]);
    } else if (typeof obj[prop] === 'object') {
      this.doMask(obj[prop], fields);
    }
  }
};

const maskEmail = async (email) => {
  const preEmailLength = email.split("@")[0].length;
  // get number of word to hide, half of preEmail
  const hideLength = ~~(preEmailLength / 2);
  console.log(hideLength);
  // create regex pattern
  const r = new RegExp(".{" + hideLength + "}@", "g")
  // replace hide with ***
  email = email.replace(r, "***@");
  return email;
};

const maskWalletAddress = async (wallet) => {
  const preWalletLength = wallet.length;

  // get number of word to hide, 1/3 of preWallet
  const hideLength = Math.floor(preWalletLength / 3);

  // replace hide with ***
  let r = wallet.substr(hideLength, hideLength);
  wallet = wallet.replace(r, "*************");

  return wallet;
};

const responseErrorInternal = (message) => {
  return {
    status: 500,
    message: message || 'Internal server error',
    data: null,
  }
};

const responseNotFound = (message) => {
  return {
    status: 404,
    message: message || 'Not Found!',
    data: null,
  }
};

const responseBadRequest = (message) => {
  return {
    status: 400,
    message: message || 'Looks like this is unkown request, please try again or contact us.',
    data: null,
  }
};

const responseSuccess = (data = null, message) => {
  return {
    status: 200,
    message: message || 'Success!',
    data,
  }
};

const checkSumAddress = (address) => {
  const addressVerified = Web3.utils.toChecksumAddress(address);
  return addressVerified;
};

const paginationArray = (array, page_number, page_size) => {
  const newData = JSON.parse(JSON.stringify(array));
  const pageData = newData.slice((page_number - 1) * page_size, page_number * page_size);
  const dataLength = newData.length;
  return {
    data: pageData,
    total: dataLength,
    perPage: page_size,
    lastPage: Math.ceil(dataLength / page_size),
    page: page_number,
  };
};

const getTiers = () => {
  let tiers = []
  let delays = []
  try {
    tiers = JSON.parse(process.env.USER_TIERS)
    delays = JSON.parse(process.env.DELAY_DURATIONS)
  } catch (error) {
    tiers = [15, 100, 400, 1000]
    delays = [5, 8, 12, 15]
  }
  return {
    tiers: tiers.map(tier => Web3.utils.toWei(tier.toString())),
    delays: delays
  }
}

const getRateSetting = async () => {
  let rateSetting
  try {
    if (await RedisUtils.checkExistRedisRateSetting()) {
      rateSetting = JSON.parse(await RedisUtils.getRedisRateSetting())
    } else {
      rateSetting = JSON.parse(JSON.stringify(await RateSetting.query().first()));
      RedisUtils.createRedisRateSetting(rateSetting)
    }
  } catch (error) {
  }

  if (!rateSetting) {
    rateSetting = {
      lp_pkf_rate: 0,
      spkf_rate: 0,
      epkf_rate: 0,
    }
  }

  return rateSetting
}

const getStakingPoolInstance = async () => {
  const pool = STAKING_POOL_SMART_CONTRACT
  if (!pool) {
    return null
  }

  const stakingPoolSC = new networkToWeb3[Const.NETWORK_AVAILABLE.BSC].eth.Contract(STAKING_POOL_CONTRACT_ABI, pool);
  if (!stakingPoolSC) {
    return null
  }

  return stakingPoolSC
}

const getStakingPoolsDetail = async (data) => {
  if (!data) {
    return
  }

  const instance = await getStakingPoolInstance()
  if (!instance) {
    return data
  }

  data = JSON.parse(JSON.stringify(data))
  try {
    data = await Promise.all(data.map(async (item) => {
      if (item.staking_type === 'linear') {
        const scData = await instance.methods.linearPoolInfo(item.pool_id).call()
        item.cap = scData.cap
        item.minInvestment = scData.minInvestment
        item.maxInvestment = scData.maxInvestment
        item.APR = scData.APR
        item.lockDuration = scData.lockDuration
        item.delayDuration = scData.delayDuration
        item.startJoinTime = scData.startJoinTime
        item.endJoinTime = scData.endJoinTime
      }

      return item
    }))

  } catch (e) {
    return
  }

  return data
};

const getStakingPool = async (wallet_address) => {
  let pools = []
  if (await RedisStakingPoolUtils.existRedisStakingPoolsDetail()) {
    pools = JSON.parse(await RedisStakingPoolUtils.getRedisStakingPoolsDetail())
  }

  if (!pools || !Array.isArray(pools) || pools.length < 1) {
    pools = await StakingPoolModel.query().fetch();
    pools = JSON.parse(JSON.stringify(pools))
  }

  let stakedToken = new BigNumber('0');
  let stakedUni = new BigNumber('0');
  for (const pool of pools) {
    if (!pool.pool_address) {
      continue;
    }

    const stakingPoolSC = new networkToWeb3[Const.NETWORK_AVAILABLE.BSC].eth.Contract(STAKING_POOL_CONTRACT_ABI, pool.pool_address);
    if (!stakingPoolSC) {
      continue;
    }

    try {
      switch (pool.staking_type) {
        case 'alloc':
          const [allocPoolInfo, allocUserInfo] = await Promise.all([
            stakingPoolSC.methods.allocPoolInfo(pool.pool_id).call(),
            stakingPoolSC.methods.allocUserInfo(pool.pool_id, wallet_address).call()
          ]);

          if (allocPoolInfo.lpToken.toLowerCase() === GAFI_SMART_CONTRACT_ADDRESS.toLowerCase()) {
            stakedToken = stakedToken.plus(new BigNumber(allocUserInfo.amount));
            break;
          }

          if (allocPoolInfo.lpToken.toLowerCase() === UNI_LP_GAFI_SMART_CONTRACT_ADDRESS.toLowerCase()) {
            stakedUni = stakedUni.plus(new BigNumber(allocUserInfo.amount));
            break;
          }

          break;
        case 'linear':
          const [linearAcceptedToken, linearStakingData] = await Promise.all([
            // stakingPoolSC.methods.linearAcceptedToken().call(),
            GAFI_SMART_CONTRACT_ADDRESS,
            stakingPoolSC.methods.linearStakingData(pool.pool_id, wallet_address).call()
          ]);

          if (linearAcceptedToken.toLowerCase() === GAFI_SMART_CONTRACT_ADDRESS.toLowerCase()) {
            stakedToken = stakedToken.plus(new BigNumber(linearStakingData.balance));
          }
          break;
        default:
      }
    } catch (err) {
      console.log('getStakingPool', err)
    }
  }

  return {
    staked: stakedToken.toFixed(),
    stakedUni: stakedUni.toFixed(),
  };
}

const getUserTierSmartWithCached = async (wallet_address) => {
  if (await RedisUtils.checkExistRedisUserTierBalance(wallet_address)) {
    return JSON.parse(await RedisUtils.getRedisUserTierBalance(wallet_address));
  }

  const tierInfo = await getUserTierSmart(wallet_address);
  RedisUtils.createRedisUserTierBalance(wallet_address, tierInfo);

  return tierInfo
}

const getUserTierSmart = async (wallet_address) => {
  try {
    // Get cached Rate Setting
    // const rateSetting = await getRateSetting()
    const tiers = (await getTiers()).tiers
    const stakingData = await getStakingPool(wallet_address)

    // Caculate PKF Staked
    let stakedToken = new BigNumber((stakingData && stakingData.staked) || 0)

    // Caculate LP-PKF Staked
    // TODO: .multipliedBy(rateSetting.lp_pkf_rate)
    // let stakedUni = new BigNumber((stakingData && stakingData.stakedUni) || 0);
    let stakedUni = new BigNumber(0);

    // Bonus points
    const bonus = new BigNumber(getBonusPoint(wallet_address)).multipliedBy(ONE_UNIT)
    stakedToken = stakedToken.plus(bonus)

    // get tiers
    let userTier = 0;
    tiers.map((tokenRequire, index) => {
      // master: Fetch NFT Owner
      if (index === tiers.length - 1) {
        if (getLegendIdByOwner(wallet_address) && stakedToken.gte(tokenRequire)) {
          userTier = index + 1;
        }
        return;
      }

      if (stakedToken.gte(tokenRequire)) {
        userTier = index + 1;
      }
    });

    return [
      userTier,
      stakedToken.plus(stakedUni).dividedBy(ONE_UNIT).toFixed(),
      stakedToken.dividedBy(ONE_UNIT).toFixed(),
      0,
    ];
  }
  catch (e) {
    return [0, 0, 0, 0]
  }
};

const getContractInstanceDev = async (camp) => {
  const web3Dev = new Web3(getWeb3ProviderLink());
  const web3BscDev = new Web3(getWeb3BscProviderLink());
  const web3PolygonDev = new Web3(getWeb3PolygonProviderLink());
  const networkToWeb3Dev = {
    [Const.NETWORK_AVAILABLE.ETH]: web3Dev,
    [Const.NETWORK_AVAILABLE.BSC]: web3BscDev,
    [Const.NETWORK_AVAILABLE.POLYGON]: web3PolygonDev
  }

  return new networkToWeb3Dev[camp.network_available].eth.Contract(CONTRACT_ABI, camp.campaign_hash);
};

const getContractInstance = async (camp) => {
  if (isDevelopment) {  // Prevent limit request Infura when dev
    return getContractInstanceDev(camp);
  }

  return new networkToWeb3[camp.network_available].eth.Contract(CONTRACT_ABI, camp.campaign_hash);
}

const getERC721TokenContractInstanceDev = async (camp) => {
  const web3Dev = new Web3(getWeb3ProviderLink());
  const web3BscDev = new Web3(getWeb3BscProviderLink());
  const web3PolygonDev = new Web3(getWeb3PolygonProviderLink());
  const networkToWeb3Dev = {
    [Const.NETWORK_AVAILABLE.ETH]: web3Dev,
    [Const.NETWORK_AVAILABLE.BSC]: web3BscDev,
    [Const.NETWORK_AVAILABLE.POLYGON]: web3PolygonDev
  }
  return new networkToWeb3Dev[camp.network_available].eth.Contract(ERC721_ABI, camp.token);
};

const getERC721TokenContractInstance = async (camp) => {
  if (isDevelopment) {  // Prevent limit request Infura when dev
    return getERC721TokenContractInstanceDev(camp);
  }
  return new networkToWeb3[camp.network_available].eth.Contract(ERC721_ABI, camp.token);
}

const getContractClaimInstance = async (camp) => {
  return new networkToWeb3[camp.network_available].eth.Contract(CONTRACT_CLAIM_ABI, camp.campaign_hash);
}

const getOfferCurrencyInfo = async (camp) => {
  // init pool contract
  const poolContract = await getContractInstance(camp);
  // get convert rate token erc20 -> our token

  let scCurrency, unit;
  switch (camp.accept_currency) {
    case Const.ACCEPT_CURRENCY.USDT:
    case Const.ACCEPT_CURRENCY.USDC:
      let networkCurrencyToContract = {
        [Const.ACCEPT_CURRENCY.USDT]: {
          [Const.NETWORK_AVAILABLE.ETH]: {
            scCurrency: ETH_SMART_CONTRACT_USDT_ADDRESS,
            uint: 6
          },
          [Const.NETWORK_AVAILABLE.BSC]: {
            scCurrency: BSC_SMART_CONTRACT_USDT_ADDRESS,
            uint: 18
          },
          [Const.NETWORK_AVAILABLE.POLYGON]: {
            scCurrency: POLYGON_SMART_CONTRACT_USDT_ADDRESS,
            uint: 6
          }
        },
        [Const.ACCEPT_CURRENCY.USDC]: {
          [Const.NETWORK_AVAILABLE.ETH]: {
            scCurrency: ETH_SMART_CONTRACT_USDC_ADDRESS,
            uint: 6
          },
          [Const.NETWORK_AVAILABLE.BSC]: {
            scCurrency: BSC_SMART_CONTRACT_USDC_ADDRESS,
            uint: 18
          },
          [Const.NETWORK_AVAILABLE.POLYGON]: {
            scCurrency: POLYGON_SMART_CONTRACT_USDC_ADDRESS,
            uint: 6
          }
        }
      }
      scCurrency = networkCurrencyToContract[camp.accept_currency][camp.network_available].scCurrency;
      unit = networkCurrencyToContract[camp.accept_currency][camp.network_available].uint;
      break;
    case Const.ACCEPT_CURRENCY.BUSD:
      scCurrency = BSC_SMART_CONTRACT_BUSD_ADDRESS;
      unit = 18;
      break;
    case Const.ACCEPT_CURRENCY.ETH:
    case Const.ACCEPT_CURRENCY.BNB:
    case Const.ACCEPT_CURRENCY.POLYGON:
      scCurrency = '0x0000000000000000000000000000000000000000';
      unit = 18;
      break;
    default:
      console.log(`Do not found currency support ${camp.accept_currency} of campaignId ${camp.id}`);
      return ErrorFactory.responseErrorInternal();
  }
  // call to SC to get rate
  const receipt = await Promise.all([
    poolContract.methods.getOfferedCurrencyRate(scCurrency).call(),
    poolContract.methods.getOfferedCurrencyDecimals(scCurrency).call()
  ]);

  const rate = receipt[0];
  const decimal = receipt[1];
  return [rate, decimal, unit];
}

const getTokenSoldSmartContract = async (pool) => {
  if (!pool.campaign_hash) {
    return 0;
  }
  const isClaimable = pool.pool_type === Const.POOL_TYPE.CLAIMABLE;
  const poolContract = isClaimable ? await getContractClaimInstance(pool) : await getContractInstance(pool);

  try {
    if (pool.token_type === Const.TOKEN_TYPE.ERC721 && pool.process === Const.PROCESS.ONLY_CLAIM) {
      return await poolContract.methods.tokenClaimed().call();
    }

    let tokenSold = await poolContract.methods.tokenSold().call();
    if (pool.token_type === 'erc721') {
      return tokenSold
    }
    const decimal = pool.decimals ? pool.decimals : 18

    tokenSold = new BigNumber(tokenSold).div(new BigNumber(10).pow(decimal)).toFixed();
    return tokenSold;
  }
  catch (e) {
    return 0
  }
};

/**
 * Functions: Calculate Pool Progress
 */
const checkPoolIsFinish = (pool) => {
  const currentTime = moment().unix();
  return (pool.finish_time && currentTime > pool.finish_time);
};

const getProgressWithPools = (pool) => {
  if (!pool) {
    return {
      progress: '0',
      tokenSold: '0',
      totalSoldCoin: '0',
    };
  }

  let tokenSold = pool.tokenSold || pool.token_sold || '0';
  let totalSoldCoin = pool.totalSoldCoin || pool.total_sold_coin || '0';
  let tokenSoldDisplay = pool.tokenSoldDisplay || pool.token_sold_display || '0';
  let progressDisplay = pool.progressDisplay || pool.progress_display || '0';
  let progress = '0';

  const isFinish = checkPoolIsFinish(pool);
  if (isFinish) {
    return {
      progress: '100',
      tokenSold: tokenSold,
      totalSoldCoin: totalSoldCoin,
    }
  }

  // Merge config display with real
  const originTokenSold = tokenSold;
  tokenSold = new BigNumber(tokenSold).plus(tokenSoldDisplay).toFixed();

  // Normal Case
  if (new BigNumber(tokenSold).gt(totalSoldCoin)) { // If tokenSold > totalSoldCoin ==> tokenSold = totalSoldCoin
    tokenSold = totalSoldCoin;
  }

  // Merge config display with real
  const totalSoldCoinDiv = totalSoldCoin > 0 ? totalSoldCoin : 1;
  if (new BigNumber(progressDisplay).gt(0)) { // progressDisplay > 0
    progress = new BigNumber(originTokenSold).div(totalSoldCoinDiv).multipliedBy(100).plus(progressDisplay).toFixed();
  } else {
    progress = new BigNumber(tokenSold).div(totalSoldCoinDiv).multipliedBy(100).toFixed();
  }

  if (new BigNumber(progress).lte(0)) {
    progress = '0';
  }
  if (new BigNumber(progress).gte(new BigNumber(99.9))) {
    progress = '100';
  }

  return {
    progress,
    tokenSold,
    totalSoldCoin,
  }
};

/**
 * Functions: Task Update Pool Status / Token Sold
 * Maintain Pool Status in Tasks:
 *    /app/Task/UpdateClaimablePoolInformationTask.js
 *    /app/Task/UpdatePoolInformationTask.js
 */
const getLastClaimConfig = (poolDetails) => {
  if (poolDetails.campaignClaimConfig && poolDetails.campaignClaimConfig.length > 0) {
    return poolDetails.campaignClaimConfig[poolDetails.campaignClaimConfig.length - 1];
  }
  return null;
};

const getLastClaimConfigTime = (poolDetails) => {
  const lastClaim = getLastClaimConfig(poolDetails);
  if (lastClaim) {
     // +1week
    return new BigNumber(lastClaim.start_time).plus(7 * 24 * 3600).toFixed();
  }
  return null;
};

const getLastActualFinishTime = (poolDetails) => {
  if (poolDetails.finish_time) {
     // +12h
    return new BigNumber(poolDetails.finish_time).plus(12 * 3600).toFixed();
  }
  return null;
};

const getFirstClaimConfig = (poolDetails) => {
  if (poolDetails && poolDetails.campaignClaimConfig && poolDetails.campaignClaimConfig.length > 0) {
    return poolDetails.campaignClaimConfig[0];
  }
  return null;
};

const getPoolStatusByPoolDetail = async (poolDetails, tokenSold) => {
  if (!poolDetails) {
    return PoolStatus.TBA;
  }

  const firstClaimConfig = () => {
    return getFirstClaimConfig(poolDetails);
  };
  const lastClaimConfig = () => {
    return getLastClaimConfig(poolDetails);
  };
  const lastClaimConfigTime = () => {
    return getLastClaimConfigTime(poolDetails);
  };

  const startBuyTimeField = () => {
    return poolDetails.start_time;
  };
  const endBuyTimeField = () => {
    return poolDetails.finish_time;
  };
  const startJoinTimeField = () => {
    return poolDetails.start_join_pool_time;
  };
  const endJoinTimeField = () => {
    return poolDetails.end_join_pool_time;
  };
  const releaseTimeField = () => {
    let releaseTime = poolDetails && poolDetails.release_time;
    const firstClaim = firstClaimConfig();
    if (firstClaim) {
      releaseTime = firstClaim.start_time;
    }
    return releaseTime;
  };
  const amountField = () => {
    return poolDetails.total_sold_coin;
  };

  const poolTypeField = () => {
    return poolDetails.pool_type;
  };
  const buyTypeField = () => {
    return poolDetails.buy_type;
  };

  const startBuyTime = startBuyTimeField() ? new Date(Number(startBuyTimeField()) * 1000) : undefined;
  const endBuyTime = endBuyTimeField() ? new Date(Number(endBuyTimeField()) * 1000) : undefined;
  const startJoinTime = startJoinTimeField() ? new Date(Number(startJoinTimeField()) * 1000) : undefined;
  const endJoinTime = endJoinTimeField() ? new Date(Number(endJoinTimeField()) * 1000) : undefined;
  const releaseTime = releaseTimeField() ? new Date(Number(releaseTimeField()) * 1000) : undefined;
  const isClaimable = poolTypeField() !== Const.POOL_TYPE.SWAP;
  const buyType = buyTypeField();

  // const soldProgress = new BigNumber(tokenSold).div(amountField() || 1).toFixed();
  // const soldProgress = new BigNumber(tokenSold).div(amountField() || 1).multipliedBy(100).toFixed();
  let { progress } = getProgressWithPools({
    ...poolDetails,
    tokenSold: tokenSold || poolDetails.tokenSold || poolDetails.token_sold || '0',
  });

  const soldProgress = progress;
  const today = new Date().getTime();
  const requiredReleaseTime = isClaimable ? !releaseTime : false;

  // Check TBA Status
  if ((!startJoinTime || !endJoinTime) && buyType === Const.BUY_TYPE.WHITELIST_LOTTERY) {
    return PoolStatus.TBA;
  }

  if ((!startBuyTime || !endBuyTime) && buyType === Const.BUY_TYPE.FCFS) {
    return PoolStatus.TBA;
  }

  // Check Upcoming Status
  if (startJoinTime && today < startJoinTime.getTime()) {
    return PoolStatus.UPCOMING;
  }

  // exist start_join_time
  // but don't exist start_buy_time
  if (startJoinTime && !startBuyTime) {
    return PoolStatus.UPCOMING;
  }

  // or current time < start buy time
  if (startBuyTime && today < startBuyTime.getTime()) {
    return PoolStatus.UPCOMING;
  }
  if (startJoinTime && endJoinTime && today > startJoinTime.getTime() && today < endJoinTime.getTime()) {
    return PoolStatus.UPCOMING;
  }
  if (endJoinTime && startBuyTime && today > endJoinTime.getTime() && today < startBuyTime.getTime()) {
    return PoolStatus.UPCOMING;
  }

  // Check Claimable Status
  const lastClaimTime = lastClaimConfigTime();
  if (!lastClaimTime && poolDetails.process && poolDetails.process === Const.PROCESS.ONLY_CLAIM) {
    return PoolStatus.FILLED;
  }

  if (
    isClaimable &&
    releaseTime && lastClaimTime &&
    releaseTime.getTime() <= today && today < (lastClaimTime * 1000)
  ) {
    if (poolDetails.process && poolDetails.process === Const.PROCESS.ONLY_CLAIM) {
      return PoolStatus.FILLED;
    }

    return PoolStatus.CLAIMABLE;
  }

  const actualFinishTime = getLastActualFinishTime(poolDetails);
  const now = moment().unix();
  if (actualFinishTime && actualFinishTime < now) {
    return PoolStatus.CLOSED;
  }

  if (new BigNumber(soldProgress || 0).gte(new BigNumber(99.9))) {
    return PoolStatus.CLOSED;
  }

  if (releaseTime && actualFinishTime && actualFinishTime > now) {
    // Check Filled Status
    // if (new BigNumber(soldProgress || 0).gte(99)) { // soldProgress >=99
    //   return PoolStatus.FILLED;
    // }
    if (
      endBuyTime &&
      endBuyTime.getTime() <= today && today < releaseTime.getTime()
    ) {
      return PoolStatus.FILLED;
    }

    // Check Progress Status
    if (
      releaseTime && today < releaseTime.getTime()
    ) {
      return PoolStatus.SWAP; // In Progress
    }
  }

  return PoolStatus.CLOSED;
};

const getDecimalsByTokenAddress = async ({ network = Const.NETWORK_AVAILABLE.ETH, address }) => {
  const contractToken = new networkToWeb3[network].eth.Contract(CONTRACT_ERC20_ABI, address);
  const decimals = await contractToken.methods.decimals().call();
  return {
    [checkSumAddress(address)]: +decimals
  }
}

const getStakingProvider = async () => {
  return networkToWeb3[Const.NETWORK_AVAILABLE.BSC]
}

const getPathExportUsers = (fileName) => {
  return `download/export_users/${fileName}`
}

const getLegendData = () => {
  return LEGEND_DATA;
}

const getLegendIdByOwner = (wallet_address) => {
  if (!LEGEND_DATA || !wallet_address) {
    return
  }

  const data = LEGEND_DATA.filter(data => data.wallet_address.toLowerCase() === wallet_address.toLowerCase() && data.valid === true);
  if (!data || data.length < 1) {
    return
  }

  return data[0]
}

const getBonusPoint = (wallet_address) => {
  if (!BONUS_DATA) {
    return 0
  }

  const data = BONUS_DATA.filter(data => data.wallet_address === wallet_address);
  if (!data || data.length < 1) {
    return 0
  }

  const bonus = parseInt(data[0].gafi)

  return isNaN(bonus) ? 0 : bonus
}

const checkIsInPreOrderTime = (poolDetails, currentUserTierLevel) => {
  // if (!poolDetails) {
  //   return false;
  // }
  // if (currentUserTierLevel < poolDetails.pre_order_min_tier) {
  //   return false;
  // }
  //
  // let startPreOrderTime = poolDetails.startPreOrderTime || poolDetails.start_pre_order_time;
  // let startBuyTime = poolDetails.startBuyTime || poolDetails.start_time;
  // if (!startPreOrderTime || !startBuyTime) {
  //   return false;
  // }
  //
  // const now = moment().unix();
  // if (startPreOrderTime < now && now < startBuyTime) {
  //   return true;
  // }
  return false;
};

module.exports = {
  randomString,
  doMask,
  maskEmail,
  maskWalletAddress,
  responseSuccess,
  responseNotFound,
  responseErrorInternal,
  responseBadRequest,
  checkSumAddress,
  paginationArray,
  getERC721TokenContractInstance,
  getUserTierSmartWithCached,
  getUserTierSmart,
  getContractInstance,
  getContractClaimInstance,
  getStakingPoolInstance,
  getStakingPoolsDetail,
  getOfferCurrencyInfo,
  getTokenSoldSmartContract,
  getPoolStatusByPoolDetail,
  getProgressWithPools,
  checkPoolIsFinish,
  getWeb3ProviderLink,
  getWeb3BscProviderLink,

  getLastClaimConfig,
  getLastClaimConfigTime,
  getLastActualFinishTime,
  getFirstClaimConfig,
  getDecimalsByTokenAddress,
  getTiers,
  getPathExportUsers,
  getStakingProvider,
  checkIsInPreOrderTime,

  getLegendData,
  getLegendIdByOwner,
};
