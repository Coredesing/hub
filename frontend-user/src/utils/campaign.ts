import _ from "lodash";
import moment from "moment";
import BigNumber from "bignumber.js";
import {
  ACCEPT_CURRENCY,
  CONVERSION_RATE,
  POOL_IS_PRIVATE,
  POOL_STATUS,
  POOL_STATUS_TEXT,
  TOKEN_STAKE_SYMBOLS,
} from "../constants";
import { convertFromWei, getPoolContract } from "../services/web3";
import axios from "axios";
import { getRateSettings } from "../request/rate";
import { getRates } from "../store/actions/sota-tiers";
import {formatRoundUp, numberWithCommas} from "./formatNumber";
import {getIconCurrencyUsdt} from "./usdt";

export const checkIsFinishTime = (campaignDetail: any): boolean => {
  // console.log("campaignDetail", campaignDetail);

  const closeTime = _.get(campaignDetail, "closeTime", "");
  let isFinish = false;
  if (closeTime) {
    const closeTimeDate = moment.unix(parseInt(closeTime)).toDate();
    const currentDate = new Date();
    if (currentDate >= closeTimeDate) {
      isFinish = true;
    }
  }

  return isFinish;
};

export const getTokenRemainingCanBuy = (campaignDetail: any): string => {
  if (!campaignDetail) return "0";
  const tokenLeft = _.get(campaignDetail, "tokenLeft", 0);
  const tokenClaimed = _.get(campaignDetail, "tokenClaimed", 0);
  let remainTokenAvailable = new BigNumber(tokenLeft).plus(tokenClaimed);

  return remainTokenAvailable.toFixed();
};

export const checkIsBetweenCloseTimeAndReleaseTime = (
  campaignDetail: any
): boolean => {
  const closeTime = _.get(campaignDetail, "closeTime", "");
  const releaseTime = _.get(campaignDetail, "releaseTime", "");

  let isBetween = false;
  if (closeTime && releaseTime) {
    const closeTimeDate = moment.unix(parseInt(closeTime)).toDate();
    const releaseTimeDate = moment.unix(parseInt(releaseTime)).toDate();
    const currentDate = new Date();
    if (closeTimeDate <= currentDate && currentDate < releaseTimeDate) {
      isBetween = true;
    }
  }

  return isBetween;
};

export const getAccessPoolText = (pool: any) => {
  if (!pool) return "";
  const isPrivate = pool?.is_private || pool?.isPrivate;
  const buyType = pool?.buy_type || pool?.buyType || pool?.method;
  if (isPrivate == POOL_IS_PRIVATE.PRIVATE) {
    return "Private";
  }
  if (isPrivate == POOL_IS_PRIVATE.SEED) {
    return "Seed";
  }
  return "Public";
  // return ((buyType + '').toLowerCase() == BUY_TYPE.WHITELIST_LOTTERY ? "Whitelist/Lottery" : BUY_TYPE.FCFS.toUpperCase());
};

export const calculateTokenSoldWhenFinish = (
  totalSoldCoin: string | number
) => {
  const result = new BigNumber(totalSoldCoin)
    .minus(new BigNumber(totalSoldCoin).div(10000))
    .toFixed();
  return result;
};

export const getProgressWithPools = (pool: any) => {
  if (!pool) {
    return {
      progress: "0",
      tokenSold: "0",
      totalSoldCoin: "0",
    };
  }

  let tokenSold = pool.tokenSold || pool.token_sold || "0";
  let totalSoldCoin = pool.totalSoldCoin || pool.total_sold_coin || "0";
  let tokenSoldDisplay =
    pool.tokenSoldDisplay || pool.token_sold_display || "0";
  let progressDisplay = pool.progressDisplay || pool.progress_display || "0";
  let progress = "0";

  const isFinish = checkPoolIsFinish(pool);
  if (isFinish) {
    return {
      progress: "100",
      tokenSold: calculateTokenSoldWhenFinish(totalSoldCoin),
      totalSoldCoin: totalSoldCoin,
    };
  }

  if (pool.id == 22) {
    return {
      progress: "100",
      tokenSold: "500000",
      totalSoldCoin: "500000",
    };
  }

  // Merge config display with real
  const originTokenSold = tokenSold;
  tokenSold = new BigNumber(tokenSold).plus(tokenSoldDisplay).toFixed();

  // Normal Case
  if (new BigNumber(tokenSold).gt(totalSoldCoin)) {
    // If tokenSold > totalSoldCoin ==> tokenSold = totalSoldCoin
    tokenSold = totalSoldCoin;
  }

  // Merge config display with real
  const totalSoldCoinDiv = totalSoldCoin > 0 ? totalSoldCoin : 1;
  if (new BigNumber(progressDisplay).gt(0)) {
    // progressDisplay > 0
    progress = new BigNumber(originTokenSold)
      .div(totalSoldCoinDiv)
      .multipliedBy(100)
      .plus(progressDisplay)
      .toFixed();
  } else {
    progress = new BigNumber(tokenSold)
      .div(totalSoldCoinDiv)
      .multipliedBy(100)
      .toFixed();
  }

  if (new BigNumber(progress).lte(0)) {
    progress = "0";
  }
  if (new BigNumber(progress).gt(99)) {
    progress = "100";
  }

  return {
    progress,
    tokenSold,
    totalSoldCoin,
  };
};

