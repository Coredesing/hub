import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { useWeb3React } from '@web3-react/core';
import useStyles from './style';
import Button from '../Button';
import ConnectButton from './ConnectButton';
import ModalStake from '../ModalStake';
import ModalUnstake from '../ModalUnstake';
import ModalClaim from '../ModalClaim';
import ModalConfirmation from '../ModalConfirm';
import ModalROI from '../ModalROI';
import useCommonStyle from '../../../styles/CommonStyle';
import moment from "moment";
import {numberWithCommas} from '../../../utils/formatNumber';

import { useDispatch } from 'react-redux';
import { alertSuccess, alertFailure } from '../../../store/actions/alert';

import useTokenDetails from '../../../hooks/useTokenDetails';
import useTokenAllowance from '../../../hooks/useTokenAllowance';
import useTokenApprove from '../../../hooks/useTokenApprove';
import useTokenBalance from '../../../hooks/useTokenBalance';

import useAllocStake from '../hook/useAllocStake';
import useAllocUnstake from '../hook/useAllocUnstake';
import useAllocClaim from '../hook/useAllocClaim';
import useAllocClaimPendingWithdraw from '../hook/useAllocClaimPendingWithdraw';

import { ETH_CHAIN_ID } from '../../../constants/network'
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { BigNumber, utils } from 'ethers';

const ONE_DAY_IN_SECONDS = 86400;
const EST_BLOCK_PER_YEAR = 2369600; // Number of block per year, with estimated 20s/block

const ArrowIcon = () => {
  return (
    <svg width="16" height="9" viewBox="0 0 16 9" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path id="Shape Copy 26" d="M7.99997 8.72727C7.71322 8.72727 7.4265 8.6225 7.20788 8.41341L0.328227 1.83028C-0.109409 1.41151 -0.109409 0.732549 0.328227 0.313949C0.765686 -0.10465 1.4751 -0.10465 1.91277 0.313949L7.99997 6.13907L14.0872 0.314153C14.5249 -0.104447 15.2342 -0.104447 15.6716 0.314153C16.1095 0.732752 16.1095 1.41171 15.6716 1.83048L8.79207 8.41361C8.57334 8.62274 8.28662 8.72727 7.99997 8.72727Z" fill="currentColor"/>
    </svg>
  )
}

