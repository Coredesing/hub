import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import useStyles, { useAuctionBoxStyles, useMysteyBoxStyles } from "./style";
import { AboutMysteryBox } from "./About";
import { getTimelineOfPool, isImageFile, isVideoFile } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import {
    APP_NETWORKS_SUPPORT,
} from "../../constants/network";
import useKyc from "../../hooks/useKyc";
import useAuth from "../../hooks/useAuth";
import { AlertKYC } from "../../components/Base/AlertKYC";
import useTokenAllowance from "../../hooks/useTokenAllowance";
import useTokenApprove from "../../hooks/useTokenApprove";
import axios from "../../services/axios";
import { alertFailure } from "../../store/actions/alert";
import { HashLoader } from "react-spinners";
import { numberWithCommas } from "../../utils/formatNumber";
import { WrapperAlert } from "../../components/Base/WrapperAlert";
import { pushMessage } from "../../store/actions/message";
import { TimelineType, TokenType } from "./types";
import Image from "../../components/Base/Image";
import usePoolJoinAction from './hooks/usePoolJoinAction';
import { ButtonBase } from "@base-components/Buttons";
import CountDownTimeV1, { CountDownTimeType as CountDownTimeTypeV1 } from "@base-components/CountDownTime";
import _ from 'lodash';
import { getUserTier } from "@store/actions/sota-tiers";
import { Link } from "react-router-dom";
import { TIERS } from "@app-constants";
import useClaimBox from "./hooks/useClaimBox";
import { getContract } from "@utils/contract";
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
import AuctionPoolAbi from '@abi/AuctionPool.json';
import useAuctionBox from './hooks/useAuctionBox';
import DialogTxSubmitted from "@base-components/DialogTxSubmitted";
import { utils } from "ethers";
import { AboutAuctionBox } from "./components/AboutAuctionBox";

