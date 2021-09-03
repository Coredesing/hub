import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import useStyles from "./style";
import AboutTicket from "./About";
import { getApproveToken, getDiffTime } from "../../utils";
import { Progress } from "./Progress";
import { useFetchV1 } from "../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import {
    APP_NETWORKS_SUPPORT,
} from "../../constants/network";
import useKyc from "../../hooks/useKyc";
import useAuth from "../../hooks/useAuth";
import { AlertKYC } from "../../components/Base/AlertKYC";
import { calcProgress, getBalance, getRemaining, isEndPool } from "./utils";
import usePoolDepositAction from "./hooks/usePoolDepositAction";
import { caclDiffTime } from "./getDiffTime";
import useTokenAllowance from "../../hooks/useTokenAllowance";
import useTokenApprove from "../../hooks/useTokenApprove";
import useUserPurchased from "./hooks/useUserPurchased";
import TicketModal from "./TicketModal";
import useTokenClaim from "./hooks/useTokenClaim";
import axios from "../../services/axios";
import useUserRemainTokensClaim from "./hooks/useUserRemainTokensClaim";
import { alertFailure, setTypeIsPushNoti } from "../../store/actions/alert";
import { HashLoader } from "react-spinners";
import { numberWithCommas } from "../../utils/formatNumber";
import { WrapperAlert } from "../../components/Base/WrapperAlert";
import { pushMessage } from "../../store/actions/message";
import { CountDownTimeType } from "./types";
import { CountDownOpenInTime } from "./components/CountDownOpenInTime";
import { CountDownEndTime } from "./components/CountDownEndTime";
import { AscDescAmountBox } from "./components/AscDescAmountBox";
import { ButtonApprove } from "./components/ButtonApprove";
import { ButtonBuy } from "./components/ButtonBuy";
import { ButtonClaim } from "./components/ButtonClaim";
import Image from "../../components/Base/Image";
import { Recapcha } from "../../components/Base/Recapcha";
const iconWarning = "/images/warning-red.svg";
const ticketImg = "/images/gamefi-ticket.png";
const finishedImg = "/images/finished.png";
const soldoutImg = "/images/soldout.png";

