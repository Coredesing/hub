import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../styles/CommonStyle';
import { withRouter } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import { HashLoader } from "react-spinners";
import moment from 'moment'
import DefaultLayout from "../../components/Layout/DefaultLayout";
import {
  Dialog, DialogContent, /*DialogActions,*/ CircularProgress,
} from '@material-ui/core';
// import CustomButton from './Button'
import StakingHeader, { DURATION_LIVE, DURATION_FINISHED, POOL_TYPE_ALLOC, POOL_TYPE_LINEAR, BENEFIT_ALL, BENEFIT_IDO_ONLY, BENEFIT_REWARD_ONLY } from './Header'
// import AllocationPool from './Pool/AllocationPool';
import LinearPool from './Pool/LinearPool';
// import useTokenDetails from "../../hooks/useTokenDetails";
// import ButtonLink from "../../components/Base/ButtonLink";
// import ModalTransaction from "./ModalTransaction";
import { BigNumber } from 'ethers';
import useTokenAllowance from '../../hooks/useTokenAllowance';
import useDetailListStakingPool from './hook/useDetailListStakingPool';
import ModalStake from "./ModalStake";
import { ChainDefault } from '../../constants/network'
import { getBalance } from "../../store/actions/balance";

import useFetch, { useFetchV1 } from '../../hooks/useFetch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import DialogTxSubmitted from '../../components/Base/DialogTxSubmitted';
import { WrapperAlert } from '../../components/Base/WrapperAlert';
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRowBody,
  TableRowHead,
  // TableSortLabel,
} from "@base-components/Table";
import { convertTimeToStringFormat } from '@utils/convertDate';
import { SearchBox } from '@base-components/SearchBox';
import { CountDownTimeV1 } from '@base-components/CountDownTime';
import { Box, Typography, Button } from '@material-ui/core';
import { cvtAddressToStar, debounce, escapeRegExp } from '@utils/index';
import { numberWithCommas } from '@utils/formatNumber';
import { getTiers } from '@store/actions/sota-tiers';
import WrapperContent from '@base-components/WrapperContent';
import SelectBox from '@base-components/SelectBox';
import { getVectorIcon } from '@base-components/Icon';
// import BN from 'bignumber.js';
import { getContract } from '@utils/contract';
import STAKING_POOL_ABI from '@abi/StakingPool.json';
import clsx from 'clsx';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { TIERS } from '@app-constants';

const closeIcon = '/images/icons/close.svg';

