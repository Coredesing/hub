import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import useStyles, { useAuctionBoxStyles, useMysteyBoxStyles } from "./style";
import { AboutMysteryBox } from "./About";
import { getTimelineOfPool, isImageFile, isVideoFile } from "../../utils";
import { Progress } from "@base-components/Progress";
import { useFetchV1 } from "../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import {
    APP_NETWORKS_SUPPORT,
} from "../../constants/network";
import useKyc from "../../hooks/useKyc";
import useAuth from "../../hooks/useAuth";
import { AlertKYC } from "../../components/Base/AlertKYC";
import { calcProgress, getBalance } from "./utils";
import useTokenAllowance from "../../hooks/useTokenAllowance";
import useTokenApprove from "../../hooks/useTokenApprove";
import TicketModal from "./TicketModal";
import axios from "../../services/axios";
import { alertFailure } from "../../store/actions/alert";
import { HashLoader } from "react-spinners";
import { numberWithCommas } from "../../utils/formatNumber";
import { WrapperAlert } from "../../components/Base/WrapperAlert";
import { pushMessage } from "../../store/actions/message";
import { TimelineType, TokenType } from "./types";
import { AscDescAmountBox } from "./components/AscDescAmountBox";
import Image from "../../components/Base/Image";
import usePoolJoinAction from './hooks/usePoolJoinAction';
import { ButtonBase } from "@base-components/Buttons";
import CountDownTimeV1, { CountDownTimeType as CountDownTimeTypeV1 } from "@base-components/CountDownTime";
import { BaseRequest } from "../../request/Request";
import ModalOrderBox from './components/ModalOrderBox';
import useOrderBox from "./hooks/useOrderBox";
import ModalConfirmBuyBox from "./components/ModalConfirmBuyBox";
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
import TicketBidModal from "./TicketBidModal";
import AuctionBoxModal from "./components/AuctionBoxModal";

