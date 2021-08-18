import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import useStyles from './style';
import DefaultLayout from "../../components/Layout/DefaultLayout";

// import SwipeableViews from 'react-swipeable-views';
import { AboutTicket } from './About';
import { formatNumber, getDiffTime } from '../../utils';
import { Progress } from './Progress';
import useFetch from '../../hooks/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import { APP_NETWORKS_SUPPORT } from '../../constants/network';
import useKyc from '../../hooks/useKyc';
import useAuth from '../../hooks/useAuth';
import usePoolDetails from '../../hooks/usePoolDetails';
import { AlertKYC } from '../../components/Base/AlertKYC';
import { getBalance, isApproved } from './utils';
import axios from 'axios';
import useWalletSignature from '../../hooks/useWalletSignature';
import usePoolDepositAction from './hooks/usePoolDepositAction';
import { approve } from '../../store/actions/sota-token';
import { useWeb3React } from '@web3-react/core';
import { caclDiffTime } from './getDiffTime';
import { getContractAddress } from './getContractAddress';
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

  const dispatch = useDispatch();

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
      const openTime = +dataTicket.start_time * 1000;
      const finishTime = +dataTicket.finish_time * 1000;
      if (openTime > Date.now()) {
        setOpenTime(getDiffTime(openTime, Date.now()));
      }
      if (finishTime > openTime) {
        setIsBuy(true);
        setTimeEnd(getDiffTime(finishTime, Date.now() >= openTime ? Date.now() : openTime));
      } else {
        setFinishedTime(true);
        setIsBuy(false);
      }
      setInfoTicket(dataTicket);
    }
  }, [dataTicket, loadingTicket]);

  const { account: connectedAccount1, library } = useWeb3React();
  const onApprove = () => {
    const tokenContract = getContractAddress(infoTicket.network_available, dataTicket.accept_currency);
    dispatch(approve(connectedAccount1, library, tokenContract, infoTicket.campaign_hash));
    setAccApprove(true);
  }
  const [renewBalance, setNewBalance] = useState(true);
  const [isAccApproved, setAccApprove] = useState(true);
  useEffect(() => {
    const setBalance = async () => {
      try {
        const approved = await isApproved(connectedAccount, dataTicket.campaign_hash, library, dataTicket.network_available, dataTicket.accept_currency);
        console.log('approved', approved);
        setAccApprove(approved);
        const myNumTicket = await getBalance(connectedAccount, dataTicket.token, dataTicket.network_available, dataTicket.accept_currency);
        setTicketBought(+myNumTicket);
        setNewBalance(false);
      } catch (error) {
        console.log(error)
      }

    }
    renewBalance && connectedAccount && dataTicket && setBalance();
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
      }
    } catch (error) {
      console.log(error);
    }
  }

  const calcProgress = (sold: number, total: number) => {
    return Math.ceil((sold * 100) / total) || 0;
  }

  return (
    <DefaultLayout>

      <div className={styles.content}>
        {!isAccApproved &&  <div className={styles.displayContent}>
          <div className={`${styles.alert}`}>
            <span className="kyc-link" onClick={onApprove}>Please approve your account to continue</span>
          </div>
        </div>}
       
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
                <img src={tetherIcon} alt="" />
                <span>{infoTicket.ether_conversion_rate} USDT</span>
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
                  <span className={styles.text}>OWNED</span> <span className={styles.textBold}>{ticketBought}
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

                {allowNetwork && isBuy && isAccApproved && <div className={styles.infoTicket}>
                  <div className={styles.amountBuy}>
                    <span>Amount</span>
                    <div>
                      <span onClick={descAmount}>-</span>
                      <span>{numTicketBuy}</span>
                      <span onClick={ascAmount}>+</span>
                    </div>
                  </div>
                  <button className={styles.buynow} onClick={onBuyTicket} disabled={numTicketBuy <= 0}>
                    buy now
                  </button>
                </div>}

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