const StakingPools = (props: any) => {
  const styles = useStyles();
  const commonStyles = useCommonStyle();
  const dispatch = useDispatch();

  // Start Staking Logic 

  const { appChainID, walletChainID } = useTypedSelector(state => state.appNetwork).data;
  const { account: connectedAccount, library } = useWeb3React();
  const { data: balance = {} } = useSelector((state: any) => state.balance);
  const { retrieveTokenAllowance } = useTokenAllowance();

  // Filter
  const [durationType, setDurationType] = useState(DURATION_LIVE);
  const [poolType, setPoolType] = useState(POOL_TYPE_LINEAR);
  const [benefitType, setBenefitType] = useState(BENEFIT_ALL);
  const [stakedOnly, setStakedOnly] = useState(false);
  const [searchString, setSearchString] = useState('');

  // Transaction
  const [openModalTransactionSubmitting, setOpenModalTransactionSubmitting] = useState(false)
  const [transactionHashes, setTransactionHashes] = useState([]) as any;
  const { data: poolsList, loading: loadingGetPool } = useFetch<any>(`/staking-pool`);
  const [resetTopStaking, setResetTopStaking] = useState(true);
  const { data: listTopStaked, loading: loadingTopStaked } = useFetchV1<any>(`/staking-pool/top-staked`, resetTopStaking);
  const { allocPools, linearPools, fetchDetailList, loading: loadingDetailList } = useDetailListStakingPool(poolsList)
  const [filteredAllocPools, setFilteredAllocPools] = useState([]) as any;
  const [filteredLinearPools, setFilteredLinearPools] = useState([]) as any;
  const { data: tiers } = useSelector((state: any) => state.tiers);

  useEffect(() => {
    if (_.isEmpty(tiers)) {
      dispatch(getTiers());
    }
  }, [dispatch, tiers])

  useEffect(() => {
    let listAlloc = Object.values(allocPools);
    let listLinear = Object.values(linearPools);

    if (durationType === DURATION_FINISHED) {
      listAlloc = listAlloc.filter((e: any) => e?.allocPoint === "0")
      listLinear = listLinear.filter((e: any) => (
        Number(e?.endJoinTime) <= moment().unix() ||
        (BigNumber.from(e?.cap).gt(BigNumber.from('0')) && BigNumber.from(e?.cap).sub(BigNumber.from(e?.totalStaked)).eq(BigNumber.from('0')))
      ))
    } else {
      listAlloc = listAlloc.filter((e: any) => e?.allocPoint !== "0")
      listLinear = listLinear.filter((e: any) => (
        Number(e?.endJoinTime) > moment().unix() &&
        (BigNumber.from(e?.cap).eq(BigNumber.from('0')) || BigNumber.from(e?.cap).sub(BigNumber.from(e?.totalStaked)).gt(BigNumber.from('0')))
      ))
    }

    if (benefitType === BENEFIT_REWARD_ONLY) {
      listAlloc = listAlloc.filter((e: any) => e?.rkp_rate === 0)
      listLinear = listLinear.filter((e: any) => e?.rkp_rate === 0)
    }

    if (benefitType === BENEFIT_IDO_ONLY) {
      listAlloc = listAlloc.filter((e: any) => e?.rkp_rate > 0)
      listLinear = listLinear.filter((e: any) => e?.rkp_rate > 0)
    }

    if (searchString) {
      listAlloc = listAlloc.filter((e: any) => (e?.title as string).toLowerCase().indexOf(searchString.toLowerCase()) !== -1)
      listLinear = listLinear.filter((e: any) => (e?.title as string).toLowerCase().indexOf(searchString.toLowerCase()) !== -1)
    }

    if (stakedOnly) {
      listAlloc = listAlloc.filter((e: any) => e?.stakingAmount !== '0' || e?.pendingWithdrawal?.amount !== '0')
      listLinear = listLinear.filter((e: any) => e?.stakingAmount !== '0' || e?.pendingWithdrawal?.amount !== '0')
    }
    setFilteredAllocPools(listAlloc);
    setFilteredLinearPools(listLinear);
  }, [linearPools, allocPools, durationType, benefitType, stakedOnly, searchString])

  const [recallTopStaking, resRecallTopStaking] = useState({ isCall: false, inSeconds: 0 });


  const reloadData = useCallback(async () => {
    if (connectedAccount) {
      dispatch(getBalance(connectedAccount));
    }
    resRecallTopStaking({ isCall: true, inSeconds: 30 });
    fetchDetailList && fetchDetailList();
  }, [connectedAccount, fetchDetailList, dispatch]);

  useEffect(() => {
    if (recallTopStaking.isCall) {
      let count = 0;
      const timer = setTimeout(() => {
        resRecallTopStaking(d => ({ ...d, inSeconds: d.inSeconds - 1 }));
        if (count === recallTopStaking.inSeconds) {
          setResetTopStaking(true);
          clearInterval(timer);
          resRecallTopStaking({ isCall: false, inSeconds: 0 });
          return;
        }
        count++;
      }, 1000);
      return () => {
        clearTimeout(timer);
      }
    }
  }, [recallTopStaking])


  useEffect(() => {
    if (connectedAccount) {
      // dispatch(getAllowance(connectedAccount));
      dispatch(getBalance(connectedAccount));
    }
  }, [connectedAccount, dispatch]);

  const wrongChain = useMemo(() => {
    return appChainID !== ChainDefault.id || appChainID !== walletChainID;
  }, [appChainID, walletChainID]);

  const [topWalletRanking, setTopWalletRanking] = useState<any[]>([]);
  const [searchWallet, setSearchWallet] = useState('');

  const onSearchWallet = debounce((event: any) => {
    const value = event.target?.value;
    setSearchWallet(value);
  }, 1000);

  const [eventTime, setEventTime] = useState<{ [k: string]: any }>({
    isFinished: true, title: '', time: { days: 0, hours: 0, minutes: 0, seconds: 0 }
  });

  const handleEventTime = (listTopStaked: any) => {
    if (listTopStaked?.start_time * 1000 > Date.now()) {
      setEventTime({
        isFinished: false, title: 'Open in', time: {
          date1: listTopStaked?.start_time * 1000,
          date2: Date.now()
        }
      });
    } else if (listTopStaked?.end_time * 1000 > Date.now()) {
      setEventTime({
        isFinished: false, title: 'End in', time: {
          date1: listTopStaked?.end_time * 1000,
          date2: Date.now()
        }
      });
    } else {
      setEventTime({ isFinished: true, title: '' });
    }
  }

  useEffect(() => {
    if (listTopStaked?.top) {
      setResetTopStaking(false);
      handleEventTime(listTopStaked);
    }
  }, [listTopStaked])

  const onFinishCountdown = useCallback(() => {
    handleEventTime(listTopStaked);
  }, [listTopStaked]);

  useEffect(() => {
    let arr = (listTopStaked?.top || []).map((t: any, idx: number) => ({ ...t, idx }));
    if (searchWallet) {
      const regex = new RegExp(escapeRegExp(searchWallet), 'i');
      arr = arr.filter((item: any) => regex.test(item.wallet_address));
    }
    setTopWalletRanking(arr)
  }, [listTopStaked, searchWallet]);

  const [currentTops, setCurrentTops] = useState<any>({});
  const { data: topStakedsOver = [] as any } = useFetchV1('/staking-pool/legend-snapshots');
  const [recallTopLegend, setRecallTopLegend] = useState(true);
  const { data: topStakedCurrent = [] as any } = useFetchV1('/staking-pool/legend-current', recallTopLegend);

  const [topsStaked, setTopsStaked] = useState<any>([]);

  const sortTopsStaked = (topsStaked: any[], currentStake: { [k: string]: any }) => {
    const idx = topsStaked.findIndex((e: any) => e.name === currentStake.name);
    if (idx <= 0) return currentStake;

    const before = topsStaked[idx - 1];
    if (!before) {
      return currentStake;
    }
    currentStake.top.map((n: any, currRank: number) => {
      let beforeRank = before.top.findIndex((o: any) => o.wallet_address === n.wallet_address);
      currRank += 1;
      beforeRank += 1;
      n.isHighlight = n.wallet_address === connectedAccount;
      if (beforeRank === 0) {
        n.steps = 0;
      } else if (currRank === beforeRank) {
        n.steps = 0;
      } else if (currRank < beforeRank) {
        n.steps = beforeRank - currRank;
      } else {
        n.steps = -(currRank - beforeRank);
      }
      return n;
    })
    return currentStake;
  }

  const idForRealTime = -1;

  useEffect(() => {
    let arr: any = [];
    let current: { [k: string]: any } = {};
    if (topStakedsOver?.length) {
      arr = [...topStakedsOver];
      current = arr.slice(-1)[0];
    }
    if (topStakedCurrent?.length) {
      current = { name: 'Realtime Stake', top: topStakedCurrent, id: idForRealTime }
      arr = [...arr, current];
    }
    if (current.name) {
      setCurrentTops(sortTopsStaked(arr, current));
    }
    if (arr.length) {
      setRecallTopLegend(false);
      setTopsStaked(arr);
    }
  }, [topStakedsOver, topStakedCurrent]);

  const onSetCurrentTop = (id: number) => {
    setCurrentTops((old: any) => {
      const currentChange: any = JSON.parse(JSON.stringify(topsStaked.find((t: any) => +t.id === +id) || {}));
      if (!old.top) {
        return currentChange;
      }
      return sortTopsStaked(topsStaked, currentChange);
    });
  }

  const onSelectPool = (id: number) => {
    onSetCurrentTop(id);
  }

  const onChangePool = (event: any) => {
    event.stopPropagation();
    onSetCurrentTop(event.target.value);
  }

  const onSetRecallTopStake = debounce(() => {
    setRecallTopLegend(true);
  }, 1000);

  useEffect(() => {
    if (connectedAccount && filteredLinearPools?.length) {
      filteredLinearPools.forEach((pool: any) => {

        const contract = getContract(pool.pool_address, STAKING_POOL_ABI, library, connectedAccount as string);
        if (contract) {
          contract.on('LinearDeposit', (poolid, address, amount) => {
            if (topStakedCurrent.find((e: any) => e.wallet_address === address)) {
              onSetRecallTopStake();
            }
          })
        }
      })
    }
  }, [filteredLinearPools, connectedAccount, library]);


  const [expandedEvent, setExpandEvent] = useState(true);

  return (
    <DefaultLayout>
      <WrapperContent useShowBanner={false}>
        <div className={styles.wrapper}>
          <div className="content">
            {wrongChain &&
              <WrapperAlert type="error">
                Please switch to the {ChainDefault.name} network to join these staking pools
              </WrapperAlert>
            }
            <StakingHeader
              durationType={durationType}
              setDurationType={setDurationType}
              poolType={poolType}
              setPoolType={setPoolType}
              stakedOnly={stakedOnly}
              setStakedOnly={setStakedOnly}
              benefitType={benefitType}
              setBenefitType={setBenefitType}
              location={props.location}
              history={props.history}
              searchString={searchString}
              setSearchString={setSearchString}
            />

            {
              loadingDetailList &&
              <div className={styles.loader} style={{ marginTop: 70 }}>
                <HashLoader loading={true} color={'#72F34B'} />
              </div>
            }

            {
              // !loadingDetailList && poolType === POOL_TYPE_ALLOC && filteredAllocPools.length > 0 &&
              <>
                {/* {durationType === DURATION_FINISHED && 
                <div className={styles.messageDuration}>
                  <img src={iconWarning} style={{ marginRight: "12px" }} alt="" />
                  These pools are no longer distributing rewards. Please unstake your tokens.
                </div>
              } */}
                {/* <div className="pool-area">
                {
                  filteredAllocPools.map((pool: any) => (
                    <AllocationPool
                      key={pool?.id}
                      reload={reloadData}
                      setTransactionHashes={setTransactionHashes}
                      setOpenModalTransactionSubmitting={setOpenModalTransactionSubmitting}
                      connectedAccount={connectedAccount}
                      poolDetail={pool}
                      // blockNumber={blockNumber}
                      poolAddress={pool?.pool_address}
                    />
                  ))
                }
              </div> */}
              </>
            }



            {/* {durationType === DURATION_FINISHED && 
                <div className={styles.messageDuration}>
                  <img src={iconWarning} style={{ marginRight: "12px" }} alt="" />
                  These pools are no longer distributing rewards. Please unstake your tokens.
                </div>
              } */}
            <div className="pool-area">
              {
                !loadingDetailList && poolType === POOL_TYPE_LINEAR && filteredLinearPools.length > 0 &&
                filteredLinearPools.map((pool: any, idx: number) => (
                  <LinearPool
                    expandedDetail={filteredLinearPools[0].pool_id === pool.pool_id}
                    key={pool?.id}
                    reload={reloadData}
                    setTransactionHashes={setTransactionHashes}
                    setOpenModalTransactionSubmitting={setOpenModalTransactionSubmitting}
                    connectedAccount={connectedAccount}
                    poolDetail={pool}
                    poolAddress={pool?.pool_address}
                    poolsList={poolsList}
                  />
                ))
              }
              {listTopStaked && !listTopStaked?.disable &&
                <Accordion expanded={expandedEvent} style={{ marginTop: "30px", marginBottom: "20px" }} className={styles.boxRank} classes={{ root: styles.accordionRoot }}>
                  <AccordionSummary
                    expandIcon={<svg width="16" height="9" viewBox="0 0 16 9" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path id="Shape Copy 26" d="M7.99997 8.72727C7.71322 8.72727 7.4265 8.6225 7.20788 8.41341L0.328227 1.83028C-0.109409 1.41151 -0.109409 0.732549 0.328227 0.313949C0.765686 -0.10465 1.4751 -0.10465 1.91277 0.313949L7.99997 6.13907L14.0872 0.314153C14.5249 -0.104447 15.2342 -0.104447 15.6716 0.314153C16.1095 0.732752 16.1095 1.41171 15.6716 1.83048L8.79207 8.41361C8.57334 8.62274 8.28662 8.72727 7.99997 8.72727Z" fill="currentColor" />
                    </svg>}
                    aria-controls="panel1a-content"
                    classes={{
                      content: styles.accordionSummaryContent,
                      expanded: styles.accordionSummaryExpanded,
                      root: styles.accordionSummaryRoot
                    }}
                    onClick={() => setExpandEvent(b => !b)}
                  >
                    <Box className={styles.boxRankHeader}>
                      <Box className={styles.boxListRank}>
                        <Typography variant="h5" component="h5" className="text-uppercase">
                          Gamefi stake event
                        </Typography>
                        <Box className={styles.list}>
                          <Typography variant="h5" component="h5" className="item">
                            1. TOP {listTopStaked?.limit} RANKING will be given 1 NFT Legend
                          </Typography>
                          <Typography variant="h5" component="h5" className="item">
                            2. The results will be updated every minute and will be announced after review
                          </Typography>
                        </Box>
                      </Box>
                      <Box className={styles.boxListRank} marginBottom="20px">
                        <Box className={styles.endInText}>
                          {eventTime.title}
                        </Box>
                        {
                          !eventTime.isFinished && <Box>
                            <CountDownTimeV1 time={eventTime.time}
                              onFinish={onFinishCountdown} />
                          </Box>
                        }
                      </Box>
                    </Box>
                    <Box className="expanded-text" display="flex" justifyContent="flex-end" alignItems="center">
                      Details
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails
                    classes={{ root: styles.accordionDetailsRoot }}
                  >
                    <Box>
                      <Typography variant="h5" component="h5" className="text-uppercase" style={{ marginBottom: '10px' }}>
                        Ranking&nbsp;
                        {
                          recallTopStaking.isCall && <span style={{ fontFamily: 'Firs Neue', fontSize: '12px', fontWeight: 'normal', textTransform: 'none' }}>(The top will be update in {recallTopStaking.inSeconds} seconds)</span>
                        }
                      </Typography>
                      <Box marginBottom="10px" width="50%">
                        <SearchBox onChange={onSearchWallet} placeholder="Search first or last 14 digits of your wallet" />
                      </Box>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRowHead>
                              <TableCell>No</TableCell>
                              <TableCell align="left">Wallet Address</TableCell>
                              <TableCell align="left">Current Staked</TableCell>
                              <TableCell align="left">Last time Stake</TableCell>
                            </TableRowHead>
                          </TableHead>
                          <TableBody>
                            {topWalletRanking.map((row: any, idx: number) => (
                              <TableRowBody key={idx}>
                                <TableCell component="th" scope="row" className={row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined}>
                                  <Box >
                                    <span>{row.idx + 1}</span>
                                    {
                                      row.idx + 1 <= listTopStaked?.limit && <Box width="40px" height="40px" marginLeft="10px">
                                        <img src={TIERS.slice(-1)[0].icon} alt="" style={{ width: '40px', height: '40px' }} />
                                      </Box>
                                    }
                                  </Box>
                                </TableCell>
                                <TableCell align="left" className={row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined}>{cvtAddressToStar(row.wallet_address)}</TableCell>
                                <TableCell align="left" className={row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined}>{numberWithCommas((row.amount + '') || 0, 4)}</TableCell>
                                <TableCell align="left" className={row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined}>{convertTimeToStringFormat(new Date(+row.last_time * 1000))}</TableCell>
                              </TableRowBody>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              }
              <Accordion style={{ marginTop: "30px", marginBottom: "20px" }} className={styles.boxRank} classes={{ root: styles.accordionRoot }}>
                <AccordionSummary
                  expandIcon={<svg width="16" height="9" viewBox="0 0 16 9" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path id="Shape Copy 26" d="M7.99997 8.72727C7.71322 8.72727 7.4265 8.6225 7.20788 8.41341L0.328227 1.83028C-0.109409 1.41151 -0.109409 0.732549 0.328227 0.313949C0.765686 -0.10465 1.4751 -0.10465 1.91277 0.313949L7.99997 6.13907L14.0872 0.314153C14.5249 -0.104447 15.2342 -0.104447 15.6716 0.314153C16.1095 0.732752 16.1095 1.41171 15.6716 1.83048L8.79207 8.41361C8.57334 8.62274 8.28662 8.72727 7.99997 8.72727Z" fill="currentColor" />
                  </svg>}
                  aria-controls="panel1a-content"
                  classes={{
                    content: styles.accordionSummaryContent,
                    expanded: styles.accordionSummaryExpanded,
                    root: styles.accordionSummaryRoot
                  }}
                // onClick={() => setExpaned(b => !b)}
                >
                  <Box marginBottom="20px" gridGap="16px" display="flex" flexDirection="column">
                    <Box marginRight="20px">
                      <Box display="flex" gridGap="8px" flexWrap="wrap" marginBottom="10px">
                        <Button className={clsx(styles.btnFilterPool, { active: currentTops.id === idForRealTime })} onClick={(e) => {
                          e.stopPropagation();
                          onSelectPool(idForRealTime);
                        }}>
                          Realtime
                        </Button>
                        <Button className={clsx(styles.btnFilterPool, { active: currentTops.id !== idForRealTime })} onClick={(e) => {
                          e.stopPropagation();
                          const id = topStakedsOver?.length ? topStakedsOver.slice(-1)[0].id : null;
                          id && onSelectPool(id);
                        }}>
                          Snapshot
                        </Button>
                        {currentTops.id !== idForRealTime && <SelectBox
                          items={(topsStaked || []).filter((t: any) => t.id !== idForRealTime).map((t: any) => ({ poolName: t.name, id: t.id }))}
                          itemNameShowValue={'poolName'}
                          itemNameValue={'id'}
                          onChange={onChangePool}
                          value={currentTops.id + ''}
                          defaultValue={currentTops.id + ''}
                        />}
                      </Box>
                    </Box>
                    <Box>
                      <h3 className="text-uppercase" style={{ fontSize: '24px', fontFamily: 'Firs Neue', color: '#fff' }}>
                        {currentTops.id === idForRealTime ? 'LEGENDARY RANKING REALTIME' : (currentTops.name ? currentTops.name + ' - ' : '') + 'legendary SNAPSHOT'}
                      </h3>
                    </Box>
                  </Box>
                  <Box className="expanded-text" display="flex" justifyContent="flex-end" alignItems="center">
                    Details
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRowHead>
                          <TableCell align="left">No</TableCell>
                          <TableCell align="left">Wallet Address</TableCell>
                          <TableCell align="left">Amount</TableCell>
                          <TableCell align="left">{currentTops.id !== idForRealTime ? 'Snapshot Time' : 'Last Time Staked'}</TableCell>
                        </TableRowHead>
                      </TableHead>
                      <TableBody>
                        {currentTops?.top?.map((row: any, idx: number) => (
                          <TableRowBody key={idx}>
                            <TableCell component="th" scope="row" className={clsx(row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined, {
                              [styles.cellHighlight]: row.isHighlight
                            })}>
                              <div className={styles.cellRank}>
                                {/* <div>
                              {row.isHighlight && <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 8.5L0.749999 16.7272L0.75 0.272758L15 8.5Z" fill="#72F34B" />
                              </svg>}
                            </div> */}

                                <div className="rank">
                                  <img src={`/images/icons/${!row.steps ? 'gray' : row.steps > 0 ? 'green' : 'red'}-rank.png`} alt="" />
                                  <span>{idx + 1}</span>
                                </div>
                                <div className="movement">
                                  {row.steps > 0 ? <span className="up icon">{getVectorIcon()}</span> : row.steps < 0 ? <span className="down icon">{getVectorIcon('#D01F36')}</span> : ''}
                                  <span>
                                    {(row.steps === 0 ? '-' : (row.steps > 0 ? row.steps : row.steps ? -row.steps : ''))}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell align="left" className={clsx(row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined, {
                              [styles.cellHighlight]: row.isHighlight
                            })}>{cvtAddressToStar(row.wallet_address)}</TableCell>
                            <TableCell align="left" className={clsx(row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined, {
                              [styles.cellHighlight]: row.isHighlight
                            })}>{numberWithCommas((row.amount + '') || 0, 4)}</TableCell>
                            <TableCell align="left" className={clsx(row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined, {
                              [styles.cellHighlight]: row.isHighlight
                            })}>{convertTimeToStringFormat(new Date((currentTops.id > 0 ? +row.snapshot_at : +row.last_time) * 1000))}</TableCell>
                          </TableRowBody>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </div>


          </div>

          <Dialog
            open={openModalTransactionSubmitting}
            keepMounted
            onClose={() => setOpenModalTransactionSubmitting(false)}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            className={commonStyles.loadingTransaction}
          >
            <DialogContent className="content">
              <img src={closeIcon} alt="" onClick={() => setOpenModalTransactionSubmitting(false)} />
              <span className={commonStyles.nnb1824d}>Transaction Submitting</span>
              <CircularProgress color="primary" />
            </DialogContent>
          </Dialog>

          <ModalStake open={false} />

          {transactionHashes.length > 0 && <DialogTxSubmitted
            networkName={ChainDefault.id}
            transaction={transactionHashes[0].tnx}
            onClose={() => setTransactionHashes([])}
            open={transactionHashes.length > 0}
          />}
        </div>
      </WrapperContent>
    </DefaultLayout>
  );
};

export default withRouter(StakingPools);
