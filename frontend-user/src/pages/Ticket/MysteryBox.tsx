import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import useStyles, { useMysteyBoxStyles } from "./style";
import { AboutMysteryBox } from "./About";
import { apiRoute, getApproveToken, getDiffTime, isImageFile, isVideoFile } from "../../utils";
import { Progress } from "@base-components/Progress";
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
import { alertFailure, alertSuccess, setTypeIsPushNoti } from "../../store/actions/alert";
import { HashLoader } from "react-spinners";
import { numberWithCommas } from "../../utils/formatNumber";
import { WrapperAlert } from "../../components/Base/WrapperAlert";
import { pushMessage } from "../../store/actions/message";
import { CountDownTimeType, TimelineType } from "./types";
import { CountDownEndTime } from "./components/CountDownEndTime";
import { AscDescAmountBox } from "./components/AscDescAmountBox";
import { ButtonBuy } from "./components/ButtonBuy";
import { ButtonApprove } from "./components/ButtonApprove";
import { ButtonClaim } from "./components/ButtonClaim";
import Image from "../../components/Base/Image";
import usePoolJoinAction from './hooks/usePoolJoinAction';
import { ButtonGreen } from "@base-components/Buttons";
import CountDownTimeV1, { CountDownTimeType as CountDownTimeTypeV1 } from "@base-components/CountDownTime";
import { BaseRequest } from "../../request/Request";
import ModalOrderBox from './components/ModalOrderBox';
import useOrderBox from "./hooks/useOrderBox";
import { convertTimeToStringFormat } from "@utils/convertDate";
import ModalConfirmBuyBox from "./components/ModalConfirmBuyBox";
const iconWarning = "/images/warning-red.svg";
const ticketImg = "/images/gamefi-ticket.png"
const finishedImg = "/images/finished.png";
const soldoutImg = "/images/soldout.png";

