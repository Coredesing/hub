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
  Dialog, DialogContent, DialogActions, CircularProgress,
} from '@material-ui/core';
import CustomButton from './Button'
import StakingHeader, { DURATION_LIVE, DURATION_FINISHED, POOL_TYPE_ALLOC, POOL_TYPE_LINEAR, BENEFIT_ALL, BENEFIT_IDO_ONLY, BENEFIT_REWARD_ONLY } from './Header'
// import AllocationPool from './Pool/AllocationPool';
import LinearPool from './Pool/LinearPool';
import useTokenDetails from "../../hooks/useTokenDetails";
import ButtonLink from "../../components/Base/ButtonLink";
import ModalTransaction from "./ModalTransaction";
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
  TableSortLabel,
} from "@base-components/Table";
import { convertTimeToStringFormat } from '@utils/convertDate';
import { SearchBox } from '@base-components/SearchBox';
import { CountDownTimeV1 } from '@base-components/CountDownTime';
import { Box, Typography } from '@material-ui/core';
import { cvtAddressToStar, debounce, escapeRegExp } from '@utils/index';
import { numberWithCommas } from '@utils/formatNumber';
import { getTiers } from '@store/actions/sota-tiers';
import WrapperContent from '@base-components/WrapperContent';
import { topStaking } from './data';
import SelectBox from '@base-components/SelectBox';
import { getVectorIcon } from '@base-components/Icon';
console.log(topStaking);
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
  const onChangePool = (event: any) => {
    setCurrentTops((old: any) => {
      const currentChange: any = JSON.parse(JSON.stringify(topStaking[event.target.value]));
      if (!old.top) {
        return currentChange;
      }
      const before = topStaking[currentChange.id - 1];
      if (!before) {
        return currentChange;
      }

      currentChange.top.map((n: any, currRank: number) => {
        let beforeRank = before.top.findIndex((o) => o.wallet_address === n.wallet_address);
        currRank += 1;
        beforeRank += 1;
        if (currRank === beforeRank) {
          n.steps = 0;
        } else if (currRank < beforeRank) {
          n.steps = beforeRank - currRank;
        } else {
          n.steps = -(currRank - beforeRank);
        }
        return n;
      })
      console.log(currentChange)
      return currentChange;
    });
  }
  // useEffect(() => {
  //   if(connectedAccount && filteredLinearPools?.length) {
  //     const newDeposit: any = {};
  //     const newWithdraw: any = {};
  //     filteredLinearPools.forEach((pool: any) => {

  //       const contract = getContract(pool.pool_address, STAKING_POOL_ABI, library, connectedAccount as string);
  //       if(contract) {
  //         contract.on('LinearDeposit', (poolid, address, amount) => {
  //           if(!new BN(newDeposit.poolid || 0).eq(new BN(poolid.toNumber())) || newDeposit.address !== address || !new BN(newDeposit.amount || 0).eq(new BN(amount.toBigInt()))) {
  //             newDeposit.address = address;
  //             newDeposit.poolid = new BN(poolid.toNumber());
  //             newDeposit.amount = new BN(amount.toBigInt());
  //             setResetTopStaking(true);
  //           }
  //         })
  //         contract.on('LinearPendingWithdraw', (poolid, address, amount) => {
  //           if(!new BN(newWithdraw.poolid || 0).eq(new BN(poolid.toNumber())) || newWithdraw.address !== address || !new BN(newWithdraw.amount || 0).eq(new BN(amount.toBigInt()))) {
  //             newWithdraw.address = address;
  //             newWithdraw.poolid = new BN(poolid.toNumber());
  //             newWithdraw.amount = new BN(amount.toBigInt());
  //             setResetTopStaking(true);
  //           }
  //         })
  //       }
  //     })
  //   }
  // }, [filteredLinearPools, connectedAccount, library]);


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
                <Box marginTop="30px" className={styles.boxRank}>
                  <Box className={styles.boxRankHeader}>
                    <Box className={styles.boxListRank}>
                      <Typography variant="h5" component="h5" className="text-uppercase">
                        Gamefi stake event
                      </Typography>
                      <Box className={styles.list}>
                        <Typography variant="h5" component="h5" className="item">
                          1. TOP 12 RANKING will be given 1 NFT Legend
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
                            <TableCell component="th" scope="row" className={row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined}>  {row.idx + 1} </TableCell>
                            <TableCell align="left" className={row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined}>{cvtAddressToStar(row.wallet_address)}</TableCell>
                            <TableCell align="left" className={row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined}>{numberWithCommas((row.amount + '') || 0, 4)}</TableCell>
                            <TableCell align="left" className={row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined}>{convertTimeToStringFormat(new Date(+row.last_time * 1000))}</TableCell>
                          </TableRowBody>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <SelectBox
                    items={topStaking.map((t, id) => ({ poolName: t.poolname, id }))}
                    itemNameShowValue={'poolName'}
                    itemNameValue={'id'}
                    onChange={onChangePool}
                  >

                  </SelectBox>
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
                        {currentTops?.top?.map((row: any, idx: number) => (
                          <TableRowBody key={idx}>
                            <TableCell component="th" scope="row" className={row.idx + 1 <= listTopStaked?.limit ? styles.cellActive : undefined}>
                              <div className={styles.cellRank}>
                                <div className="rank">
                                  <img src={`/images/icons/${!row.steps ? 'gray' : row.steps > 0 ? 'green' : 'red'}-rank.png`} alt="" />
                                  <span>{idx + 1}</span>
                                </div>
                                <div className="movement">
                                  {row.steps > 0 ? <span className="up icon">{getVectorIcon()}</span> : row.steps < 0 ? <span className="down icon">{getVectorIcon('#D01F36')}</span> : ''}
                                  <span>
                                    {row.steps}
                                  </span>
                                </div>
                              </div>
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
              }
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
