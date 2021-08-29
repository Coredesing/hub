import React, { useCallback, useEffect, useState } from "react";
import { withRouter, useParams } from "react-router-dom";
import clsx from "clsx";
import useStyles from "./style";
import DefaultLayout from "../../components/Layout/DefaultLayout";
// import SwipeableViews from 'react-swipeable-views';
import AboutTicket from "./About";
import { formatNumber, getDiffTime } from "../../utils";
import { Progress } from "./Progress";
import { useFetchV1 } from "../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import {
  APP_NETWORKS_SUPPORT,
  ETH_CHAIN_ID,
  POLYGON_CHAIN_ID,
} from "../../constants/network";
import useKyc from "../../hooks/useKyc";
import useAuth from "../../hooks/useAuth";
import { AlertKYC } from "../../components/Base/AlertKYC";
import { getBalance, isEndPool } from "./utils";
import usePoolDepositAction from "./hooks/usePoolDepositAction";
import { caclDiffTime } from "./getDiffTime";
import useTokenAllowance from "../../hooks/useTokenAllowance";
import useTokenApprove from "../../hooks/useTokenApprove";
import {
  getBUSDAddress,
  getUSDCAddress,
  getUSDTAddress,
} from "../../utils/contractAddress/getAddresses";
import { PurchaseCurrency } from "../../constants/purchasableCurrency";
import useUserPurchased from "./hooks/useUserPurchased";
import TicketModal from "./TicketModal";
import useTokenClaim from "./hooks/useTokenClaim";
import axios from "../../services/axios";
import useUserRemainTokensClaim from "./hooks/useUserRemainTokensClaim";
import { alertFailure, setTypeIsPushNoti } from "../../store/actions/alert";
import { TOKEN_TYPE } from "../../constants";
import NotFoundPage from "../NotFoundPage/ContentPage";
import { Backdrop, CircularProgress, useTheme } from '@material-ui/core';
import { HashLoader } from "react-spinners";
import { numberWithCommas } from "../../utils/formatNumber";
// import { FormInputNumber } from '../../components/Base/FormInputNumber/FormInputNumber';
const iconWarning = "/images/warning-red.svg";
const ticketImg = "/images/gamefi-ticket.png";
// const tetherIcon = '/images/icons/tether.svg';
const brightIcon = "/images/icons/bright.svg";
const finishedImg = "/images/finished.png";
const soldoutImg = "/images/soldout.png";
const Ticket: React.FC<any> = (props: any) => {
  const params = useParams<{ [k: string]: any }>();
  const id = params.id;
  const theme = useTheme();
  const [checkParamType, setCheckParamType] = useState({
    checking: true,
    valid: false,
  });
  const { data: dataTicket = null, loading: loadingTicket } = useFetchV1<any>(
    `/pool/${id}`,
  );
  useEffect(() => {
    if (!loadingTicket) {
      const result = {
        checking: false,
        valid: false
      }
      if (dataTicket) {
        result.valid = dataTicket.token_type === TOKEN_TYPE.ERC721;
      }
      setCheckParamType(result);
    }
  }, [loadingTicket, dataTicket]);

  return (
    <DefaultLayout>
      {
        checkParamType.checking ?
          <Backdrop open={checkParamType.checking} style={{ color: '#fff', zIndex: theme.zIndex.drawer + 1, }}>
            <CircularProgress color="inherit" />
          </Backdrop>
          : (checkParamType.valid ? <ContentTicket id={id} /> : <NotFoundPage />)
      }
    </DefaultLayout>
  );
};

