import { useEffect, useMemo, useState } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import useFetch from './useFetch';
import useTokenDetails, { TokenType } from './useTokenDetails';
import BigNumber from 'bignumber.js';
import moment from "moment";
import {convertMomentObjectToDateTimeString, convertUnixTimeToDateTime} from "../utils/convertDate";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export type Tier = {
  allocation: string,
  ticket_allow: string,
  name: string,
  // maxBuy: string,s
  startTime: string,
  endTime: string,
  level: string | number,
}

export type PoolDetails = {
  id: number;
  website: string;
  amount: number;
  totalSoldCoin: number;  // Alias of amount
  ethRate: number;
  method: string;
  type: string;
  tokenDetails: TokenType;
  title: string;
  buyLimit: number[],
  poolAddress: string;
  joinTime: string;
  endJoinTime: string;
  startBuyTime: string;
  endBuyTime: string;
  releaseTime: string;
  purchasableCurrency: string;
  banner: string;
  networkAvailable: string;
  networkIcon: string;
  minTier: number;
  isDeployed: boolean;
  isDisplay: boolean;
  addressReceiver: string;
  minimumBuy: number[];
  description: string;
  tiersWithDetails: Tier[];
  displayPriceRate: any;
  priceUsdt: string;
  isPrivate: string;
  campaignClaimConfig?: any;
  socialRequirement?: any;
  whitelistBannerSetting?: any;
  whitelistCountry?: any;
  socialNetworkSetting?: any;
  claimPolicy?: any;
  publicWinnerStatus?: any;
  progressDisplay?: any;
  tokenSoldDisplay?: any;
  tokenSold?: any;
  campaignStatus?: string;
  poolStatus?: string;
  freeBuyTimeSetting?: any;
}

export type PoolDetailsReturnType ={
  poolDetails: PoolDetails | undefined,
  loading: boolean
}

const ETH_ICON = '/images/eth.svg';
const BSC_ICON = '/images/bsc.svg';
const POLYGON_ICON = '/images/polygon-matic.svg';


const usePoolDetails = (poolId : number): PoolDetailsReturnType => {
  const [poolDetailDone, setPoolDetailDone] = useState<boolean>(false);
  const { loading: fetchPoolLoading, error, data }  = useFetch<any>(`/pool/${poolId}`);
  const { data: connectedAccountTier } = useTypedSelector(state => state.userTier);

  // const { tokenSold: tokenSold1, soldProgress: soldPro } = useTokenSoldProgress(
  //   data?.campaign_hash,
  //   data?.total_sold_coin,
  //   data?.network_available,
  //   data,
  // );

  const poolDetails = useMemo(() => {
    if (data && data.tiers && !fetchPoolLoading && !error && poolDetailDone)  {
      const buyLimit: number[] = [];
      const minimumBuy: number[] = [];
      const tiersWithDetails: Tier[] = [];

      const tokenDetails = (data.token == 'TBD') ? {
        symbol: 'TBA',
        name: 'TBA',
        decimals: 18,
        address: 'Token contract not available yet.'
      } : {
        symbol: data.symbol,
        name: data.name,
        decimals: data.decimals,
        address: data.token
      }

      data.tiers.length > 0 && data.tiers.map((tier: any) => {
        buyLimit.push(tier.max_buy);
        minimumBuy.push(tier.min_buy);
        tiersWithDetails.push({
          allocation: tier.ticket_allow_percent,
          ticket_allow: tier.ticket_allow,
          name: tier.name,
          // maxBuy: `${tier.max_buy} ${data.accept_currency.toUpperCase()}`,
          startTime: tier.start_time,
          endTime: tier.end_time,
          level: tier.level,
        })
      })

      let campaignClaimConfig = data.campaignClaimConfig || [];
      campaignClaimConfig = campaignClaimConfig.map((claimConfig: any, index: number) => {
        return {
          ...claimConfig,
          start_time_formated: convertUnixTimeToDateTime(claimConfig.start_time),
          start_time_moment: moment(claimConfig.start_time),
        }
      });

      const networkIcon = (()=>{
        switch (data.network_available) {
          case 'bsc':
            return BSC_ICON;
          case 'polygon':
            return POLYGON_ICON;
          case 'eth':
          default:
            return ETH_ICON;
        }
      })();
      

      console.log('data.campaignClaimConfig', data.campaignClaimConfig, campaignClaimConfig);

      return {
        method: data.buy_type,
        startTime: data.start_join_pool_time,
        token: data.token,
        ethRate: data.purchasableCurrency === 'eth' ? data.ether_conversion_rate: data.token_conversion_rate,
        type: data.pool_type,
        amount: data.total_sold_coin,
        totalSoldCoin: data.total_sold_coin,  // Alias of amount
        website: data.website,
        tokenDetails,
        title: data.title,
        buyLimit,
        minimumBuy,
        poolAddress: data.campaign_hash,
        joinTime: data.start_join_pool_time,
        endJoinTime: data.end_join_pool_time,
        startBuyTime: data.start_time,
        endBuyTime: data.finish_time,
        purchasableCurrency: data.accept_currency,
        id: data.id,
        banner: data.token_images,
        releaseTime: data.release_time,
        networkAvailable: data.network_available,
        networkIcon: networkIcon,
        minTier: data.min_tier,
        isDeployed: data.is_deploy === 1,
        isDisplay: data.is_display === 1,
        addressReceiver: data.address_receiver,
        description: data.description,
        tiersWithDetails,
        displayPriceRate: !!data.display_price_rate,
        priceUsdt: new BigNumber(data?.price_usdt || 0).toFixed(),
        campaignClaimConfig,
        socialRequirement: data.socialRequirement,
        whitelistBannerSetting: data.whitelistBannerSetting,
        isPrivate: data.is_private,
        lockSchedule: data.lock_schedule,
        whitelistCountry: data.whitelist_country,
        socialNetworkSetting: data.socialNetworkSetting,
        claimPolicy: data.claim_policy,
        publicWinnerStatus: data.public_winner_status,
        progressDisplay: data.progress_display || 0,
        tokenSoldDisplay: data.token_sold_display || 0,
        tokenSold: data.token_sold || 0, // Token sold from Backend (Crawler)
        campaignStatus: data?.campaign_status,
        poolStatus: data?.campaign_status,  // alias of campaignStatus
        freeBuyTimeSetting: data?.freeBuyTimeSetting,

      }
    }

    return;
  }, [data, fetchPoolLoading, error, poolDetailDone, connectedAccountTier]);

  useEffect(() => {
    data && setPoolDetailDone(true);
  }, [data]);

  return  {
    poolDetails,
    loading: fetchPoolLoading || !poolDetailDone
  }
}

export default usePoolDetails;