export const checkPoolIsFinish = (pool: any) => {
  const currentTime = moment().unix();
  return pool.finish_time && currentTime > pool.finish_time;
};

export const getTokenSold = async (pool: any) => {
  let result = "0";
  try {
    const networkAvailable = pool.network_available || pool.networkAvailable;
    const poolHash = pool.campaign_hash || pool.campaignHash;
    if (poolHash == "Token contract not available yet.") {
      return "0";
    }

    const contract = getPoolContract({ networkAvailable, poolHash });
    if (contract) {
      result = await contract.methods.tokenSold().call();
      result = convertFromWei(result.toString());
    }
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const getEpkfBonusLink = () => {
  const link = process.env.REACT_APP_EPKF_BONUS_LINK || "";
  return link;
};

export const getEPkfBonusBalance = (wallet_address: string) => {
  return axios
    .get(getEpkfBonusLink().replace("WALLET_ADDRESS", wallet_address))
    .catch((e) => {
      return {};
    });
};

export const getEPkfBonusBalanceValue = async (wallet_address: string) => {
  let epkfResponse = (await getEPkfBonusBalance(wallet_address)) || {};
  // let epkfResponse = (await getEPkfBonusBalance('0xB4c400AF1a6aE83A899fCe31a7AD9ac466D66f66')) || {};

  let ePkf = 0;
  // @ts-ignore
  if (epkfResponse?.status === 200) {
    // @ts-ignore
    if (epkfResponse?.data?.code === 200) {
      // @ts-ignore
      ePkf = new BigNumber(epkfResponse?.data?.data || 0)
        .div(Math.pow(10, 18))
        .toFixed();
    }
  }
  return ePkf;
};

export const getRateSettingAPI = async () => {
  const rateAPIResponse = await getRateSettings();
  let rateSettings: any = {};
  // @ts-ignore
  if (rateAPIResponse?.status === 200) {
    // @ts-ignore
    rateSettings = rateAPIResponse?.data || {};
  }
  return rateSettings;
};

export const mappingRateSettingObjectToArray = (dataRateSettingAPI: any) => {
  if (!dataRateSettingAPI) return [];

  // Get Rate from API data
  let rateSetting = [...CONVERSION_RATE].map((item) => {
    if (item.symbol === TOKEN_STAKE_SYMBOLS.LP_PKF) {
      item.rate = dataRateSettingAPI.lp_pkf_rate;
    } else if (item.symbol === TOKEN_STAKE_SYMBOLS.EPKF) {
      item.rate = dataRateSettingAPI.epkf_rate;
    } else if (item.symbol === TOKEN_STAKE_SYMBOLS.SPKF) {
      item.rate = dataRateSettingAPI.spkf_rate;
    }
    return item;
  });
  return rateSetting;
};

export const mappingRateSettingArrayToObject = (rateSettings: any) => {
  const rateObject: any = {
    spkf_rate: 1,
    lp_pkf_rate: 1,
    epkf_rate: 1,
  };
  if (!rateSettings || rateSettings.length == 0) {
    return rateObject;
  }

  for (let i = 0; i < rateSettings.length; i++) {
    const rate = rateSettings[i];
    if (rate.symbol == TOKEN_STAKE_SYMBOLS.SPKF) {
      rateObject.spkf_rate = rate.rate || 1;
    } else if (rate.symbol == TOKEN_STAKE_SYMBOLS.LP_PKF) {
      rateObject.lp_pkf_rate = rate.rate || 1;
    } else if (rate.symbol == TOKEN_STAKE_SYMBOLS.EPKF) {
      rateObject.epkf_rate = rate.rate || 1;
    }
  }

  return rateObject;
};

export const getTokenStakeSmartContractInfo = async (
  contract: any,
  address: string
) => {
  let result = {};
  const resultPkf = await contract?.methods
    .userInfo(address, process.env.REACT_APP_PKF)
    .call();
  const stakedPkf = convertFromWei(resultPkf.staked);

  const resultUni = await contract?.methods
    .userInfo(address, process.env.REACT_APP_UNI_LP)
    .call();
  const stakedUni = convertFromWei(resultUni.staked);

  const resultMantra = await contract?.methods
    .userInfo(address, process.env.REACT_APP_MANTRA_LP)
    .call();
  const stakedMantra = convertFromWei(resultMantra.staked);

  let epkfStaked = await getEPkfBonusBalanceValue(address);

  result = {
    ...result,
    resultPkf: resultPkf,
    pkfStaked: stakedPkf,
    resultUni: resultUni,
    uniStaked: stakedUni,
    resultMantra: resultMantra,
    mantraStaked: stakedMantra,
    ePkf: epkfStaked,
  };

  let rateSettings;
  let rateObject;

  rateObject = await getRateSettingAPI();
  rateSettings = mappingRateSettingObjectToArray(rateObject);
  console.log("epkfStaked", epkfStaked);

  // Calculate totak stake balance
  const totalStaked = new BigNumber(stakedPkf)
    .plus(new BigNumber(stakedUni).multipliedBy(rateObject.lp_pkf_rate))
    .plus(new BigNumber(epkfStaked).multipliedBy(rateObject.epkf_rate))
    .toFixed();

  result = {
    ...result,
    totalStaked: totalStaked,
  };

  return {
    tokenStakes: result,
    rateSettings,
    rateStakeInfo: rateObject,
  };
};

export const findUserTier = async (contract: any, address: string) => {};

/**
 * Functions: Total Raise
 */
export const getTotalRaiseByPool = (pool: any) => {
  let totalRaise = "0";
  let currencySymbol = "$";
  if (!pool) {
    return { totalRaise, currencySymbol }
  }

  let poolStatus = pool?.poolStatus || pool?.campaign_status;
  if (poolStatus === "TBA" || poolStatus === "Upcoming" || poolStatus === "Swap") {
    const rateUsdPrice = (pool.purchasableCurrency || pool.accept_currency) === ACCEPT_CURRENCY.ETH
        ? pool.priceUsdt || pool.price_usdt || 0
        : pool.ethRate || pool.token_conversion_rate || 0;

    currencySymbol = "$";
    totalRaise = new BigNumber(pool?.amount || pool?.total_sold_coin || 0)
      .multipliedBy(rateUsdPrice)
      .toFixed();

    totalRaise = formatRoundUp(new BigNumber(totalRaise), 0); // Round up with 0 decimal place

  } else if (poolStatus === "Filled" || poolStatus === "Claimable" || poolStatus === "Ended") {
    const totalSoldCoin = pool?.totalSoldCoin || pool?.total_sold_coin || 0;
    const tokenSold = pool?.tokenSold || pool?.token_sold || 0;
    const networkAvailable = pool?.network_available || pool?.networkAvailable;

    currencySymbol = ((pool.purchasableCurrency || pool.accept_currency) + "").toUpperCase();
    totalRaise = formatRoundUp(
      new BigNumber(totalSoldCoin).multipliedBy(pool.ethRate || pool.token_conversion_rate || 0)
    );
    totalRaise = calculateTokenSoldWhenFinish(totalRaise);
    totalRaise = formatRoundUp(new BigNumber(totalRaise));

    const { currencyIcon, currencyName } = getIconCurrencyUsdt({
      ...pool,
      purchasableCurrency: currencySymbol,
      networkAvailable,
    });
    currencySymbol = currencyName;
  }

  return {
    totalRaise,
    currencySymbol,
  };
};

export const showTotalRaisePrice = (pool: any) => {
  const { totalRaise, currencySymbol } = getTotalRaiseByPool(pool);
  return `${numberWithCommas(totalRaise)} ${currencySymbol}`;
};
