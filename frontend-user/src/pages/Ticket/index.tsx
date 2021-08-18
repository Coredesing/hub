import React, { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import useStyles from './style';
import DefaultLayout from "../../components/Layout/DefaultLayout";
// import SwipeableViews from 'react-swipeable-views';
import { AboutTicket } from './About';
import { formatNumber, getDiffTime } from '../../utils';
import { Progress } from './Progress';
import useFetch from '../../hooks/useFetch';
import { useSelector } from 'react-redux';
import { APP_NETWORKS_SUPPORT, ETH_CHAIN_ID, POLYGON_CHAIN_ID } from '../../constants/network';
import useKyc from '../../hooks/useKyc';
import useAuth from '../../hooks/useAuth';
import { AlertKYC } from '../../components/Base/AlertKYC';
import { getBalance } from './utils';
import usePoolDepositAction from './hooks/usePoolDepositAction';
import { caclDiffTime } from './getDiffTime';
import useTokenAllowance from '../../hooks/useTokenAllowance';
import useTokenApprove from '../../hooks/useTokenApprove';
import { getBUSDAddress, getUSDCAddress, getUSDTAddress } from '../../utils/contractAddress/getAddresses';
import { PurchaseCurrency } from '../../constants/purchasableCurrency';
const ticketImg = '/images/gamefi-ticket.png';
const tetherIcon = '/images/icons/tether.svg';
const brightIcon = '/images/icons/bright.svg';
const finishedImg = '/images/finished.png';
const soldoutImg = '/images/soldout.png';
const Ticket: React.FC<any> = (props: any) => {
  const styles = useStyles();

  const { connectedAccount, isAuth, wrongChain } = useAuth();

  const { isKYC } = useKyc(connectedAccount);

  const { appChainID } = useSelector((state: any) => state.appNetwork).data;
  const [ticketBought, setTicketBought] = useState<number>(0);
  const [numTicketBuy, setNumTicketBuy] = useState<number>(0);
  const [isShowInfo, setIsShowInfo] = useState<boolean>(false);
  const [isBuy, setIsBuy] = useState<boolean>(false);
  const [endOpenTime, setEndOpenTime] = useState<boolean>(false);
  const [finishedTime, setFinishedTime] = useState<boolean>(false);
  const [openTime, setOpenTime] = useState<{ [k in string]: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [endTime, setTimeEnd] = useState<{ [k in string]: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [infoTicket, setInfoTicket] = useState<{ [k in string]: any }>({});
  const {
    data: dataTicket = null,
    loading: loadingTicket,
  } = useFetch<any>(`/pool/gamefi-ticket`);

  const [allowNetwork, setAllowNetwork] = useState<boolean>(false);
  useEffect(() => {
    const networkInfo = APP_NETWORKS_SUPPORT[Number(appChainID)];
    if (!networkInfo) {
      return;
    }
    setAllowNetwork(String(networkInfo.name).toLowerCase() === (infoTicket.network_available || '').toLowerCase())
  }, [infoTicket, appChainID]);

  useEffect(() => {
    if (!loadingTicket && dataTicket) {
      console.log(dataTicket)
      const openTime = +dataTicket.start_time * 1000;
      const finishTime = +dataTicket.finish_time * 1000;
      if (openTime > Date.now()) {
        setOpenTime(getDiffTime(openTime, Date.now()));
      }
      if (finishTime > openTime && finishTime > Date.now()) {
        setIsBuy(true);
        setTimeEnd(getDiffTime(finishTime, Date.now() >= openTime ? Date.now() : openTime));
      } else {
        setFinishedTime(true);
        setIsBuy(false);
      }

      setInfoTicket(dataTicket);
    }
  }, [dataTicket, loadingTicket]);

  useEffect(() => {
    console.log(finishedTime)
  }, [finishedTime])

  const [renewBalance, setNewBalance] = useState(true);
  useEffect(() => {
    const setBalance = async () => {
      try {
        // const approved = await isApproved(connectedAccount, dataTicket.campaign_hash, library, dataTicket.network_available, dataTicket.accept_currency);
        // console.log('approved', approved);
        // setAccApprove(approved);
        const myNumTicket = await getBalance(connectedAccount, dataTicket.token, dataTicket.network_available, dataTicket.accept_currency);
        setTicketBought(+myNumTicket);
        // setNewBalance(false);
      } catch (error) {
        console.log(error)
      }

    }
    connectedAccount && dataTicket && setBalance();
  }, [connectedAccount, dataTicket, renewBalance]);

  useEffect(() => {
    const interval = setInterval(() => {

      const newOpenTime = { ...openTime };
      if (newOpenTime.days === 0 && newOpenTime.hours === 0 && newOpenTime.minutes === 0 && newOpenTime.seconds === 0) {
        clearInterval(interval);
        setIsBuy(true);
        setEndOpenTime(true);
        setIsShowInfo(true);
        return;
      }
      setOpenTime(caclDiffTime(newOpenTime));
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [openTime, setOpenTime]);

  useEffect(() => {
    let interval: any;
    if (isBuy) {
      interval = setInterval(() => {

        const newEndTime = { ...endTime };
        if (newEndTime.days === 0 && newEndTime.hours === 0 && newEndTime.minutes === 0 && newEndTime.seconds === 0) {
          clearInterval(interval);
          setIsBuy(false);
          setEndOpenTime(true);
          setFinishedTime(true);
          return;
        }
        setTimeEnd(caclDiffTime(newEndTime));
      }, 1000);
    }

    return () => {
      interval && clearInterval(interval);
    }
  }, [isBuy, endTime, setTimeEnd]);

  const ascAmount = () => {
    if (numTicketBuy === 25) {
      return;
    }
    setNumTicketBuy(n => n + 1);
  }
  const descAmount = () => {
    if (numTicketBuy > 0) {
      setNumTicketBuy(n => n - 1);
    }
  }
  // const { data: depositTransaction, error: depositError1 } = useSelector((state: any) => state.deposit);
  // const { data: approveTransaction, error: approveError } = useSelector((state: any) => state.approve);

  // const {data: allowance = 0} = useSelector((state: any) => state.allowance);
  // console.log('depositError1', depositError1, 'depositTransaction', depositTransaction)
  // console.log('approveTransaction', approveTransaction)
  // console.log('allowance', allowance)


  const {
    deposit,
    tokenDepositLoading,
    tokenDepositTransaction,
    depositError,
    tokenDepositSuccess
  } = usePoolDepositAction({
    poolAddress: infoTicket.campaign_hash,
    poolId: infoTicket?.id,
    purchasableCurrency: String(infoTicket.accept_currency).toUpperCase(),
    amount: `0x${(numTicketBuy * (+infoTicket.ether_conversion_rate || 0)).toString(16)}`,
    isClaimable: infoTicket.pool_type === "claimable",
    networkAvailable: infoTicket.network_available
  });

  const { retrieveTokenAllowance } = useTokenAllowance();

  const getApproveToken = useCallback((appChainID: string) => {
    const purchasableCurrency = String(infoTicket.accept_currency).toUpperCase();
    if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.USDT) {
      return {
        address: getUSDTAddress(appChainID),
        name: "USDT",
        symbol: "USDT",
        decimals: (appChainID === ETH_CHAIN_ID || appChainID === POLYGON_CHAIN_ID) ? 6 : 18
      };
    }

    if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.BUSD) {
      return {
        address: getBUSDAddress(appChainID),
        name: "BUSD",
        symbol: "BUSD",
        decimals: 18
      };
    }

    if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.USDC) {
      return {
        address: getUSDCAddress(appChainID),
        name: "USDC",
        symbol: "USDC",
        decimals: (appChainID === ETH_CHAIN_ID || appChainID === POLYGON_CHAIN_ID) ? 6 : 18
      };
    }

    if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.ETH) {
      return {
        address: "0x00",
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
      }
    }
  }, [infoTicket.accept_currency])

  const tokenToApprove = getApproveToken(appChainID);

  const { approveToken, tokenApproveLoading, transactionHash } = useTokenApprove(
    tokenToApprove,
    connectedAccount,
    infoTicket.campaign_hash,
    false
  );
  const [tokenAllowance, setTokenAllowance] = useState<number | undefined>(undefined);

  const handleTokenApprove = async () => {
    try {
      // setApproveModal(true);
      await approveToken();
      console.log(infoTicket.campaign_hash, connectedAccount, tokenToApprove)
      if ( infoTicket.campaign_hash && connectedAccount && tokenToApprove) {
        setTokenAllowance(await retrieveTokenAllowance(tokenToApprove, connectedAccount, infoTicket.campaign_hash) as number);
        // setTokenBalance(await retrieveTokenBalance(tokenToApprove, connectedAccount) as number);
      }
    } catch (err) {
      console.log(err);
      // setApproveModal(false);
    }
  }

  const fetchPoolDetails = useCallback(async () => {
    if (infoTicket.campaign_hash && connectedAccount && tokenToApprove) {
      setTokenAllowance(await retrieveTokenAllowance(tokenToApprove, connectedAccount, infoTicket.campaign_hash) as number);
    }

}, [connectedAccount, tokenToApprove, infoTicket.campaign_hash, retrieveTokenAllowance]);


useEffect(() => {
  const fetchPoolDetailsBlockchain = async () => {
    await fetchPoolDetails();
  }

  connectedAccount && infoTicket.campaign_hash && fetchPoolDetailsBlockchain();
}, [connectedAccount, infoTicket.campaign_hash, fetchPoolDetails]);

const isAccApproved = (tokenAllowance: number) => {
  return +tokenAllowance > 0;
}

  useEffect(() => {
    console.log(tokenDepositLoading,
      tokenDepositTransaction,
      depositError,
      tokenDepositSuccess)
  }, [tokenDepositLoading,
    tokenDepositTransaction,
    depositError,
    tokenDepositSuccess])


  const onBuyTicket = async () => {
    try {

      if (numTicketBuy > 0) {
        await deposit();
        setNewBalance(true);
        setTicketBought(0);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const calcProgress = (sold: number, total: number) => {
    return Math.ceil((sold * 100) / total) || 0;
  }

  const getMaxTicketBuy = (ownedTicket: number, maxTicket: number = 0) => {
    if(ownedTicket >= maxTicket) return 0;
    return maxTicket - ownedTicket;
  }

  return (
    <DefaultLayout>

      <div className={styles.content}>
        {
          !isKYC && !loadingTicket && <AlertKYC connectedAccount={connectedAccount} />
        }

        <div className={styles.card}>
          <div className={styles.cardImg}>
            <img src={infoTicket.token_images} alt="" />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardBodyText}>
              <h3>{infoTicket.name}</h3>
              <h4>
                <span >TOTAL SALE</span> {infoTicket.total_sold_coin}
              </h4>
              <button>
                <img height={20} src={infoTicket && infoTicket.accept_currency ? `/images/${infoTicket.accept_currency.toUpperCase()}.png` : ''} alt="" />
                <span>{infoTicket.ether_conversion_rate} {infoTicket && infoTicket.accept_currency ? infoTicket.accept_currency.toUpperCase() : ''}</span>
                <span className="small-text">
                  /{infoTicket.symbol}
                </span>
              </button>
            </div>
            <div className={styles.cardBodyDetail}>
              {!endOpenTime &&
                <div className={styles.cardBodyClock}>
                  <h5>
                    Open in
                    <span className="open">
                      <img src={brightIcon} alt="" />
                    </span>
                  </h5>
                  <div className="times">
                    <span className="time">
                      <span className="number">{formatNumber(openTime.days)}</span>
                      <span className="text">Days</span>
                    </span>
                    <span className="dot">:</span>
                    <span className="time">
                      <span className="number">{formatNumber(openTime.hours)}</span>
                      <span className="text">Hours</span>
                    </span>
                    <span className="dot">:</span>
                    <span className="time">
                      <span className="number">{formatNumber(openTime.minutes)}</span>
                      <span className="text">Minutes</span>
                    </span>
                    <span className="dot">:</span>
                    <span className="time">
                      <span className="number">{formatNumber(openTime.seconds)}</span>
                      <span className="text">Seconds</span>
                    </span>
                  </div>
                </div>
              }
              {isShowInfo && <div className={styles.cardBodyProgress}>
                <div className={styles.progressItem}>
                  <span className={styles.text}>Progress</span>
                  <div className="showProgress">
                    <Progress progress={calcProgress(+infoTicket.token_sold, +infoTicket.total_sold_coin)} />
                  </div>
                  <div className={clsx(styles.infoTicket, 'total')}>
                    <span className={styles.textBold}>
                      {calcProgress(+infoTicket.token_sold, +infoTicket.total_sold_coin)}%
                    </span>

                    <span className="amount">
                      {infoTicket.token_sold}/{infoTicket.total_sold_coin} Tickets
                    </span>
                  </div>
                </div>
                <div className={styles.infoTicket}>
                  <span className={styles.text}>Remaining</span> <span className={styles.textBold}>
                    {(+infoTicket.total_sold_coin || 0) - (+infoTicket.token_sold || 0)}
                  </span>
                </div>
                <div className={styles.infoTicket}>
                  <span className={styles.text}>OWNED/MAX</span> <span className={styles.textBold}>{ticketBought}/{getMaxTicketBuy(ticketBought, +infoTicket.max_buy_ticket)}
                  </span>
                </div>
                <div className={styles.infoTicket}>
                  <span className={styles.text}>PARTICIPANTS</span> <span className={styles.textBold}>{infoTicket.participants}
                  </span>
                </div>
                {!finishedTime && isBuy && <div className={styles.infoTicket}>
                  <span className={styles.text}>END IN</span>
                  <span className={styles.timeEnd}>
                    {formatNumber(endTime.days)}d : {formatNumber(endTime.hours)}h : {formatNumber(endTime.minutes)}m : {formatNumber(endTime.seconds)}s
                  </span>
                </div>}

                {allowNetwork && !finishedTime && isBuy && isAccApproved(tokenAllowance || 0) && <div className={styles.infoTicket}>
                  <div className={styles.amountBuy}>
                    <span>Amount</span>
                    <div>
                      <span onClick={descAmount}>-</span>
                      <span>{numTicketBuy}</span>
                      <span onClick={ascAmount}>+</span>
                    </div>
                  </div>
                  <button className={clsx(styles.buynow, {
                    [styles.buyDisabled]: numTicketBuy <= 0
                  })} onClick={onBuyTicket} disabled={numTicketBuy <= 0}>
                    buy now
                  </button>
                </div>}

                {!isAccApproved(tokenAllowance || 0) && <button className={styles.btnApprove} onClick={handleTokenApprove} >
                    Approve
                  </button>}

                {finishedTime && <div className={clsx(styles.infoTicket, styles.finished)}>
                  <div className="img-finished">
                    <img src={finishedImg} alt="" />
                  </div>
                  <div className="soldout">
                    <img src={soldoutImg} alt="" />
                  </div>
                </div>}

              </div>}

            </div>
          </div>
        </div>
        <div className={styles.displayContent}>
          <AboutTicket info={infoTicket} />
        </div>
      </div>
    </DefaultLayout>
  )
}

export default withRouter(Ticket);