const ContentTicket = ({ id, ...props }: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { connectedAccount /*isAuth, wrongChain*/ } = useAuth();
  const { isKYC, checkingKyc } = useKyc(connectedAccount);
  // console.log(isKYC, checkingKyc)
  const alert = useSelector((state: any) => state.alert);
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
    seconds: 0,
  });
  const [endTime, setTimeEnd] = useState<{ [k in string]: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [infoTicket, setInfoTicket] = useState<{ [k in string]: any }>({});
  const [renewTicket, setNewTicket] = useState<boolean>(true);
  const { data: dataTicket = null, loading: loadingTicket } = useFetchV1<any>(
    `/pool/${id}`,
    renewTicket
  );

  const [allowNetwork, setAllowNetwork] = useState<{ ok: boolean, [k: string]: any }>({ ok: false });
  useEffect(() => {
    const networkInfo = APP_NETWORKS_SUPPORT[Number(appChainID)];
    if (!networkInfo) {
      return;
    }
    setAllowNetwork(
      {
        ok: String(networkInfo.name).toLowerCase() ===
          (infoTicket.network_available || "").toLowerCase(),
        ...networkInfo,
      }
    );
  }, [infoTicket, appChainID]);
  const isClaim = dataTicket?.process === "only-claim";

  useEffect(() => {
    dispatch(setTypeIsPushNoti({ failed: false }));
  }, [dispatch]);

  const [isAccInWinners, setAccInWinners] = useState<{
    loading: boolean;
    ok?: boolean;
    error?: string;
    data?: { [k: string]: any };
  }>({
    loading: false,
    ok: false,
  });
  const maxCanBuyOrClaim = +isAccInWinners.data?.lottery_ticket || 0;
  useEffect(() => {
    if (connectedAccount) {
      setAccInWinners({ ok: false, loading: true, error: "" });
    }
  }, [connectedAccount]);
  useEffect(() => {
    if (isAccInWinners.loading) {
      let info: any = {};
      axios
        .get(
          `/pool/${id}/check-exist-winner?wallet_address=${connectedAccount}&campaignId=${id}`
        )
        .then((res) => {
          const result = res.data;
          if (result?.status === 200) {
            info.ok = true;
            info.data = result.data || {};
          } else {
            info.error = "You're not in winners";
          }
        })
        .catch((err) => {
          info.error = "You're not in winners";
        })
        .finally(() => {
          info.loading = false;
          setAccInWinners(info);
        });
    }
  }, [isAccInWinners, connectedAccount, id]);

  const [phase, setPhase] = useState<any>({});
  const [phaseName, setPhaseName] = useState('');
  useEffect(() => {
    if (!loadingTicket && dataTicket) {
      setNewTicket(false);
      setInfoTicket(dataTicket);
      if (isEndPool(dataTicket.campaign_status)) {
        setFinishedTime(true);
        return;
      }
      let openTime: number;
      let finishTime: number;
      if (isClaim) {
        const claimConfigs = dataTicket.campaignClaimConfig || [];
        const leng = claimConfigs.length;
        if (!leng) return;
        const timeStartPhase2 = dataTicket.freeBuyTimeSetting?.start_buy_time;
        if (leng === 1) {
          const openClaim = claimConfigs[0];
          openTime = +openClaim.start_time * 1000;
          const endTime = timeStartPhase2 ? +timeStartPhase2 * 1000 : (+openClaim.end_time * 1000 || openTime + 1000 * 60 * 60 * 24);
          finishTime = endTime;
          if (timeStartPhase2) {
            setPhaseName('Phase 1');
            setPhase({
              1: {
                openTime,
                finishTime,
              },
              2: {
                openTime: finishTime,
                finishTime: finishTime + 1000 * 60 * 60 * 24
              }
            })
          }
        } else {
          const openClaim = claimConfigs[0];
          let endClaim = claimConfigs.slice(-1)[0];
          if (!endClaim) return;
          openTime = +openClaim.start_time * 1000;
          const endTime = timeStartPhase2 ? +timeStartPhase2 * 1000 : (+endClaim.end_time * 1000 || +endClaim.start_time * 1000);
          finishTime = endTime;
          if (timeStartPhase2) {
            setPhaseName('Phase 1');
            setPhase({
              1: {
                openTime,
                finishTime: +timeStartPhase2 * 1000,
              },
              2: {
                openTime: +timeStartPhase2 * 1000,
                finishTime: endTime
              }
            })
          }
        }
      } else {
        let timeStartPhase2 = dataTicket.freeBuyTimeSetting?.start_buy_time;
        openTime = +dataTicket.start_time * 1000;
        if(timeStartPhase2) {
          timeStartPhase2 = +timeStartPhase2 * 1000;
          finishTime = timeStartPhase2;
          setPhaseName('Phase 1');
          setPhase({
            1: {
              openTime,
              finishTime: timeStartPhase2,
            },
            2: {
              openTime: timeStartPhase2,
              finishTime: +dataTicket.finish_time * 1000
            }
          })
        } else {
          finishTime = +dataTicket.finish_time * 1000;
        }
      }

      if (openTime > Date.now()) {
        setOpenTime(getDiffTime(openTime, Date.now()));
      }
      if (finishTime < Date.now() || finishTime <= openTime) {
        setFinishedTime(true);
        setIsBuy(false);
      } else {
        setIsBuy(true);
        setTimeEnd(
          getDiffTime(
            finishTime,
            Date.now() >= openTime ? Date.now() : openTime
          )
        );
      }
    }
  }, [dataTicket, loadingTicket, isClaim]);

  useEffect(() => {
    if (Object.keys(phase).length) {
      const interval = setInterval(() => {
        if (Date.now() > phase[2].finishTime) {
          clearInterval(interval);
          return;
        }
        if (Date.now() >= phase[2].openTime && Date.now() < phase[2].finishTime) {
          setTimeEnd(getDiffTime(phase[2].finishTime, Date.now()))
          setFinishedTime(false);
          setAccInWinners({ ok: false, loading: true, error: "" });
          setPhaseName('Phase 2');
          clearInterval(interval);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      }
    }
  }, [phase]);

  const [renewBalance, setNewBalance] = useState(true);
  const [ownedTicket, setOwnedTicket] = useState(0);
  const [openModal, setOpenModalTx] = useState(false);
  const onCloseModal = useCallback(() => {
    setOpenModalTx(false);
  }, [setOpenModalTx]);

  useEffect(() => {
    const setBalance = async () => {
      try {
        // const approved = await isApproved(connectedAccount, dataTicket.campaign_hash, library, dataTicket.network_available, dataTicket.accept_currency);
        // console.log('approved', approved);
        // setAccApprove(approved);
        const myNumTicket = await getBalance(
          connectedAccount,
          dataTicket.token,
          dataTicket.network_available,
          dataTicket.accept_currency
        );
        setOwnedTicket(+myNumTicket);
        setNewBalance(false);
      } catch (error) {
        console.log(error);
      }
    };
    !isClaim && (renewBalance || connectedAccount) && dataTicket && setBalance();
  }, [connectedAccount, dataTicket, renewBalance, isClaim]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newOpenTime = { ...openTime };
      if (
        newOpenTime.days === 0 &&
        newOpenTime.hours === 0 &&
        newOpenTime.minutes === 0 &&
        newOpenTime.seconds === 0
      ) {
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
    };
  }, [openTime, setOpenTime]);

  useEffect(() => {
    let interval: any;
    if (isBuy && endOpenTime) {
      interval = setInterval(() => {
        const newEndTime = { ...endTime };
        if (
          newEndTime.days === 0 &&
          newEndTime.hours === 0 &&
          newEndTime.minutes === 0 &&
          newEndTime.seconds === 0
        ) {
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
    };
  }, [isBuy, endTime, setTimeEnd, endOpenTime]);

  const ascAmount = () => {
    if (!isKYC) return;
    const ticketCanBuy = getMaxTicketBuy(
      ticketBought,
      maxCanBuyOrClaim
    );
    if (numTicketBuy >= ticketCanBuy) {
      return;
    }
    setNumTicketBuy((n) => n + 1);
  };
  const descAmount = () => {
    if (!isKYC) return;
    if (numTicketBuy > 0) {
      setNumTicketBuy((n) => n - 1);
    }
  };

  const ascMaxAmount = () => {
    if (!isKYC) return;
    const maxTicket = getMaxTicketBuy(ticketBought, maxCanBuyOrClaim);
    if (maxTicket === 0) return;
    setNumTicketBuy(maxTicket);
  };

  const descMinAmount = () => {
    if (!isKYC) return;
    const maxTicket = getMaxTicketBuy(ticketBought, maxCanBuyOrClaim);
    if (maxTicket === 0) return;
    setNumTicketBuy(1);
  };
  // const { data: depositTransaction, error: depositError1 } = useSelector((state: any) => state.deposit);
  // const { data: approveTransaction, error: approveError } = useSelector((state: any) => state.approve);

  // const {data: allowance = 0} = useSelector((state: any) => state.allowance);
  // console.log('depositError1', depositError1, 'depositTransaction', depositTransaction)
  // console.log('approveTransaction', approveTransaction)
  // console.log('allowance', allowance)

  const { claimToken, transactionHash, claimTokenSuccess, loading: loadingClaming, error: errorClaming } = useTokenClaim(
    infoTicket.campaign_hash,
    infoTicket?.id
  );

  const [lockWhenClaiming, setLockWhenClaiming] = useState(false);
  const [userClaimed, setUserClaimed] = useState(0);

  useEffect(() => {
    if (!loadingClaming) {
      setLockWhenClaiming(false);
    }
  }, [loadingClaming, errorClaming]);

  const {
    retrieveClaimableTokens
  } = useUserRemainTokensClaim(infoTicket.campaign_hash, true);
  const checkUserClaimed = useCallback(() => {
    if (!connectedAccount) {
      setUserClaimed(0);
      return;
    }
    retrieveClaimableTokens(connectedAccount, infoTicket.campaign_hash).then((res) => {
      setUserClaimed(+res?.userClaimed || 0);
    }).catch(() => setUserClaimed(0));
  }, [retrieveClaimableTokens, setUserClaimed, connectedAccount, infoTicket.campaign_hash]);

  useEffect(() => {
    if (isClaim) {
      checkUserClaimed();
    }
  }, [checkUserClaimed, isClaim, retrieveClaimableTokens, infoTicket.campaign_hash, connectedAccount]);

  const isNotClaim = (numTicketClaimed: number, available: number) => {
    return +available - +numTicketClaimed <= 0;
  }

  useEffect(() => {
    if (claimTokenSuccess) {
      setNewTicket(true);
      setAccInWinners((d) => ({
        error: "",
        loading: true,
        ok: false,
        data: d.data,
      }));
      checkUserClaimed();
    }
    if (transactionHash) {
      setOpenModalTx(true);
    }
  }, [claimTokenSuccess, transactionHash, checkUserClaimed]);

  const {
    deposit,
    tokenDepositTransaction,
    tokenDepositSuccess,
    /*tokenDepositLoading,
    
    depositError,
    */
  } = usePoolDepositAction({
    poolAddress: infoTicket.campaign_hash,
    poolId: infoTicket?.id,
    purchasableCurrency: String(infoTicket.accept_currency).toUpperCase(),
    amount: `0x${(
      numTicketBuy * (+infoTicket.ether_conversion_rate || 0)
    ).toString(16)}`,
    isClaimable: infoTicket.pool_type === "claimable",
    networkAvailable: infoTicket.network_available,
  });

  useEffect(() => {
    if (tokenDepositSuccess) {
      setNewTicket(true);
      setNewBalance(true);
    }
    if (tokenDepositTransaction) {
      setOpenModalTx(true);
      setNumTicketBuy(0);
    }
  }, [tokenDepositSuccess, tokenDepositTransaction]);

  const { retrieveTokenAllowance, tokenAllowanceLoading } = useTokenAllowance();

  const getApproveToken = useCallback(
    (appChainID: string) => {
      const purchasableCurrency = String(
        infoTicket.accept_currency
      ).toUpperCase();
      if (
        purchasableCurrency &&
        purchasableCurrency === PurchaseCurrency.USDT
      ) {
        return {
          address: getUSDTAddress(appChainID),
          name: "USDT",
          symbol: "USDT",
          decimals:
            appChainID === ETH_CHAIN_ID || appChainID === POLYGON_CHAIN_ID
              ? 6
              : 18,
        };
      }

      if (
        purchasableCurrency &&
        purchasableCurrency === PurchaseCurrency.BUSD
      ) {
        return {
          address: getBUSDAddress(appChainID),
          name: "BUSD",
          symbol: "BUSD",
          decimals: 18,
        };
      }

      if (
        purchasableCurrency &&
        purchasableCurrency === PurchaseCurrency.USDC
      ) {
        return {
          address: getUSDCAddress(appChainID),
          name: "USDC",
          symbol: "USDC",
          decimals:
            appChainID === ETH_CHAIN_ID || appChainID === POLYGON_CHAIN_ID
              ? 6
              : 18,
        };
      }

      if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.ETH) {
        return {
          address: "0x00",
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        };
      }
    },
    [infoTicket.accept_currency]
  );
  const tokenToApprove = getApproveToken(appChainID);

  const { approveToken /*tokenApproveLoading, transactionHash*/ } =
    useTokenApprove(
      tokenToApprove,
      connectedAccount,
      infoTicket.campaign_hash,
      false
    );
  const [tokenAllowance, setTokenAllowance] = useState<number | undefined>(
    undefined
  );

  const [isApproving, setIsApproving] = useState(false);
  const handleTokenApprove = async () => {
    try {
      // setApproveModal(true);
      if (isApproving) return;
      setIsApproving(true);
      await approveToken();
      if (infoTicket.campaign_hash && connectedAccount && tokenToApprove) {
        setTokenAllowance(
          (await retrieveTokenAllowance(
            tokenToApprove,
            connectedAccount,
            infoTicket.campaign_hash
          )) as number
        );
        setIsApproving(false);
        // setTokenBalance(await retrieveTokenBalance(tokenToApprove, connectedAccount) as number);
      }
    } catch (err) {
      dispatch(alertFailure('Hmm, Something went wrong. Please try again'));
      setIsApproving(false);
      // setApproveModal(false);
    }
  };

  const fetchPoolDetails = useCallback(async () => {
    if (infoTicket.campaign_hash && connectedAccount && tokenToApprove) {
      setTokenAllowance(
        (await retrieveTokenAllowance(
          tokenToApprove,
          connectedAccount,
          infoTicket.campaign_hash
        )) as number
      );
    }
  }, [
    connectedAccount,
    tokenToApprove,
    infoTicket.campaign_hash,
    retrieveTokenAllowance,
  ]);

  useEffect(() => {
    const fetchPoolDetailsBlockchain = async () => {
      await fetchPoolDetails();
    };
    !tokenAllowanceLoading && connectedAccount &&
      infoTicket.campaign_hash &&
      fetchPoolDetailsBlockchain();
  }, [connectedAccount, infoTicket.campaign_hash, fetchPoolDetails, tokenAllowanceLoading]);

  const {
    retrieveUserPurchased,
    // userPurchasedLoading
  } = useUserPurchased(infoTicket.campaign_hash, true);

  useEffect(() => {
    if ((renewBalance || connectedAccount) && infoTicket.campaign_hash) {
      if (connectedAccount)
        retrieveUserPurchased(connectedAccount, infoTicket.campaign_hash)
          .then((ticket) => {
            setTicketBought(+ticket || 0);
            setNewBalance(false);
          })
          .catch((err) => {
            console.log(err);
          });
    }
  }, [renewBalance, connectedAccount, infoTicket, retrieveUserPurchased]);

  const isAccApproved = (tokenAllowance: number) => {
    return +tokenAllowance > 0;
  };

  const onClaimTicket = async () => {
    if (!isKYC || isNotClaim(userClaimed, isAccInWinners.data?.lottery_ticket) || lockWhenClaiming) return;
    setLockWhenClaiming(true);
    await claimToken();
  };
  const onBuyTicket = async () => {
    if (!isKYC) return;
    try {
      if (numTicketBuy > 0) {
        await deposit();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calcProgress = (sold: number, total: number) => {
    return Math.ceil((sold * 100) / total) || 0;
  };

  const getMaxTicketBuy = (boughtTicket: number, maxTicket: number = 0) => {
    if (boughtTicket >= maxTicket) return 0;
    return maxTicket - boughtTicket;
  };

  const getRemaining = (totalTicket: number, totalSold: number) => {
    return +totalTicket - +totalSold || 0;
  };


  return (
    loadingTicket ? <div className={styles.loader} style={{ marginTop: 70 }}>
      <HashLoader loading={true} color={'#72F34B'} />
      <p className={styles.loaderText}>
        <span style={{ marginRight: 10 }}>Loading Pool Details ...</span>
      </p>
    </div> :
      <>
        <TicketModal
          open={openModal}
          onClose={onCloseModal}
          transaction={tokenDepositTransaction || transactionHash}
          networkName={infoTicket?.network_available}
        />
        <div className={styles.content}>
          {!isKYC && !checkingKyc && connectedAccount && (
            <AlertKYC connectedAccount={connectedAccount} />
          )}

          <div className={styles.card}>
            <div className={styles.cardImg}>
              <img
                src={infoTicket.banner}
                alt=""
                onError={(e: any) => {
                  // e.target.onerror = null;
                  e.target.src = ticketImg;
                }}
              />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardBodyText}>
                <h3 style={{ position: 'relative' }}>
                  {
                    allowNetwork.icon && <img src={allowNetwork.icon} alt="" style={{ position: 'absolute', top: '5px', left: 0, width: '24px', height: '24px' }} />
                  }
                  {infoTicket.title || infoTicket.name}
                </h3>
                {!endOpenTime && (
                  <h4>
                    <span>TOTAL SALE</span> {infoTicket.total_sold_coin ? numberWithCommas(infoTicket.total_sold_coin, 0) : 0}
                  </h4>
                )}
                <button className={clsx({ openBuy: isShowInfo })}>
                  <img
                    height={20}
                    src={
                      infoTicket && infoTicket.accept_currency
                        ? `/images/${infoTicket.accept_currency.toUpperCase()}.png`
                        : ""
                    }
                    alt=""
                  />
                  <span>
                    {isClaim ? 0 : infoTicket.ether_conversion_rate}{" "}
                    {infoTicket && infoTicket.accept_currency
                      ? infoTicket.accept_currency.toUpperCase()
                      : "..."}
                  </span>
                  <span className="small-text">
                    /{infoTicket.symbol || "Ticket"}
                  </span>
                </button>
              </div>
              <div className={styles.cardBodyDetail}>
                {!endOpenTime && (
                  <div className={styles.cardBodyClock}>
                    <h5>
                      Open in
                      <span className="open">
                        <img src={brightIcon} alt="" />
                      </span>
                    </h5>
                    <div className="times">
                      <span className="time">
                        <span className="number">
                          {formatNumber(openTime.days)}
                        </span>
                        <span className="text">
                          Day{openTime.days > 1 ? "s" : ""}
                        </span>
                      </span>
                      <span className="dot">:</span>
                      <span className="time">
                        <span className="number">
                          {formatNumber(openTime.hours)}
                        </span>
                        <span className="text">
                          Hour{openTime.hours > 1 ? "s" : ""}
                        </span>
                      </span>
                      <span className="dot">:</span>
                      <span className="time">
                        <span className="number">
                          {formatNumber(openTime.minutes)}
                        </span>
                        <span className="text">
                          Minute{openTime.minutes > 1 ? "s" : ""}
                        </span>
                      </span>
                      <span className="dot">:</span>
                      <span className="time">
                        <span className="number">
                          {formatNumber(openTime.seconds)}
                        </span>
                        <span className="text">
                          Second{openTime.seconds > 1 ? "s" : ""}
                        </span>
                      </span>
                    </div>
                  </div>
                )}

                {endOpenTime && !infoTicket.campaign_hash && (
                  <div className={styles.comingSoon}>Coming soon</div>
                )}
                {infoTicket.campaign_hash && isShowInfo && (
                  <div className={styles.cardBodyProgress}>
                    <div className={styles.progressItem}>
                      <span className={styles.text}>Progress</span>
                      <div className="showProgress">
                        <Progress
                          progress={calcProgress(
                            +infoTicket.token_sold,
                            +infoTicket.total_sold_coin
                          )}
                        />
                      </div>
                      <div className={clsx(styles.infoTicket, "total")}>
                        <span className={styles.textBold}>
                          {calcProgress(
                            +infoTicket.token_sold,
                            +infoTicket.total_sold_coin
                          )}
                          %
                        </span>

                        <span className="amount">
                          {infoTicket.token_sold ? numberWithCommas(infoTicket.token_sold, 0) : "..."}/
                          {infoTicket.total_sold_coin ? numberWithCommas(infoTicket.total_sold_coin, 0) : "..."} Tickets
                        </span>
                      </div>
                    </div>
                    {!finishedTime && (
                      <div className={styles.infoTicket}>
                        <span className={styles.text}>Remaining</span>{" "}
                        <span className={styles.textBold}>
                          {numberWithCommas(getRemaining(
                            infoTicket.total_sold_coin,
                            infoTicket.token_sold
                          ), 0)}
                        </span>
                      </div>
                    )}
                    {finishedTime && (
                      <div className={styles.infoTicket}>
                        <span className={styles.text}>TOTAL SALES</span>{" "}
                        <span className={styles.textBold}>
                          {infoTicket.total_sold_coin ? numberWithCommas(infoTicket.total_sold_coin, 0) : 0}
                        </span>
                      </div>
                    )}
                    <div className={styles.infoTicket}>
                      <span className={styles.text}>OWNED</span>{" "}
                      <span className={styles.textBold}>
                        {isClaim
                          ? userClaimed
                          : ownedTicket}
                      </span>
                    </div>
                    {!isClaim && (
                      <div className={styles.infoTicket}>
                        <span className={styles.text}>BOUGHT/MAX</span>{" "}
                        <span className={styles.textBold}>
                          {ticketBought}/{maxCanBuyOrClaim || 0}
                        </span>
                      </div>
                    )}
                    {!isClaim && finishedTime && (
                      <div className={styles.infoTicket}>
                        <span className={styles.text}>PARTICIPANTS</span>{" "}
                        <span className={styles.textBold}>
                          {infoTicket.participants ? numberWithCommas(infoTicket.participants, 0) : 0}
                        </span>
                      </div>
                    )}
                    {isClaim && (
                      <div className={styles.infoTicket}>
                        <span className={styles.text}>AVAILABLE TO CAILM</span>{" "}
                        <span className={styles.textBold}>
                          {maxCanBuyOrClaim - userClaimed || 0}
                        </span>
                      </div>
                    )}
                    {!finishedTime && isBuy && (
                      <div className={styles.infoTicket}>
                        <span className={styles.text}>{phaseName} END IN</span>
                        <span className={styles.timeEnd}>
                          {formatNumber(endTime.days)}d :{" "}
                          {formatNumber(endTime.hours)}h :{" "}
                          {formatNumber(endTime.minutes)}m :{" "}
                          {formatNumber(endTime.seconds)}s
                        </span>
                      </div>
                    )}
                    {!finishedTime &&
                      (isClaim ? (
                        isAccInWinners.ok && (
                          <button
                            className={clsx(styles.btnClaim, {
                              disabled:
                                !isKYC || isNotClaim(userClaimed, maxCanBuyOrClaim) || lockWhenClaiming,
                            })}
                            onClick={onClaimTicket}
                            disabled={
                              !isKYC || isNotClaim(userClaimed, maxCanBuyOrClaim) || lockWhenClaiming
                            }
                          >
                            Claim
                          </button>
                        )
                      ) : (
                        <>
                          {isAccInWinners.ok && allowNetwork.ok &&
                            isBuy &&
                            isAccApproved(tokenAllowance || 0) && (
                              <div
                                className={clsx(styles.infoTicket, styles.buyBox)}
                                style={{ marginTop: "16px" }}
                              >
                                <div className={styles.amountBuy}>
                                  <span>Amount</span>
                                  <div>
                                    <span
                                      onClick={descMinAmount}
                                      className={clsx(styles.btnMinMax, "min", {
                                        disabled:
                                          !getMaxTicketBuy(
                                            ticketBought,
                                            maxCanBuyOrClaim
                                          ) ||
                                          numTicketBuy === getMaxTicketBuy(
                                            ticketBought,
                                            maxCanBuyOrClaim
                                          ) ||
                                          !isKYC,
                                      })}
                                    >
                                      Min
                                    </span>
                                    <span
                                      onClick={descAmount}
                                      className={clsx({
                                        [styles.disabledAct]:
                                          !getMaxTicketBuy(
                                            ticketBought,
                                            maxCanBuyOrClaim
                                          ) ||
                                          numTicketBuy === 0 ||
                                          !isKYC,
                                      })}
                                    >
                                      <svg
                                        width="12"
                                        height="3"
                                        viewBox="0 0 12 3"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M11.1818 0H0.818182C0.366544 0 0 0.366544 0 0.818182V1.3636C0 1.81524 0.366544 2.18178 0.818182 2.18178H11.1818C11.6334 2.18178 12 1.81524 12 1.3636V0.818182C12 0.366544 11.6334 0 11.1818 0Z"
                                          fill="white"
                                        />
                                      </svg>
                                    </span>
                                    <span>
                                      {numTicketBuy}
                                      {/* {getMaxTicketBuy(ticketBought, +infoTicket.max_buy_ticket) ?
                            <FormInputNumber type="number" value={numTicketBuy} allowZero isInteger isPositive onChange={setNumTicketBuy} min={0} max={getMaxTicketBuy(ticketBought, +infoTicket.max_buy_ticket)} />
                            : numTicketBuy} */}
                                    </span>
                                    <span
                                      onClick={ascAmount}
                                      className={clsx({
                                        [styles.disabledAct]:
                                          !getMaxTicketBuy(
                                            ticketBought,
                                            maxCanBuyOrClaim
                                          ) ||
                                          numTicketBuy ===
                                          getMaxTicketBuy(
                                            ticketBought,
                                            maxCanBuyOrClaim
                                          ) ||
                                          !isKYC,
                                      })}
                                    >
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M11.343 5.06254H11.3437H6.93746V0.664585C6.93746 0.302634 6.64439 0 6.28244 0H5.71863C5.35678 0 5.06244 0.302634 5.06244 0.664585V5.06254H0.656293C0.294537 5.06254 0 5.35522 0 5.71727V6.28429C0 6.64605 0.294439 6.93746 0.656293 6.93746H5.06254V11.3513C5.06254 11.7131 5.35678 11.9999 5.71873 11.9999H6.28254C6.64449 11.9999 6.93756 11.713 6.93756 11.3513V6.93746H11.343C11.705 6.93746 12 6.64595 12 6.28429V5.71727C12 5.35522 11.705 5.06254 11.343 5.06254Z"
                                          fill="white"
                                        />
                                      </svg>
                                    </span>
                                    <span
                                      onClick={ascMaxAmount}
                                      className={clsx(styles.btnMinMax, "max", {
                                        disabled:
                                          !getMaxTicketBuy(
                                            ticketBought,
                                            maxCanBuyOrClaim
                                          ) ||
                                          numTicketBuy ===
                                          getMaxTicketBuy(
                                            ticketBought,
                                            maxCanBuyOrClaim
                                          ) ||
                                          !isKYC,
                                      })}
                                    >
                                      Max
                                    </span>
                                  </div>
                                </div>
                                <button
                                  className={clsx(styles.buynow, {
                                    [styles.buyDisabled]: numTicketBuy <= 0,
                                  })}
                                  onClick={onBuyTicket}
                                  disabled={numTicketBuy <= 0 || !isKYC}
                                >
                                  buy now
                                </button>
                              </div>
                            )}
                          {!isAccApproved(tokenAllowance || 0) && (
                            <button
                              className={styles.btnApprove}
                              onClick={handleTokenApprove}
                            >
                              {isApproving ? <div style={{ display: 'grid', gridTemplateColumns: '28px auto', gap: '5px', placeContent: 'center' }}>
                                <CircularProgress style={{ color: '#fff', width: '28px', height: '28px' }} />
                                Approving
                              </div> : 'Approve'}
                            </button>
                          )}
                        </>
                      ))}

                    {((alert?.type === "error" && alert.message) ||
                      (!isAccInWinners.loading &&
                        !isAccInWinners.ok &&
                        isAccInWinners.error)) && (
                        <div className={styles.alertMsg}>
                          <img src={iconWarning} alt="" />
                          <span>
                            {!isAccInWinners.ok
                              ? isAccInWinners.error
                              : alert.message}
                          </span>
                        </div>
                      )}

                    {finishedTime && (
                      <div className={clsx(styles.infoTicket, styles.finished)}>
                        <div className="img-finished">
                          <img src={finishedImg} alt="" />
                        </div>
                        {!getRemaining(
                          infoTicket.total_sold_coin,
                          infoTicket.token_sold
                        ) && (
                            <div className="soldout">
                              <img src={soldoutImg} alt="" />
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.displayContent}>
            <AboutTicket info={infoTicket} />
          </div>
        </div>
      </>
  );
}
export default withRouter(Ticket);