const AuctionBox = ({ id, infoTicket, ...props }: any) => {
    const styles = useStyles();
    const mysteryStyles = useMysteyBoxStyles();
    const auctionBoxStyles = useAuctionBoxStyles();
    const dispatch = useDispatch();
    const { connectedAccount, wrongChain /*isAuth*/ } = useAuth();
    const connectorName = useTypedSelector(state => state.connector).data;
    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const { data: userTier, loading: loadingUserTier } = useSelector((state: any) => state.userTier);
    const [currencyPool, setCurrencyPool] = useState<TokenType & ObjectType<any> | undefined>();
    const [lastBidder, setLastBidder] = useState<null | { wallet: string, amount: string, currency: string }>(null);
    const [resetLastBidder, setResetLastBidder] = useState(true);
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
            const timeLine = getTimelineOfPool(infoTicket);
            if (timeLine.startJoinPooltime > Date.now()) {
                setCountdown({ date1: timeLine.startJoinPooltime, date2: Date.now(), title: 'Whitelist Opens In', isUpcoming: true });
            }
            else if (timeLine.endJoinPoolTime > Date.now()) {
                setCountdown({ date1: timeLine.endJoinPoolTime, date2: Date.now(), title: 'Whitelist Closes In', isWhitelist: true });
            }
            else if (timeLine.startBuyTime > Date.now()) {
                setCountdown({ date1: timeLine.startBuyTime, date2: Date.now(), title: 'Auction Starts In', isUpcomingAuction: true });
            }
            else if (timeLine.finishTime > Date.now()) {
                setCountdown({ date1: timeLine.finishTime, date2: Date.now(), title: 'Auction Ends In', isAuction: true });
            }
            else {
                setCountdown({ date1: 0, date2: 0, title: 'Auction Ended', isFinished: true });
            }
        }
    }, [infoTicket]);

    useEffect(() => {
        if (infoTicket) {
            onSetCountdown();
        }
    }, [infoTicket])

    useEffect(() => {
        if (infoTicket?.acceptedTokensConfig?.length) {
            const handleSetToken = async () => {
                try {
                    const infoToken = infoTicket.acceptedTokensConfig[0]
                    infoToken.neededApprove = !(new BigNumber(infoToken.address).isZero());
                    if (infoToken.neededApprove) {
                        const networkInfo = getNetworkInfo(infoTicket.network_available);
                        const erc20Contract = getContractInstance(Erc20Abi, infoToken.address, connectorName, networkInfo?.id);
                        const decimals = erc20Contract ? await erc20Contract.methods.decimals().call() : null;
                        infoToken.decimals = decimals;
                    }
                    console.log('infoToken', infoToken);
                    setCurrencyPool(infoToken);
                } catch (error) {

                }
            }
            handleSetToken();
        }
    }, [infoTicket, connectorName])

    const [contractAuctionPool, setContractAuctionPool] = useState<any>();
    useEffect(() => {
        if (infoTicket?.campaign_hash) {
            const networkInfo = getNetworkInfo(infoTicket.network_available);
            const contract = getContractInstance(AuctionPoolAbi, infoTicket.campaign_hash, connectorName, networkInfo?.id);
            setContractAuctionPool(contract);
        }
    }, [infoTicket]);
    useEffect(() => {
        if (contractAuctionPool && resetLastBidder) {
            const getLastBidder = async () => {
                try {
                    const result = await contractAuctionPool.methods.lastBidder().call();
                    setLastBidder({
                        wallet: result.wallet,
                        currency: result.token,
                        amount: utils.formatEther(result.amount),
                    })
                    setResetLastBidder(false);
                    console.log('result', result);
                } catch (error) {

                }
            }
            getLastBidder();
        }
    }, [contractAuctionPool, resetLastBidder])

    const [rateEachBid, setRateEachBid] = useState<string>('');
    useEffect(() => {
        if(contractAuctionPool) {
            contractAuctionPool.methods.minBidIncrementPerMile().call().then((num: any) => {
                setRateEachBid(+(+num / 1000).toFixed(2) + '');
            })
        }
    }, [contractAuctionPool])

    // const [subBoxes, setSubBoxes] = useState<{ [k: string]: any }[]>([]);
    const [boxTypeSelected, setSelectBoxType] = useState<{ [k: string]: any }>({});
    useEffect(() => {
        if (infoTicket && infoTicket.boxTypesConfig?.length) {
            const boxes = infoTicket.boxTypesConfig.map((b: any, subBoxId: number) => ({ ...b, subBoxId }));
            setSelectBoxType(boxes[0]);
            // setSubBoxes(boxes)
        }
    }, [infoTicket])

    const [openModalPlaceBidBox, setOpenModalPlaceBidBox] = useState(false);
    const [openModalTx, setOpenModalTx] = useState(false);
    const onShowModalPlaceBidBox = () => {
        setOpenModalPlaceBidBox(true);
    }
    const onCloseModalPlaceBidBox = useCallback(() => {
        setOpenModalPlaceBidBox(false);
    }, []);

    const { auctionBox, auctionLoading, auctionSuccess, auctionTxHash } = useAuctionBox({
        poolId: infoTicket.id,
        poolAddress: infoTicket.campaign_hash,
        currencyInfo: currencyPool,
        subBoxId: boxTypeSelected?.subBoxId as number,
    });

    useEffect(() => {
        if (auctionTxHash) {
            setOpenModalTx(true);
        }
    }, [auctionTxHash])
    useEffect(() => {
        if (auctionSuccess) {
            onCloseModalPlaceBidBox();
            setResetLastBidder(true);
        }
    }, [auctionSuccess]);

    const onPlaceBid = useCallback(async (numberBox: number, captcha: string) => {
        auctionBox(numberBox, captcha);
    }, [infoTicket, connectedAccount, currencyPool]);

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
            currencyPool,
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
            if (infoTicket.campaign_hash && connectedAccount && currencyPool) {
                const numAllowance = await retrieveTokenAllowance(
                    currencyPool,
                    connectedAccount,
                    infoTicket.campaign_hash
                );
                setTokenAllowance(numAllowance);
                setIsApproving(false);
            }
        } catch (err) {
            console.log('err', err)
            setIsApproving(false);
        }
    };

    const getTokenAllowance = useCallback(async () => {
        if (infoTicket.campaign_hash && connectedAccount && currencyPool?.neededApprove) {
            const numAllowance = await retrieveTokenAllowance(
                currencyPool,
                connectedAccount,
                infoTicket.campaign_hash
            );
            setTokenAllowance(numAllowance);
        }
    }, [
        connectedAccount,
        currencyPool,
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

    const disabledBuyNow = !allowNetwork.ok || !isKYC || auctionLoading || !connectedAccount || loadingUserTier || !_.isNumber(userTier) || (infoTicket?.min_tier > 0 && (userTier < infoTicket.min_tier));
    const isShowBtnApprove = allowNetwork.ok && countdown?.isAuction && connectedAccount && !tokenAllowanceLoading && tokenAllowance !== undefined && !isAccApproved(tokenAllowance as number) && currencyPool?.neededApprove;
    const isShowBtnBuy = connectedAccount && !checkingKyc && countdown.isAuction && isAccApproved(tokenAllowance as number);

    return (
        <>
            <DialogTxSubmitted
                transaction={auctionTxHash}
                open={openModalTx}
                onClose={() => setOpenModalTx(false)}
                networkName={allowNetwork.shortName}
            />
            <AuctionBoxModal
                open={openModalPlaceBidBox}
                onClose={onCloseModalPlaceBidBox}
                onClick={onPlaceBid}
                bidInfo={infoTicket}
                token={currencyPool}
                auctionLoading={auctionLoading}
                lastBidder={lastBidder}
                rateEachBid={rateEachBid}
                currencyPool={currencyPool}
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
                                        <h3 className="text-uppercase font-rajdhani-imp" style={{ fontSize: '34px' }}>
                                            {infoTicket.title || infoTicket.name}
                                        </h3>
                                        <h4 className="text-uppercase font-rajdhani-imp" style={{ fontSize: '14px', fontWeight: 200 }}>
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
                                                <label className="label text-uppercase font-rajdhani-imp">supported</label>
                                                <span className="text-uppercase icon font-poppins-imp items-center"> {infoTicket.network_available && <img src={`/images/icons/${(infoTicket.network_available || '').toLowerCase()}.png`} className="icon" alt="" />} {infoTicket.network_available}</span>
                                            </div>
                                            <div className="item" >
                                                <label className="label text-uppercase font-rajdhani-imp">MIN RANK</label>
                                                {infoTicket.min_tier > 0 ? <span className="icon font-poppins-imp items-center" style={{ gridTemplateColumns: '22px auto' }}><img src={TIERS[infoTicket.min_tier].icon} className="icon" alt="" style={{ width: "22px", height: "20px" }} /> {TIERS[infoTicket.min_tier].name}</span>
                                                    : <span className="font-poppins-imp">No Required</span>
                                                }
                                            </div>
                                        </div>
                                        <div className="detail-items" style={{ marginBottom: '33px', gridTemplateColumns: '1fr 1fr', }}>
                                            {
                                                !lastBidder && <div className="box-type-wrapper">
                                                    <h4 className="text-uppercase">Starting PRICE</h4>
                                                    <div className={mysteryStyles.currency}>
                                                        {
                                                            currencyPool?.name && <img className="icon" src={`/images/icons/${(currencyPool.name || '').toLowerCase()}.png`} alt="" />
                                                        }
                                                        <span className="text-uppercase font-rajdhani-imp">{+currencyPool?.price || ''} {currencyPool?.name}</span>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                lastBidder && <div className="box-type-wrapper">
                                                    <h4 className="text-uppercase">Highest Bid</h4>
                                                    <div className={mysteryStyles.currency}>
                                                        {
                                                            currencyPool?.name && <img className="icon" src={`/images/icons/${(currencyPool.name || '').toLowerCase()}.png`} alt="" />
                                                        }
                                                        <span className="text-uppercase font-rajdhani-imp">{+lastBidder?.amount || ''} {currencyPool?.name}</span>
                                                    </div>
                                                </div>
                                            }
                                            {/* {
                                                lastBidder && lastBidder.wallet === connectedAccount && <div className="box-type-wrapper">
                                                    <h4 className="text-uppercase">Your Bid</h4>
                                                    <div className={mysteryStyles.currency}>
                                                        {
                                                            currencyPool?.name && <img className="icon" src={`/images/icons/${(currencyPool.name || '').toLowerCase()}.png`} alt="" />
                                                        }
                                                        <span className="text-uppercase font-rajdhani-imp">{+lastBidder?.amount || ''} {currencyPool?.name}</span>
                                                    </div>
                                                </div>
                                            } */}
                                        </div>
                                    </div>
                                    <div>
                                        <div className={auctionBoxStyles.wrapperCountdown}>
                                            <h4 className="text-uppercase font-rajdhani-imp">{countdown.title}</h4>
                                            {!countdown.isFinished && countdown.date1 && countdown.date2 && <CountDownTimeV1 time={countdown} className={"countdown font-rajdhani-imp"} onFinish={onSetCountdown} />}
                                        </div>

                                        {
                                            isShowBtnApprove &&
                                            <ButtonBase
                                                color="green"
                                                isLoading={isApproving}
                                                disabled={isApproving}
                                                onClick={handleTokenApprove}
                                                className={clsx("w-full font-rajdhani-imp text-uppercase bold-imp", auctionBoxStyles.mt50px)}
                                            >
                                                Approve
                                            </ButtonBase>
                                        }
                                        {
                                            isShowBtnBuy &&
                                            <ButtonBase
                                                color="green"
                                                isLoading={auctionLoading}
                                                disabled={disabledBuyNow}
                                                onClick={onShowModalPlaceBidBox}
                                                className={clsx("w-full font-rajdhani-imp text-uppercase bold-imp", auctionBoxStyles.mt50px)}>
                                                Place a Bid
                                            </ButtonBase>
                                        }
                                        {
                                            countdown.isFinished &&
                                            <ButtonBase
                                                color="grey"
                                                className={clsx("w-full font-rajdhani-imp text-uppercase bold-imp", auctionBoxStyles.mt50px)}>
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
                    <AboutAuctionBox
                        info={infoTicket}
                        defaultTab={1}
                        contractAuctionPool={contractAuctionPool}
                    />
                </div>
            </div>
        </>
    );
}
export default AuctionBox;
