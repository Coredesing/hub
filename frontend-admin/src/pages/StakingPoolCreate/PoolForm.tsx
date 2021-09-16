import React, {useEffect, useState} from 'react';
import useStyles from "./style";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {cloneDeep} from 'lodash';

import {CircularProgress, Grid} from "@material-ui/core";
import {getTokenInfo, TokenType} from "../../utils/token";
import {createPool, updatePool} from "../../request/staking-pool";
import {alertFailure, alertSuccess} from "../../store/actions/alert";
import {withRouter} from "react-router-dom";
import {deployStakingPool, updateStakingPool} from "../../store/actions/staking-pool";
import useContractDetail from './hook/useContractDetail';
import useStakingPoolDetail from './hook/useStakingPoolDetail'

import PoolDisplaySwitch from "./Components/PoolDisplaySwitch";
import PoolType from "./Components/PoolType";
import PoolName from "./Components/PoolName";
import PoolLogo from "./Components/PoolLogo";
import PoolWebsite from "./Components/PoolWebsite";
import PoolRKPRate from "./Components/PoolRKPRate";
import PoolTokenPrice from "./Components/PoolTokenPrice";
import PoolWithdrawDelay from "./Components/PoolWithdrawDelayDuration";
import PoolAddress from "./Components/PoolAddress";
import NetworkAvailable from "./Components/NetworkAvailable";

import AllocTokenAddress from "./Components/AllocTokenAddress";
import AllocPoint from "./Components/AllocPoint";
import LinearAnnualRate from "./Components/LinearAnnualRate";
import LinearLockDuration from "./Components/LinearLockDuration";
import LinearJoinDuration from "./Components/LinearJoinDuration";
import LinearCap from "./Components/LinearCap";
import LinearAmountLimit from "./Components/LinearAmountLimit";
import { utils } from 'ethers';

import moment from "moment";

const ONE_DAY_IN_SECOND = 86400;