const Ticket = ({ id, ...props }: any) => {
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
    const [openTime, setOpenTime] = useState<CountDownTimeType>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [endTime, setTimeEnd] = useState<CountDownTimeType>({
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
        if (!networkInfo || !infoTicket?.network_available) {
            return;
        }
        const ok = String(networkInfo.name).toLowerCase() === (infoTicket.network_available || "").toLowerCase();
        if (!ok) {
            dispatch(pushMessage(`Please switch to ${(infoTicket.network_available || '').toLocaleUpperCase()} network to do Apply Whitelist, Approve/Buy tokens.`))
        } else {
            dispatch(pushMessage(''));
        }
        setAllowNetwork(
            {
                ok,
                ...networkInfo,
            }
        );
    }, [infoTicket, appChainID, dispatch]);
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
        setAccInWinners({ ok: false, loading: !!connectedAccount, error: "" });
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
                if (timeStartPhase2) {
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

    const tokenToApprove = getApproveToken(appChainID, infoTicket.accept_currency);

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
        if (!verifiedCapcha) {
            return dispatch(alertFailure('Recaptcha requires verification.'));
        }
        try {
            if (numTicketBuy > 0) {
                await deposit();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getMaxTicketBuy = (boughtTicket: number, maxTicket: number = 0) => {
        if (boughtTicket >= maxTicket) return 0;
        return maxTicket - boughtTicket;
    };

    const [verifiedCapcha, setVerifiedCapcha] = useState<string | null>('');
    const onVerifyCapcha = (token: string | null) => {
        setVerifiedCapcha(token)
    }

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

                    {
                        !connectedAccount && <WrapperAlert>
                            Please connect to wallet
                        </WrapperAlert>
                    }
                    {
                        (!isAccInWinners.loading && connectedAccount) && (isAccInWinners.ok
                            ? <WrapperAlert type="info">
                                The whitelist winners are out! Congratulations on your&nbsp;
                                <span style={{ color: '#ff673e' }}>{numberWithCommas(`${maxCanBuyOrClaim}`)} </span>
                                allocation for {infoTicket?.title}. {' '}
                                You can view more the list of winners at winners tab.
                            </WrapperAlert>
                            : <WrapperAlert type="error"> Sorry, you have not been chosen as whitelist winner. </WrapperAlert>)
                    }
                    {!isKYC && !checkingKyc && connectedAccount && (
                        <AlertKYC connectedAccount={connectedAccount} />
                    )}

                    <div className={styles.card}>
                        <div className={styles.cardImg}>
                            <Image src={infoTicket.banner} defaultSrc={ticketImg} />
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.cardBodyText}>
                                <h3 style={{ position: 'relative' }}>
                                    {
                                        <img src={`/images/${infoTicket.network_available}.svg`} alt="" style={{ position: 'absolute', top: '5px', left: 0, width: '24px', height: '24px' }} />
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
                                <div className={styles.infoTicket} style={{ width: '100%', marginTop: '20px', alignItems: 'center' }}>
                                    <span className={styles.text}>SUPPORTED</span> <span className={styles.textBold} style={{ textTransform: 'uppercase' }}>
                                        {infoTicket.network_available}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.cardBodyDetail}>

                                {!endOpenTime && (
                                    <CountDownOpenInTime time={openTime} />
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
                                                <CountDownEndTime time={endTime} />
                                            </div>
                                        )}
                                        {!finishedTime &&
                                            (isClaim ? (
                                                isAccInWinners.ok && (
                                                    <ButtonClaim onClick={onClaimTicket} disabled={!isKYC || isNotClaim(userClaimed, maxCanBuyOrClaim) || lockWhenClaiming} />
                                                )
                                            ) : (
                                                <>
                                                    {isAccInWinners.ok && allowNetwork.ok &&
                                                        isBuy &&
                                                        isAccApproved(tokenAllowance || 0) && (
                                                            <>
                                                                <Recapcha onChange={onVerifyCapcha} />
                                                                <div
                                                                    className={clsx(styles.infoTicket, styles.buyBox)}
                                                                    style={{ marginTop: "16px" }}
                                                                >
                                                                    <AscDescAmountBox
                                                                        descMinAmount={descMinAmount}
                                                                        descAmount={descAmount}
                                                                        ascAmount={ascAmount}
                                                                        ascMaxAmount={ascMaxAmount}
                                                                        value={numTicketBuy}
                                                                        disabledMin={!getMaxTicketBuy(ticketBought, maxCanBuyOrClaim) || numTicketBuy === getMaxTicketBuy(ticketBought, maxCanBuyOrClaim) || !isKYC}
                                                                        disabledSub={!getMaxTicketBuy(ticketBought, maxCanBuyOrClaim) || numTicketBuy === 0 || !isKYC}
                                                                        disabledAdd={!getMaxTicketBuy(ticketBought, maxCanBuyOrClaim) || numTicketBuy === getMaxTicketBuy(ticketBought, maxCanBuyOrClaim) || !isKYC}
                                                                        disabledMax={!getMaxTicketBuy(ticketBought, maxCanBuyOrClaim) || numTicketBuy === getMaxTicketBuy(ticketBought, maxCanBuyOrClaim) || !isKYC}
                                                                    />
                                                                    <ButtonBuy onClick={onBuyTicket} disabled={numTicketBuy <= 0 || !isKYC || !verifiedCapcha} />
                                                                </div>
                                                            </>
                                                        )}
                                                    {isAccInWinners.ok && !isAccApproved(tokenAllowance || 0) && (
                                                        <ButtonApprove isApproving={isApproving} onClick={handleTokenApprove} />
                                                    )}
                                                </>
                                            ))}

                                        {(alert?.type === "error" && alert.message) && (
                                            <div className={styles.alertMsg}>
                                                <img src={iconWarning} alt="" />
                                                <span>
                                                    {alert.message}
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
export default Ticket;
