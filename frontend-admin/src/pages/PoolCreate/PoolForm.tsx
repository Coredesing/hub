import React, {useEffect, useState} from 'react';
import useStyles from "./style";
import {useCommonStyle} from "../../styles";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {cloneDeep} from 'lodash';

import {CircularProgress, Grid} from "@material-ui/core";
import {getTokenInfo, TokenType} from "../../utils/token";
import {isFactorySuspended} from "../../utils/campaignFactory";
import {createPool, updatePool} from "../../request/pool";
import {alertFailure, alertSuccess} from "../../store/actions/alert";
import {withRouter} from "react-router-dom";
import {deployPool} from "../../store/actions/campaign";
import {adminRoute} from "../../utils";

import KycRequired from "./Components/KycRequired";
import PoolBanner from "./Components/PoolBanner";
import PoolMiniBanner from "./Components/PoolMiniBanner";
import TokenAddress from "./Components/TokenAddress";
import TotalCoinSold from "./Components/TotalCoinSold";
import TokenLogo from "./Components/TokenLogo";
import TokenSymbol from "./Components/TokenSymbol";
import DurationTime from "./Components/DurationTimes";
import MinTier from "./Components/MinTier";
import TierTable from "./Components/Tier/TierTable";
import BuyType from "./Components/BuyType";
import PoolType from "./Components/PoolType";
import NetworkAvailable from "./Components/NetworkAvailable";
import AcceptCurrency from "./Components/AcceptCurrency";
import PoolDescription from "./Components/PoolDescription";
import AddressReceiveMoney from "./Components/AddressReceiveMoney";
import ExchangeRate from "./Components/ExchangeRate";
import DisplayPoolSwitch from "./Components/DisplayPoolSwitch";
import PoolHash from "./Components/PoolHash";
import PoolName from "./Components/PoolName";
import UserJoinPool from "./Components/UserJoinPool";
import PoolWebsite from "./Components/PoolWebsite";
import moment from "moment";
import ClaimConfigTable from "./Components/ClaimConfig/ClaimConfigTable";
import SeriesContentTable from "./Components/SeriesContentConfig/SeriesContentTable";
import BoxTypesConfigTable from "./Components/BoxTypesConfig/BoxTypesConfigTable";
import WhitelistSocialRequirement from "./Components/WhitelistSocialRequirement";
import {campaignClaimConfigFormat} from "../../utils/campaign";
import PrivatePoolSetting from "./Components/PrivatePoolSetting";
import BuyTokens from "./Components/BuyRemainTokens/BuyTokens";
import WhitelistBannerSetting from "./Components/WhitelistBannerSetting/WhitelistBannerSetting";
import ProgressDisplaySetting from "./Components/ProgressDisplaySetting/ProgressDisplaySetting";
import GleamRequirement from "./Components/WhitelistSocialRequirement/GleamRequirement";
import LockSchedule from "./Components/LockSchedule/LockSchedule";
import ForbiddenCountry from "./Components/ForbiddenCountry/ForbiddenCountry";
import SocialSetting from "./Components/SocialSetting/SocialSetting";
import FreeTimeSetting from "./Components/FreeTimeSetting/FreeTimeSetting";
import PoolRule from "./Components/PoolRule";
import Process from "./Components/Process";
import {POOL_IS_PRIVATE, TOKEN_TYPE} from "../../constants";
import {Const} from "../../../../crawler/bin/ethlink/Const";