function PoolForm(props: any) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { isEdit, poolDetail } = props;
  const { currentNetworkId } = useSelector((state: any) => state).userCurrentNetwork;
  const [loading, setLoading] = useState(false);
  const [stakingPoolAddress, setStakingPoolAddress] = useState('');
  const [networkAvailable, setNetworkAvailable] = useState('');
  const [token, setToken] = useState<TokenType | null>(null);
  const [needValidate, setNeedValidate] = useState(false);
  const {contractDetail, fetchContractDetail} = useContractDetail(networkAvailable, stakingPoolAddress);
  const {poolDetail: stakingPoolDetail, fetchStakingPoolDetail} = useStakingPoolDetail(networkAvailable, stakingPoolAddress, poolDetail?.staking_type, poolDetail?.pool_id);

  const { register, setValue, getValues, clearErrors, errors, handleSubmit, control, watch } = useForm({
    mode: "onChange",
    defaultValues: poolDetail,
    reValidateMode: 'onChange',
  });
  const inputNetworkAvailable = watch('network_available');
  const inputStakingPoolAddress = watch('pool_address');

  useEffect(() => {
    setStakingPoolAddress(inputStakingPoolAddress);
  }, [inputStakingPoolAddress]);

  useEffect(() => {
    setNetworkAvailable(inputNetworkAvailable);
  }, [inputNetworkAvailable]);


  useEffect(() => {
    fetchContractDetail && fetchContractDetail();
    fetchStakingPoolDetail && fetchStakingPoolDetail();
  }, [currentNetworkId, fetchStakingPoolDetail, fetchContractDetail]);

  useEffect(() => {
    if (!isEdit) {
      return
    }

    const {lpToken, allocPoint, APR, minInvestment, maxInvestment, cap, lockDuration, delayDuration, startJoinTime, endJoinTime} = stakingPoolDetail as any
    switch (poolDetail?.staking_type) {
      case 'alloc':
        setValue('token', lpToken, { shouldValidate: true });
        setValue('alloc_point', allocPoint);
        setValue('delay_duration', Number(delayDuration) / ONE_DAY_IN_SECOND);
        break;
      
      case 'linear':
        setValue('APR', APR);
        setValue('delay_duration', Number(delayDuration) / ONE_DAY_IN_SECOND);
        setValue('min_investment', utils.formatEther(minInvestment || '0'));
        setValue('max_investment', utils.formatEther(maxInvestment || '0'));
        setValue('start_join_pool_time', moment.unix(startJoinTime));
        setValue('end_join_pool_time', moment.unix(endJoinTime));
        setValue('cap', utils.formatEther(cap || '0'));
        setValue('lock_duration', Number(lockDuration) / ONE_DAY_IN_SECOND);
        break;
    
      default:
        break;
    }
    
  }, [stakingPoolDetail, isEdit, poolDetail, setValue]);
  
  const isAllocPool = watch('staking_type') === 'alloc';
  const isLinearPool = watch('staking_type') === 'linear';

  const handleCreate = async (data: any) => {
    let submitData = {};

    switch (data.staking_type) {
      case "alloc":
        submitData = {
          pool_address: data.pool_address,
          network_available: data.network_available,
          staking_type: data.staking_type,
          title: data.title,
          logo: data.logo,
          website: data.website,
          rkp_rate: data.rkp_rate,
          accepted_token_price: data.accepted_token_price,
          reward_token_price: data.reward_token_price,
          delay_duration: data.delay_duration,
          token: data.token,
          alloc_point: data.alloc_point,
        }
        break;

      case "linear":
        submitData = {
          pool_address: data.pool_address,
          network_available: data.network_available,
          staking_type: data.staking_type,
          title: data.title,
          logo: data.logo,
          website: data.website,
          rkp_rate: data.rkp_rate,
          accepted_token_price: data.accepted_token_price,
          reward_token_price: data.accepted_token_price,
          delay_duration: data.delay_duration,
          APR: data.APR,
          lock_duration: data.lock_duration,
          start_join_pool_time: data.start_join_pool_time?.unix() || '0',
          end_join_pool_time: data.end_join_pool_time?.unix() || '0',
          cap: data.cap,
          min_investment: data.min_investment,
          max_investment: data.max_investment,
        }
        break;

      default:
        dispatch(alertFailure('Something wrong'));
        return;
    }
    await dispatch(deployStakingPool(submitData));
  };


  const handleUpdateInfo = async (data: any) => {
    try {
      const submitData = {
        pool_address: poolDetail?.pool_address || data.pool_address,
        network_available: poolDetail?.network_available || data.network_available,
        staking_type: data.staking_type,
        title: data.title,
        logo: data.logo,
        website: data.website,
        rkp_rate: data.rkp_rate,
        accepted_token_price: data.accepted_token_price,
        reward_token_price: isAllocPool ? data.reward_token_price : data.accepted_token_price,
      }
      await updatePool(submitData, poolDetail?.id);
      dispatch(alertSuccess('Update Staking Pool Successful!'));
    } catch (err) {
      console.log(err)
    }
  };

  const handleUpdateContract = async (data: any) => {
    let submitData = {};

    switch (data.staking_type) {
      case "alloc":
        submitData = {
          pool_address: poolDetail?.pool_address || data.pool_address,
          pool_id: poolDetail?.pool_id,
          staking_type: poolDetail?.staking_type,
          delay_duration: data.delay_duration,
          alloc_point: data.alloc_point,
        }
        break;
      case "linear":
        submitData = {
          pool_address: poolDetail?.pool_address || data.pool_address,
          pool_id: poolDetail?.pool_id,
          staking_type: poolDetail?.staking_type,
          cap: data.cap,
          min_investment: data.min_investment,
          max_investment: data.max_investment,
          APR: data.APR,
          end_join_pool_time: data.end_join_pool_time.unix(),
        }
        break;

      default:
        dispatch(alertFailure('Something wrong'));
        return;
    }
    await dispatch(updateStakingPool(submitData));
  };

  // Create Pool (Deploy to Smart Contract)
  const handleStakingPoolCreate = () => {
    handleSubmit(handleCreate)();
  };

  // Backend only
  const handleStakingPoolUpdateInfo = () => {
    handleSubmit(handleUpdateInfo)();
  };

  // Contract only
  const handleStakingPoolUpdateContract = () => {
    handleSubmit(handleUpdateContract)();
  };

  return (
  <>
    <div className="contentPage">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div className="">
            <div className={classes.exchangeRate}>
              {!!poolDetail?.id &&
                <PoolDisplaySwitch
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  control={control}
                />
              }

              <PoolType
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                isEdit={isEdit}
                errors={errors}
                control={control}
              />

              <PoolAddress
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                getValues={getValues}
                errors={errors}
                contractDetail={contractDetail}
                watch={watch}
                isEdit={isEdit}
              />

              <NetworkAvailable
                poolDetail={poolDetail}
                setValue={setValue}
                errors={errors}
                control={control}
                isEdit={isEdit}
              />

              <PoolName
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />

              <PoolLogo
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

              <PoolRKPRate
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
              />

              <PoolTokenPrice
                isAllocPool={isAllocPool}
                poolDetail={poolDetail}
                register={register}
                setValue={setValue}
                errors={errors}
              />
              

              {
                isEdit && 
                <button
                  disabled={loading}
                  className={classes.formButtonUpdatePool}
                  onClick={handleStakingPoolUpdateInfo}
                >
                  {
                    (loading) ? <CircularProgress size={25} /> : 'Update Info'
                  }
                </button>
              }
            </div>
          </div>
        </Grid>

        <Grid item xs={6}>
          <div className={classes.exchangeRate}>
            {isAllocPool ? 'Allocation Options' : 'Linear Options'}
            {
              isAllocPool &&
              <>
                <AllocTokenAddress
                  poolDetail={poolDetail}
                  register={register}
                  token={token}
                  setToken={setToken}
                  setValue={setValue}
                  getValues={getValues}
                  errors={errors}
                  watch={watch}
                  isEdit={isEdit}
                  isAllocPool={isAllocPool}
                  needValidate={needValidate}
                />

                <AllocPoint
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                  watch={watch}
                  isEdit={isEdit}
                  stakingPoolDetail={stakingPoolDetail}
                  contractDetail={contractDetail}
                  isAllocPool={isAllocPool}
                  errors={errors}
                />

                <PoolWithdrawDelay
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                />
              </>
            }
            
            {
              isLinearPool &&
              <>
                <LinearAnnualRate
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                />

                <LinearLockDuration
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  isEdit={isEdit}
                />

                <PoolWithdrawDelay
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  disabled={isEdit}
                />
                
                <LinearJoinDuration
                  poolDetail={poolDetail}
                  register={register}
                  token={token}
                  errors={errors}
                  control={control}
                  getValues={getValues}
                  setValue={setValue}
                  watch={watch}
                  isEdit={isEdit}
                  needValidate={needValidate}
                />

                <LinearCap
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                />

                <LinearAmountLimit
                  poolDetail={poolDetail}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                />
              </>
            }


            {
              isEdit && 
              <button
                disabled={loading}
                className={classes.formButtonUpdatePool}
                onClick={handleStakingPoolUpdateContract}
              >
                {
                  (loading) ? <CircularProgress size={25} /> : 'Update Contract'
                }
              </button>
            }
          </div>

        </Grid>

      </Grid>

      {
        !isEdit && 
        <button
          disabled={loading}
          className={classes.formButtonUpdatePool}
          onClick={handleStakingPoolCreate}
        >
          {
            (loading) ? <CircularProgress size={25} /> : 'Create'
          }
        </button>
      }

    </div>

  </>
  );
}

export default withRouter(PoolForm);
