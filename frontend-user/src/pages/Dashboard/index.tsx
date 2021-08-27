import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {withRouter} from 'react-router-dom';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import useStyles from './style';
import Card from './Card';
import CardActive from './CardActive';
import CardCompletedSales from './CardCompletedSales';
import usePools from '../../hooks/usePools';
import {BUY_TYPE, POOL_TYPE} from '../../constants';
import {convertFromWei, getPoolContract} from '../../services/web3';
import {getPoolStatusByPoolDetail} from "../../utils/getPoolStatusByPoolDetail";
import {PoolStatus} from "../../utils/getPoolStatus";
import BackgroundComponent from './BackgroundComponent'
import BigNumber from 'bignumber.js';
import useFetch from "../../hooks/useFetch";
import {isEmail} from "../../utils";
import axios from "../../services/axios";
import clsx from "clsx";
import {Button, TextField} from "@material-ui/core";

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

  const [email, setEmail] = useState('');
  const [statusSubc, setStatusSub] = useState<{
    ok?: boolean,
    msg?: string,
    isShow: boolean,
  }>({
    ok: false,
    msg: '',
    isShow: false
  });
  const onChangeEmail = (event: any) => {
    const value = event.target.value;
    setEmail(value);
  }
  const onSubmitEmail = () => {
    if (!isEmail(email)) {
      return setStatusSub({ ok: false, msg: 'Invalid email', isShow: true });
    }
    axios.post('/home/subscribe', { email })
      .then((res) => {
        const result = res.data;
        if (result?.status === 200) {
          setEmail('');
          setStatusSub({ ok: true, msg: 'Subcribe succesfully. We\'ll contact to you as soos as possible!.', isShow: true });
          setTimeout(() => {
            setStatusSub({isShow: false});
          }, 4000);
        } else {
          setStatusSub({ ok: false, msg: 'Something wrong was happened. Please try again later!', isShow: true });
        }
      }).catch(err => {
      console.log(err);
      setStatusSub({ ok: false, msg: 'Something wrong was happened. Please try again later!', isShow: true });
    })
  }

  return (
    <DefaultLayout>
      {/*<BackgroundComponent/>*/}
      <div style={{marginTop: 100}}></div>

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
            return index < 5 && <CardCompletedSales pool={pool} key={pool.id} autoFetch={true}/>
          })}
        </div>
        <button className={styles.btnViewAllPools} onClick={() => props.history.push('/pools')}>
          View all Pools&nbsp;
          <img src="/images/icons/arrow-right-bold.svg" alt=""/>
        </button>
      </div>
      }

      <section className={clsx(styles.section, styles.contact)}>
        <div className="rectangle">
          <img src="/images/subcriber.svg" alt="" />
        </div>
        <h3>
          Get the Latest in Your Inbox
        </h3>
        <div className={styles.contactForm}>
          <form onSubmit={(e) => { e.preventDefault(); onSubmitEmail() }}>
            <TextField className={styles.inputForm}
                       label="Email" variant="outlined"
                       placeholder="Enter your Email"
                       value={email}
                       onChange={onChangeEmail}
                       onSubmit={(e) => e.preventDefault()}
            />
            <Button className={styles.btnForm} type="submit">
              Subscribe
            </Button>
          </form>

          {statusSubc.isShow && <div className={clsx(styles.alertMsg, {
              error: !statusSubc.ok,
              success: statusSubc.ok
            }
          )}>
            {statusSubc.ok ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM15.5355 8.46447C15.9261 8.07394 16.5592 8.07394 16.9498 8.46447C17.3403 8.85499 17.3403 9.48816 16.9498 9.87868L11.2966 15.5318L11.2929 15.5355C11.1919 15.6365 11.0747 15.7114 10.9496 15.7602C10.7724 15.8292 10.5795 15.8459 10.3948 15.8101C10.2057 15.7735 10.0251 15.682 9.87868 15.5355L9.87489 15.5317L7.05028 12.7071C6.65975 12.3166 6.65975 11.6834 7.05028 11.2929C7.4408 10.9024 8.07397 10.9024 8.46449 11.2929L10.5858 13.4142L15.5355 8.46447Z" fill="#0A0A0A" />
              </svg>
              : <img src={'/images/warning-red.svg'} alt="" />}
            <span>{statusSubc.msg}</span>
          </div>}

        </div>
      </section>
    </DefaultLayout>
  );
};

export default withRouter(Dashboard);
