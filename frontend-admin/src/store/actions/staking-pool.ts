import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { utils, BigNumber } from 'ethers';

import { alertActions } from '../constants/alert';
import {createPool} from "../../request/staking-pool";

import stakingPoolABI from '../../abi/Staking/StakingPool.json';
import { getContractInstance, getWeb3Instance } from '../../services/web3';


const duration = {
  seconds: function (val: Number | String) {
    return BigNumber.from(val);
  },
  minutes: function (val: Number | String) {
    return BigNumber.from(val).mul(this.seconds("60"));
  },
  hours: function (val: Number | String) {
    return BigNumber.from(val).mul(this.minutes("60"));
  },
  days: function (val: Number | String) {
    return BigNumber.from(val).mul(this.hours("24"));
  },
  weeks: function (val: Number | String) {
    return BigNumber.from(val).mul(this.days("7"));
  },
  years: function (val: Number | String) {
    return BigNumber.from(val).mul(this.days("365"));
  },
};

export const deployStakingPool = (stakingPool: any) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      // dispatch({ type: campaignActions.MY_CAMPAIGN_CREATE_REQUEST });

      const poolType = stakingPool.staking_type;
      let stakingPoolContract = getContractInstance(stakingPoolABI, stakingPool.pool_address || '');
      
      if (!stakingPoolContract) {
        dispatch({
          type: alertActions.ERROR_MESSAGE,
          payload: 'Invalid staking pool address'
        });
        return;
      }

      const userWalletAddress = getState().user.data.wallet_address;

      switch(poolType) {
        case 'linear':
          let newLinearPool = await stakingPoolContract.methods.linearAddPool(
            utils.parseEther(stakingPool.cap), // the maximum number of staking tokens the pool will receive
            utils.parseEther(stakingPool.min_investment), // the minimum investment amount users need to use in order to join the pool
            utils.parseEther(stakingPool.max_investment), // the maximum investment amount users can deposit to join the pool
            stakingPool.APR, // the APR rate
            duration.days(stakingPool.lock_duration).toNumber(), // the duration users need to wait before being able to withdraw and claim the rewards
            duration.days(stakingPool.delay_duration).toNumber(), // the duration users need to wait to receive the principal amount, after unstaking from the pool
            stakingPool.start_join_pool_time, // the time when users can start to join the pool
            stakingPool.end_join_pool_time // the time when users can no longer join the pool
          ).send({
            from: userWalletAddress,
          });

          console.log('Deploy Response: ', newLinearPool);
          if (newLinearPool) {
            dispatch({ type: alertActions.SUCCESS_MESSAGE, payload: 'Deploy Staking Pool Successful!'});

            const poolId = newLinearPool?.events?.LinearPoolCreated?.returnValues?.poolId;

            const createData = {
              pool_id: poolId,
              pool_address: stakingPool.pool_address,
              network_available: stakingPool.network_available,
              staking_type: 'linear',
              title: stakingPool.title,
              logo: stakingPool.logo,
              website: stakingPool.website,
              rkp_rate: stakingPool.rkp_rate,
              accepted_token_price: stakingPool.accepted_token_price,
              reward_token_price: stakingPool.reward_token_price,
            };

            await createPool(createData);
            window.location.replace('/#/dashboard/staking');
          }
          break;
        case 'alloc':
          let newAllocPool = await stakingPoolContract.methods.allocAddPool(
            stakingPool.alloc_point, // the allocation point of the pool, used when calculating total reward the whole pool will receive each block
            stakingPool.token, // the token which this pool will accept
            duration.days(stakingPool.delay_duration).toNumber() // the duration user need to wait when withdraw
          ).send({
            from: userWalletAddress,
          });

          console.log('Deploy Response: ', newAllocPool);
          if (newAllocPool) {
            dispatch({ type: alertActions.SUCCESS_MESSAGE, payload: 'Deploy Staking Pool Successful!'});

            const poolId = newAllocPool?.events?.AllocPoolCreated?.returnValues?.pid;

            const createData = {
              pool_id: poolId,
              pool_address: stakingPool.pool_address,
              network_available: stakingPool.network_available,
              staking_type: 'alloc',
              title: stakingPool.title,
              logo: stakingPool.logo,
              website: stakingPool.website,
              rkp_rate: stakingPool.rkp_rate,
              accepted_token_price: stakingPool.accepted_token_price,
              reward_token_price: stakingPool.reward_token_price,
            };
            
            await createPool(createData);
            window.location.replace('/#/dashboard/staking');
          }
          break;
          
        default:
          dispatch({
            type: alertActions.ERROR_MESSAGE,
            payload: 'Invalid staking pool type'
          });
      }
        
        
    } catch (err: any) {
      console.log('ERROR: ', err);

      // dispatch({
      //   type: campaignActions.MY_CAMPAIGN_CREATE_FAIL,
      //   payload: err?.message
      // });

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err?.message
      });
    }
  }
}


export const updateStakingPool = (stakingPool: any) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      const poolType = stakingPool.staking_type;
      let stakingPoolContract = getContractInstance(stakingPoolABI, stakingPool.pool_address || '');
      
      if (!stakingPoolContract) {
        dispatch({
          type: alertActions.ERROR_MESSAGE,
          payload: 'Invalid staking pool address'
        });
        return;
      }

      const userWalletAddress = getState().user.data.wallet_address;

      switch(poolType) {
        case 'linear':
          let newLinearPool = await stakingPoolContract.methods.linearSetPool(
            stakingPool.pool_id,
            utils.parseEther(stakingPool.cap), // the maximum number of staking tokens the pool will receive
            utils.parseEther(stakingPool.min_investment), // the minimum investment amount users need to use in order to join the pool
            utils.parseEther(stakingPool.max_investment), // the maximum investment amount users can deposit to join the pool
            stakingPool.APR, // the APR rate
            stakingPool.end_join_pool_time // the time when users can no longer join the pool
          ).send({
            from: userWalletAddress,
          });
  
          console.log('Update Response: ', newLinearPool);
          if (newLinearPool) {
            dispatch({ type: alertActions.SUCCESS_MESSAGE, payload: 'Update Staking Pool Successful!'});
          }
          break;
        case 'alloc':
          let newAllocPool = await stakingPoolContract.methods.allocSetPool(
            stakingPool.pool_id,
            stakingPool.alloc_point, // the allocation point of the pool, used when calculating total reward the whole pool will receive each block
            duration.days(stakingPool.delay_duration).toNumber() // the duration user need to wait when withdraw
          ).send({
            from: userWalletAddress,
          });
  
          console.log('Deploy Response: ', newAllocPool);
          if (newAllocPool) {
            dispatch({ type: alertActions.SUCCESS_MESSAGE, payload: 'Update Staking Pool Successful!'});
          }
          break;
          
        default:
          dispatch({
            type: alertActions.ERROR_MESSAGE,
            payload: 'Invalid staking pool type'
          });
      }
        
        
    } catch (err: any) {
      console.log('ERROR: ', err);

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err?.message
      });
    }
  }
}