function PoolForm(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const dispatch = useDispatch();
  const history = props.history;

  const { data: loginUser } = useSelector(( state: any ) => state.user);

  const { isEdit, poolDetail } = props;
  const [isSuspend, setIsSuspend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingDeploy, setLoadingDeploy] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [token, setToken] = useState<TokenType | null>(null);
  const [needValidate, setNeedValidate] = useState(false);

  useEffect(() => {
    const checkCampaignFactorySuspended = async () => {
      const isSuspended = await isFactorySuspended();
      setIsSuspend(isSuspended);
    }
    checkCampaignFactorySuspended();
  }, []);

  const { register, setValue, getValues, clearErrors, errors, handleSubmit, control, watch } = useForm({
    mode: "onChange",
    defaultValues: poolDetail,
    reValidateMode: 'onChange',
  });

  const createUpdatePool = async (data: any) => {
    // Format Tiers
    const minTier = data.minTier;
    let tierConfiguration = data.tierConfiguration || '[]';
    tierConfiguration = JSON.parse(tierConfiguration);
    tierConfiguration = tierConfiguration.map((currency: any, index: number) => {
      const item = {
        ...currency,
        currency: data.acceptCurrency,
      };
      if (index < minTier) {
        item.maxBuy = 0;
        item.minBuy = 0;
      }

      item.startTime = item.startTime ? (moment(item.startTime).unix() || null) : null;
      item.endTime = item.endTime ? (moment(item.endTime).unix() || null) : null;
      return item;
    });

    // Format Claim Config
    let campaignClaimConfig = data.campaignClaimConfig || '[]';
    campaignClaimConfig = JSON.parse(campaignClaimConfig);
    campaignClaimConfig = campaignClaimConfig.map((item: any, index: number) => {
      item.startTime = item.startTime ? (moment(item.startTime).unix() || null) : null;
      item.endTime = item.endTime ? (moment(item.endTime).unix() || null) : null;
      return item;
    });

    let tokenInfo: any = {
      symbol: data?.token_symbol,
    };

    if (data.token) {
      tokenInfo = await getTokenInforDetail(data.token, data.token_type);
      if (!tokenInfo?.symbol) {
        throw Error('Token Information has not been loaded !!!');
        dispatch(alertFailure('Token Information has not been loaded !!!'))
        return false;
      }

      tokenInfo.symbol = data?.token_symbol
    }

    try {
      if (!Array.isArray(data.seriesContentConfig)) {
        data.seriesContentConfig = JSON.parse(data.seriesContentConfig)
      }
    } catch (e) {
      data.seriesContentConfig = []
    }

    try {
      if (!Array.isArray(data.boxTypesConfig)) {
        data.boxTypesConfig = JSON.parse(data.boxTypesConfig)
      }
    } catch (e) {
      data.boxTypesConfig = []
    }

    const submitData = {
      registed_by: loginUser?.wallet_address,
      is_display: data.is_display,

      // Pool general
      title: data.title,
      website: data.website,
      banner: data.banner,
      mini_banner: data.mini_banner ?? '',
      description: data.description,
      process: data.process,
      rule: data.rule ?? '',
      address_receiver: data.addressReceiver,

      // Token
      token: data.token,
      token_images: data.tokenImages,
      total_sold_coin: data.totalSoldCoin,

      token_by_eth: data.tokenRate,
      token_conversion_rate: data.tokenRate,

      price_usdt: data.price_usdt,
      display_price_rate: data.display_price_rate,

      // TokenInfo
      tokenInfo,

      // Time
      start_time: data.start_time ? data.start_time.unix() : null,
      finish_time: data.finish_time ? data.finish_time.unix() : null,
      release_time: data.release_time ? data.release_time.unix() : null,
      start_join_pool_time: data.start_join_pool_time ? data.start_join_pool_time.unix() : null,
      end_join_pool_time: data.end_join_pool_time ? data.end_join_pool_time.unix() : null,
      pre_order_min_tier: data.pre_order_min_tier,
      start_pre_order_time: data.start_pre_order_time ? data.start_pre_order_time.unix() : null,

      // Types
      accept_currency: data.acceptCurrency,
      network_available: data.networkAvailable,
      buy_type: data.buyType,
      pool_type: data.poolType,
      kyc_bypass: data.kyc_bypass,

      // Private Pool Setting
      is_private: data.isPrivate,

      // Tier
      min_tier: data.minTier,
      tier_configuration: tierConfiguration,

      // Claim Configuration
      claim_configuration: campaignClaimConfig,

      // Wallet
      wallet: isEdit ? poolDetail?.wallet : {},

      // Whitelist Social Requirement
      self_twitter: data.self_twitter,
      self_group: data.self_group,
      self_channel: data.self_channel,
      self_retweet_post: data.self_retweet_post,
      self_retweet_post_hashtag: data.self_retweet_post_hashtag,
      partner_twitter: data.partner_twitter,
      partner_group: data.partner_group,
      partner_channel: data.partner_channel,
      partner_retweet_post: data.partner_retweet_post,
      partner_retweet_post_hashtag: data.partner_retweet_post_hashtag,
      gleam_link: data.gleam_link,

      // Forbidden Countries Setting
      forbidden_countries: data.forbidden_countries,

      // Whitelist Banner Setting
      guide_link: data.guide_link,
      whitelist_link: data.whitelist_link,
      announcement_time: data.announcement_time ? data.announcement_time.unix() : null,

      // Progress Display Setting
      token_sold_display: data.token_sold_display,
      progress_display: data.progress_display,

      // Lock Schedule Setting
      lock_schedule: data.lock_schedule,

      // Social Media
      medium_link: data.medium_link,
      twitter_link: data.twitter_link,
      telegram_link: data.telegram_link,

      // Claim Policy
      claim_policy: data.claim_policy,
      seriesContentConfig: data.seriesContentConfig,
      boxTypesConfig: data.boxTypesConfig,

      // Free Time Settings
      freeBuyTimeSetting: {
        start_time_free_buy: data.start_time_free_buy ? data.start_time_free_buy.unix() : null,
        max_bonus_free_buy: data.max_bonus_free_buy,
      }
    };

    console.log('[createUpdatePool] - Submit with data: ', submitData);

    let response = {};
    if (isEdit) {
      response = await updatePool(submitData, poolDetail.id);
    } else {
      response = await createPool(submitData);
    }

    return response;
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response: any = await createUpdatePool(data);
      if (response?.status === 200) {
        dispatch(alertSuccess('Successful!'));
        if (isEdit) {
          // window.location.reload();
        } else {
          history.push(adminRoute('/campaigns'));
        }
      } else {
        dispatch(alertFailure('Fail!'));
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('ERROR: ', e);
    }
  };

  // Update After Deploy
  const updatePoolAfterDeloy = async (data: any) => {
    // Format Claim Config
    let campaignClaimConfig = data.campaignClaimConfig || '[]';
    campaignClaimConfig = campaignClaimConfigFormat(campaignClaimConfig);

    try {
      if (!Array.isArray(data.seriesContentConfig)) {
        data.seriesContentConfig = JSON.parse(data.seriesContentConfig)
      }
    } catch (e) {
      data.seriesContentConfig = []
    }

    try {
      if (!Array.isArray(data.boxTypesConfig)) {
        data.boxTypesConfig = JSON.parse(data.boxTypesConfig)
      }
    } catch (e) {
      data.boxTypesConfig = []
    }

    const submitData = {
      // Pool general
      title: data.title,
      website: data.website,
      banner: data.banner,
      mini_baner: data.mini_banner,
      description: data.description,
      process: data.process,
      rule: data.rule ?? '',

      // USDT Price
      price_usdt: data.price_usdt, // Do not check isAcceptEth
      display_price_rate: data.display_price_rate,

      // KYC required
      kyc_bypass: data.kyc_bypass,

      // Token
      token_images: data.tokenImages,
      total_sold_coin: data.totalSoldCoin,

      // Claim Configuration
      claim_configuration: campaignClaimConfig,
      // Time
      // Release time will auto fill from first record of Campaign Claim Config Table
      release_time: data.release_time ? data.release_time.unix() : null,

      // Whitelist Social Requirement
      self_twitter: data.self_twitter,
      self_group: data.self_group,
      self_channel: data.self_channel,
      self_retweet_post: data.self_retweet_post,
      self_retweet_post_hashtag: data.self_retweet_post_hashtag,
      partner_twitter: data.partner_twitter,
      partner_group: data.partner_group,
      partner_channel: data.partner_channel,
      partner_retweet_post: data.partner_retweet_post,
      partner_retweet_post_hashtag: data.partner_retweet_post_hashtag,

      // Forbidden Countries Setting
      forbidden_countries: data.forbidden_countries,

      // Whitelist Banner Setting
      guide_link: data.guide_link,
      whitelist_link: data.whitelist_link,
      announcement_time: data.announcement_time ? data.announcement_time.unix() : null,

      // Progress Display Setting
      token_sold_display: data.token_sold_display,
      progress_display: data.progress_display,

      // Lock Schedule Setting
      lock_schedule: data.lock_schedule,

      // Social Media
      medium_link: data.medium_link,
      twitter_link: data.twitter_link,
      telegram_link: data.telegram_link,

      // Claim Policy
      claim_policy: data.claim_policy,
      seriesContentConfig: data.seriesContentConfig,
      boxTypesConfig: data.boxTypesConfig,

      // Free Time Settings
      freeBuyTimeSetting: {
        start_time_free_buy: data.start_time_free_buy ? data.start_time_free_buy.unix() : null,
        max_bonus_free_buy: data.max_bonus_free_buy,
      }
    };

    console.log('[updatePoolAfterDeloy] - Submit with data: ', submitData);

    let response = await updatePool(submitData, poolDetail.id);

    return response;
  };

  const handleUpdateAfterDeloy = async (data: any) => {
    setLoading(true);
    try {
      const response: any = await updatePoolAfterDeloy(data);
      if (response?.status === 200) {
        dispatch(alertSuccess('Successful!'));
        // history.push(adminRoute('/campaigns'));
        // window.location.reload();
      } else {
        dispatch(alertFailure('Fail!'));
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('ERROR: ', e);
    }
  };

  // Create / Update Pool (Before Pool Deployed to Smart Contract)
  const handleCampaignCreateUpdate = () => {
    setNeedValidate(false);
    setTimeout(() => {
      if (poolDetail?.is_deploy) {
        handleSubmit(handleUpdateAfterDeloy)();
      } else {
        handleSubmit(handleFormSubmit)();
      }

      // // Show toast message has Validate Errors
      // const validateErrors = cloneDeep(errors);
      // setTimeout(() => {
      //   const hasAnyErrors = Object.keys(validateErrors).length > 0;
      //   if (hasAnyErrors) {
      //     dispatch(alertFailure('Validate Fail. Please check validate errors!'));
      //   }
      // }, 500);
    }, 100);
  };

  const getTokenInforDetail = async (token: string, token_type: string) => {
    const erc20Token = await getTokenInfo(token, token_type);
    let tokenInfo: any = {};
    if (erc20Token) {
      const { name, symbol, decimals, address, token_type } = erc20Token;
      tokenInfo = { name, symbol, decimals, address, token_type };
    }
    return tokenInfo;
  }

  // Deploy Pool And Update
  const handleDeloySubmit = async (data: any) => {
    if (poolDetail.is_deploy || deployed) {
      alert('Pool is deployed !!!');
      return false;
    }
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('The system will store the latest pool information.\n' +
     'Are you sure you want to deploy?')) {
      setNeedValidate(false);
      return false;
    }

    setLoadingDeploy(true);
    try {
      // Save data before deploy
      const response = await createUpdatePool(data);
      const tokenInfo = await getTokenInforDetail(data.token, data.token_type);

      const history = props.history;
      const minTier = data.minTier;
      let tierConfiguration = data.tierConfiguration || '[]';
      tierConfiguration = JSON.parse(tierConfiguration);
      tierConfiguration = tierConfiguration.map((currency: any, index: number) => {
        const item = {
          ...currency,
          currency: data.acceptCurrency,
        };
        if (index < minTier) {
          item.maxBuy = 0;
          item.minBuy = 0;
        }
        return item;
      });

      if (data && data.token_symbol) {
        tokenInfo.symbol = data?.token_symbol
      }

      try {
        if (!Array.isArray(data.seriesContentConfig)) {
          data.seriesContentConfig = JSON.parse(data.seriesContentConfig)
        }
      } catch (e) {
        data.seriesContentConfig = []
      }

      try {
        if (!Array.isArray(data.boxTypesConfig)) {
          data.boxTypesConfig = JSON.parse(data.boxTypesConfig)
        }
      } catch (e) {
        data.boxTypesConfig = []
      }

      const submitData = {
        id: poolDetail.id,
        registed_by: loginUser?.wallet_address,

        // Pool general
        title: data.title,
        website: data.website,
        banner: data.banner,
        mini_banner: data.mini_banner,
        description: data.description,
        process: data.process,
        rule: data.rule ?? '',
        address_receiver: data.addressReceiver,

        // Token
        token: data.token,
        token_images: data.tokenImages,
        total_sold_coin: data.totalSoldCoin,

        // Rate
        token_by_eth: data.tokenRate,
        token_conversion_rate: data.tokenRate,

        // USDT Price
        price_usdt: data.price_usdt,
        display_price_rate: data.display_price_rate,

        kyc_bypass: data.kyc_bypass,

        // TokenInfo
        tokenInfo,

        // Time
        start_time: data.start_time ? data.start_time.unix() : null,
        finish_time: data.finish_time ? data.finish_time.unix() : null,
        release_time: data.release_time ? data.release_time.unix() : null,
        start_join_pool_time: data.start_join_pool_time ? data.start_join_pool_time.unix() : null,
        end_join_pool_time: data.end_join_pool_time ? data.end_join_pool_time.unix() : null,
        pre_order_min_tier: data.pre_order_min_tier,
        start_pre_order_time: data.start_pre_order_time ? data.start_pre_order_time.unix() : null,

        // Types
        accept_currency: data.acceptCurrency,
        network_available: data.networkAvailable,
        buy_type: data.buyType,
        pool_type: data.poolType,

        // Tier
        min_tier: data.minTier,
        tier_configuration: tierConfiguration,

        // Wallet
        wallet: isEdit ? poolDetail?.wallet : {},

        // Progress Display Setting
        token_sold_display: data.token_sold_display,
        progress_display: data.progress_display,

        // Lock Schedule Setting
        lock_schedule: data.lock_schedule,

        // Social Media
        medium_link: data.medium_link,
        twitter_link: data.twitter_link,
        telegram_link: data.telegram_link,

        // Claim Policy
        claim_policy: data.claim_policy,
        seriesContentConfig: data.seriesContentConfig,
        boxTypesConfig: data.boxTypesConfig,

        // Free Time Settings
        freeBuyTimeSetting: {
          start_time_free_buy: data.start_time_free_buy ? data.start_time_free_buy.unix() : null,
          max_bonus_free_buy: data.max_bonus_free_buy,
        }
      };

      console.log('[handleDeloySubmit] - Submit with data: ', submitData);

      await dispatch(deployPool(submitData, history));
      setLoadingDeploy(false);
      setDeployed(true);
      window.location.reload();
    } catch (e) {
      setLoadingDeploy(false);
      console.log('ERROR: ', e);
    }
  };

  const handlerDeploy = () => {
    setNeedValidate(true);
    setTimeout(() => {
      handleSubmit(handleDeloySubmit)();
    }, 100);
  };

  const watchBuyType = watch('buyType');
  const watchIsPrivate = watch('isPrivate');
  const watchTokenType = watch('token_type');
  const isDeployed = !!poolDetail?.is_deploy;

  console.log('errors==========>', errors);

  return (
  <>
    <div className="contentPage">
      <Grid container spacing={2}>
        <Grid item xs={6}>

          <div className="">
            <div className={classes.exchangeRate}>
              {!!poolDetail?.id &&
                <DisplayPoolSwitch
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  control={control}
                />
              }

              <PoolName
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />

              <PoolHash poolDetail={poolDetail} />
              {/*{!!poolDetail?.is_deploy &&*/}
              {/*  <PoolHash poolDetail={poolDetail} />*/}
              {/*}*/}
              <PoolBanner
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />

              <PoolMiniBanner
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
              />

              <PoolWebsite
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />

            </div>

            <div className={classes.exchangeRate}>
              <BuyType
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
              />

              <PrivatePoolSetting
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
              />

              <PoolType
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
              />

              <NetworkAvailable
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
                needValidate={needValidate}
              />

              <AcceptCurrency
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
                watch={watch}
              />

              <KycRequired
                  poolDetail={poolDetail}
                  setValue={setValue}
                  errors={errors}
                  control={control}
                  watch={watch}
              />

              <Process
                  poolDetail={poolDetail}
                  setValue={setValue}
                  errors={errors}
                  control={control}
                  watch={watch}
              />

            </div>


            <div className={classes.exchangeRate}>
              <ClaimConfigTable
                poolDetail={poolDetail}
                setValue={setValue}
                register={register}
                watch={watch}
                errors={errors}
                control={control}
              />
            </div>

            <SocialSetting
              poolDetail={poolDetail}
              setValue={setValue}
              errors={errors}
              control={control}
              watch={watch}
              register={register}
            />

            {
              (watchIsPrivate ? Number(watchIsPrivate) : 0) !== POOL_IS_PRIVATE.COMMUNITY &&
              <div className={classes.exchangeRate}>
                <WhitelistSocialRequirement
                    poolDetail={poolDetail}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    control={control}
                    watch={watch}
                />
              </div>
            }

            {
              (watchIsPrivate ? Number(watchIsPrivate) : 0) === POOL_IS_PRIVATE.COMMUNITY &&
              <div className={classes.exchangeRate}>
                <GleamRequirement
                    poolDetail={poolDetail}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    control={control}
                    watch={watch}
                />
              </div>
            }

          </div>
        </Grid>

        <Grid item xs={6}>
          <div className={classes.exchangeRate}>
            <TokenAddress
              poolDetail={poolDetail}
              register={register}
              token={token}
              setToken={setToken}
              setValue={setValue}
              getValues={getValues}
              control={control}
              errors={errors}
              watch={watch}
              needValidate={needValidate}
            />

            <TokenSymbol
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
            />

            <AddressReceiveMoney
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
              needValidate={needValidate}
            />

            <TotalCoinSold
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
            />

            <TokenLogo
              poolDetail={poolDetail}
              register={register}
              errors={errors}
            />

          </div>

          <div className={classes.exchangeRate}>
            <DurationTime
              poolDetail={poolDetail}
              register={register}
              token={token}
              setToken={setToken}
              setValue={setValue}
              errors={errors}
              control={control}
              getValues={getValues}
              watch={watch}
              needValidate={needValidate}
            />
          </div>


          <ExchangeRate
            poolDetail={poolDetail}
            register={register}
            token={token}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />

          <WhitelistBannerSetting
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />

          <ProgressDisplaySetting
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />

          <LockSchedule
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />

          <ForbiddenCountry
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />

          <FreeTimeSetting
            poolDetail={poolDetail}
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
            watch={watch}
          />

        </Grid>

      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.exchangeRate}>
            <PoolDescription
              poolDetail={poolDetail}
              register={register}
              setValue={setValue}
              errors={errors}
            />
          </div>
        </Grid>
      </Grid>

      {
        watchTokenType && watchTokenType !== TOKEN_TYPE.ERC20 &&
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={classes.exchangeRate}>
              <PoolRule
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
              />
            </div>
          </Grid>
        </Grid>
      }

      {
        watchTokenType && watchTokenType === TOKEN_TYPE.MYSTERY_BOX &&
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={classes.exchangeRate}>
              <SeriesContentTable
                  poolDetail={poolDetail}
                  setValue={setValue}
                  register={register}
                  watch={watch}
                  errors={errors}
                  control={control}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className={classes.exchangeRate}>
              <BoxTypesConfigTable
                  poolDetail={poolDetail}
                  setValue={setValue}
                  register={register}
                  watch={watch}
                  errors={errors}
                  control={control}
              />
            </div>
          </Grid>
        </Grid>
      }

      <Grid container spacing={2}>
        <Grid item xs={12}>

          <div className={classes.exchangeRate}>
            <MinTier
              poolDetail={poolDetail}
              setValue={setValue}
              errors={errors}
              control={control}
            />

            <TierTable
              poolDetail={poolDetail}
              register={register}
              watch={watch}
            />

          </div>


        </Grid>
      </Grid>

      {isDeployed &&
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={classes.exchangeRate}>
              <BuyTokens
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
                watch={watch}
              />
            </div>
          </Grid>
        </Grid>
      }


      <Grid container spacing={2}>
        <Grid item xs={12}>

          {isEdit && poolDetail?.id && watchBuyType === 'whitelist' &&
          <div className={classes.exchangeRate}>
            <UserJoinPool
              poolDetail={poolDetail}
              setValue={setValue}
              errors={errors}
              control={control}
            />
          </div>
          }

          <button
            disabled={!isEdit || !poolDetail?.id || poolDetail?.is_deploy || loading || loadingDeploy || deployed }
            className={(!isEdit || poolDetail?.is_deploy || deployed) ? classes.formButtonDeployed : classes.formButtonDeploy}
            onClick={handlerDeploy}
          >
            {loadingDeploy && <CircularProgress size={25} />}
            {!loadingDeploy && 'Deploy'}
          </button>

          <button
            disabled={loading || loadingDeploy}
            className={classes.formButtonUpdatePool}
            onClick={handleCampaignCreateUpdate}
          >
            {
              (loading || loadingDeploy) ? <CircularProgress size={25} /> : (isEdit ? 'Update' : 'Create')
            }
          </button>

          {/* Button Update with disable after deploy */}
          {/*<button*/}
          {/*  disabled={loading || loadingDeploy || poolDetail?.is_deploy}*/}
          {/*  className={poolDetail?.is_deploy ? classes.formButtonDeployed : classes.formButtonUpdatePool}*/}
          {/*  onClick={handleCampaignCreateUpdate}*/}
          {/*>*/}
          {/*  {*/}
          {/*    (loading || loadingDeploy) ? <CircularProgress size={25} /> : (isEdit ? 'Update' : 'Create')*/}
          {/*  }*/}
          {/*</button>*/}

        </Grid>
      </Grid>




    </div>

  </>
  );
}

export default withRouter(PoolForm);
