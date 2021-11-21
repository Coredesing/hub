import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import useStyles, { useMarketplaceStyle } from "./style";
import { AboutMarketplaceNFT } from "./About";
import { apiRoute, cvtAddressToStar, getApproveToken, getCurrencyByNetwork, getDiffTime, getTimelineOfPool, isImageFile, isVideoFile } from "../../utils";
import { Progress } from "@base-components/Progress";
import { useFetchV1 } from "../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import {
    APP_NETWORKS_SUPPORT,
} from "../../constants/network";
import useKyc from "../../hooks/useKyc";
import useAuth from "../../hooks/useAuth";
import { AlertKYC } from "../../components/Base/AlertKYC";
import { HashLoader } from "react-spinners";
import { WrapperAlert } from "../../components/Base/WrapperAlert";
import { pushMessage } from "../../store/actions/message";
import Image from "../../components/Base/Image";
import CountDownTime, { CountDownTimeType as CountDownTimeTypeV1 } from "@base-components/CountDownTime";

import _ from 'lodash';
import { getUserTier } from "@store/actions/sota-tiers";
import { Link } from "react-router-dom";
import { TIERS } from "@app-constants";
import { getContract } from "@utils/contract";
import PreSaleBoxAbi from '@abi/PreSaleBox.json';
import { useWeb3React } from "@web3-react/core";
import BigNumber from 'bn.js';
import BN from 'bignumber.js';
import { ButtonBase } from "@base-components/Buttons";
import TransferNFTModal from "./components/TransferNFTModal";
import { alertFailure, alertSuccess, alertWarning } from "@store/actions/alert";
import ListingNFTModal from "./components/ListNFTModal";
import useTokenAllowance from "@hooks/useTokenAllowance";
import useTokenApprove from '@hooks/useTokenApprove';
import { getExplorerTransactionAddress, getNetworkInfo } from "@utils/network";
import { ObjectType } from "@app-types";
import axios from "@services/axios";
import { getContractInstance } from "@services/web3";
import erc721ABI from '@abi/Erc721.json';
import marketplaceABI from '@abi/Marketplace.json';
import {utils} from 'ethers'
import OfferNFTModal from "./components/OfferNFTModal";
const MARKETPLACE_SMART_CONTRACT = process.env.REACT_APP_MARKETPLACE_SMART_CONTRACT as string;

