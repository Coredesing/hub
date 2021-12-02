import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { CountDownTimeType, TimelineType, TokenType } from "./types";
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
import BigNumber from 'bignumber.js';
import { Box } from "@material-ui/core";
import { ObjectType } from "@app-types";
import { getContractInstance } from "@services/web3";
import Erc20Abi from '@abi/Erc20.json';
import { useTypedSelector } from "@hooks/useTypedSelector";
import Erc721Abi from '@abi/Erc721.json';
import { getNetworkInfo } from "@utils/network";

const MysteryBox = ({ id, ...props }: any) => {
    const styles = useStyles();
    const mysteryStyles = useMysteyBoxStyles();
    const dispatch = useDispatch();
    const { library } = useWeb3React();
    const { connectedAccount, wrongChain /*isAuth*/ } = useAuth();
    const connectorName = useTypedSelector(state => state.connector).data;
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
        const ok = String(networkInfo.shortName).toLowerCase() === (infoTicket.network_available || "").toLowerCase();
        if (!ok) {
            dispatch(pushMessage(`Please switch to ${(infoTicket.network_available || '').toLocaleUpperCase()} network to do Apply Whitelist, Approve/Buy Mystery Box.`))
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
    const [checkSoldout, setCheckSoldout] = useState({ loading: true, soldout: false });
    const [maxBoxCanBuy, setMaxBoxCanBuy] = useState(0);
    const [boxTypeSelected, setSelectBoxType] = useState<{ [k: string]: any }>({});
    const [tokenSeletected, setTokenSelected] = useState<ObjectType<any>>({});
    const [tokenToApprove, setTokenToApprove] = useState<TokenType & ObjectType<any> | undefined>();
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
    const onSelectBoxType = (boxType: ObjectType<any>) => {
        setSelectBoxType(boxType);
        handleLoadVideo(boxType)
    }

    useEffect(() => {
        if (!loadingTicket && dataTicket) {
            setNewTicket(false);
            setInfoTicket(dataTicket);
            if (dataTicket?.boxTypesConfig?.length) {
                const networkInfo = getNetworkInfo(dataTicket.network_available);
                const contractPreSale = getContractInstance(PreSaleBoxAbi, dataTicket.campaign_hash, connectorName, networkInfo?.id);
                if (contractPreSale) {
                    Promise.all(dataTicket.boxTypesConfig.map((b: any, subBoxId: number) => new Promise(async (res, rej) => {
                        try {
                            const response = await contractPreSale.methods.subBoxes(eventId, subBoxId).call();
                            const result = {
                                maxSupply: new BigNumber('maxSupply' in response ? response.maxSupply : 0).toString(),
                                totalSold: new BigNumber('totalSold' in response ? response.totalSold : 0).toString(),
                            }
                            res({ ...b, subBoxId, ...result });
                        } catch (error) {
                            rej(error)
                        }
                    })))
                        .then((arr) => {
                            const boxNotSoldout = arr.find((b: any) => b.totalSold !== b.maxSupply);
                            setSelectBoxType((boxNotSoldout || arr[0]) as { [k: string]: any })
                            setSubBoxes(arr as any[])
                            const totalSold = arr.reduce((total: number, item: any) => {
                                total += +item.totalSold;
                                return total;
                            }, 0)
                            setCheckSoldout({ loading: false, soldout: totalSold === +dataTicket.total_sold_coin });
                        }).catch((err) => {
                            setCheckSoldout({ loading: false, soldout: false });
                            console.log('err', err)
                        })
                } else {
                    setSubBoxes(dataTicket.boxTypesConfig);
                    setSelectBoxType(dataTicket.boxTypesConfig[0])
                    setCheckSoldout({ loading: false, soldout: false });
                }
            } else {
                setCheckSoldout({ loading: false, soldout: false });
            }
        }
    }, [dataTicket, loadingTicket]);

    useEffect(() => {

        if (Array.isArray(infoTicket?.tiers) && _.isNumber(userTier)) {
            const currentTier = infoTicket.tiers.find(t => t.level === userTier);
            setMaxBoxCanBuy(currentTier?.ticket_allow || 0);
        }

    }, [infoTicket, userTier]);

    const [countdown, setCountdown] = useState<CountDownTimeTypeV1 & { title: string, [k: string]: any }>({ date1: 0, date2: 0, title: '' });
    const [timelines, setTimelines] = useState<ObjectType<TimelineType>>({});
    const { checkingKyc, isKYC } = useKyc(connectedAccount, (_.isNumber(infoTicket?.kyc_bypass) && !infoTicket?.kyc_bypass));
    const [timelinePool, setTimelinePool] = useState<ObjectType<any>>({});
    const onSetCountdown = useCallback(() => {
        if (dataTicket) {
            const isAccIsBuyPreOrder = userTier >= dataTicket.pre_order_min_tier;
            const timeLine = getTimelineOfPool(dataTicket);
            setTimelinePool(timeLine);
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
                    desc: 'Whitelist registrants will be given favorable dealings to buy Mystery Boxes in phase 1, on a FCFS basis.'
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
                    desc: 'Whitelist registrants will be given favorable dealings to buy Mystery Boxes in phase 1, on a FCFS basis.'
                };
                timeLinesInfo[4] = {
                    title: 'END',
                    desc: 'Thank you for watching.'
                }
            }
            const startBuyTime = isAccIsBuyPreOrder && timeLine.startPreOrderTime ? timeLine.startPreOrderTime : timeLine.startBuyTime;
            const soldOut = checkSoldout.soldout;
            if (soldOut) {
                setCountdown({ date1: 0, date2: 0, title: 'Finished', isFinished: true });
                timeLine.freeBuyTime ? (timeLinesInfo[5].current = true) : (timeLinesInfo[4].current = true);
            } else if (timeLine.startJoinPooltime > Date.now()) {
                setCountdown({ date1: timeLine.startJoinPooltime, date2: Date.now(), title: 'Whitelist Opens In', isUpcoming: true });
                timeLinesInfo[1].current = true;
            }
            else if (timeLine.endJoinPoolTime > Date.now()) {
                // check preorder
                if (isAccIsBuyPreOrder && startBuyTime < Date.now()) {
                    timeLinesInfo[3].current = true;
                    setCountdown({ date1: timeLine?.freeBuyTime || timeLine?.finishTime, date2: Date.now(), title: 'Phase 1 Ends In', isSale: true, isPhase1: true });
                } else {
                    setCountdown({ date1: timeLine.endJoinPoolTime, date2: Date.now(), title: 'Whitelist Closes In', isWhitelist: true });
                    timeLinesInfo[2].current = true;
                }
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
    }, [dataTicket, userTier, checkSoldout]);

    useEffect(() => {
        if (!loadingTicket && infoTicket && _.isNumber(userTier) && !checkSoldout.loading) {
            onSetCountdown();
        }
    }, [infoTicket, loadingTicket, userTier, checkSoldout])

    const [recallMybox, setRecallMyBox] = useState(true);
    const [ownedBox, setOwnedBox] = useState(0);
    const [openModal, setOpenModalTx] = useState(false);
    const onCloseModal = useCallback(() => {
        setOpenModalTx(false);
    }, [setOpenModalTx]);

    const ascAmount = () => {
        if (!isKYC) return;
        const ticketCanBuy = getMaxTicketBuy(
            myBoxThisPool,
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
        const maxTicket = getMaxTicketBuy(myBoxThisPool, maxBoxCanBuy);
        if (maxTicket === 0) return;
        setNumBoxBuy(maxTicket);
    };

    const descMinAmount = () => {
        if (!isKYC) return;
        const maxTicket = getMaxTicketBuy(myBoxThisPool, maxBoxCanBuy);
        if (maxTicket === 0) return;
        setNumBoxBuy(1);
    };

    const eventId = 0;
    const { claimBox, claimBoxLoading, claimTransactionHash, isClaimedBoxSuccess } = useClaimBox({
        poolAddress: infoTicket.campaign_hash,
        poolId: infoTicket.id,
        eventId,
        subBoxId: boxTypeSelected.subBoxId,
        priceOfBox: tokenSeletected.price,
        tokenAddress: tokenSeletected.address,
    });

    const [contractPreSaleWithAcc, setContractPreSaleWithAcc] = useState<any>();
    useEffect(() => {
        if (infoTicket?.campaign_hash && connectedAccount && library) {
            const contract = getContract(infoTicket.campaign_hash, PreSaleBoxAbi, library, connectedAccount as string);
            setContractPreSaleWithAcc(contract);
        }
    }, [infoTicket, connectedAccount, library]);

    const [contractPreSale, setContractPreSale] = useState<any>();
    useEffect(() => {
        if (infoTicket?.campaign_hash) {
            const networkInfo = getNetworkInfo(infoTicket.network_available);
            const contract = getContractInstance(PreSaleBoxAbi, infoTicket.campaign_hash, connectorName, networkInfo?.id);
            setContractPreSale(contract);
        }
    }, [infoTicket])

    useEffect(() => {
        if (!connectedAccount) {
            setOwnedBox(0);
            return;
        }

        const getMyNumBox = async () => {
            try {

                const myNumBox = await getBalance(
                    connectedAccount,
                    dataTicket.token,
                    dataTicket.network_available,
                    dataTicket.accept_currency
                );
                setOwnedBox(+myNumBox || 0);
                setRecallMyBox(false);
            } catch (error) {
                console.log(error);
            }
        };
        !isClaim && recallMybox && dataTicket?.token && getMyNumBox();
    }, [connectedAccount, dataTicket, recallMybox, isClaim]);

    const [myBoxThisPool, setMyBoxThisPool] = useState(0);
    useEffect(() => {
        if (!contractPreSale || !connectedAccount) {
            setMyBoxThisPool(0);
            return;
        }
        const getMyBoxThisPool = async () => {
            try {
                const myBox = await contractPreSale.methods.userBought(eventId, connectedAccount).call();
                setMyBoxThisPool(+myBox);
            } catch (error) {
                console.log('er', error);
            }

        }
        getMyBoxThisPool();
    }, [contractPreSale]);

    const [lockWhenBuyBox, setLockWhenBuyBox] = useState(false);
    const [subBoxes, setSubBoxes] = useState<{ [k: string]: any }[]>([]);
    const [totalBoxesBought, setTotalBoxesBought] = useState(0);
    const [renewTotalBoxesBought, setRenewTotalBoxesBought] = useState(true);
    const getRemainingBox = () => {
        if (subBoxes?.length) {
            const remaining = subBoxes.reduce((total, item) => {
                total -= +(item.totalSold) || 0;
                return total;
            }, (+infoTicket.total_sold_coin || 0));
            return remaining < 0 ? 0 : remaining;
        }
        return infoTicket.total_sold_coin;
    }

    useEffect(() => {
        if (infoTicket?.campaign_hash && renewTotalBoxesBought && contractPreSale) {
            contractPreSale.methods.saleEvents(eventId).call().then((res: any) => {
                const totalBought = res.currentSupply ? res.currentSupply : 0;
                setTotalBoxesBought(totalBought);
            }).catch((err: any) => {
                console.log('err', err);
            })
        }
    }, [infoTicket, renewTotalBoxesBought, contractPreSale]);

    const [loadingCollection, setLoadingCollection] = useState(false);
    const [collections, setCollections] = useState<{ [k: string]: any }>([]);
    const handleSetCollections = async (ownedBox: number) => {
        if (!contractPreSaleWithAcc) return;
        setLoadingCollection(true);
        setCollections([]);
        try {
            const Erc721contract = getContractInstance(Erc721Abi, infoTicket.token, connectorName, appChainID);
            if (!Erc721contract) return;
            const isCallDefaultCollection = infoTicket.campaign_hash === infoTicket.token;
            const arrCollections = [];
            if (!connectedAccount) return;
            for (let id = 0; id < ownedBox; id++) {
                if (isCallDefaultCollection) {
                    const idCollection = (await contractPreSaleWithAcc.tokenOfOwnerByIndex(connectedAccount, id)).toNumber();
                    const boxType = await contractPreSaleWithAcc.boxes(idCollection);
                    const idBoxType = boxType.subBoxId.toNumber();
                    const infoBox = subBoxes.find((b, subBoxId) => subBoxId === idBoxType);
                    const collection = infoBox && { ...infoBox, idCollection };
                    collection && arrCollections.push(collection);
                } else {
                    const idCollection = await Erc721contract.methods.tokenOfOwnerByIndex(connectedAccount, id).call();
                    const tokenURI = await Erc721contract?.methods.tokenURI(idCollection).call();
                    const collection: ObjectType<any> = {
                        idCollection: idCollection
                    };
                    try {
                        const infoBoxType = (await axios.get(tokenURI)).data;
                        Object.assign(collection, infoBoxType);
                        collection.icon = infoBoxType.image;
                        collection.price = infoBoxType.price;
                    } catch (error) {
                        collection.icon = 'default.img';
                    }
                    arrCollections.push(collection);
                }
            }
            setCollections(arrCollections);
        } catch (error) {
            console.log('error', error)
            console.error('Something went wrong when show collections');
        } finally {
            setLoadingCollection(false);
        }
    }

    const handleRefreshCollection = () => {
        setRecallMyBox(true);
    }

    useEffect(() => {

        if (ownedBox > 0 && subBoxes.length) {
            handleSetCollections(ownedBox);
        }
    }, [ownedBox, subBoxes.length]);

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
            handleRefreshCollection();
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
    const [isRedirectCompetition, setRedirectCompetition] = useState(false);
    useEffect(() => {
        if (countdown.isWhitelist || countdown.isUpcoming) {
            setRedirectCompetition(false);
        }
    }, [connectedAccount, countdown]);
    const onJoinCompetition = (link: string) => {
        setRedirectCompetition(true);
        window.open(link);
    }
    const [recallBoxOrdered, setRecallBoxOrdered] = useState(true);
    const { data: boxesOrdered = {} as any, loading: loadingBoxOrdered } = useFetchV1<boolean>(`/pool/${infoTicket?.id}/nft-order?wallet_address=${connectedAccount}`, !!(connectedAccount && 'id' in infoTicket) && recallBoxOrdered);
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

    useEffect(() => {
        if (getMaxTicketBuy(myBoxThisPool, maxBoxCanBuy)) {
            setNumBoxBuy(1);
        }
    }, [myBoxThisPool, maxBoxCanBuy])

    const renderMsg = () => {
        if (
            connectedAccount && infoTicket.min_tier > 0 && !loadingUserTier && _.isNumber(userTier) && (userTier < infoTicket.min_tier)
        ) {
            return <WrapperAlert>
                <span>You haven't achieved min rank ({TIERS[infoTicket.min_tier]?.name}) to apply for Whitelist yet. To upgrade your Rank, please click <Link to="/account?tab=rank" className="text-weight-600 text-white link">here</Link></span></WrapperAlert>
        }
        if ((alreadyJoinPool || joinPoolSuccess) && countdown.isWhitelist) {
            return <WrapperAlert type="info">
                You have successfully applied whitelist.
                {timelinePool.freeBuyTime ? ' Please stay tuned, you can buy from Phase 1' : ' Please stay tuned and wait until time to buy Mystery boxes'}
            </WrapperAlert>
        }
        if ((alreadyJoinPool || joinPoolSuccess) && (countdown.isSale || countdown.isUpcomingSale)) {
            return <WrapperAlert type="info">
                Congratulations! You have successfully applied whitelist and can buy Mystery boxes
            </WrapperAlert>
        }
        if ((!loadingJoinpool && connectedAccount && (countdown.isSale || countdown.isUpcomingSale)) && !countdown.isPhase2 && !alreadyJoinPool) {
            return <WrapperAlert type="error">
                You have not applied whitelist.
                {(timelinePool.freeBuyTime && !countdown.isPhase2) ? ' Please stay tuned, you can buy from Phase 2' : ' Please stay tuned and join other pools'}
            </WrapperAlert>
        }
    }

    const [listCurrencies, setListCurrencies] = useState<ObjectType<any>[]>([]);
    useEffect(() => {
        if (boxTypeSelected.currency_ids && infoTicket.acceptedTokensConfig?.length) {
            const idsAllowed = boxTypeSelected.currency_ids.split(',').map((id: string) => id.trim());
            const acceptedTokensConfig: ObjectType<any> = infoTicket.acceptedTokensConfig
                .filter((t: any, id: number) => idsAllowed.includes(id + ''))
            const list = acceptedTokensConfig.map((t: ObjectType<any>) => ({
                ...t,
                style: {
                    background: `linear-gradient(${Math.floor(Math.random() * 360)}deg, rgba(255,0,0,1), rgba(255,0,0,0) 70.71%),
                linear-gradient(${Math.floor(Math.random() * 360)}deg, rgba(0,255,0,1), rgba(0,255,0,0) 70.71%),
                linear-gradient(${Math.floor(Math.random() * 360)}deg, rgba(0,0,255,1), rgba(0,0,255,0) 70.71%)`,
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                }
            }));
            setListCurrencies(list);
        }
    }, [infoTicket, boxTypeSelected.id]);

    const [cachedDecimals, setCachedDecimals] = useState<ObjectType<string>>({});
    const onSelectToken = async (token: ObjectType<any>) => {
        if (token.address === tokenSeletected.address && token.id === tokenSeletected.id) return;
        token.neededApprove = !(new BigNumber(token.address).isZero());
        if (token.neededApprove) {
            let decimals = cachedDecimals[token.address];
            if (!decimals) {
                const networkInfo = getNetworkInfo(infoTicket.network_available);
                const erc20Contract = getContractInstance(Erc20Abi, token.address, connectorName, networkInfo?.id);
                decimals = erc20Contract ? await erc20Contract.methods.decimals().call() : null;
                setCachedDecimals(c => ({ ...c, [token.address]: decimals }));
            }
            token.decimals = decimals;
        }
        setTokenSelected(token);
        setTokenToApprove(token as TokenType & ObjectType<any>);
    }
    useEffect(() => {
        if (listCurrencies.length) {
            const token = listCurrencies[0];
            onSelectToken(token);
        }
    }, [listCurrencies])

    const [isApproving, setIsApproving] = useState(false);

    const { retrieveTokenAllowance, tokenAllowanceLoading } = useTokenAllowance();

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

    const handleTokenApprove = async () => {
        try {
            if (isApproving) return;
            setIsApproving(true);
            await approveToken();
            if (infoTicket.campaign_hash && connectedAccount && tokenToApprove) {
                const numAllowance = await retrieveTokenAllowance(
                    tokenToApprove,
                    connectedAccount,
                    infoTicket.campaign_hash
                );
                setTokenAllowance(numAllowance);
                setIsApproving(false);
            }
        } catch (err) {
            console.log('err', err)
            // dispatch(alertFailure('Hmm, Something went wrong. Please try again'));
            setIsApproving(false);
        }
    };

    const getTokenAllowance = useCallback(async () => {
        if (infoTicket.campaign_hash && connectedAccount && tokenToApprove?.neededApprove) {
            const numAllowance = await retrieveTokenAllowance(
                tokenToApprove,
                connectedAccount,
                infoTicket.campaign_hash
            );
            setTokenAllowance(numAllowance);
        }
    }, [
        connectedAccount,
        tokenToApprove,
        infoTicket.campaign_hash,
        retrieveTokenAllowance,
    ]);

    useEffect(() => {
        connectedAccount &&
            infoTicket.campaign_hash &&
            getTokenAllowance();
    }, [connectedAccount, infoTicket.campaign_hash, getTokenAllowance]);

    const isAccApproved = (tokenAllowance: number) => {
        return +tokenAllowance > 0;
    };

    const disabledBuyNow = !allowNetwork.ok || +numBoxBuy < 1 || !isKYC || lockWhenBuyBox || !connectedAccount || loadingUserTier || !_.isNumber(userTier) || (infoTicket?.min_tier > 0 && (userTier < infoTicket.min_tier));
    const isShowBtnApprove = allowNetwork.ok && countdown?.isSale && connectedAccount && !tokenAllowanceLoading && tokenAllowance !== undefined && !isAccApproved(tokenAllowance as number) && tokenToApprove?.neededApprove;
    const isShowBtnBuy =
        (connectedAccount && !checkingKyc && !loadingJoinpool && countdown.isSale && ((countdown.isPhase1 && (alreadyJoinPool || joinPoolSuccess)) || countdown.isPhase2)) &&
        (!tokenSeletected.neededApprove || (tokenSeletected.neededApprove && isAccApproved(tokenAllowance as number)));

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
                    <ModalConfirmBuyBox open={openModalConfirmBuyBox} onClose={onCloseModalConfirmBuyBox} onConfirm={onBuyBox}
                        infoBox={infoTicket}
                        isLoadingButton={lockWhenBuyBox}
                        amount={numBoxBuy}
                        boxTypeSelected={boxTypeSelected}
                        tokenSeletected={tokenSeletected}
                        isClaimedBoxSuccess={isClaimedBoxSuccess}
                    />
                    <div className={styles.content}>
                        {
                            !connectedAccount && <WrapperAlert>
                                Please connect to wallet
                            </WrapperAlert>
                        }
                        {/* {
                            countdown.isWhitelist && connectedAccount && !loadingTicket && infoTicket.min_tier > 0 && !loadingUserTier && _.isNumber(userTier) && (userTier < infoTicket.min_tier) && <WrapperAlert>
                                <span>You haven't achieved min rank ({TIERS[infoTicket.min_tier]?.name}) to apply for Whitelist yet. To upgrade your Rank, please click <Link to="/account?tab=rank" className="text-weight-600 text-white link">here</Link></span>
                            </WrapperAlert>
                        } */}
                        {
                            renderMsg()
                        }
                        {/* {(alreadyJoinPool || joinPoolSuccess) && countdown.isWhitelist && <WrapperAlert type="info">
                            Congratulations! You have successfully applied whitelist.
                        </WrapperAlert>} */}
                        {/* {(alreadyJoinPool || joinPoolSuccess) && (countdown.isSale || countdown.isUpcomingSale) && <WrapperAlert type="info">
                            Congratulations! You have successfully applied whitelist and can buy Mystery boxes
                        </WrapperAlert>} */}
                        {/* {
                            (!loadingJoinpool && connectedAccount && countdown.isSale && !countdown.isPhase2) &&
                            ((alreadyJoinPool) ? null : <WrapperAlert type="error"> Sorry, you didn’t apply whitelist. </WrapperAlert>)
                        } */}
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
                                        {!countdown.isFinished && countdown.date1 && countdown.date2 && <CountDownTimeV1 time={countdown} className={"countdown"} onFinish={onSetCountdown} />}
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
                                                {/* <img className="icon" src={`/images/icons/${(infoTicket.network_available || '').toLowerCase()}.png`} alt="" /> */}
                                                {/* <span className="text-uppercase">{infoTicket.token_conversion_rate} {getCurrencyByNetwork(infoTicket.network_available)}</span> */}
                                                <div className={`wrapperIcon-${tokenSeletected.name}`} style={{ position: 'relative' }}>
                                                    <img className="icon" src={tokenSeletected.icon} onLoad={(e: any) => {
                                                        e.target.style.display = 'block';
                                                        const wrapperImg = document.querySelector(`.wrapperIcon-${tokenSeletected.name}`) as any;
                                                        wrapperImg.style = {};
                                                    }} alt=""
                                                        onError={(e: any) => {
                                                            e.target.style.display = 'none';
                                                            const wrapperImg = document.querySelector(`.wrapperIcon-${tokenSeletected.name}`) as any;
                                                            for (const p in tokenSeletected.style) {
                                                                wrapperImg.style[p as any] = tokenSeletected.style[p];
                                                            }
                                                            wrapperImg.style.width = '24px';
                                                            wrapperImg.style.height = '24px';
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-uppercase">{tokenSeletected.price} {tokenSeletected.name}/Box</span>

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
                                                        <span>{numberWithCommas(getRemainingBox() + '')}</span>
                                                    </div>
                                                }
                                                <div className="item">
                                                    <label className="label text-uppercase">supported</label>
                                                    <span className="text-uppercase icon"> {infoTicket.network_available && <img src={`/images/icons/${(infoTicket.network_available || '').toLowerCase()}.png`} className="icon" alt="" />} {infoTicket.network_available}</span>
                                                </div>
                                                <div className="item" >
                                                    <label className="label text-uppercase">MIN RANK</label>
                                                    {infoTicket.min_tier > 0 ? <span className="icon" style={{ gridTemplateColumns: '22px auto' }}><img src={TIERS[infoTicket.min_tier].icon} className="icon" alt="" style={{ width: "22px", height: "20px" }} /> {TIERS[infoTicket.min_tier].name}</span>
                                                        : <span>No Required</span>
                                                    }
                                                </div>
                                            </div>
                                            <div className="box-type-wrapper">
                                                <h4 className="text-uppercase">Currency</h4>
                                                <Box className="box-types" gridTemplateColumns="repeat(auto-fill, minmax(80px,1fr)) !important">
                                                    {
                                                        (listCurrencies).map((t: any, idx: number) => <Box key={t.address} onClick={() => onSelectToken(t)} gridTemplateColumns="20px auto !important" className={clsx("box-type", { active: t.address === tokenSeletected.address })}>
                                                            <div className={`wrapperImg-${idx}`} style={{ position: 'relative' }}>
                                                                <img src={t.icon} className="icon" alt="" style={{ width: '20px', height: '20px' }}
                                                                    onError={(e: any) => {
                                                                        e.target.style.visibility = 'hidden';
                                                                        const wrapperImg = document.querySelector(`.wrapperImg-${idx}`) as any;
                                                                        for (const p in t.style) {
                                                                            wrapperImg.style[p as any] = t.style[p];
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <span>{t.name}</span>
                                                        </Box>)
                                                    }
                                                </Box>
                                            </div>
                                            <div className="box-type-wrapper">
                                                <h4 className="text-uppercase">TYPE</h4>
                                                <div className="box-types">
                                                    {
                                                        (subBoxes).map((t: any) => <div key={t.id} onClick={() => onSelectBoxType(t)} className={clsx("box-type type", { active: t.id === boxTypeSelected.id })}>
                                                            <div className="wrapper-icon">
                                                                <img src={t.icon} className="icon" alt="" />
                                                            </div>
                                                            <span>
                                                                {t.name} <br />
                                                                {t.totalSold || 0}/{t.maxSupply || t.limit}
                                                            </span>
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
                                                        disabledMin={!getMaxTicketBuy(myBoxThisPool, maxBoxCanBuy) || numBoxBuy === 1}
                                                        disabledSub={!getMaxTicketBuy(myBoxThisPool, maxBoxCanBuy) || numBoxBuy === 0}
                                                        disabledAdd={!getMaxTicketBuy(myBoxThisPool, maxBoxCanBuy) || numBoxBuy === getMaxTicketBuy(myBoxThisPool, maxBoxCanBuy)}
                                                        disabledMax={!getMaxTicketBuy(myBoxThisPool, maxBoxCanBuy) || numBoxBuy === getMaxTicketBuy(myBoxThisPool, maxBoxCanBuy)}
                                                    />
                                                    <div className="bought" >
                                                        <h4 className="text-uppercase">BOUGHT/MAX</h4>
                                                        <span className={styles.textBold}>
                                                            {myBoxThisPool}/{maxBoxCanBuy || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            }

                                            {
                                                (countdown.isWhitelist || countdown.isUpcoming) && !loadingJoinpool && <>
                                                    {
                                                        !isRedirectCompetition && +infoTicket.is_private === 3 && infoTicket.socialRequirement?.gleam_link && !alreadyJoinPool && !joinPoolSuccess ?
                                                            <ButtonBase color="red"
                                                                onClick={() => onJoinCompetition(infoTicket.socialRequirement.gleam_link)}
                                                                isLoading={isApplyingWhitelist}
                                                                className="mt-0-important text-transform-unset w-full">
                                                                Join Competition
                                                            </ButtonBase> :
                                                            (connectedAccount && !checkingKyc && !alreadyJoinPool && !joinPoolSuccess) &&
                                                            <ButtonBase color="green"
                                                                onClick={countdown.isWhitelist ? onApplyWhitelist : undefined}
                                                                isLoading={isApplyingWhitelist}
                                                                disabled={countdown.isUpcoming || alreadyJoinPool || poolJoinLoading || isApplyingWhitelist || !isKYC || (_.isNumber(userTier) && (userTier < infoTicket.min_tier))}
                                                                className="mt-0-important text-transform-unset w-full">
                                                                {(alreadyJoinPool) ? 'Applied Whitelist' : 'Apply Whitelist'}
                                                            </ButtonBase>
                                                    }
                                                </>
                                            }
                                            {
                                                (connectedAccount && !checkingKyc && !loadingBoxOrdered && !loadingJoinpool && (alreadyJoinPool || joinPoolSuccess)) && countdown.isWhitelist &&
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
                                                isShowBtnApprove &&
                                                <ButtonBase
                                                    color="green"
                                                    isLoading={isApproving}
                                                    disabled={isApproving}
                                                    onClick={handleTokenApprove}
                                                    className="mt-0-important text-transform-unset w-full">
                                                    Approve
                                                </ButtonBase>
                                            }

                                            {
                                                isShowBtnBuy && !!getRemainingBox() &&
                                                <ButtonBase
                                                    color="green"
                                                    isLoading={lockWhenBuyBox}
                                                    disabled={disabledBuyNow}
                                                    onClick={(alreadyJoinPool || joinPoolSuccess || countdown.isPhase2) && isKYC ? onShowModalConfirmBuyBox : undefined}
                                                    className="mt-0-important text-transform-unset w-full">
                                                    Buy Now
                                                </ButtonBase>
                                            }
                                            {
                                                <div className={clsx(styles.infoTicket, styles.finished)}>
                                                    {countdown.isFinished && <div className="img-finished">
                                                        <img src={"/images/finished.png"} alt="" />
                                                    </div>}
                                                    {!loadingTicket && !getRemainingBox() && (
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
                                defaultTab={1}
                                ownedBox={ownedBox}
                                collections={loadingCollection ? [] : collections}
                                loadingCollection={loadingCollection}
                                handleRefreshCollection={handleRefreshCollection}
                                boxTypeSelected={boxTypeSelected}
                            />
                        </div>
                    </div>
                </>
            }
        </>
    );
}
export default MysteryBox;
