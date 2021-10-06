import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import useStyles, { useMysteyBoxStyles } from "./style";
import { AboutMysteryBox } from "./About";
import { apiRoute, getApproveToken, getCurrencyByNetwork, getDiffTime, getTimelineOfPool, isImageFile, isVideoFile } from "../../utils";
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
import { ButtonBase } from "@base-components/Buttons";
import CountDownTimeV1, { CountDownTimeType as CountDownTimeTypeV1 } from "@base-components/CountDownTime";
import { BaseRequest } from "../../request/Request";
import ModalOrderBox from './components/ModalOrderBox';
import useOrderBox from "./hooks/useOrderBox";
import { convertTimeToStringFormat } from "@utils/convertDate";
import ModalConfirmBuyBox from "./components/ModalConfirmBuyBox";
import WrapperContent from "@base-components/WrapperContent";
import _ from 'lodash';

const MysteryBox = ({ id, ...props }: any) => {
    const styles = useStyles();
    const mysteryStyles = useMysteyBoxStyles();
    const dispatch = useDispatch();
    const { connectedAccount /*isAuth, wrongChain*/ } = useAuth();
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
    const [boxTypeSelected, setSelectBoxType] = useState<{ [k: string]: any }>({});
    const handleLoadVideo = (boxType: { [k: string]: any }) => {
        const wrapperVideo = document.querySelector('.wrapperVideo');
        if (wrapperVideo) {
            let elemDivVdo: any = wrapperVideo.querySelector('.video');
            elemDivVdo && wrapperVideo.removeChild(elemDivVdo);

            elemDivVdo = document.createElement('div');
            elemDivVdo.className = "video";
            const video = document.createElement('video');
            video.autoplay = true;
            video.controls = false;
            video.muted = true;
            video.loop = true;
            video.preload = "auto"
            const source = document.createElement('source');
            source.src = boxType.banner;
            source.type = "video/mp4";
            video.appendChild(source);
            elemDivVdo.appendChild(video);
            elemDivVdo.style.zIndex = '1';
            elemDivVdo && wrapperVideo.appendChild(elemDivVdo);
            video.onloadedmetadata = function () {
                setTimeout(() => {
                    elemDivVdo.style.zIndex = '100';
                }, 500);
            };
        }
    }
    const onSelectBoxType = (boxType: { [k: string]: any }) => {
        setSelectBoxType(boxType);
        handleLoadVideo(boxType)
    }

    useEffect(() => {
        if (!loadingTicket && dataTicket) {
            setNewTicket(false);
            setInfoTicket(dataTicket);
            const firstBoxType = dataTicket.boxTypesConfig?.[0];
            if (firstBoxType) {
                setSelectBoxType(firstBoxType)
            }
        }
    }, [dataTicket, loadingTicket, isClaim]);


    const [countdown, setCountdown] = useState<CountDownTimeTypeV1 & { title: string, [k: string]: any }>({ date1: 0, date2: 0, title: '' });
    const [timelines, setTimelines] = useState<TimelineType | {}>({});
    const { checkingKyc, isKYC } = useKyc(connectedAccount, (_.isNumber(infoTicket?.kyc_bypass) && !infoTicket?.kyc_bypass));

    const onSetCountdown = useCallback(() => {
        if (dataTicket) {
            const timeLine = getTimelineOfPool(dataTicket);

            const timeLinesInfo: { [k: string]: any } = {
                1: {
                    title: 'UPCOMING',
                    desc: `Stay tuned and prepare to APPLY WHITELIST.`
                },
                2: {
                    title: 'WHITELIST',
                    desc: 'Click the [APPLY WHITELIST] button to register for Phase 1.'
                }
            };
            if (timeLine.freeBuyTime) {
                timeLinesInfo[3] = {
                    title: 'BUY PHASE 1',
                    desc: 'Whitelist registrants will be given favorable dealings to buy Mecha Boxes in phase 1, on a FCFS basis.'
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
                    desc: 'Whitelist registrants will be given favorable dealings to buy Mecha Boxes in phase 1, on a FCFS basis.'
                };
                timeLinesInfo[4] = {
                    title: 'END',
                    desc: 'Thank you for watching.'
                }
            }

            if (timeLine.startJoinPooltime > Date.now()) {
                setCountdown({ date1: timeLine.startJoinPooltime, date2: Date.now(), title: 'Whitelist Opens In', isUpcoming: true });
                timeLinesInfo[1].current = true;
            }
            else if (timeLine.endJoinPoolTime > Date.now()) {
                setCountdown({ date1: timeLine.endJoinPoolTime, date2: Date.now(), title: 'Whitelist Closes In', isWhitelist: true });
                timeLinesInfo[2].current = true;
            }
            else if (timeLine.startBuyTime > Date.now()) {
                timeLinesInfo[2].current = true;
                if (timeLine.freeBuyTime) {
                    setCountdown({ date1: timeLine.startBuyTime, date2: Date.now(), title: 'Sale Phase 1 Starts In' });
                } else {
                    setCountdown({ date1: timeLine.startBuyTime, date2: Date.now(), title: 'Sale Starts In' });
                }
            }
            else if (timeLine.freeBuyTime && timeLine.freeBuyTime > Date.now()) {
                timeLinesInfo[3].current = true;
                setCountdown({ date1: timeLine.freeBuyTime, date2: Date.now(), title: 'Phase 1 Ends In', isBuy: true });
            }
            else if (timeLine.finishTime > Date.now()) {
                if (timeLine.freeBuyTime) {
                    timeLinesInfo[4].current = true;
                    setCountdown({ date1: timeLine.finishTime, date2: Date.now(), title: 'Phase 2 Ends In', isBuy: true });
                } else {
                    timeLinesInfo[3].current = true;
                    setCountdown({ date1: timeLine.finishTime, date2: Date.now(), title: 'Sale Ends In', isBuy: true });
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

    // useEffect(() => {
    //     const setBalance = async () => {
    //         try {
    //             const myNumTicket = await getBalance(
    //                 connectedAccount,
    //                 dataTicket.token,
    //                 dataTicket.network_available,
    //                 dataTicket.accept_currency
    //             );
    //             setOwnedTicket(+myNumTicket);
    //             setNewBalance(false);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     !isClaim && (renewBalance || connectedAccount) && dataTicket && setBalance();
    // }, [connectedAccount, dataTicket, renewBalance, isClaim]);

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
        try {
            if (!isKYC) return;
            setApplyingWhitelist(true);
            const baseRequest = new BaseRequest()
            const response = await baseRequest.post(`/pool/${infoTicket.id}/whitelist-apply-box`, {
                wallet_address: connectedAccount,
            }) as any
            const resObj = await response.json()
            console.log(resObj)
            // setApplyingWhitelist(false)

            if (resObj?.status === 200) {
                joinPool()
            } else {
                dispatch(alertFailure(resObj.message))
                setApplyingWhitelist(false);
            }
        } catch (error) {
            console.log(error)
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

    const [recallCheckJoinCampaign, setRecallCheckJoin] = useState(true);

    const { data: alreadyJoinPool, loading: loadingJoinpool } = useFetchV1<boolean>(`/user/check-join-campaign/${infoTicket?.id}?wallet_address=${connectedAccount}`, !!(connectedAccount && 'id' in infoTicket) && recallCheckJoinCampaign);
    const { joinPool, poolJoinLoading, joinPoolSuccess } = usePoolJoinAction({ poolId: infoTicket?.id, connectedAccount: connectedAccount as string });

    useEffect(() => {
        if (!poolJoinLoading) {
            setApplyingWhitelist(false);
        }
    }, [poolJoinLoading]);
    useEffect(() => {
        if (joinPoolSuccess) {
            setApplyingWhitelist(false);
            onShowModalOrderBox();
        }
    }, [joinPoolSuccess]);
    useEffect(() => {
        if (!loadingJoinpool) {
            setRecallCheckJoin(false);
        }
    }, [loadingJoinpool]);
    useEffect(() => {
        setRecallCheckJoin(true);
        setRecallBoughtBox(true);
    }, [connectedAccount]);
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
            onCloseModalOrderBox();
            setNewTicket(true);
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
        <>
            {loadingTicket ? <div className={styles.loader} style={{ marginTop: 70 }}>
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
                    <ModalOrderBox open={openModalOrderBox} onClose={onCloseModalOrderBox} onConfirm={onOrderBox} isLoadingButton={buyBoxLoading} isSuccessOrderbox={statusBuyBox} defaultValue={maxBoxCanBuy} />
                    <ModalConfirmBuyBox open={openModalConfirmBuyBox} onClose={onCloseModalConfirmBuyBox} onConfirm={onBuyBox} infoBox={infoTicket} isLoadingButton={buyBoxLoading} amount={numBoxBuy} />
                    <div className={styles.content}>

                        {
                            !connectedAccount && <WrapperAlert>
                                Please connect to wallet
                            </WrapperAlert>
                        }
                        {(alreadyJoinPool) && <WrapperAlert type="info">
                            Congratulations! You have successfully applied whitelist.
                        </WrapperAlert>}
                        {
                            (!loadingJoinpool && connectedAccount && countdown.isBuy) &&
                            ((alreadyJoinPool) ? null : <WrapperAlert type="error"> Sorry, you have not been chosen as whitelist winner. </WrapperAlert>)
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
                                                <div className="onload">
                                                    <HashLoader loading={true} color={'#72F34B'} />
                                                </div>
                                                <div className="video">
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
                                                <img className="icon" src={`/images/icons/${(infoTicket.network_available || '').toLowerCase()}.png`} alt="" />
                                                <span className="text-uppercase">{infoTicket.token_conversion_rate} {getCurrencyByNetwork(infoTicket.network_available)}</span>
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
                                                        (infoTicket.boxTypesConfig || []).map((t: any) => <div key={t.id} onClick={() => onSelectBoxType(t)} className={clsx("box-type", { active: t.id === boxTypeSelected.id })}>
                                                            <img src={t.icon} className="icon" alt="" />
                                                            <span>{t.name} x{t.limit}</span>
                                                        </div>)
                                                    }
                                                </div>
                                            </div>
                                            {/* {countdown.isBuy && <AscDescAmountBox
                                                descMinAmount={descMinAmount}
                                                descAmount={descAmount}
                                                ascAmount={ascAmount}
                                                ascMaxAmount={ascMaxAmount}
                                                value={numBoxBuy}
                                                disabledMin={!getMaxTicketBuy(boxBought, maxBoxCanBuy) || numBoxBuy === 1}
                                                disabledSub={!getMaxTicketBuy(boxBought, maxBoxCanBuy) || numBoxBuy === 0}
                                                disabledAdd={!getMaxTicketBuy(boxBought, maxBoxCanBuy) || numBoxBuy === getMaxTicketBuy(boxBought, maxBoxCanBuy)}
                                                disabledMax={!getMaxTicketBuy(boxBought, maxBoxCanBuy) || numBoxBuy === getMaxTicketBuy(boxBought, maxBoxCanBuy)}
                                            />} */}
                                            {
                                                (connectedAccount && !checkingKyc && !loadingJoinpool && !alreadyJoinPool && !joinPoolSuccess) && (countdown.isWhitelist || countdown.isUpcoming) &&
                                                <ButtonBase color="green" onClick={countdown.isWhitelist ? onApplyWhitelist : undefined} isLoading={isApplyingWhitelist} disabled={countdown.isUpcoming || alreadyJoinPool || poolJoinLoading || isApplyingWhitelist || !isKYC} className="text-transform-unset w-full">
                                                    {(alreadyJoinPool) ? 'Applied Whitelist' : 'Apply Whitelist'}
                                                </ButtonBase>
                                            }
                                            {
                                                (connectedAccount && !checkingKyc && !loadingJoinpool && (alreadyJoinPool || joinPoolSuccess)) && countdown.isWhitelist &&
                                                <ButtonBase color="green" onClick={(alreadyJoinPool || joinPoolSuccess) && isKYC ? onShowModalOrderBox : undefined} disabled={!isKYC} className="text-transform-unset w-full">
                                                    {maxBoxCanBuy > 0 ? 'Change Order' : 'Order Box'}
                                                </ButtonBase>
                                            }
                                            {/* {
                                                (connectedAccount && !checkingKyc && !loadingJoinpool && (alreadyJoinPool || joinPoolSuccess)) && countdown.isBuy &&
                                                <ButtonBase color="green" disabled={+numBoxBuy < 1 || !isKYC} onClick={(alreadyJoinPool || joinPoolSuccess) && isKYC ? onShowModalConfirmBuyBox : undefined} className="text-transform-unset w-full">
                                                    Buy Now
                                                </ButtonBase>
                                            } */}
                                            {
                                                countdown.isFinished &&
                                                <div className={clsx(styles.infoTicket, styles.finished)}>
                                                    <div className="img-finished">
                                                        <img src={"/images/finished.png"} alt="" />
                                                    </div>
                                                    {!getRemaining(
                                                        infoTicket.total_sold_coin,
                                                        infoTicket.token_sold
                                                    ) && (
                                                            <div className="soldout">
                                                                <img src={"/images/soldout.png"} alt="" />
                                                            </div>
                                                        )}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.displayContent}>
                            <AboutMysteryBox info={infoTicket} timelines={timelines} defaultTab={2} />
                        </div>
                    </div>
                </>
            }
        </>
    );
}
export default MysteryBox;