const AllocationPool = (props: any) => {
  const { connectedAccount, poolDetail, blockNumber, poolAddress, reload, setOpenModalTransactionSubmitting, setTransactionHashes } = props
  const styles = useStyles();
  const { library } = useWeb3React();
  const dispatch = useDispatch();
  
  const { appChainID, walletChainID } = useTypedSelector(state => state.appNetwork).data;
  const {tokenDetails} = useTokenDetails(poolDetail?.lpToken, 'eth');
  const {tokenDetails: rewardTokenDetails} = useTokenDetails(poolDetail?.rewardToken, 'eth');
  const [tokenAllowance, setTokenAllowance] = useState(BigNumber.from('0'));
  const { retrieveTokenAllowance } = useTokenAllowance();
  const [tokenBalance, setTokenBalance] = useState('0');
  const { retrieveTokenBalance } = useTokenBalance(tokenDetails, connectedAccount);
  const {approveToken , tokenApproveLoading, transactionHash: approveTransactionHash} = useTokenApprove(tokenDetails, connectedAccount, poolAddress, false);

  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('0');
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [unstakeAmount, setUnstakeAmount] = useState('0');
  const [showClaimModal, setShowClaimModal] = useState(false);

  const {allocStakeToken , transactionHash: stakeTransactionHash} = useAllocStake(poolAddress, poolDetail?.pool_id, stakeAmount);
  const {allocUnstakeToken, transactionHash: unstakeTransactionHash} = useAllocUnstake(poolAddress, poolDetail?.pool_id, unstakeAmount);
  const {allocClaimToken, transactionHash: claimTransactionHash} = useAllocClaim(poolAddress, poolDetail?.pool_id);
  const {allocClaimPendingWithdraw, transactionHash: claimPendingTransactionHash} = useAllocClaimPendingWithdraw(poolAddress, poolDetail?.pool_id);


  const [apr, setApr] = useState(0);
  const [showROIModal, setShowROIModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previousStep, setPreviousStep] = useState('');


  const loadTokenAllowance = useCallback(async () =>{
    setTokenAllowance(BigNumber.from('0x'+((await retrieveTokenAllowance(tokenDetails, connectedAccount, poolAddress))?.toString(16)||'0')));
  },[tokenDetails, connectedAccount, poolAddress, retrieveTokenAllowance])

  useEffect(()=>{
    try {
      loadTokenAllowance()
    } catch (err) {
      console.log(err)
    }
  }, [poolDetail, connectedAccount, loadTokenAllowance, tokenApproveLoading]);

  useEffect(()=>{
    retrieveTokenBalance(tokenDetails, connectedAccount)
      .then(balance => {
        setTokenBalance(balance as string);
      });
  }, [retrieveTokenBalance, connectedAccount, tokenDetails]);


  useEffect(()=>{
    // price in $
    const acceptedTokenPrice = Number(poolDetail?.accepted_token_price) || 1;
    const rewardTokenPrice = Number(poolDetail?.reward_token_price) || 1;

    const estimatedAmount = utils.parseEther(`${1000/acceptedTokenPrice}`); // investment with $1000
    const poolRewardPerBlock = BigNumber.from(poolDetail?.rewardPerBlock || "0")
                                        .div(BigNumber.from(poolDetail?.totalAllocPoint || "0"))
                                        .mul(BigNumber.from(poolDetail?.allocPoint || "0"))
    const rewardPerYear = poolRewardPerBlock.mul(BigNumber.from(EST_BLOCK_PER_YEAR))
                                                    .mul(estimatedAmount)
                                                    .div((BigNumber.from(poolDetail?.lpSupply || "0").add(estimatedAmount)))

    const estimatedRewardPerYear = Number(utils.formatEther(rewardPerYear))
    setApr((estimatedRewardPerYear * rewardTokenPrice) / 1000 * 100);
  }, [poolDetail, connectedAccount, loadTokenAllowance])

  const handleApprove = async () => {
    try {
      setOpenModalTransactionSubmitting(true);
      await approveToken()
      setOpenModalTransactionSubmitting(false);
    } catch (err) {
      setOpenModalTransactionSubmitting(false);
      console.log(err)
    }
  }

  useEffect(()=>{
    if (!approveTransactionHash) {
      return
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{tnx: approveTransactionHash, isApprove: true}])
  }, [approveTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes])


  const handleStake = async () =>{
    try {
      if (utils.parseEther(stakeAmount).lt(BigNumber.from('0'))) {
        dispatch(alertFailure('Invalid amount'));
        return;
      }
      setShowStakeModal(false);
      setOpenModalTransactionSubmitting(true);
      await allocStakeToken();
      setStakeAmount('0');
      setOpenModalTransactionSubmitting(false);
      reload && reload();
    } catch (err) {
      setOpenModalTransactionSubmitting(false);
      console.log(err)
    }
  }

  useEffect(()=>{
    if (!stakeTransactionHash) {
      return
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{tnx: stakeTransactionHash, isApprove: false}])
  }, [stakeTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes])


  const handleUnstake = async () =>{
    try {
      if (utils.parseEther(unstakeAmount).lt(BigNumber.from('0'))) {
        dispatch(alertFailure('Invalid amount'));
        return;
      }

      if (BigNumber.from(poolDetail?.pendingWithdrawal?.amount || '0').gt(BigNumber.from('0')) && confirmed === false) {
        setPreviousStep('unstake');
        if (Number(poolDetail?.pendingWithdrawal?.applicableAt) > moment().unix()){
          setConfirmationText(`You currently have ${rewardTokenDetails?.symbol} waiting to be withdrawn. If you continue to withdraw tokens, the withdrawal delay time will be extended until ${moment.unix(moment().unix() + Number(poolDetail?.delayDuration)).format("YYYY-MM-DD HH:mm:ss ([GMT]Z)")}`);
        } else {
          setConfirmationText(`You currently have ${rewardTokenDetails?.symbol} available for withdrawal. If you continue to withdraw tokens, the withdrawal delay time will be extended until ${moment.unix(moment().unix() + Number(poolDetail?.delayDuration)).format("YYYY-MM-DD HH:mm:ss ([GMT]Z)")}`);
        }
        setShowConfirmModal(true);
        setShowUnstakeModal(false);
        return;
      }
      setConfirmed(false);
      setPreviousStep('');

      setShowUnstakeModal(false);
      setOpenModalTransactionSubmitting(true);
      await allocUnstakeToken();
      setUnstakeAmount('0');
      setOpenModalTransactionSubmitting(false);
      setConfirmationText('');
      reload && reload();
    } catch (err) {
      setConfirmed(false);
      setPreviousStep('');
      setConfirmationText('');

      setOpenModalTransactionSubmitting(false);
      console.log(err)
    }
  }

  useEffect(()=>{
    if (!unstakeTransactionHash) {
      return
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{tnx: unstakeTransactionHash, isApprove: false}])
  }, [unstakeTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes])


  const handleClaim = async () =>{
    try {
      setShowClaimModal(false);
      setOpenModalTransactionSubmitting(true);
      await allocClaimToken();
      setOpenModalTransactionSubmitting(false);
      reload && reload();
    } catch (err) {
      setShowClaimModal(false);
      setOpenModalTransactionSubmitting(false);
      console.log(err)
    }
  }

  useEffect(()=>{
    if (!claimTransactionHash) {
      return
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{tnx: claimTransactionHash, isApprove: false}])
  }, [claimTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes])


  const handleClaimPendingWithdraw = async () =>{
    try {
      setOpenModalTransactionSubmitting(true);
      await allocClaimPendingWithdraw();
      setOpenModalTransactionSubmitting(false);
      reload && reload();
    } catch (err) {
      setOpenModalTransactionSubmitting(false);
      console.log(err)
    }
  }

  useEffect(()=>{
    if (!claimPendingTransactionHash) {
      return
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{tnx: claimPendingTransactionHash, isApprove: false}])
  }, [claimPendingTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes])


  useEffect(() => {
    if (!confirmed) {
      return
    }
    setShowConfirmModal(false);
    switch (previousStep) {
      case 'stake':
        handleStake();
        return;

      case 'unstake':
        handleUnstake();
        return;

      case 'claimPendingWithdraw':
        handleClaimPendingWithdraw();
        return;

      default:
        return;
    }
  }, [confirmed, previousStep])

  const wrongChain = useMemo(() => {
    return appChainID !== ETH_CHAIN_ID || appChainID !== walletChainID;
  }, [appChainID, walletChainID]);

  const addToMetamask = async () => {
    try {
      if (!window?.ethereum) {
        return;
      }
      const windowObj = window as any;
      const { ethereum } = windowObj;
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenDetails?.address, // The address that the token is at.
            symbol: tokenDetails?.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDetails?.decimals, // The number of decimals in the token
          },
        },
      });

      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Accordion className={styles.pool}>
      <AccordionSummary
        expandIcon={<ArrowIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
      <div className="pool--sumary">
        <img src={poolDetail?.logo} className="pool--logo" alt="" />
        <div className="pool--sumary-block">
          <div className={styles.textPrimary} style={{fontSize: '20px'}}>
            {poolDetail?.title}
          </div>
          <div className={styles.textSecondary + ' mobile-hidden'}>
            {
              poolDetail?.rkp_rate > 0 ? 
              <span>With IDO</span> : 
              <span style={{color: '#D0AA4D'}}>Without IDO</span>
            }
          </div>
        </div>
        <div className="pool--sumary-block pool--sumary-block__min-width">
          <div className={styles.textSecondary}>
            Earned
          </div>
          <div className={styles.textPrimary}>
            {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)} PKF
          </div>
        </div>
        <div className="pool--sumary-block pool--sumary-block__min-width">
          <div className={styles.textSecondary}>
            APR
          </div>
          <div className={styles.textAPR}>
            {apr.toFixed(1)}%
            <svg width="16" height="16" className="mobile-hidden" style={{marginLeft: '4px'}} onClick={(e) => {e.stopPropagation();setShowROIModal(true)}} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.10754 3.28003H10.8738L8.17041 0.436157V2.33923C8.17041 2.85474 8.5885 3.28003 9.10754 3.28003Z" fill="#AEAEAE"/>
              <path d="M10.9059 7.3855C8.53064 7.3855 6.59863 9.31738 6.59863 11.6927C6.59863 14.068 8.53064 16 10.9059 16C13.2812 16 15.2133 14.068 15.2133 11.6927C15.2133 9.31738 13.2812 7.3855 10.9059 7.3855ZM13.4579 14.4357C13.4001 14.4934 13.3281 14.5222 13.2524 14.5222C13.1803 14.5222 13.1046 14.4934 13.0505 14.4393L11.9476 13.3363C11.5223 13.6715 10.9816 13.8734 10.3977 13.8734C9.01721 13.8734 7.89624 12.756 7.89624 11.3792C7.89624 10.0023 9.01721 8.88489 10.3977 8.88489C11.7782 8.88489 12.8992 10.0023 12.8992 11.3792C12.8992 11.963 12.6974 12.5037 12.3549 12.9291L13.4579 14.0284C13.5696 14.1401 13.5696 14.324 13.4579 14.4357Z" fill="#AEAEAE"/>
              <path d="M10.3979 9.46521C9.33826 9.46521 8.47314 10.3267 8.47314 11.3827C8.47314 12.4388 9.33472 13.3003 10.3979 13.3003C10.9207 13.3003 11.3964 13.0912 11.7424 12.7524C11.746 12.7488 11.7496 12.7451 11.7532 12.7416C11.7568 12.7379 11.764 12.7344 11.7676 12.7272C12.11 12.3811 12.3228 11.9054 12.3228 11.3827C12.3228 10.3231 11.4576 9.46521 10.3979 9.46521Z" fill="#AEAEAE"/>
              <path d="M6.17712 10.4528H3.0448C2.88623 10.4528 2.75647 10.3231 2.75647 10.1644C2.75647 10.0059 2.88623 9.8761 3.0448 9.8761H6.36816C6.55188 9.40759 6.797 9.01099 7.09985 8.6145H3.0448C2.88623 8.6145 2.75647 8.48486 2.75647 8.32617C2.75647 8.1676 2.88623 8.03784 3.0448 8.03784H7.64771C8.5127 7.28088 9.65894 6.79797 10.9097 6.79797C11.0286 6.79797 11.126 6.80872 11.2701 6.81958V3.85669H9.10742C8.27124 3.85669 7.59363 3.17188 7.59363 2.33923V0H2.06445C1.35071 0 0.78125 0.583862 0.78125 1.30115V12.3019C0.78125 13.0192 1.35071 13.5886 2.06445 13.5886H6.40771C6.15906 13.012 6.02209 12.3632 6.02209 11.6855C6.01843 11.2603 6.07617 10.8492 6.17712 10.4528ZM3.0448 6.2356H6.69617C6.85474 6.2356 6.9845 6.36536 6.9845 6.52405C6.9845 6.68262 6.85474 6.81238 6.69617 6.81238H3.0448C2.88623 6.81238 2.75647 6.68262 2.75647 6.52405C2.75647 6.36536 2.88623 6.2356 3.0448 6.2356Z" fill="#AEAEAE"/>
            </svg>
          </div>
        </div>
        <div className="pool--sumary-block pool--sumary-block__min-width-lg mobile-hidden">
          <div className={styles.textSecondary}>
            Total staked
          </div>
          <div className={styles.textPrimary}>
            {(+utils.formatEther(poolDetail?.lpSupply)).toFixed(2)} {tokenDetails?.symbol}
          </div>
        </div>
        <div className="pool--sumary-block mobile-hidden">
          <div className={styles.textSecondary}>
            Ends in
          </div>
          <div className={styles.textPrimary}>
            {poolDetail?.endBlockNumber !== "0" && Number(poolDetail?.endBlockNumber) > blockNumber ?
            `${numberWithCommas(Number(Number(poolDetail?.endBlockNumber) - blockNumber).toString())} blocks` :
            '---'}
          </div>
        </div>
        <div className="pool--sumary-block mobile-hidden">
          <div className={styles.textSecondary}>
            Withdrawal delay time
          </div>
          <div className={styles.textPrimary}>
            { Number(poolDetail?.delayDuration) > 0 ? `${(Number(poolDetail?.delayDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days` : 'None'}
          </div>
        </div>
      </div>
      <div className="pool--expand-text mobile-hidden">
        Details
      </div>
      </AccordionSummary>
      <AccordionDetails className="pool--detail">
        <div className="pool--detail-block mobile-hidden" style={{ width: '240px' }}>
          <a
            className={styles.link}
            target="_blank"
            href={poolDetail?.website}
            rel="noreferrer"
          >
            View Project Site
          </a>
          <a
            className={styles.link}
            target="_blank"
            href={`https://etherscan.io/address/${poolDetail?.pool_address}`}
            rel="noreferrer"
          >
            View Contract
          </a>
          <button
            className={styles.link}
            onClick={addToMetamask}
          >
            Add to Metamask
          </button>
        </div>
        <div className="pool--detail-block mobile-flex-col">
          <div className="items-center mobile-flex-row justify-between w-full">
            <div className={styles.textSecondary}>
              Earned
            </div>
            <div className={styles.textPrimary}>
              {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)} {tokenDetails?.symbol}
            </div>
          </div>
          <div className="items-center mobile-flex-row justify-between w-full">
            <div className={styles.textSecondary}>
              APR
            </div>
            <div className={styles.textAPR}>
              <svg width="16" height="16" style={{marginRight: '4px'}} onClick={(e) => {e.stopPropagation();setShowROIModal(true)}} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.10754 3.28003H10.8738L8.17041 0.436157V2.33923C8.17041 2.85474 8.5885 3.28003 9.10754 3.28003Z" fill="#AEAEAE"/>
                <path d="M10.9059 7.3855C8.53064 7.3855 6.59863 9.31738 6.59863 11.6927C6.59863 14.068 8.53064 16 10.9059 16C13.2812 16 15.2133 14.068 15.2133 11.6927C15.2133 9.31738 13.2812 7.3855 10.9059 7.3855ZM13.4579 14.4357C13.4001 14.4934 13.3281 14.5222 13.2524 14.5222C13.1803 14.5222 13.1046 14.4934 13.0505 14.4393L11.9476 13.3363C11.5223 13.6715 10.9816 13.8734 10.3977 13.8734C9.01721 13.8734 7.89624 12.756 7.89624 11.3792C7.89624 10.0023 9.01721 8.88489 10.3977 8.88489C11.7782 8.88489 12.8992 10.0023 12.8992 11.3792C12.8992 11.963 12.6974 12.5037 12.3549 12.9291L13.4579 14.0284C13.5696 14.1401 13.5696 14.324 13.4579 14.4357Z" fill="#AEAEAE"/>
                <path d="M10.3979 9.46521C9.33826 9.46521 8.47314 10.3267 8.47314 11.3827C8.47314 12.4388 9.33472 13.3003 10.3979 13.3003C10.9207 13.3003 11.3964 13.0912 11.7424 12.7524C11.746 12.7488 11.7496 12.7451 11.7532 12.7416C11.7568 12.7379 11.764 12.7344 11.7676 12.7272C12.11 12.3811 12.3228 11.9054 12.3228 11.3827C12.3228 10.3231 11.4576 9.46521 10.3979 9.46521Z" fill="#AEAEAE"/>
                <path d="M6.17712 10.4528H3.0448C2.88623 10.4528 2.75647 10.3231 2.75647 10.1644C2.75647 10.0059 2.88623 9.8761 3.0448 9.8761H6.36816C6.55188 9.40759 6.797 9.01099 7.09985 8.6145H3.0448C2.88623 8.6145 2.75647 8.48486 2.75647 8.32617C2.75647 8.1676 2.88623 8.03784 3.0448 8.03784H7.64771C8.5127 7.28088 9.65894 6.79797 10.9097 6.79797C11.0286 6.79797 11.126 6.80872 11.2701 6.81958V3.85669H9.10742C8.27124 3.85669 7.59363 3.17188 7.59363 2.33923V0H2.06445C1.35071 0 0.78125 0.583862 0.78125 1.30115V12.3019C0.78125 13.0192 1.35071 13.5886 2.06445 13.5886H6.40771C6.15906 13.012 6.02209 12.3632 6.02209 11.6855C6.01843 11.2603 6.07617 10.8492 6.17712 10.4528ZM3.0448 6.2356H6.69617C6.85474 6.2356 6.9845 6.36536 6.9845 6.52405C6.9845 6.68262 6.85474 6.81238 6.69617 6.81238H3.0448C2.88623 6.81238 2.75647 6.68262 2.75647 6.52405C2.75647 6.36536 2.88623 6.2356 3.0448 6.2356Z" fill="#AEAEAE"/>
              </svg>
              {apr.toFixed(1)}%
            </div>
          </div>
          <div className="items-center mobile-flex-row justify-between w-full">
            <div className={styles.textSecondary}>
              Total staked
            </div>
            <div className={styles.textPrimary}>
              {(+utils.formatEther(poolDetail?.lpSupply)).toFixed(2)} {tokenDetails?.symbol}
            </div>
          </div>
          <div className="items-center mobile-flex-row justify-between w-full">
            <div className={styles.textSecondary}>
              Ends in
            </div>
            <div className={styles.textPrimary}>
              {poolDetail?.endBlockNumber !== "0" && Number(poolDetail?.endBlockNumber) > blockNumber ?
              `${numberWithCommas(Number(Number(poolDetail?.endBlockNumber) - blockNumber).toString())} blocks` :
              '---'}
            </div>
          </div>
          <div className="items-center mobile-flex-row justify-between w-full">
            <div className={styles.textSecondary}>
              Withdrawal delay time
            </div>
            <div className={styles.textPrimary}>
              { Number(poolDetail?.delayDuration) > 0 ? `${(Number(poolDetail?.delayDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days` : 'None'}
            </div>
          </div>
        </div>
        <div className="pool--detail-block pool--detail-block__claim">
          <div>
            <div className={styles.textSecondary}>
              Earned
            </div>
            <div className={styles.textPrimary}>
              {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)} PKF
            </div>
          </div>

          <Button
            text="Claim Token"
            backgroundColor="#FFD058"
            onClick={() => setShowClaimModal(true)}
            style={{
              color: '#090B1C',
              minWidth: '140px',
            }}
            disabled={poolDetail?.pendingReward === "0" || wrongChain}
          />
        </div>
        {
          !connectedAccount &&
          <div className="pool--detail-block pool--detail-block__claim">
            <div className={styles.textSecondary}>
              Start Staking
            </div>

            <ConnectButton />
          </div>
        }

        {
          connectedAccount && tokenAllowance.eq(BigNumber.from('0')) &&
          <div className="pool--detail-block pool--detail-block__claim">
            <div className={styles.textSecondary}>
              Enable Pool
            </div>

            <div style={{ marginTop: 'auto' }}>
              <Button
                text="Enable"
                onClick={() => handleApprove()}
                disabled={wrongChain}
                backgroundColor="#3232DC"
              />
            </div>
          </div>
        }

        {
          connectedAccount && tokenAllowance.gt(BigNumber.from('0')) &&
          <div className="pool--detail-block">
            <div style={{marginBottom: '20px'}}>
              <div className={styles.textSecondary}>
                Staking
              </div>
              <div className={styles.textPrimary}>
                {(+utils.formatEther(poolDetail?.stakingAmount)).toFixed(2)} {tokenDetails?.symbol}
              </div>
            </div>

            <div className="xs-flex-row justify-between" style={{ marginTop: 'auto' }}>
              <Button
                text="Stake"
                onClick={() => setShowStakeModal(true)}
                disabled={wrongChain}
                backgroundColor="#3232DC"
              />
              {
                BigNumber.from(poolDetail?.stakingAmount || '0').gt(BigNumber.from('0')) &&
                <Button
                  text="Unstake"
                  onClick={() => setShowUnstakeModal(true)}
                  backgroundColor="#191920"
                  style={{
                    color: '#6398FF',
                    border: '1px solid #6398FF',
                    margin: 'auto 0px 10px 6px',
                  }}
                  disabled={poolDetail?.stakingAmount === "0" || wrongChain}
                />
              }
            </div>
          </div>
        }

        {
          connectedAccount && tokenAllowance.gt(BigNumber.from('0')) && BigNumber.from(poolDetail?.pendingWithdrawal?.amount || '0').gt(BigNumber.from('0')) &&
          <div className="pool--detail-block">
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
              <div>
                <div className={styles.textSecondary}>
                  Withdrawal Amount
                </div>
                <div className={styles.textPrimary}>
                  {(+utils.formatEther(poolDetail?.pendingWithdrawal?.amount)).toFixed(2)} {tokenDetails?.symbol}
                </div>
              </div>
              <div style={{ marginLeft: '20px' }}>
                <div className={styles.textSecondary}>
                  Available at
                </div>
                <div className={styles.textPrimary}>
                  {moment.unix(Number(poolDetail?.pendingWithdrawal?.applicableAt)).format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
            </div>

            <Button
              text="Withdraw"
              onClick={handleClaimPendingWithdraw}
              backgroundColor="#3232DC"
              style={{
                width: '160px',
              }}
              disabled={Number(poolDetail?.pendingWithdrawal?.applicableAt) > moment().unix() || wrongChain}
            />
          </div>
        }

      </AccordionDetails>

      <ModalStake
        open={showStakeModal}
        amount={stakeAmount}
        setAmount={setStakeAmount}
        tokenDetails={tokenDetails}
        logo={poolDetail?.logo}
        tokenBalance={tokenBalance}
        stakingAmount={Number(utils.formatEther(poolDetail?.stakingAmount)).toFixed(2)}
        onClose={() => setShowStakeModal(false)}
        onConfirm={handleStake}
      />

      <ModalUnstake
        amount={unstakeAmount}
        setAmount={setUnstakeAmount}
        tokenDetails={tokenDetails}
        logo={poolDetail?.logo}
        pendingReward={poolDetail?.pendingReward}
        delayDuration={poolDetail?.delayDuration}
        stakingAmount={poolDetail?.stakingAmount}
        open={showUnstakeModal}
        onClose={() => setShowUnstakeModal(false)}
        onConfirm={handleUnstake}
      />

      <ModalClaim
        tokenDetails={tokenDetails}
        logo={poolDetail?.logo}
        pendingReward={poolDetail?.pendingReward}
        open={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onConfirm={handleClaim}
      />

      <ModalConfirmation
        open={showConfirmModal}
        text={confirmationText}
        onConfirm={() => setConfirmed(true)}
        onClose={() => setShowConfirmModal(false)}
      />

      <ModalROI
        open={showROIModal}
        apr={apr}
        rewardTokenPrice={Number(poolDetail?.reward_token_price) || 1}
        rewardToken={rewardTokenDetails}
        acceptedToken={tokenDetails}
        onClose={() => setShowROIModal(false)}
      />
    </Accordion>
  )
}

export default AllocationPool;
