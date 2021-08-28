import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import useStyles from './style';
import Card from './Card';
import CardActive from './CardActive';
import CardCompletedSales from './CardCompletedSales';
import usePools from '../../hooks/usePools';
import { BUY_TYPE, POOL_TYPE } from '../../constants';
import { convertFromWei, getPoolContract } from '../../services/web3';
import { getPoolStatusByPoolDetail } from "../../utils/getPoolStatusByPoolDetail";
import { PoolStatus } from "../../utils/getPoolStatus";
import BackgroundComponent from './BackgroundComponent'
import BigNumber from 'bignumber.js';
import useFetch from "../../hooks/useFetch";
import ContactForm from '../../components/Base/ContactForm';

const arrowRightIcon = '/images/icons/arrow-right.svg';
const background = '/images/icons/background2.svg';

type PoolData = {
  data: [],
  total: string,
  perPage: number,
  page: number,
  lastPage: number,
};

const Dashboard = (props: any) => {
  const styles = useStyles();
  const { data: appChain } = useSelector((state: any) => state.appNetwork);
  const { data: connector } = useSelector((state: any) => state.connector);

  const [upcomingPoolsV3Display, setUpcomingPoolsV3Display] = useState<Array<any>>([]);
  const [activePoolsV3Display, setActivePoolsV3Display] = useState<Array<any>>([]);
  const [nextToLaunchPoolsV3Display, setNextToLaunchPoolsV3Display] = useState<Array<any>>([]);
  const [completeSalePoolsV3Display, setCompleteSalePoolsV3Display] = useState<Array<any>>([]);

  const { data: upcomingPoolsV3, loading: loadingUpcomingPoolV3, error: errorUpcomingPoolV3 } = useFetch<PoolData>(`/pools/v3/upcoming-pools`);
  const { data: activePoolsV3, loading: loadingActivePoolsV3, error: errorActivePoolsV3 } = useFetch<PoolData>(`/pools/v3/active-pools`);
  const { data: nextToLaunchPoolsV3, loading: loadingNextToLaunchPoolsV3, error: errorNextToLaunchPoolsV3 } = useFetch<PoolData>(`/pools/v3/next-to-launch-pools`);
  const { data: completeSalePoolsV3, loading: loadingCompleteSalePoolsV3, error: errorCompleteSalePoolsV3 } = useFetch<PoolData>(`/pools/v3/complete-sale-pools`);

  const setStatusPools = async (pools: Array<any>) => {
    await Promise.all(
      pools.map(async (pool: any) => {
        // const tokenSold = await getTokenSold(pool);
        // const status = await getPoolStatusByPoolDetail(pool, tokenSold);
        // console.log('Status Pool:', status);
        // pool.status = status;
        pool.status = pool.campaign_status;
      })
    );
  };

  useEffect(() => {
    if (!upcomingPoolsV3 || !loadingUpcomingPoolV3) return;
    if (upcomingPoolsV3?.data && upcomingPoolsV3.data.length) {
      let pools = upcomingPoolsV3.data;
      setStatusPools(pools)
        .then(() => {
          setUpcomingPoolsV3Display(pools);
        });
    }
  }, [loadingUpcomingPoolV3, upcomingPoolsV3]);

  useEffect(() => {
    if (!activePoolsV3 || !loadingActivePoolsV3) return;
    if (activePoolsV3?.data && activePoolsV3.data.length) {
      let pools = activePoolsV3.data;
      setStatusPools(pools)
        .then(() => {
          setActivePoolsV3Display(pools);
        });
    }
  }, [activePoolsV3, loadingActivePoolsV3]);

  useEffect(() => {
    if (!nextToLaunchPoolsV3 || !loadingNextToLaunchPoolsV3) return;
    if (nextToLaunchPoolsV3?.data && nextToLaunchPoolsV3.data.length) {
      let pools = nextToLaunchPoolsV3.data;
      setStatusPools(pools)
        .then(() => {
          setNextToLaunchPoolsV3Display(pools);
        });
    }
  }, [loadingNextToLaunchPoolsV3, nextToLaunchPoolsV3]);

  useEffect(() => {
    if (!completeSalePoolsV3 || !loadingCompleteSalePoolsV3) return;
    if (completeSalePoolsV3?.data && completeSalePoolsV3.data.length) {
      let pools = completeSalePoolsV3.data;
      setStatusPools(pools)
        .then(() => {
          setCompleteSalePoolsV3Display(pools);
        });
    }
  }, [completeSalePoolsV3, loadingCompleteSalePoolsV3]);

  const getTokenSold = async (pool: any) => {
    let result = '0';
    try {
      // const contract = getContractInstance(POOL_ABI, pool.campaign_hash || '', connector, appChain.appChainID);
      // if (contract) {
      //   result = await contract.methods.tokenSold().call();
      //   result = convertFromWei(result.toString());
      // }
      const networkAvailable = pool.network_available || pool.networkAvailable;
      const poolHash = pool.campaign_hash || pool.campaignHash;
      const contract = getPoolContract({ networkAvailable, poolHash });
      if (contract) {
        result = await contract.methods.tokenSold().call();
        result = convertFromWei(result.toString());
      }
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  const checkBuyTime = (pool: any) => {
    return !pool.start_time || !pool.finish_time
  }

  const checkJoinTime = (pool: any) => {
    return !pool.start_join_pool_time || !pool.end_join_pool_time
  }

  const checkTBA = (pool: any) => {
    return pool.pool_type == POOL_TYPE.SWAP && pool.buy_type == BUY_TYPE.FCFS && checkBuyTime(pool)
      || pool.pool_type == POOL_TYPE.SWAP && pool.buy_type == BUY_TYPE.WHITELIST_LOTTERY && (checkBuyTime(pool) || checkJoinTime(pool))
      || pool.pool_type == POOL_TYPE.CLAIMABLE && pool.buy_type == BUY_TYPE.FCFS && (checkBuyTime(pool) || !pool.release_time)
      || pool.pool_type == POOL_TYPE.CLAIMABLE && pool.buy_type == BUY_TYPE.WHITELIST_LOTTERY && (checkBuyTime(pool) || checkJoinTime(pool) || !pool.release_time)
  };

  // useEffect(() => {
  //   setTimeout(function(){ window.scroll({ top: 0, behavior: 'smooth'}) }, 500);
  // }, [])

  return (
    <DefaultLayout>
      {/*<BackgroundComponent/>*/}
      <div style={{ marginTop: 100 }}></div>

      {activePoolsV3Display && activePoolsV3Display.length > 0 &&
        <div className={`${styles.listPools} listPools2`}>
          <h2>Active Pools</h2>
          <div className="active_pools">
            {activePoolsV3Display.map((pool: any, index) => {
              return <CardActive pool={pool} key={pool.id} autoFetch={true} />
            })}
          </div>
        </div>
      }

      {
        nextToLaunchPoolsV3Display && nextToLaunchPoolsV3Display.length > 0 &&
        <div className={styles.listPools}>
          <h2>Next to launch</h2>
          <div className="pools">
            {nextToLaunchPoolsV3Display.map((pool: any, index) => {
              return <Card pool={pool} key={pool.id} autoFetch={false} />
            })}
          </div>
        </div>
      }

      {upcomingPoolsV3Display && upcomingPoolsV3Display.length > 0 &&
        <div className={styles.listPools}>
          <h2>Upcoming</h2>
          <div className="pools">
            {upcomingPoolsV3Display.map((pool: any, index) => {
              return <Card pool={pool} key={pool.id} autoFetch={true} />
            })}
          </div>
        </div>
      }

      {completeSalePoolsV3Display && completeSalePoolsV3Display.length > 0 &&
        <div className={styles.listPools}>
          <h2>Completed Sales</h2>
          <div className="pools_completed_sales">
            {completeSalePoolsV3Display.map((pool: any, index) => {
              return index < 5 && <CardCompletedSales pool={pool} key={pool.id} autoFetch={true} />
            })}
          </div>
          <button className={styles.btnViewAllPools} onClick={() => props.history.push('/pools')}>
            View all Pools&nbsp;
            <img src="/images/icons/arrow-right-bold.svg" alt="" />
          </button>
        </div>
      }
      <ContactForm className={styles.section} />
      
    </DefaultLayout>
  );
};

export default withRouter(Dashboard);