const AuctionBox = ({ id, infoTicket, ...props }: any) => {
    const styles = useStyles();
    const mysteryStyles = useMysteyBoxStyles();
    const auctionBoxStyles = useAuctionBoxStyles();
    const dispatch = useDispatch();
    const { library } = useWeb3React();
    const { connectedAccount, wrongChain /*isAuth*/ } = useAuth();
    const connectorName = useTypedSelector(state => state.connector).data;
    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const [numBoxBuy, setNumBoxBuy] = useState<number>(0);
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

    // useEffect(() => {
    //     dispatch(setTypeIsPushNoti({ failed: false }));
    // }, [dispatch]);
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

    const [countdown, setCountdown] = useState<CountDownTimeTypeV1 & { title: string, [k: string]: any }>({ date1: 0, date2: 0, title: '' });
    const { checkingKyc, isKYC } = useKyc(connectedAccount, (_.isNumber(infoTicket?.kyc_bypass) && !infoTicket?.kyc_bypass));
    const onSetCountdown = useCallback(() => {
        if (infoTicket) {
            setCountdown({ date1: Date.now() + 1000 * 6000, date2: Date.now(), title: 'Auction starts in', isComing: true });
        }
    }, [infoTicket]);

    useEffect(() => {
        if (infoTicket) {
            onSetCountdown();
        }
    }, [infoTicket])

    const [recallMybox, setRecallMyBox] = useState(true);
    const [ownedBox, setOwnedBox] = useState(0);
    const [openModal, setOpenModalTx] = useState(false);
    const onCloseModal = useCallback(() => {
        setOpenModalTx(false);
    }, [setOpenModalTx]);


    const eventId = 0;
    const { claimBox, claimBoxLoading, claimTransactionHash, isClaimedBoxSuccess } = useClaimBox({
        poolAddress: infoTicket.campaign_hash,
        poolId: infoTicket.id,
        eventId,
        subBoxId: 1,

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
                    infoTicket.token,
                    infoTicket.network_available,
                    infoTicket.accept_currency
                );
                setOwnedBox(+myNumBox || 0);
                setRecallMyBox(false);
            } catch (error) {
                console.log(error);
            }
        };
        recallMybox && infoTicket?.token && getMyNumBox();
    }, [connectedAccount, infoTicket, recallMybox]);

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

    useEffect(() => {
        if (infoTicket?.campaign_hash && contractPreSale) {
            contractPreSale.methods.saleEvents(eventId).call().then((res: any) => {
                const totalBought = res.currentSupply ? res.currentSupply : 0;
                setTotalBoxesBought(totalBought);
            }).catch((err: any) => {
                console.log('err', err);
            })
        }
    }, [infoTicket, contractPreSale]);
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
            const callWithExternalApi = !!infoTicket.use_external_api;
            const handleInfoTokenExternal = async (idCollection: number, collection: ObjectType<any>) => {
                const tokenURI = await Erc721contract?.methods.tokenURI(idCollection).call();
                collection.idCollection = idCollection;
                const infoBoxType = (await axios.get(tokenURI)).data;
                Object.assign(collection, infoBoxType);
                collection.icon = infoBoxType.image;
                collection.price = infoBoxType.price;
                return collection;
            }
            if (callWithExternalApi) {
                const result = await axios.get(`pool/owner/${infoTicket.token}?wallet=${connectedAccount}&limit=100`);
                const arr = result.data.data?.data || [];
                for (let i = 0; i < arr.length; i++) {
                    const idCollection = arr[i]?.token_id;
                    const collection: ObjectType<any> = {
                        idCollection
                    };
                    try {
                        handleInfoTokenExternal(idCollection, collection);
                    } catch (error) {
                        console.log('err', error);
                    }
                    arrCollections.push(collection);
                }
            } else {
                for (let id = 0; id < ownedBox; id++) {
                    if (isCallDefaultCollection) {
                        try {
                            const collection: ObjectType<any> = {};
                            const idCollection = (await contractPreSaleWithAcc.tokenOfOwnerByIndex(connectedAccount, id)).toNumber();
                            const boxType = await contractPreSaleWithAcc.boxes(idCollection);
                            const idBoxType = boxType.subBoxId.toNumber();
                            const infoBox = subBoxes.find((b, subBoxId) => subBoxId === idBoxType);
                            infoBox && Object.assign(collection, infoBox);
                            collection.idCollection = idCollection;
                            arrCollections.push(collection);
                        } catch (error) {
                            console.log('error', error);
                        }
                    } else {
                        const collection: ObjectType<any> = {};
                        try {
                            const idCollection = await Erc721contract.methods.tokenOfOwnerByIndex(connectedAccount, id).call();
                            handleInfoTokenExternal(idCollection, collection);
                            arrCollections.push(collection);
                        } catch (error) {
                            console.log('error', error)
                        }
                    }
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
            onCloseModalPlaceBidBox();
        }
    }, [claimBoxLoading]);

    useEffect(() => {
        if (claimTransactionHash) {
            onCloseModalPlaceBidBox();
            setOpenModalTx(true);
        }
    }, [claimTransactionHash]);

    useEffect(() => {
        if (isClaimedBoxSuccess) {

            setNumBoxBuy(0);
            handleRefreshCollection();
        }
    }, [isClaimedBoxSuccess]);

    const [openModalOrderBox, setOpenModalOrderBox] = useState(false);
    const onShowModalOrderBox = () => {
        setOpenModalOrderBox(true);
    }
    const onCloseModalOrderBox = useCallback(() => {
        setOpenModalOrderBox(false);
    }, []);

    const [openModalPlaceBidBox, setOpenModalPlaceBidBox] = useState(false);
    const onShowModalPlaceBidBox = () => {
        setOpenModalPlaceBidBox(true);
    }
    const onCloseModalPlaceBidBox = useCallback(() => {
        setOpenModalPlaceBidBox(false);
    }, []);

    const { orderBox, orderBoxLoading, statusOrderBox } = useOrderBox({ poolId: infoTicket.id, });
    useEffect(() => {
        if (statusOrderBox) {
            setOpenModalOrderBox(false);
            onCloseModalOrderBox();
        }
    }, [statusOrderBox]);

    const onPlaceBid = useCallback(async (numberBox: number) => {
        orderBox(numberBox)
    }, [infoTicket, connectedAccount]);

    const renderMsg = () => {
        if (!connectedAccount) return (<WrapperAlert>
            Please connect to wallet
        </WrapperAlert>)
        if (
            connectedAccount && infoTicket.min_tier > 0 && !loadingUserTier && _.isNumber(userTier) && (userTier < infoTicket.min_tier)
        ) {
            return <WrapperAlert>
                <span>You haven't achieved min rank ({TIERS[infoTicket.min_tier]?.name}) to apply for Whitelist yet. To upgrade your Rank, please click <Link to="/account?tab=rank" className="text-weight-600 text-white link">here</Link></span></WrapperAlert>
        }
    }

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
    const isShowBtnBuy = connectedAccount && !checkingKyc && countdown.isSale && isAccApproved(tokenAllowance as number);

    return (
        <>
            <TicketModal
                open={openModal}
                onClose={onCloseModal}
                transaction={claimTransactionHash}
                networkName={infoTicket?.network_available}
            />
            <AuctionBoxModal
                open={openModalPlaceBidBox}
                onClose={onCloseModalPlaceBidBox}
                onClick={onPlaceBid}
                bidInfo={infoTicket}
                ownedBidStaked={{}}
                token={tokenToApprove}
            />
            <div className={styles.content}>
                {renderMsg()}
                {!isKYC && !checkingKyc && connectedAccount && (
                    <AlertKYC connectedAccount={connectedAccount} />
                )}

                <div className={styles.contentCard}>
                    <div className={styles.wrapperCard}>
                        <div className={styles.card} >
                            <div className={clsx(styles.cardImg, mysteryStyles.cardImg)} style={{ minHeight: '460px' }}>
                                {isImageFile(infoTicket.banner) && <Image src={infoTicket.banner} />}
                                {isVideoFile(infoTicket.banner) && <>
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
                                                <source src={infoTicket.banner} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </div>
                                </>
                                }
                            </div>
                            <div className={mysteryStyles.carBodyInfo} style={{ display: 'flex', flexDirection: 'column' }} >
                                <div>
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
                                </div>

                                <div className={mysteryStyles.cardBodyDetail} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div className="detail-items" style={{ marginBottom: '33px', gridTemplateColumns: 'repeat(auto-fill, 115px)', }}>
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
                                            <h4 className="text-uppercase">Listing PRICE</h4>
                                            <div className={mysteryStyles.currency}>
                                                <img className="icon" src={`/images/icons/${(infoTicket.network_available || '').toLowerCase()}.png`} alt="" />
                                                <span className="text-uppercase">0.5 BNB</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div >
                                        <div className={auctionBoxStyles.wrapperCountdown}>
                                            <h4>Auction starts in</h4>
                                            {!countdown.isFinished && countdown.date1 && countdown.date2 && <CountDownTimeV1 time={countdown} className={"countdown"} onFinish={onSetCountdown} />}
                                        </div>

                                        {
                                            isShowBtnApprove &&
                                            <ButtonBase
                                                color="green"
                                                isLoading={isApproving}
                                                disabled={isApproving}
                                                onClick={handleTokenApprove}
                                                className="mt-16px-imp text-transform-unset w-full">
                                                Approve
                                            </ButtonBase>
                                        }
                                        {
                                            // isShowBtnBuy &&
                                            <ButtonBase

                                                color="green"
                                                isLoading={lockWhenBuyBox}
                                                // disabled={disabledBuyNow}
                                                onClick={onShowModalPlaceBidBox}
                                                className="mt-16px-imp text-transform-unset w-full">
                                                Place a Bid
                                            </ButtonBase>
                                        }
                                        {
                                            countdown.isFinished &&
                                            <ButtonBase
                                                color="grey"
                                                className="mt-16px-imp text-transform-unset w-full">
                                                Auction End
                                            </ButtonBase>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.displayContent}>
                    <AboutMysteryBox
                        info={infoTicket}
                        defaultTab={1}
                        ownedBox={ownedBox}
                        collections={loadingCollection ? [] : collections}
                        loadingCollection={loadingCollection}
                        handleRefreshCollection={handleRefreshCollection}
                    />
                </div>
            </div>
        </>
    );
}
export default AuctionBox;