const MysteryBox = ({ id, projectAddress, ...props }: any) => {
    const styles = useStyles();
    const marketplaceStyle = useMarketplaceStyle();
    const dispatch = useDispatch();
    const { library } = useWeb3React();
    const { connectedAccount, wrongChain } = useAuth();
    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const [infoNFT, setInfoNFT] = useState<ObjectType<any>>({});
    const [addressOwnerNFT, setAddressOwnerNFT] = useState('');
    useEffect(() => {

        axios.get(`/marketplace/collection/${projectAddress}`).then(async (res) => {
            const infoProject = res.data.data;
            if (!infoProject) {
                return;
            }
            try {
                const contract = getContractInstance(erc721ABI, projectAddress, undefined, appChainID);
                if (!contract) return;
                const addressOwnerNFT = await contract.methods.ownerOf(id).call();
                setAddressOwnerNFT(addressOwnerNFT);
                console.log('addressOwner', addressOwnerNFT);
                const tokenURI = await contract.methods.tokenURI(id).call();
                console.log('infoNFT', infoNFT)
                const infoBoxType = (await axios.get(tokenURI)).data || {};
                setInfoNFT({
                    ...infoBoxType,
                    id: id,
                    project: infoProject,
                })
            } catch (error: any) {
                console.log('err', error)
            }
        })
    }, [id, projectAddress, appChainID])

    const [tokenOwner, setTokenOwner] = useState('');
    const [nftPrice, setNFTPrice] = useState('0');
    useEffect(() => {
        if (!appChainID || !MARKETPLACE_SMART_CONTRACT) return;

        const getTokenOnSale = async () => {
            try {
                const contract = getContractInstance(marketplaceABI, MARKETPLACE_SMART_CONTRACT, undefined, appChainID);
                console.log('contract', contract)
                if (!contract) return;
                const tokenOnSale = await contract.methods.tokensOnSale(projectAddress, id).call();
                console.log('tokenOnSale', tokenOnSale)
                setTokenOwner(tokenOnSale.tokenOwner);
                setNFTPrice(utils.formatEther(tokenOnSale.price))
            } catch (error) {
                console.log('er', error)
            }

        }
        getTokenOnSale();
    }, [id, appChainID, projectAddress])

    useEffect(() => {
        dispatch(getUserTier(!wrongChain && connectedAccount ? connectedAccount : ''));
    }, [wrongChain, connectedAccount, dispatch]);

    const [allowNetwork, setAllowNetwork] = useState<{ ok: boolean, [k: string]: any }>({ ok: false });
    useEffect(() => {
        // const networkInfo = APP_NETWORKS_SUPPORT[Number(appChainID)];
        const networkInfo = getNetworkInfo(infoNFT.project?.network)
        // if (!networkInfo || !infoNFT?.network_available) {
        //     return;
        // }
        const ok = String(networkInfo.name).toLowerCase() === (infoNFT.network || "").toLowerCase();
        // if (!ok) {
        //     dispatch(pushMessage(`Please switch to ${(infoNFT.network_available || '').toLocaleUpperCase()} network to do Apply Whitelist, Approve/Buy tokens.`))
        // } else {
        //     dispatch(pushMessage(''));
        // }
        setAllowNetwork(
            {
                ok,
                ...networkInfo,
            }
        );
    }, [infoNFT, appChainID, dispatch]);


    const [contractPreSale, setContractPreSale] = useState<any>();
    useEffect(() => {
        if (infoNFT?.campaign_hash && connectedAccount) {
            const contract = getContract(infoNFT.campaign_hash, PreSaleBoxAbi, library, connectedAccount as string);
            setContractPreSale(contract);
        }
    }, [infoNFT, connectedAccount])

    const tagTypes = ['Character', 'Sales'];
    const tagCategories = ['Fighting', 'Strategy'];

    const [openTransferModal, setOpenTransferModal] = useState(false);
    const onTransferNFT = (receiverAddress: string) => {
        dispatch(alertSuccess("Transfer succesfully to address: " + receiverAddress));
    }


    const [marketplaceContract, setMarketplaceContract] = useState<any>(null);
    useEffect(() => {
        if(!library || !connectedAccount) {
            setMarketplaceContract(null);
            return;
        }
        const contract = getContract(MARKETPLACE_SMART_CONTRACT, marketplaceABI, library, connectedAccount as string);
        setMarketplaceContract(contract);
    }, [library, connectedAccount]);
    const [openListingModal, setOpenListingModal] = useState(false);
    
    const [txHash, setTxHash] = useState('');
    const [openTxModal, setOpenTxModal] = useState(false);

    const handleTx = async (tx: any) => {
        dispatch(alertWarning("Request is processing!"));
        setTxHash(tx.hash)
        // setOpenTxModal(true)
        await tx.wait(1);
        dispatch(alertSuccess("Request Successful"));
    }

    const onListingNFT = async (price: number) => {
        try {
            if(!marketplaceContract) return;
            const tx = await marketplaceContract.list(id, projectAddress, new BN(price).multipliedBy(new BN(1e18)).toFixed(), '0x0000000000000000000000000000000000000000');
            handleTx(tx);
        } catch (error) {
            console.log('er', error)
        }
    }

    const onDelistNFT = async () => {
        if(!marketplaceContract) return;
        const tx = await marketplaceContract.delist(id, projectAddress);
        handleTx(tx);
    }
    const [openOfferModal, setOpenOfferModal] = useState(false);
    const onOfferNFT = async (offerPrice: number) => {
        if(!marketplaceContract) return;
        const options = {
            value: utils.parseEther(offerPrice + '')
        }
        const tx = await marketplaceContract.offer(id, projectAddress, new BN(offerPrice).multipliedBy(new BN(1e18)).toFixed(), '0x0000000000000000000000000000000000000000', options);
        handleTx(tx);
    }
    const onBuyNFT = async () => {
        if(!marketplaceContract) return;
        const options = {
            value: utils.parseEther(nftPrice + '')
        }
        const tx = await marketplaceContract.buy(id, projectAddress, new BN(nftPrice).multipliedBy(new BN(1e18)).toFixed(), '0x0000000000000000000000000000000000000000', options);
        handleTx(tx);
    }
    // const { library, account } = useWeb3React();
    const onApprove = async () => {
        if(!marketplaceContract) return;
        const tx = await marketplaceContract.setApprovalForAll(MARKETPLACE_SMART_CONTRACT, true);
        handleTx(tx);
    }

    const [isApproved, setApproved] = useState(false)
    useEffect(() => {
        if(!library || !connectedAccount) return;
        const checkApprove = async () => {
            try {
                const contract = getContract(projectAddress, erc721ABI, library, connectedAccount as string);
                const isApproved = await contract.isApprovedForAll(connectedAccount, MARKETPLACE_SMART_CONTRACT);
                setApproved(isApproved)
            } catch (error) {
                console.log('err', error)
            }
        }
        checkApprove();
    }, [projectAddress, library, connectedAccount])

    // const { retrieveTokenAllowance, tokenAllowanceLoading } = useTokenAllowance();

    // const tokenToApprove = getApproveToken(appChainID, infoNFT.accept_currency);

    // const { approveToken /*tokenApproveLoading, transactionHash*/ } =
    //     useTokenApprove(
    //         tokenToApprove,
    //         connectedAccount,
    //         infoNFT.campaign_hash,
    //         false
    //     );
    // const [tokenAllowance, setTokenAllowance] = useState<number | undefined>(
    //     undefined
    // );

    // const [isApproving, setIsApproving] = useState(false);
    // const handleTokenApprove = async () => {
    //     try {
    //         if (isApproving) return;
    //         setIsApproving(true);
    //         await approveToken();
    //         if (infoNFT.campaign_hash && connectedAccount && tokenToApprove) {
    //             setTokenAllowance(
    //                 (await retrieveTokenAllowance(
    //                     tokenToApprove,
    //                     connectedAccount,
    //                     infoNFT.campaign_hash
    //                 )) as number
    //             );
    //             setIsApproving(false);
    //         }
    //     } catch (err) {
    //         dispatch(alertFailure('Hmm, Something went wrong. Please try again'));
    //         setIsApproving(false);
    //     }
    // };
    const isOwnerNFT = connectedAccount && connectedAccount === addressOwnerNFT;
    const isOwnerTokenNFT = connectedAccount && tokenOwner === connectedAccount;
    return (
        <>
            <div className={styles.content}>
                {
                    !connectedAccount && <WrapperAlert>
                        Please connect to wallet
                    </WrapperAlert>
                }
                <TransferNFTModal open={openTransferModal} onClose={() => setOpenTransferModal(false)} onConfirm={onTransferNFT} />
                <OfferNFTModal open={openOfferModal} onClose={() => setOpenOfferModal(false)} onConfirm={onOfferNFT} />
                <ListingNFTModal open={openListingModal} onClose={() => setOpenListingModal(false)} onConfirm={onListingNFT} onApprove={onApprove} isApproved={isApproved} />
                <div className={styles.contentCardNft}>
                    <div className={clsx(styles.wrapperCard, styles.wrapperCardNft)}>
                        <div className={styles.card}>
                            <div className={clsx(styles.cardImg, marketplaceStyle.cardImg)}>
                                <Image src={infoNFT.image} />
                            </div>
                            <div className={marketplaceStyle.carBodyInfo}>
                                <div className={marketplaceStyle.cardBodyHeader}>
                                    <h3 className="text-uppercase">
                                        {infoNFT.title || infoNFT.name}
                                    </h3>
                                    <div className={marketplaceStyle.boxesBodyHeader}>
                                        <div className="box box-icon" style={{ alignItems: 'center' }}>
                                            <img src={infoNFT.project?.logo} className="icon rounded" alt="" />
                                            <div className="text">
                                                <span className="text-uppercase">
                                                    {infoNFT.project?.name}
                                                </span>
                                            </div>
                                        </div>
                                        {/* <div className="text-uppercase box box-icon">
                                            <img src={infoNFT.token_images} className="icon rounded" alt="" />
                                            <div className="text">
                                                <span className="text-uppercase">
                                                    OWNER
                                                </span>
                                                XYZXYZXYZ
                                            </div>
                                        </div>
                                        <div className="text-uppercase interactions box">
                                            <div className="item">
                                                <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4.7782 8.74697C4.83696 8.8076 4.91696 8.84128 5.00072 8.84128C5.08447 8.84128 5.16447 8.8076 5.22323 8.74697L9.22096 4.6543C10.8881 2.94794 9.70349 0 7.33252 0C5.90868 0 5.25531 1.05716 5.00072 1.25462C4.74487 1.05632 4.09566 0 2.66891 0C0.30544 0 -0.893797 2.94036 0.780885 4.6543L4.7782 8.74697Z" fill="#7D7D7D" />
                                                </svg>
                                                <span>{200}</span>
                                            </div>
                                            <div className="item">
                                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7 0.827148C4.32515 0.827148 1.89946 2.29058 0.109543 4.66759C-0.0365143 4.86233 -0.0365143 5.1344 0.109543 5.32914C1.89946 7.70901 4.32515 9.17245 7 9.17245C9.67485 9.17245 12.1005 7.70901 13.8905 5.332C14.0365 5.13726 14.0365 4.8652 13.8905 4.67045C12.1005 2.29058 9.67485 0.827148 7 0.827148ZM7.19188 7.93812C5.41628 8.04981 3.94998 6.58638 4.06168 4.80792C4.15332 3.34162 5.34182 2.15312 6.80812 2.06147C8.58372 1.94978 10.05 3.41322 9.93832 5.19168C9.84382 6.65511 8.65531 7.84361 7.19188 7.93812ZM7.1031 6.58065C6.14657 6.64079 5.35614 5.85323 5.41915 4.8967C5.46783 4.10627 6.10934 3.46763 6.89977 3.41608C7.8563 3.35594 8.64672 4.1435 8.58372 5.10003C8.53217 5.89332 7.89066 6.53196 7.1031 6.58065Z" fill="#7D7D7D" />
                                                </svg>
                                                <span>{4000}</span>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="divider"></div>
                                <div className={marketplaceStyle.cardBodyDetail}>
                                    <div className="detail-items">
                                        {/* <div className="item">
                                            <label htmlFor="" className="label text-uppercase">PRICE</label>
                                            <div className={marketplaceStyle.currency}>
                                                <img className="icon" src={`/images/icons/${(infoNFT.network_available || '').toLowerCase()}.png`} alt="" />
                                                <span className="text-uppercase">{infoNFT.token_conversion_rate} {getCurrencyByNetwork(infoNFT.network_available)}</span>
                                            </div>
                                        </div> */}
                                        <div className="item">
                                            <label htmlFor="" className="label text-uppercase">CONTRACT ADDRESS</label>
                                            <div className="network">
                                                <img src={allowNetwork.icon} alt="" className="icon" />
                                                <span className="name">
                                                    {allowNetwork.name}:
                                                </span>
                                                <span className="address">{cvtAddressToStar(infoNFT.project?.token_address || '', '.', 10)}</span>
                                                <a href={`${getExplorerTransactionAddress({ appChainID, address: infoNFT.project?.token_address })}`} rel="noreferrer" target="_blank">
                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M13.8424 3.67302L10.3071 0.155337C10.1543 0.00325498 9.92514 -0.041861 9.72652 0.0409337C9.52755 0.123537 9.39803 0.317727 9.39803 0.533053V2.12986C7.64542 2.24568 6.77025 2.97233 6.61213 3.11711C4.41287 4.94753 4.65609 7.44348 4.73 7.94006C4.73106 7.94717 4.73213 7.95444 4.73336 7.96155L4.80442 8.37017C4.84262 8.58976 5.013 8.76227 5.23188 8.80295C5.26455 8.809 5.29725 8.812 5.3296 8.812C5.51455 8.812 5.68919 8.7157 5.78653 8.55315L5.99953 8.19818C7.16391 6.26169 8.60278 5.9499 9.398 5.94722V7.60391C9.398 7.81975 9.52823 8.01413 9.72792 8.09655C9.9276 8.17879 10.157 8.13261 10.309 7.97982L13.8444 4.42665C14.0519 4.21807 14.051 3.88052 13.8424 3.67302ZM10.4642 6.3125V5.45422C10.4642 5.19252 10.2745 4.96957 10.0161 4.92801C9.40106 4.82905 7.46526 4.70984 5.79348 6.6609C5.90132 5.86462 6.25806 4.79441 7.30412 3.92829C7.31692 3.91763 7.32135 3.91407 7.33308 3.90234C7.3409 3.89507 8.13576 3.18016 9.8777 3.18016H9.931C10.2254 3.18016 10.464 2.94156 10.464 2.64719V1.81522L12.7128 4.05251L10.4642 6.3125Z" fill="#AEAEAE" />
                                                        <path d="M11.9032 10.3399C11.6089 10.3399 11.3703 10.5785 11.3703 10.8729V12.383H1.06597V4.56594H4.26385C4.55822 4.56594 4.79682 4.32735 4.79682 4.03297C4.79682 3.7386 4.55822 3.5 4.26385 3.5H0.53297C0.238595 3.49997 0 3.73857 0 4.03294V12.916C0 13.2103 0.238595 13.4489 0.53297 13.4489H11.9032C12.1976 13.4489 12.4362 13.2103 12.4362 12.916V10.8729C12.4362 10.5785 12.1976 10.3399 11.9032 10.3399Z" fill="#AEAEAE" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <label htmlFor="" className="label text-uppercase">Price</label>
                                            <div className="text-white firs-neue-font">
                                                {nftPrice}
                                            </div>
                                        </div>
                                        <div className="item">
                                            <label htmlFor="" className="label text-uppercase">TOKEN ID</label>
                                            <div className="text-white firs-neue-font">
                                                #{infoNFT.id}
                                            </div>
                                        </div>
                                        <div className="item">
                                            <label htmlFor="" className="label text-uppercase">Description</label>
                                            <div className="text-white firs-neue-font">
                                                <p>{infoNFT.description}</p>
                                            </div>
                                        </div>
                                        {/* <div className="item">
                                            <label className="label text-uppercase">TYPE</label>
                                            <div className="tags">
                                                {tagTypes.map(t => <span key={t}>{t}</span>)}
                                            </div>
                                        </div> */}
                                        {/* <div className="item">
                                            <label className="label text-uppercase">Category</label>
                                            <div className="tags">
                                                {tagTypes.map(t => <span key={t}>{t}</span>)}
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="divider"></div>
                                <div className={marketplaceStyle.actions}>
                                    {
                                        connectedAccount && <>
                                            {
                                                isOwnerNFT && <ButtonBase color="yellow" className="w-full" onClick={() => setOpenListingModal(true)}>
                                                    List
                                                </ButtonBase>
                                            }
                                            {
                                                isOwnerTokenNFT && <ButtonBase color="yellow" className="w-full" onClick={onDelistNFT}>
                                                    Delist
                                                </ButtonBase>
                                            }
                                            {
                                                isOwnerNFT && <ButtonBase color="green" className="w-full" onClick={() => setOpenTransferModal(true)}>
                                                    Transfer
                                                </ButtonBase>
                                            }
                                            {
                                                !isOwnerNFT && tokenOwner !== connectedAccount && +tokenOwner && !(new BN(+tokenOwner).isZero()) && <ButtonBase color="yellow" className="w-full" onClick={() => setOpenOfferModal(true)}>
                                                    Offer
                                                </ButtonBase>
                                            }
                                            {
                                                !isOwnerNFT && tokenOwner !== connectedAccount && +tokenOwner && !(new BN(+tokenOwner).isZero()) && <ButtonBase color="yellow" className="w-full" onClick={onBuyNFT}>
                                                    Buy
                                                </ButtonBase>
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.displayContent}>
                    <AboutMarketplaceNFT
                        info={infoNFT}
                        id={id}
                        projectAddress={projectAddress}
                        defaultTab={1}
                        isOwnerTokenNFT={isOwnerTokenNFT}
                        isOwnerNFT={isOwnerNFT}
                        marketplaceContract={marketplaceContract}
                        handleTx={handleTx}
                    />
                </div>
            </div>
        </>
    );
}
export default MysteryBox;
