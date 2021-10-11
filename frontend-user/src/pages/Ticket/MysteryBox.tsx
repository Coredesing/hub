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
import { getUserTier } from "@store/actions/sota-tiers";
import { Link } from "react-router-dom";
import { TIERS } from "@app-constants";
import useClaimBox from "./hooks/useClaimBox";
import { getContract } from "@utils/contract";
import PreSaleBoxAbi from '@abi/PreSaleBox.json';
import { useWeb3React } from "@web3-react/core";
import BigNumber from 'bn.js';
import { Box } from "@material-ui/core";

const MysteryBox = ({ id, ...props }: any) => {
    const styles = useStyles();
    const mysteryStyles = useMysteyBoxStyles();
    const dispatch = useDispatch();
    const { library } = useWeb3React();
    const { connectedAccount, wrongChain /*isAuth*/ } = useAuth();
    // const alert = useSelector((state: any) => state.alert);
    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const [numBoxBuy, setNumBoxBuy] = useState<number>(0);
    const [infoTicket, setInfoTicket] = useState<{ [k in string]: any }>({});
    const [renewTicket, setNewTicket] = useState<boolean>(true);
    const { data: dataTicket = null, loading: loadingTicket } = useFetchV1<any>(
        `/pool/${id}`,
        renewTicket
    );
    const { data: userTier, loading: loadingUserTier } = useSelector((state: any) => state.userTier);

    useEffect(() => {
        dispatch(getUserTier(!wrongChain && connectedAccount ? connectedAccount : ''));
    }, [wrongChain, connectedAccount, dispatch]);

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
        }
    }, [dataTicket, loadingTicket, isClaim]);

    useEffect(() => {

        if (Array.isArray(infoTicket?.tiers) && _.isNumber(userTier)) {
            const currentTier = infoTicket.tiers.find(t => t.level === userTier);
            setMaxBoxCanBuy(currentTier?.ticket_allow || 0);
        }

    }, [infoTicket, userTier]);


    const [countdown, setCountdown] = useState<CountDownTimeTypeV1 & { title: string, [k: string]: any }>({ date1: 0, date2: 0, title: '' });
    const [timelines, setTimelines] = useState<TimelineType | {}>({});
    const { checkingKyc, isKYC } = useKyc(connectedAccount, (_.isNumber(infoTicket?.kyc_bypass) && !infoTicket?.kyc_bypass));

    const onSetCountdown = useCallback(() => {
        if (dataTicket) {
            const isAccIsBuyPreOrder = userTier >= dataTicket.pre_order_min_tier;
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

            const startBuyTime = isAccIsBuyPreOrder && timeLine.startPreOrderTime ? timeLine.startPreOrderTime : timeLine.startBuyTime;
            if (timeLine.startJoinPooltime > Date.now()) {
                setCountdown({ date1: timeLine.startJoinPooltime, date2: Date.now(), title: 'Whitelist Opens In', isUpcoming: true });
                timeLinesInfo[1].current = true;
            }
            else if (timeLine.endJoinPoolTime > Date.now()) {
                setCountdown({ date1: timeLine.endJoinPoolTime, date2: Date.now(), title: 'Whitelist Closes In', isWhitelist: true });
                timeLinesInfo[2].current = true;
            }
            else if (startBuyTime > Date.now()) {
                timeLinesInfo[2].current = true;
                if (timeLine.freeBuyTime) {
                    setCountdown({ date1: startBuyTime, date2: Date.now(), title: 'Sale Phase 1 Starts In', isUpcomingSale: true, isMultiPhase: true });
                } else {
                    setCountdown({ date1: startBuyTime, date2: Date.now(), title: 'Sale Starts In', isUpcomingSale: true });
                }
            }
            else if (timeLine.freeBuyTime && timeLine.freeBuyTime > Date.now()) {
                timeLinesInfo[3].current = true;
                setCountdown({ date1: timeLine.freeBuyTime, date2: Date.now(), title: 'Phase 1 Ends In', isSale: true, isPhase1: true });
            }
            else if (timeLine.finishTime > Date.now()) {
                if (timeLine.freeBuyTime) {
                    timeLinesInfo[4].current = true;
                    setCountdown({ date1: timeLine.finishTime, date2: Date.now(), title: 'Phase 2 Ends In', isSale: true, isPhase2: true });
                } else {
                    timeLinesInfo[3].current = true;
                    setCountdown({ date1: timeLine.finishTime, date2: Date.now(), title: 'Sale Ends In', isSale: true, isPhase1: true });
                }
            }
            else {
                setCountdown({ date1: 0, date2: 0, title: 'Finished', isFinished: true });
                timeLine.freeBuyTime ? (timeLinesInfo[5].current = true) : (timeLinesInfo[4].current = true);
            }
            setTimelines(timeLinesInfo);
        }
    }, [dataTicket, userTier]);

    useEffect(() => {
        if (!loadingTicket && dataTicket && _.isNumber(userTier)) {
            onSetCountdown();
        }
    }, [dataTicket, loadingTicket, userTier])

    const [recallMybox, setRecallMyBox] = useState(true);
    const [ownedBox, setOwnedBox] = useState(0);
    const [openModal, setOpenModalTx] = useState(false);
    const onCloseModal = useCallback(() => {
        setOpenModalTx(false);
    }, [setOpenModalTx]);

    useEffect(() => {
        const getMyNumBox = async () => {
            try {
                const myNumBox = await getBalance(
                    connectedAccount,
                    dataTicket.token,
                    dataTicket.network_available,
                    dataTicket.accept_currency
                );
                setOwnedBox(+myNumBox);
                setRecallMyBox(false);
            } catch (error) {
                console.log(error);
            }
        };
        !isClaim && (recallMybox || connectedAccount) && dataTicket?.token && getMyNumBox();
    }, [connectedAccount, dataTicket, recallMybox, isClaim]);

    const ascAmount = () => {
        if (!isKYC) return;
        const ticketCanBuy = getMaxTicketBuy(
            ownedBox,
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
        const maxTicket = getMaxTicketBuy(ownedBox, maxBoxCanBuy);
        if (maxTicket === 0) return;
        setNumBoxBuy(maxTicket);
    };

    const descMinAmount = () => {
        if (!isKYC) return;
        const maxTicket = getMaxTicketBuy(ownedBox, maxBoxCanBuy);
        if (maxTicket === 0) return;
        setNumBoxBuy(1);
    };

    const eventId = 0;
    const { claimBox, claimBoxLoading, claimTransactionHash, isClaimedBoxSuccess } = useClaimBox({
        poolAddress: infoTicket.campaign_hash,
        poolId: infoTicket.id,
        eventId,
        subBoxId: boxTypeSelected.subBoxId,
        priceOfBox: infoTicket.ether_conversion_rate,
    });

    const [contractPreSale, setContractPreSale] = useState<any>();
    useEffect(() => {
        if (infoTicket?.campaign_hash && connectedAccount) {
            const contract = getContract(infoTicket.campaign_hash, PreSaleBoxAbi, library, connectedAccount as string);
            setContractPreSale(contract);
        }
    }, [infoTicket, connectedAccount])

    const [lockWhenBuyBox, setLockWhenBuyBox] = useState(false);
    const [subBoxes, setSubBoxes] = useState<{ [k: string]: any }[]>([]);
    const [totalBoxesBought, setTotalBoxesBought] = useState(0);
    const [renewTotalBoxesBought, setRenewTotalBoxesBought] = useState(true);
    useEffect(() => {
        if (infoTicket?.campaign_hash && renewTotalBoxesBought && contractPreSale) {
            contractPreSale.saleEvents(eventId).then((res: any) => {
                const totalBought = res.currentSupply ? res.currentSupply.toNumber() : 0;
                setTotalBoxesBought(totalBought);
            }).catch((err: any) => {
                console.log('err', err);
            })
        }
    }, [infoTicket, renewTotalBoxesBought, contractPreSale]);

    useEffect(() => {
        if (infoTicket?.boxTypesConfig?.length) {
            if (contractPreSale) {
                Promise.all(infoTicket.boxTypesConfig.map((b: any, subBoxId: number) => new Promise(async (res, rej) => {
                    try {
                        const response = await contractPreSale.subBoxes(eventId, subBoxId);
                        const result = {
                            maxSupply: new BigNumber('maxSupply' in response ? response.maxSupply.toBigInt() : 0).toString(),
                            totalSold: new BigNumber('totalSold' in response ? response.totalSold.toBigInt() : 0).toString(),
                        }
                        res({ ...b, subBoxId, ...result });
                    } catch (error) {
                        rej(error)
                    }

                })))
                    .then((arr) => {
                        setSelectBoxType(arr[0] as { [k: string]: any })
                        setSubBoxes(arr as any[])
                    }).catch((err) => {
                        console.log('err', err)
                    })
            } else {
                setSubBoxes(infoTicket.boxTypesConfig);
                setSelectBoxType(infoTicket.boxTypesConfig[0])
            }
        }
    }, [infoTicket, contractPreSale]);

    const [loadingCollection, setLoadingCollection] = useState(false);
    const [collections, setCollections] = useState<{ [k: string]: any }>([]);
    const handleSetCollections = async (ownedBox: number) => {
        if (!contractPreSale) return;
        setLoadingCollection(true);
        setCollections([]);
        try {
            const arrCollections = [];
            if (!connectedAccount) return;
            for (let id = 0; id < ownedBox; id++) {
                const idCollection = (await contractPreSale.tokenOfOwnerByIndex(connectedAccount, id)).toNumber();
                const boxType = await contractPreSale.boxes(idCollection);
                const idBoxType = boxType.subBoxId.toNumber();
                const infoBox = subBoxes.find(b => b.subBoxId === idBoxType);
                const collection = infoBox && { ...infoBox, idCollection };
                collection && arrCollections.push(collection);
            }
            setCollections(arrCollections);
        } catch (error) {
            console.error('Something went wrong when show collections');
        } finally {
            setLoadingCollection(false);
        }
    }

    useEffect(() => {
        if (ownedBox > 0 && subBoxes.length) {
            handleSetCollections(ownedBox);
        }
    }, [ownedBox, subBoxes]);

    useEffect(() => {
        if (ownedBox <= 0) {
            setCollections([]);
        }
    }, [ownedBox])

    useEffect(() => {
        if (!connectedAccount) {
            setCollections([]);
            setOwnedBox(0);
        }
    }, [connectedAccount])

    useEffect(() => {
        if (!claimBoxLoading) {
            setLockWhenBuyBox(false);
            onCloseModalConfirmBuyBox();
        }
    }, [claimBoxLoading]);

    useEffect(() => {
        if (claimTransactionHash) {
            onCloseModalConfirmBuyBox();
            setOpenModalTx(true);
        }
    }, [claimTransactionHash]);

    useEffect(() => {
        if (isClaimedBoxSuccess) {
            setNewTicket(true);
            setRenewTotalBoxesBought(true);
            setNumBoxBuy(0);
        }
    }, [isClaimedBoxSuccess]);

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
    const [recallBoxOrdered, setRecallBoxOrdered] = useState(true);
    const { data: boxesOrdered = {} as any } = useFetchV1<boolean>(`/pool/${infoTicket?.id}/nft-order?wallet_address=${connectedAccount}`, !!(connectedAccount && 'id' in infoTicket) && recallBoxOrdered);
    useEffect(() => {
        if (boxesOrdered && 'amount' in boxesOrdered) {
            setRecallBoxOrdered(false);
        }
    }, [boxesOrdered]);

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
        setRecallBoxOrdered(true);
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

    const { orderBox, orderBoxLoading, statusOrderBox } = useOrderBox({ poolId: infoTicket.id, });
    useEffect(() => {
        if (statusOrderBox) {
            setOpenModalOrderBox(false);
            setRecallBoxOrdered(true);
            onCloseModalOrderBox();
            setNewTicket(true);
        }
    }, [statusOrderBox]);

    const onOrderBox = useCallback(async (numberBox: number) => {
        orderBox(numberBox)
    }, [infoTicket, connectedAccount]);

    const onBuyBox = useCallback((captcha: string) => {
        if (boxTypeSelected) {
            setLockWhenBuyBox(true);
            claimBox(numBoxBuy, captcha, eventId);
        }
    }, [numBoxBuy, boxTypeSelected]);

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
                        transaction={claimTransactionHash}
                        networkName={infoTicket?.network_available}
                    />
                    <ModalOrderBox open={openModalOrderBox} onClose={onCloseModalOrderBox} onConfirm={onOrderBox} isLoadingButton={orderBoxLoading} isSuccessOrderbox={statusOrderBox} defaultValue={boxesOrdered?.amount} />
                    <ModalConfirmBuyBox open={openModalConfirmBuyBox} onClose={onCloseModalConfirmBuyBox} onConfirm={onBuyBox} infoBox={infoTicket} isLoadingButton={lockWhenBuyBox} amount={numBoxBuy} boxTypeSelected={boxTypeSelected} />
                    <div className={styles.content}>
                        {
                            !connectedAccount && <WrapperAlert>
                                Please connect to wallet
                            </WrapperAlert>
                        }
                        {
                            countdown.isWhitelist && connectedAccount && !loadingTicket && infoTicket.min_tier > 0 && !loadingUserTier && _.isNumber(userTier) && (userTier < infoTicket.min_tier) && <WrapperAlert>
                                <span>You haven't achieved min rank ({TIERS[infoTicket.min_tier]?.name}) to apply for Whitelist yet. To upgrade your Rank, please click <Link to="/account?tab=rank" className="text-weight-600 text-white link">here</Link></span>
                            </WrapperAlert>
                        }
                        {(alreadyJoinPool || joinPoolSuccess) && countdown.isWhitelist && <WrapperAlert type="info">
                            Congratulations! You have successfully applied whitelist.
                        </WrapperAlert>}
                        {(alreadyJoinPool || joinPoolSuccess) && (countdown.isSale || countdown.isUpcomingSale) && <WrapperAlert type="info">
                            Congratulations! You have successfully applied whitelist and can buy Mystery boxes
                        </WrapperAlert>}
                        {
                            (!loadingJoinpool && connectedAccount && countdown.isSale && !countdown.isPhase2) &&
                            ((alreadyJoinPool) ? null : <WrapperAlert type="error"> Sorry, you didn’t apply whitelist. </WrapperAlert>)
                        }
                        {!isKYC && !checkingKyc && connectedAccount && (
                            <AlertKYC connectedAccount={connectedAccount} />
                        )}

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
                                            <h4 className="value">{numberWithCommas((boxesOrdered?.amount || 0) + '')}</h4>
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
                                                    <span>{numberWithCommas((infoTicket.total_sold_coin || 0) + '')}</span>
                                                </div>
                                                {
                                                    !countdown.isUpcoming && !countdown.isWhitelist && !countdown.isUpcomingSale &&
                                                    <div className="item">
                                                        <label className="label text-uppercase">REMAINING</label>
                                                        <span>{numberWithCommas(((+infoTicket.total_sold_coin || 0) - totalBoxesBought) + '')}</span>
                                                    </div>
                                                }
                                                <div className="item">
                                                    <label className="label text-uppercase">supported</label>
                                                    <span className="text-uppercase icon"><img src={`/images/icons/${(infoTicket.network_available || '').toLowerCase()}.png`} className="icon" alt="" /> {infoTicket.network_available}</span>
                                                </div>
                                                <div className="item" >
                                                    <label className="label text-uppercase">MIN RANK</label>
                                                    {infoTicket.min_tier > 0 ? <span className="icon" style={{ gridTemplateColumns: '22px auto' }}><img src={TIERS[infoTicket.min_tier].icon} className="icon" alt="" style={{ width: "22px", height: "20px" }} /> {TIERS[infoTicket.min_tier].name}</span>
                                                        : <span>No Required</span>
                                                    }
                                                </div>
                                            </div>
                                            <div className="box-type-wrapper">
                                                <h4 className="text-uppercase">TYPE</h4>
                                                <div className="box-types">
                                                    {
                                                        (subBoxes).map((t: any) => <div key={t.id} onClick={() => onSelectBoxType(t)} className={clsx("box-type", { active: t.id === boxTypeSelected.id })}>
                                                            <img src={t.icon} className="icon" alt="" />
                                                            <span>{t.name} {t.totalSold || 0}/{t.maxSupply || t.limit}</span>
                                                        </div>)
                                                    }
                                                </div>
                                            </div>

                                            {
                                                countdown.isSale && ((countdown.isPhase1 && (alreadyJoinPool || joinPoolSuccess)) || countdown.isPhase2) &&
                                                <div className={mysteryStyles.wrapperAmount}>
                                                    <AscDescAmountBox
                                                        descMinAmount={descMinAmount}
                                                        descAmount={descAmount}
                                                        ascAmount={ascAmount}
                                                        ascMaxAmount={ascMaxAmount}
                                                        value={numBoxBuy}
                                                        disabledMin={!getMaxTicketBuy(ownedBox, maxBoxCanBuy) || numBoxBuy === 1}
                                                        disabledSub={!getMaxTicketBuy(ownedBox, maxBoxCanBuy) || numBoxBuy === 0}
                                                        disabledAdd={!getMaxTicketBuy(ownedBox, maxBoxCanBuy) || numBoxBuy === getMaxTicketBuy(ownedBox, maxBoxCanBuy)}
                                                        disabledMax={!getMaxTicketBuy(ownedBox, maxBoxCanBuy) || numBoxBuy === getMaxTicketBuy(ownedBox, maxBoxCanBuy)}
                                                    />
                                                    <div className="bought" >
                                                        <h4 className="text-uppercase">BOUGHT/MAX</h4>
                                                        <span className={styles.textBold}>
                                                            {ownedBox}/{maxBoxCanBuy || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            }

                                            {
                                                (connectedAccount && !checkingKyc && !loadingJoinpool && !alreadyJoinPool && !joinPoolSuccess) && (countdown.isWhitelist || countdown.isUpcoming) &&
                                                <ButtonBase color="green"
                                                    onClick={countdown.isWhitelist ? onApplyWhitelist : undefined}
                                                    isLoading={isApplyingWhitelist}
                                                    disabled={countdown.isUpcoming || alreadyJoinPool || poolJoinLoading || isApplyingWhitelist || !isKYC || (_.isNumber(userTier) && (userTier < infoTicket.min_tier))}
                                                    className="mt-0-important text-transform-unset w-full">
                                                    {(alreadyJoinPool) ? 'Applied Whitelist' : 'Apply Whitelist'}
                                                </ButtonBase>
                                            }
                                            {
                                                (connectedAccount && !checkingKyc && !loadingJoinpool && (alreadyJoinPool || joinPoolSuccess)) && countdown.isWhitelist &&
                                                <ButtonBase
                                                    color="green"
                                                    onClick={(alreadyJoinPool || joinPoolSuccess) && isKYC ? onShowModalOrderBox : undefined}
                                                    disabled={!isKYC}
                                                    className="mt-0-important text-transform-unset w-full">
                                                    {boxesOrdered?.amount > 0 ? 'Change Order' : 'Order Box'}
                                                </ButtonBase>
                                            }
                                            {
                                                countdown.isSale && <div className={styles.progressItem}>
                                                    <span className={styles.text}>Progress</span>
                                                    <div className="showProgress">
                                                        <Progress
                                                            progress={calcProgress(
                                                                +totalBoxesBought,
                                                                +infoTicket.total_sold_coin
                                                            )}
                                                        />
                                                    </div>
                                                    <div className={clsx(styles.infoTicket, "total")}>
                                                        <span className={styles.textBold}>
                                                            {calcProgress(
                                                                +totalBoxesBought,
                                                                +infoTicket.total_sold_coin
                                                            )}
                                                            %
                                                        </span>

                                                        <span className="amount">
                                                            {totalBoxesBought ?? "..."}/
                                                            {infoTicket.total_sold_coin ? numberWithCommas(infoTicket.total_sold_coin, 0) : "..."} Boxes
                                                        </span>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                (connectedAccount && !checkingKyc && !loadingJoinpool && countdown.isSale && ((countdown.isPhase1 && (alreadyJoinPool || joinPoolSuccess)) || countdown.isPhase2)) &&
                                                <ButtonBase
                                                    color="green"
                                                    isLoading={lockWhenBuyBox}
                                                    disabled={+numBoxBuy < 1 || !isKYC || lockWhenBuyBox}
                                                    onClick={(alreadyJoinPool || joinPoolSuccess || countdown.isPhase2) && isKYC ? onShowModalConfirmBuyBox : undefined}
                                                    className="mt-0-important text-transform-unset w-full">
                                                    Buy Now
                                                </ButtonBase>
                                            }
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
                            <AboutMysteryBox
                                info={infoTicket}
                                timelines={timelines}
                                defaultTab={2}
                                ownedBox={ownedBox}
                                collections={loadingCollection ? [] : collections}
                                loadingCollection={loadingCollection} />
                        </div>
                    </div>
                </>
            }
        </>
    );
}
export default MysteryBox;