const MysteryBox = ({ id, ...props }: any) => {
    const styles = useStyles();
    const mysteryStyles = useMysteyBoxStyles();
    const dispatch = useDispatch();
    const { connectedAccount /*isAuth, wrongChain*/ } = useAuth();
    const { isKYC, checkingKyc } = useKyc(connectedAccount);
    const alert = useSelector((state: any) => state.alert);
    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const [boxBought, setBoxBought] = useState<number>(0);
    const [numBoxBuy, setNumBoxBuy] = useState<number>(0);
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

    // useEffect(() => {
    //     dispatch(setTypeIsPushNoti({ failed: false }));
    // }, [dispatch]);

    const [maxBoxCanBuy, setMaxBoxCanBuy] = useState(0);
    const [boxTypeSelected, onSelectBoxType] = useState<{ [k: string]: any }>({});

    useEffect(() => {
        if (!loadingTicket && dataTicket) {
            setNewTicket(false);
            setInfoTicket(dataTicket);
            const firstBoxType = dataTicket.boxTypesConfig?.[0];
            if (firstBoxType) onSelectBoxType(firstBoxType)
        }
    }, [dataTicket, loadingTicket, isClaim]);

    const [countdown, setCountdown] = useState<CountDownTimeTypeV1 & { title: string, [k: string]: any }>({ date1: 0, date2: 0, title: '' });
    const [timelines, setTimelines] = useState<TimelineType | {}>({});

    const getTimelineOfPool = (pool: { [k: string]: any }) => {
        const startJoinPooltime = +pool.start_join_pool_time * 1000;
        const endJoinPoolTime = +dataTicket.end_join_pool_time * 1000;
        const startBuyTime = +dataTicket.start_time * 1000;
        const freeBuyTime = +dataTicket.freeBuyTimeSetting?.start_buy_time * 1000 || null;
        const finishTime = +dataTicket.finish_time * 1000;
        return { startJoinPooltime, endJoinPoolTime, startBuyTime, freeBuyTime, finishTime }
    }

    const onSetCountdown = useCallback(() => {
        if (dataTicket) {
            const timeLine = getTimelineOfPool(dataTicket);

            const timeLinesInfo: { [k: string]: any } = {
                1: {
                    title: 'UPCOMMING',
                    desc: `Whitelist will be opened on ${convertTimeToStringFormat(new Date(timeLine.startJoinPooltime))}.`
                },
                2: {
                    title: 'WHITELIST',
                    desc: 'Click the [APPLY WHITELIST] button to register for Phase 1.'
                }
            };
            if (timeLine.freeBuyTime) {
                timeLinesInfo[3] = {
                    title: 'BUY PHASE 1',
                    desc: 'Whitelist registrants will be given favorable dealings to buy Mecha Boxes in the first 1 hours after the opening, on a FCFS basis.'
                };
                timeLinesInfo[4] = {
                    title: 'BUY PHASE 2',
                    desc: 'The whitelist of phase 2 will be started right after phase 1 ends. Remaining boxes left in phase 1 will be transferred to phase 2.'
                };
                timeLinesInfo[5] = {
                    title: 'END',
                    desc: 'Thank you for watching.'
                }
            } else {
                timeLinesInfo[3] = {
                    title: 'BUY PHASE 1',
                    desc: 'Whitelist registrants will be given favorable dealings to buy Mecha Boxes in the first 1 hours after the opening, on a FCFS basis.'
                };
                timeLinesInfo[4] = {
                    title: 'END',
                    desc: 'Thank you for watching.'
                }
            }


            if (timeLine.startJoinPooltime > Date.now()) {
                setCountdown({ date1: timeLine.startJoinPooltime, date2: Date.now(), title: 'Whitelist Start in' });
                timeLinesInfo[1].current = true;
            }
            else if (timeLine.endJoinPoolTime > Date.now()) {
                setCountdown({ date1: timeLine.endJoinPoolTime, date2: Date.now(), title: 'Whitelist End In', isWhitelist: true });
                timeLinesInfo[2].current = true;
            }
            else if (timeLine.startBuyTime > Date.now()) {
                timeLinesInfo[2].current = true;
                if (timeLine.freeBuyTime) {
                    setCountdown({ date1: timeLine.startBuyTime, date2: Date.now(), title: 'Phase 1 Start Buy in' });
                } else {
                    setCountdown({ date1: timeLine.startBuyTime, date2: Date.now(), title: 'Start Buy in' });
                }
            }
            else if (timeLine.freeBuyTime && timeLine.freeBuyTime > Date.now()) {
                timeLinesInfo[3].current = true;
                setCountdown({ date1: timeLine.freeBuyTime, date2: Date.now(), title: 'Phase 1 Buy end in', isBuy: true });
            }
            else if (timeLine.finishTime > Date.now()) {
                if (timeLine.freeBuyTime) {
                    timeLinesInfo[4].current = true;
                    setCountdown({ date1: timeLine.finishTime, date2: Date.now(), title: 'Phase 2 End Buy in', isBuy: true });
                } else {
                    timeLinesInfo[3].current = true;
                    setCountdown({ date1: timeLine.finishTime, date2: Date.now(), title: 'End Buy in', isBuy: true });
                }
            }
            else {
                setCountdown({ date1: 0, date2: 0, title: 'Finished', isFinished: true });
                timeLine.freeBuyTime ? (timeLinesInfo[5].current = true) : (timeLinesInfo[4].current = true);
            }
            setTimelines(timeLinesInfo);
        }
    }, [dataTicket]);

    useEffect(() => {
        if (!loadingTicket && dataTicket) {
            onSetCountdown();
        }
    }, [dataTicket, loadingTicket])

    const [renewBalance, setNewBalance] = useState(true);
    const [ownedTicket, setOwnedTicket] = useState(0);
    const [openModal, setOpenModalTx] = useState(false);
    const onCloseModal = useCallback(() => {
        setOpenModalTx(false);
    }, [setOpenModalTx]);

    useEffect(() => {
        const setBalance = async () => {
            try {
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

    const ascAmount = () => {
        if (!isKYC) return;
        const ticketCanBuy = getMaxTicketBuy(
            boxBought,
            maxBoxCanBuy
        );
        if (numBoxBuy >= ticketCanBuy) {
            return;
        }
        setNumBoxBuy((n) => n + 1);
    };
    const descAmount = () => {
        if (!isKYC) return;
        if (numBoxBuy > 0) {
            setNumBoxBuy((n) => n - 1);
        }
    };

    const ascMaxAmount = () => {
        if (!isKYC) return;
        const maxTicket = getMaxTicketBuy(boxBought, maxBoxCanBuy);
        if (maxTicket === 0) return;
        setNumBoxBuy(maxTicket);
    };

    const descMinAmount = () => {
        if (!isKYC) return;
        const maxTicket = getMaxTicketBuy(boxBought, maxBoxCanBuy);
        if (maxTicket === 0) return;
        setNumBoxBuy(1);
    };

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
    } = usePoolDepositAction({
        poolAddress: infoTicket.campaign_hash,
        poolId: infoTicket?.id,
        purchasableCurrency: String(infoTicket.accept_currency).toUpperCase(),
        amount: `0x${(
            numBoxBuy * (+infoTicket.ether_conversion_rate || 0)
        ).toString(16)}`,
        isClaimable: infoTicket.pool_type === "claimable",
        networkAvailable: infoTicket.network_available,
        captchaToken: '', // TODO: use recaptcha here
    });

    useEffect(() => {
        if (tokenDepositSuccess) {
            setNewTicket(true);
            setNewBalance(true);
        }
        if (tokenDepositTransaction) {
            setOpenModalTx(true);
            setNumBoxBuy(0);
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
                        setBoxBought(+ticket || 0);
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

    const getMaxTicketBuy = (boughtTicket: number, maxTicket: number = 0) => {
        if (boughtTicket >= maxTicket) return 0;
        return maxTicket - boughtTicket;
    };

    const [isApplyingWhitelist, setApplyingWhitelist] = useState(false);
    const onApplyWhitelist = async () => {
        setApplyingWhitelist(true);
        const baseRequest = new BaseRequest()
        const response = await baseRequest.post(`/pool/${infoTicket.id}/whitelist-apply-box`, {
            wallet_address: connectedAccount,
        }) as any
        const resObj = await response.json()
        setApplyingWhitelist(false)

        if (resObj?.status === 200) {
            joinPool()
        } else {
            dispatch(alertFailure(resObj.message))
            setApplyingWhitelist(false);
        }
    }
    const [recallBoughtBox, setRecallBoughtBox] = useState(true);
    const { data: boughtBoxes = {} as any } = useFetchV1<boolean>(`/pool/${infoTicket?.id}/nft-order?wallet_address=${connectedAccount}`, !!(connectedAccount && 'id' in infoTicket) && recallBoughtBox);
    useEffect(() => {
        if (boughtBoxes && 'amount' in boughtBoxes) {
            setMaxBoxCanBuy(boughtBoxes.amount);
            setRecallBoughtBox(false);
        }
    }, [boughtBoxes]);

    const { data: alreadyJoinPool, loading: loadingJoinpool } = useFetchV1<boolean>(`/user/check-join-campaign/${infoTicket?.id}?wallet_address=${connectedAccount}`, !!(connectedAccount && 'id' in infoTicket));
    const { joinPool, poolJoinLoading, joinPoolSuccess } = usePoolJoinAction({ poolId: infoTicket?.id });
    useEffect(() => {
        if (joinPoolSuccess) {
            setApplyingWhitelist(false);
        }
    }, [joinPoolSuccess])
    const [openModalOrderBox, setOpenModalOrderBox] = useState(false);
    const onShowModalOrderBox = () => {
        setOpenModalOrderBox(true);
    }
    const onCloseModalOrderBox = useCallback(() => {
        setOpenModalOrderBox(false);
    }, []);

    const [openModalConfirmBuyBox, setOpenModalConfirmBuyBox] = useState(false);
    const onShowModalConfirmBuyBox = () => {
        setOpenModalConfirmBuyBox(true);
    }
    const onCloseModalConfirmBuyBox = useCallback(() => {
        setOpenModalConfirmBuyBox(false);
    }, []);

    const { orderBox, buyBoxLoading, statusBuyBox } = useOrderBox({ poolId: infoTicket.id, });
    useEffect(() => {
        if (statusBuyBox) {
            setOpenModalOrderBox(false);
            setRecallBoughtBox(true);
        }
    }, [statusBuyBox]);

    const onOrderBox = useCallback(async (numberBox: number) => {
        orderBox(numberBox)
    }, [infoTicket, connectedAccount]);

    const onBuyBox = useCallback((capcha: string) => {
        console.log('capcha', capcha);
        dispatch(alertSuccess("Buy successfully!"));
        onCloseModalConfirmBuyBox();
    }, []);

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
                <ModalOrderBox open={openModalOrderBox} onClose={onCloseModalOrderBox} onConfirm={onOrderBox} isLoadingButton={buyBoxLoading} />
                <ModalConfirmBuyBox open={openModalConfirmBuyBox} onClose={onCloseModalConfirmBuyBox} onConfirm={onBuyBox} infoBox={infoTicket} isLoadingButton={buyBoxLoading} amount={numBoxBuy} />
                <div className={styles.content}>

                    {
                        !connectedAccount && <WrapperAlert>
                            Please connect to wallet
                        </WrapperAlert>
                    }
                    {
                        (!loadingJoinpool && connectedAccount) && (alreadyJoinPool
                            ? null
                            : <WrapperAlert type="error"> Sorry, you have not been chosen as whitelist winner. </WrapperAlert>)
                    }
                    {!isKYC && !checkingKyc && connectedAccount && (
                        <AlertKYC connectedAccount={connectedAccount} />
                    )}
                    {/* <div className={styles.bannerBox}>
                        <Image src="/images/nftbox-banner.png" />
                    </div> */}

                    <div className={styles.contentCard}>
                        <div className={styles.wrapperCard}>
                            <div className={mysteryStyles.headerBox}>
                                <div className="items">
                                    <div className="item">
                                        <label className="label">Registered Users</label>
                                        <h4 className="value">{numberWithCommas(infoTicket.totalRegistered || 0)}</h4>
                                    </div>
                                    <div className="item">
                                        <label className="label">Ordered Boxes</label>
                                        <h4 className="value">{numberWithCommas((infoTicket.totalOrder || 0) + '')}</h4>
                                    </div>
                                    <div className="item">
                                        <label className="label">Your Ordered</label>
                                        <h4 className="value">{numberWithCommas((boughtBoxes?.amount || 0) + '')}</h4>
                                    </div>
                                </div>
                                <div className="box-countdown">
                                    <h4 className="text-uppercase">{countdown.title}</h4>
                                    {!countdown.isFinished && <CountDownTimeV1 time={countdown} className={"countdown"} onFinish={onSetCountdown} />}
                                </div>
                            </div>
                            <div className={styles.card}>
                                <div className={clsx(styles.cardImg, mysteryStyles.cardImg)}>
                                    {isImageFile(boxTypeSelected.banner) && <Image src={boxTypeSelected.banner} />}
                                    {isVideoFile(boxTypeSelected.banner) && <>
                                        <div className="wrapperVideo">
                                            <div className="uncontrol"></div>
                                            <video
                                                preload="auto"
                                                autoPlay
                                                loop
                                                muted
                                            >
                                                <source src={boxTypeSelected.banner} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </>
                                    }

                                </div>
                                <div className={mysteryStyles.carBodyInfo}>
                                    <div className={mysteryStyles.cardBodyHeader}>
                                        <h3 className="text-uppercase">
                                            {infoTicket.title || infoTicket.name}
                                        </h3>
                                        <h4 className="text-uppercase">
                                            <img src={infoTicket.token_images} className="icon rounded" alt="" />
                                            {infoTicket.symbol}
                                        </h4>
                                    </div>
                                    <div className="divider"></div>
                                    <div className={mysteryStyles.cardBodyDetail}>
                                        <div className={mysteryStyles.currency}>
                                            <img src={`/images/icons/${(infoTicket.accept_currency || '').toLowerCase()}.png`} alt="" />
                                            <span className="text-uppercase">{infoTicket.token_conversion_rate} {infoTicket.accept_currency}</span>
                                        </div>
                                        <div className="detail-items">
                                            <div className="item">
                                                <label className="label text-uppercase">Total sale</label>
                                                <span>{numberWithCommas((infoTicket.total_sold_coin || 0) + '')} Boxes</span>
                                            </div>
                                            <div className="item">
                                                <label className="label text-uppercase">supported</label>
                                                <span className="text-uppercase icon"><img src={`/images/icons/${(infoTicket.network_available || '').toLowerCase()}.png`} className="icon" alt="" /> {infoTicket.network_available}</span>
                                            </div>
                                        </div>
                                        <div className="box-type-wrapper">
                                            <h4 className="text-uppercase">TYPE</h4>
                                            <div className="box-types">
                                                {
                                                    (infoTicket.boxTypesConfig || []).map((t: any) => <div onClick={() => onSelectBoxType(t)} className={clsx("box-type", { active: t.id === boxTypeSelected.id })}>
                                                        <img src={t.icon} className="icon" alt="" />
                                                        <span>{t.name} x{t.limit}</span>
                                                    </div>)
                                                }
                                            </div>
                                        </div>
                                        <AscDescAmountBox
                                            descMinAmount={descMinAmount}
                                            descAmount={descAmount}
                                            ascAmount={ascAmount}
                                            ascMaxAmount={ascMaxAmount}
                                            value={numBoxBuy}
                                            disabledMin={!getMaxTicketBuy(boxBought, maxBoxCanBuy) || numBoxBuy === 1}
                                            disabledSub={!getMaxTicketBuy(boxBought, maxBoxCanBuy) || numBoxBuy === 0}
                                            disabledAdd={!getMaxTicketBuy(boxBought, maxBoxCanBuy) || numBoxBuy === getMaxTicketBuy(boxBought, maxBoxCanBuy)}
                                            disabledMax={!getMaxTicketBuy(boxBought, maxBoxCanBuy) || numBoxBuy === getMaxTicketBuy(boxBought, maxBoxCanBuy)}
                                        />
                                        {
                                            (!loadingJoinpool && !alreadyJoinPool && countdown.isWhitelist) &&
                                            <ButtonGreen onClick={onApplyWhitelist} isLoading={isApplyingWhitelist} disabled={alreadyJoinPool || poolJoinLoading || joinPoolSuccess || isApplyingWhitelist} className="text-transform-unset w-full">
                                                {(alreadyJoinPool || joinPoolSuccess) ? 'Applied Whitelist' : 'Apply Whitelist'}
                                            </ButtonGreen>
                                        }
                                        {
                                            (!loadingJoinpool && (alreadyJoinPool || joinPoolSuccess)) && countdown.isWhitelist &&
                                            <ButtonGreen onClick={(alreadyJoinPool || joinPoolSuccess) ? onShowModalOrderBox : undefined} className="text-transform-unset w-full">
                                                Order Box
                                            </ButtonGreen>
                                        }
                                        {
                                            (!loadingJoinpool && (alreadyJoinPool || joinPoolSuccess)) && countdown.isBuy &&
                                            <ButtonGreen disabled={+numBoxBuy < 1} onClick={(alreadyJoinPool || joinPoolSuccess) ? onShowModalConfirmBuyBox : undefined} className="text-transform-unset w-full">
                                                Buy Now
                                            </ButtonGreen>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.displayContent}>
                        <AboutMysteryBox info={infoTicket} timelines={timelines} />
                    </div>
                </div>
            </>
    );
}
export default MysteryBox;
