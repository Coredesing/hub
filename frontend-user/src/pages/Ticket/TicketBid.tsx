import React, { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import useStyles from "./style";
import AboutTicket from "./About";
import { getApproveToken, getDiffTime } from "../../utils";
import { useFetchV1 } from "../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import {
    APP_NETWORKS_SUPPORT,
} from "../../constants/network";
import useKyc from "../../hooks/useKyc";
import useAuth from "../../hooks/useAuth";
import { AlertKYC } from "../../components/Base/AlertKYC";
import { getUserStaked, isEndPool } from "./utils";
import { caclDiffTime } from "./getDiffTime";
import useTokenAllowance from "../../hooks/useTokenAllowance";
import useTokenApprove from "../../hooks/useTokenApprove";
import TicketBidModal from "./TicketBidModal";
import TicketModalTx from "./TicketModal";
import { alertFailure, setTypeIsPushNoti } from "../../store/actions/alert";
import { HashLoader } from "react-spinners";
import { numberWithCommas } from "../../utils/formatNumber";
import { WrapperAlert } from "../../components/Base/WrapperAlert";
import { pushMessage } from "../../store/actions/message";
import { CountDownOpenInTime } from "./components/CountDownOpenInTime";
import { CountDownTimeType, ResultStaked } from "./types";
import { CountDownEndTime } from "./components/CountDownEndTime";
import { ButtonYellow } from './components/ButtonYellow'
import Image from "../../components/Base/Image";
import AlertMsg from "./components/AlertMsg";
import { ButtonApprove } from "./components/ButtonApprove";
import { isNumber } from 'lodash';
import useTicketBid from "./hooks/useTicketBid";
const ticketImg = "/images/gamefi-ticket.png";
const finishedImg = "/images/finished.png";
const soldoutImg = "/images/soldout.png";

const ContentNFTBox = ({ id, ...props }: any) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { connectedAccount /*isAuth, wrongChain*/ } = useAuth();
    const { isKYC, checkingKyc } = useKyc(connectedAccount);
    const alert = useSelector((state: any) => state.alert);
    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const [isShowInfo, setIsShowInfo] = useState<boolean>(false);
    const [canBuy, setCanBid] = useState<boolean>(false);
    const [rankUser, setRankUser] = useState<number>(-1);
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

    useEffect(() => {
        dispatch(setTypeIsPushNoti({ failed: false }));
    }, [dispatch]);

    const [phase, setPhase] = useState<any>({});
    const [phaseName, setPhaseName] = useState('');
    useEffect(() => {
        if (!loadingTicket && dataTicket) {
            console.log(dataTicket)
            setNewTicket(false);
            setInfoTicket(dataTicket);
            if (isEndPool(dataTicket.campaign_status)) {
                setFinishedTime(true);
                return;
            }
            let openTime: number;
            let finishTime: number;
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

            if (openTime > Date.now()) {
                setOpenTime(getDiffTime(openTime, Date.now()));
            }
            if (finishTime < Date.now() || finishTime <= openTime) {
                setFinishedTime(true);
                setCanBid(false);
            } else {
                setCanBid(true);
                setTimeEnd(
                    getDiffTime(
                        finishTime,
                        Date.now() >= openTime ? Date.now() : openTime
                    )
                );
            }
        }
    }, [dataTicket, loadingTicket]);

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
                    setPhaseName('Phase 2');
                    clearInterval(interval);
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            }
        }
    }, [phase]);

    const [refreshNumStaked, setRefreshNumStaked] = useState(true);
    const [ownedBidStaked, setOwnedBidStaked] = useState<ResultStaked>({ staked: 0, lastTime: 0 });
    const [openModal, setOpenModalTx] = useState(false);
    const onCloseModal = useCallback(() => {
        setOpenModalTx(false);
    }, [setOpenModalTx]);

    useEffect(() => {
        const _getUserStaked = async () => {
            try {
                const numStaked = await getUserStaked(
                    connectedAccount,
                    dataTicket.campaign_hash,
                    dataTicket.network_available,
                    dataTicket.accept_currency
                );
                setOwnedBidStaked(numStaked);
                setRefreshNumStaked(false);
            } catch (error) {
                console.log(error);
            }
        };
        (refreshNumStaked || connectedAccount) && dataTicket && _getUserStaked();
    }, [connectedAccount, dataTicket, refreshNumStaked]);

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
                setCanBid(true);
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
        if (canBuy && endOpenTime) {
            interval = setInterval(() => {
                const newEndTime = { ...endTime };
                if (
                    newEndTime.days === 0 &&
                    newEndTime.hours === 0 &&
                    newEndTime.minutes === 0 &&
                    newEndTime.seconds === 0
                ) {
                    clearInterval(interval);
                    setCanBid(false);
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
    }, [canBuy, endTime, setTimeEnd, endOpenTime]);
    
    const tokenToApprove = useMemo(() => getApproveToken(appChainID, infoTicket.accept_currency), [appChainID, infoTicket.accept_currency]);
    const { resultBid, stake, claim } = useTicketBid({
        poolAddress: infoTicket.campaign_hash,
        token: tokenToApprove,
    });

    useEffect(() => {
        console.log('resultBid', resultBid)
    }, [resultBid])

    const [lockWhenClaiming, setLockWhenClaiming] = useState(false);
    const onClaim = async () => {
        if (!isKYC ||  lockWhenClaiming) return;
        setLockWhenClaiming(true);
        await claim();
    };

    useEffect(() => {
        if (!resultBid.loading) {
            setLockWhenClaiming(false);
        }
    }, [resultBid]);

    const [openModalBid, setOpenModalBid] = useState(false);
    const onShowModalBid = () => {
        setOpenModalBid(true);
    };
    const onCloseModalBid = useCallback(() => {
        setOpenModalBid(false)
    }, [setOpenModalBid]);


    const onPlaceBid = useCallback((value: number) => {
        return stake(value)
    }, [stake]);

    useEffect(() => {
        if (resultBid.success) {
            setRefreshNumStaked(true);
        }
        if (resultBid.transaction) {
            setOpenModalTx(true);
        }
    }, [resultBid]);

    const [tokenAllowance, setTokenAllowance] = useState<number | undefined>();
    const isAccApproved = (tokenAllowance: number) => {
        return +tokenAllowance > 0;
    };
    const { retrieveTokenAllowance } = useTokenAllowance();

    const { approveToken /*tokenApproveLoading, transactionHash*/ } =
        useTokenApprove(
            tokenToApprove,
            connectedAccount,
            infoTicket.campaign_hash,
            false
        );

    const [isApproving, setIsApproving] = useState(false);
    const handleTokenApprove = async () => {
        try {
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
            }
        } catch (err) {
            dispatch(alertFailure('Hmm, Something went wrong. Please try again'));
            setIsApproving(false);
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
        connectedAccount &&
            infoTicket.campaign_hash &&
            fetchPoolDetailsBlockchain();
    }, [connectedAccount, infoTicket.campaign_hash, fetchPoolDetails]);
    return (
        loadingTicket ? <div className={styles.loader} style={{ marginTop: 70 }}>
            <HashLoader loading={true} color={'#72F34B'} />
            <p className={styles.loaderText}>
                <span style={{ marginRight: 10 }}>Loading Pool Details ...</span>
            </p>
        </div> :
            <>
                <TicketModalTx
                    open={openModal}
                    onClose={onCloseModal}
                    transaction={resultBid.transaction}
                    networkName={infoTicket?.network_available}
                />
                <TicketBidModal
                    open={openModalBid}
                    onClose={onCloseModalBid}
                    onClick={onPlaceBid}
                    bidInfo={infoTicket}
                    ownedBidStaked={ownedBidStaked}
                    token={tokenToApprove}
                />
                <div className={styles.content}>
                    {
                        !connectedAccount && <WrapperAlert>
                            Please connect to wallet
                        </WrapperAlert>
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
                                <h3>
                                    {
                                        <img src={`/images/${infoTicket.network_available}.svg`} alt="" />
                                    }
                                    {infoTicket.title || infoTicket.name}
                                </h3>
                                {!endOpenTime && (
                                    <h4>
                                        <span>TOTAL SALE</span> {infoTicket.total_sold_coin ? numberWithCommas(infoTicket.total_sold_coin, 0) : 0}
                                    </h4>
                                )}
                                <div className={clsx(styles.priceBidBox)}>
                                    <span className={clsx(styles.text)}>
                                        {!endOpenTime ? 'OPENING PRICE' : 'YOUR BID'}
                                    </span>
                                    <div>
                                        <img
                                            height={20}
                                            src={
                                                infoTicket && infoTicket.accept_currency
                                                    ? `/images/icons/${infoTicket.accept_currency.toLowerCase()}.png`
                                                    : ""
                                            }
                                            alt=""
                                        />
                                        <span className={clsx(styles.textBold, 'text-uppercase')}>
                                            0 {infoTicket.accept_currency}
                                        </span>
                                    </div>
                                </div>
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
                                        <div className={styles.infoTicket}>
                                            <span className={styles.text}>YOUR RANK</span>{" "}
                                            <span className={styles.textBold}>
                                                {rankUser < 0 ? '-' : rankUser}
                                            </span>
                                        </div>
                                        {!finishedTime && canBuy && (
                                            <div className={styles.infoTicket}>
                                                <span className={styles.text}>{phaseName} END IN</span>
                                                <CountDownEndTime time={endTime} />
                                            </div>
                                        )}
                                        {isNumber(tokenAllowance) && !isAccApproved(tokenAllowance || 0) && (
                                            <ButtonApprove isApproving={isApproving} onClick={handleTokenApprove} />
                                        )}
                                        {
                                            !finishedTime && allowNetwork.ok && <ButtonYellow onClick={onShowModalBid} style={{ textTransform: 'unset', width: '100%' }}>Place a Bid</ButtonYellow>
                                        }
                                        {
                                            finishedTime && <ButtonYellow onClick={onClaim} style={{ textTransform: 'unset', width: '100%' }}>Claim</ButtonYellow>
                                        }

                                        {(alert?.type === "error" && alert.message) && (
                                            <AlertMsg message={alert.message} />
                                        )}

                                        {/* {finishedTime && (
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
                                        )} */}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.displayContent}>
                        <AboutTicket info={infoTicket} connectedAccount={connectedAccount} setRankUser={setRankUser} />
                    </div>
                </div>
            </>
    );
}
export default ContentNFTBox;
