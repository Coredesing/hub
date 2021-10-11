import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
import { numberWithCommas } from '../../../utils/formatNumber';

import { useDispatch, useSelector } from 'react-redux';
import { alertSuccess, alertFailure } from '../../../store/actions/alert';

import useTokenDetails from '../../../hooks/useTokenDetails';
import useTokenAllowance from '../../../hooks/useTokenAllowance';
import useTokenApprove from '../../../hooks/useTokenApprove';
import useTokenBalance from '../../../hooks/useTokenBalance';

import useLinearStake from '../hook/useLinearStake';
import useLinearUnstake from '../hook/useLinearUnstake';
import useLinearClaim from '../hook/useLinearClaim';
import useLinearClaimPendingWithdraw from '../hook/useLinearClaimPendingWithdraw';

import { ChainDefault, ETH_CHAIN_ID } from '../../../constants/network'
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { BigNumber, utils } from 'ethers';
// import ModalSwitchPool from '../ModalSwitchPool';
// import useSwitchPool from '../hook/useSwitchPool';
import { getUserTier } from '../../../store/actions/sota-tiers';
import { TIERS } from '@app-constants';
import clsx from 'clsx';
import { Box } from '@material-ui/core';
import STAKING_POOL_ABI from '@abi/StakingPool.json';
import { getContractInstance, SmartContractMethod } from '@services/web3';

const ONE_DAY_IN_SECONDS = 86400;
const ONE_YEAR_IN_SECONDS = '31536000';

const ArrowIcon = () => {
  return (
    <svg width="16" height="9" viewBox="0 0 16 9" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path id="Shape Copy 26" d="M7.99997 8.72727C7.71322 8.72727 7.4265 8.6225 7.20788 8.41341L0.328227 1.83028C-0.109409 1.41151 -0.109409 0.732549 0.328227 0.313949C0.765686 -0.10465 1.4751 -0.10465 1.91277 0.313949L7.99997 6.13907L14.0872 0.314153C14.5249 -0.104447 15.2342 -0.104447 15.6716 0.314153C16.1095 0.732752 16.1095 1.41171 15.6716 1.83048L8.79207 8.41361C8.57334 8.62274 8.28662 8.72727 7.99997 8.72727Z" fill="currentColor" />
    </svg>
  )
}

const LinearPool = (props: any) => {
  const { connectedAccount, poolDetail, poolAddress, reload, setOpenModalTransactionSubmitting, setTransactionHashes, poolsList, listTopStaked } = props
  const styles = useStyles();
  const dispatch = useDispatch();
  const { data: delayTiers = [] } = useSelector((state: any) => state.delayTiers);
  const { appChainID, walletChainID } = useTypedSelector(state => state.appNetwork).data;
  const { tokenDetails } = useTokenDetails(poolDetail?.acceptedToken, ChainDefault.shortName || '');
  const [tokenAllowance, setTokenAllowance] = useState(BigNumber.from('0'));
  const { retrieveTokenAllowance } = useTokenAllowance();
  const [tokenBalance, setTokenBalance] = useState('0');
  const { retrieveTokenBalance } = useTokenBalance(tokenDetails, connectedAccount);
  const { approveToken, tokenApproveLoading, transactionHash: approveTransactionHash } = useTokenApprove(tokenDetails, connectedAccount, poolAddress, false);

  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('0');
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [unstakeAmount, setUnstakeAmount] = useState('0');
  const [showClaimModal, setShowClaimModal] = useState(false);
  // const [showSwitchModal, setShowSwitchModal] = useState(false);

  const { linearStakeToken, transactionHash: stakeTransactionHash } = useLinearStake(poolAddress, poolDetail?.pool_id, stakeAmount);
  const { linearClaimToken, transactionHash: unstakeTransactionHash } = useLinearClaim(poolAddress, poolDetail?.pool_id);
  const { linearUnstakeToken, transactionHash: claimTransactionHash } = useLinearUnstake(poolAddress, poolDetail?.pool_id, unstakeAmount);
  const { linearClaimPendingWithdraw, transactionHash: claimPendingTransactionHash } = useLinearClaimPendingWithdraw(poolAddress, poolDetail?.pool_id);

  const [progress, setProgress] = useState('0');
  const [showROIModal, setShowROIModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previousStep, setPreviousStep] = useState('');

  const loadTokenAllowance = useCallback(async () => {
    setTokenAllowance(BigNumber.from('0x' + ((await retrieveTokenAllowance(tokenDetails, connectedAccount, poolAddress))?.toString(16) || '0')));
  }, [tokenDetails, connectedAccount, poolAddress, retrieveTokenAllowance])

  useEffect(() => {
    try {
      loadTokenAllowance()
    } catch (err) {
      console.log(err)
    }
  }, [poolDetail, connectedAccount, loadTokenAllowance, tokenApproveLoading]);

  useEffect(() => {
    retrieveTokenBalance(tokenDetails, connectedAccount)
      .then(balance => {
        setTokenBalance(balance as string);
      });
  }, [retrieveTokenBalance, connectedAccount, tokenDetails]);

  useEffect(() => {
    if (!poolDetail?.cap || poolDetail?.cap === "0") {
      return
    }
    const prg = Number(utils.formatEther(poolDetail?.totalStaked)) / Number(utils.formatEther(poolDetail?.cap)) * 100
    setProgress(prg.toFixed(1))
  }, [poolDetail])

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

  useEffect(() => {
    if (!approveTransactionHash) {
      return
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: approveTransactionHash, isApprove: true }])
  }, [approveTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes])



  const handleStake = async () => {
    try {
      if (utils.parseEther(stakeAmount).add(poolDetail?.stakingAmount || '0').lt(BigNumber.from(poolDetail?.minInvestment || '0'))) {
        dispatch(alertFailure(`Minimum stake amount is ${utils.formatEther(poolDetail?.minInvestment)} ${tokenDetails?.symbol}`));
        return;
      }

      if (utils.parseEther(stakeAmount).gt(BigNumber.from(poolDetail?.maxInvestment || '0')) && BigNumber.from(poolDetail?.maxInvestment || '0').gt(BigNumber.from('0'))) {
        dispatch(alertFailure('You have exceeded the maximum number of tokens / person to stake'));
        return;
      }

      if (BigNumber.from(poolDetail?.cap || '0').gt(BigNumber.from('0')) &&
        BigNumber.from(poolDetail?.totalStaked).add(utils.parseEther(stakeAmount || '0')).gt(BigNumber.from(poolDetail?.cap || '0'))) {
        dispatch(alertFailure('The number of tokens you want to stake is greater than the amount remaining in the pool. Please try again'));
        return;
      }

      if (poolDetail?.stakingAmount !== '0' && poolDetail?.lockDuration !== '0' && confirmed === false) {
        setPreviousStep('stake');
        setConfirmationText(`You currently have PKF staked in this pool. If you want to stake more tokens, the expiry date will be extended to ${moment.unix(moment().unix() + Number(poolDetail?.lockDuration)).format("YYYY-MM-DD HH:mm:ss ([GMT]Z)")}`);
        setShowConfirmModal(true);
        setShowStakeModal(false);
        return;
      }
      setConfirmed(false);
      setPreviousStep('');

      setShowStakeModal(false);
      setOpenModalTransactionSubmitting(true);
      await linearStakeToken();
      setStakeAmount('0');
      setOpenModalTransactionSubmitting(false);
      setConfirmationText('');
      dispatch(getUserTier(connectedAccount))
      reload && reload();
    } catch (err) {
      setConfirmed(false);
      setPreviousStep('');
      setConfirmationText('');

      setOpenModalTransactionSubmitting(false);
      console.log(err)
    }
  }

  useEffect(() => {
    if (!stakeTransactionHash) {
      return
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: stakeTransactionHash, isApprove: false }])
  }, [stakeTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes])


  const connector  = useTypedSelector((state: any) => state.connector).data;
  const handleUnstake = async () => {
    try {
      if (utils.parseEther(unstakeAmount).lt(BigNumber.from('0'))) {
        dispatch(alertFailure('Invalid amount'));
        return;
      }

      if (BigNumber.from(poolDetail?.pendingWithdrawal?.amount || '0').gt(BigNumber.from('0')) && confirmed === false) {
        setPreviousStep('unstake');
        const contract = getContractInstance(STAKING_POOL_ABI, poolDetail.pool_address, connector, appChainID, SmartContractMethod.Read, false);
        const delayDuration = await contract?.methods.linearDurationOf(poolDetail.pool_id, connectedAccount).call();
        if (Number(poolDetail?.pendingWithdrawal?.applicableAt) > moment().unix()) {
          setConfirmationText(`You currently have ${tokenDetails?.symbol} waiting to be withdrawn. If you continue to withdraw tokens, the withdrawal delay time will be extended until ${moment.unix(moment().unix() + Number(delayDuration)).format("YYYY-MM-DD HH:mm:ss ([GMT]Z)")}`);
        } else {
          setConfirmationText(`You currently have ${tokenDetails?.symbol} available for withdrawal. If you continue to withdraw tokens, the withdrawal delay time will be extended until ${moment.unix(moment().unix() + Number(delayDuration)).format("YYYY-MM-DD HH:mm:ss ([GMT]Z)")}`);
        }
        setShowConfirmModal(true);
        setShowUnstakeModal(false);
        return;
      }
      setConfirmed(false);
      setPreviousStep('');

      setShowUnstakeModal(false);
      setOpenModalTransactionSubmitting(true);
      await linearUnstakeToken();
      setUnstakeAmount('0');
      setOpenModalTransactionSubmitting(false);
      setConfirmationText('');
      dispatch(getUserTier(connectedAccount))
      reload && reload();
    } catch (err) {
      setConfirmed(false);
      setPreviousStep('');
      setConfirmationText('');

      setOpenModalTransactionSubmitting(false);
      console.log(err)
    }
  }

  useEffect(() => {
    if (!unstakeTransactionHash) {
      return
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: unstakeTransactionHash, isApprove: false }])
  }, [unstakeTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes])


  const handleClaim = async () => {
    try {
      setShowClaimModal(false);
      setOpenModalTransactionSubmitting(true);
      await linearClaimToken();
      setOpenModalTransactionSubmitting(false);
      reload && reload();
    } catch (err) {
      setShowClaimModal(false);
      setOpenModalTransactionSubmitting(false);
      console.log(err)
    }
  }

  useEffect(() => {
    if (!claimTransactionHash) {
      return
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: claimTransactionHash, isApprove: false }])
  }, [claimTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes])


  const handleClaimPendingWithdraw = async () => {
    try {
      setOpenModalTransactionSubmitting(true);
      await linearClaimPendingWithdraw();
      setOpenModalTransactionSubmitting(false);
      reload && reload();
    } catch (err) {
      setOpenModalTransactionSubmitting(false);
      console.log(err)
    }
  }

  useEffect(() => {
    if (!claimPendingTransactionHash) {
      return
    }
    setOpenModalTransactionSubmitting(false);
    setTransactionHashes([{ tnx: claimPendingTransactionHash, isApprove: false }])
  }, [claimPendingTransactionHash, setOpenModalTransactionSubmitting, setTransactionHashes])

  // const onShowSwitchPoolModal = () => {
  //   setShowSwitchModal(true);
  // }

  // const onCloseSwitchModal = () => {
  //   setShowSwitchModal(false);
  // }

  // const { linearSwitchPool, transactionHash: transactionHashSwitchPool } = useSwitchPool(poolDetail.pool_address)
  // const [idSwitched, setIdSwitched] = useState();
  // const onSwitchPool = async (fromId: number, toId: number) => {
  //   setOpenModalTransactionSubmitting(true);
  //   await linearSwitchPool(fromId, toId);
  //   setOpenModalTransactionSubmitting(false);
  //   reload && reload();
  // }

  // useEffect(() => {
  //   if (!transactionHashSwitchPool) {
  //     return
  //   }
  //   setOpenModalTransactionSubmitting(false);
  //   setTransactionHashes([{ tnx: transactionHashSwitchPool, isApprove: false }])
  // }, [transactionHashSwitchPool, setTransactionHashes, setOpenModalTransactionSubmitting])


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
    return appChainID !== ChainDefault.id || appChainID !== walletChainID;
  }, [appChainID, walletChainID]);

  // const [poolOpening, setPoolOpening] = useState(-1);

  const [expanded, setExpaned] = useState<boolean>(props.expandedDetail);

  return (
    <Accordion className={styles.pool} expanded={expanded}>
      <AccordionSummary
        expandIcon={<ArrowIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        onClick={() => setExpaned(b => !b)}
      >
        <div className={styles.accordionSummaryContent}>
          <div className="pool--sumary">
            <img src={poolDetail?.logo} className="pool--logo" alt="" />
            <div className="pool--sumary-block">
              <div className={styles.textPrimary} style={{ fontSize: '20px' }}>
                {poolDetail?.title}
              </div>
              <div className={styles.textSecondary + ' mobile-hidden'}>
                {
                  poolDetail?.rkp_rate > 0 ?
                    <span>With IDO</span> :
                    <span style={{ color: '#D0AA4D' }}>Without IDO</span>
                }
              </div>
            </div>
            {/* <div className="pool--sumary-block pool--sumary-block__min-width">
          <div className={styles.textSecondary}>
            Earned
          </div>
          <div className={styles.textPrimary}>
            {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)} {tokenDetails?.symbol}
          </div>
        </div> */}
            {/* <div className="pool--sumary-block pool--sumary-block__min-width-sm">
          <div className={styles.textSecondary}>
            APR
          </div>
          <div className={styles.textAPR}>
            {poolDetail?.APR}%
            {
              Number(poolDetail?.lockDuration) === 0 &&
              <svg width="16" height="16" className="mobile-hidden" style={{marginLeft: '4px'}} onClick={(e) => {e.stopPropagation();setShowROIModal(true)}} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.10754 3.28003H10.8738L8.17041 0.436157V2.33923C8.17041 2.85474 8.5885 3.28003 9.10754 3.28003Z" fill="#AEAEAE"/>
                <path d="M10.9059 7.3855C8.53064 7.3855 6.59863 9.31738 6.59863 11.6927C6.59863 14.068 8.53064 16 10.9059 16C13.2812 16 15.2133 14.068 15.2133 11.6927C15.2133 9.31738 13.2812 7.3855 10.9059 7.3855ZM13.4579 14.4357C13.4001 14.4934 13.3281 14.5222 13.2524 14.5222C13.1803 14.5222 13.1046 14.4934 13.0505 14.4393L11.9476 13.3363C11.5223 13.6715 10.9816 13.8734 10.3977 13.8734C9.01721 13.8734 7.89624 12.756 7.89624 11.3792C7.89624 10.0023 9.01721 8.88489 10.3977 8.88489C11.7782 8.88489 12.8992 10.0023 12.8992 11.3792C12.8992 11.963 12.6974 12.5037 12.3549 12.9291L13.4579 14.0284C13.5696 14.1401 13.5696 14.324 13.4579 14.4357Z" fill="#AEAEAE"/>
                <path d="M10.3979 9.46521C9.33826 9.46521 8.47314 10.3267 8.47314 11.3827C8.47314 12.4388 9.33472 13.3003 10.3979 13.3003C10.9207 13.3003 11.3964 13.0912 11.7424 12.7524C11.746 12.7488 11.7496 12.7451 11.7532 12.7416C11.7568 12.7379 11.764 12.7344 11.7676 12.7272C12.11 12.3811 12.3228 11.9054 12.3228 11.3827C12.3228 10.3231 11.4576 9.46521 10.3979 9.46521Z" fill="#AEAEAE"/>
                <path d="M6.17712 10.4528H3.0448C2.88623 10.4528 2.75647 10.3231 2.75647 10.1644C2.75647 10.0059 2.88623 9.8761 3.0448 9.8761H6.36816C6.55188 9.40759 6.797 9.01099 7.09985 8.6145H3.0448C2.88623 8.6145 2.75647 8.48486 2.75647 8.32617C2.75647 8.1676 2.88623 8.03784 3.0448 8.03784H7.64771C8.5127 7.28088 9.65894 6.79797 10.9097 6.79797C11.0286 6.79797 11.126 6.80872 11.2701 6.81958V3.85669H9.10742C8.27124 3.85669 7.59363 3.17188 7.59363 2.33923V0H2.06445C1.35071 0 0.78125 0.583862 0.78125 1.30115V12.3019C0.78125 13.0192 1.35071 13.5886 2.06445 13.5886H6.40771C6.15906 13.012 6.02209 12.3632 6.02209 11.6855C6.01843 11.2603 6.07617 10.8492 6.17712 10.4528ZM3.0448 6.2356H6.69617C6.85474 6.2356 6.9845 6.36536 6.9845 6.52405C6.9845 6.68262 6.85474 6.81238 6.69617 6.81238H3.0448C2.88623 6.81238 2.75647 6.68262 2.75647 6.52405C2.75647 6.36536 2.88623 6.2356 3.0448 6.2356Z" fill="#AEAEAE"/>
              </svg>
            }
          </div>
        </div> */}
            {/* {
          <div className="pool--sumary-block pool--sumary-block__min-width-lg mobile-hidden">
            <div className={styles.textSecondary}>
              Remaining
            </div>
            <div className={styles.textPrimary}>
              { 
                poolDetail?.cap && BigNumber.from(poolDetail?.cap).gt(BigNumber.from('0')) ? 
                `${(+utils.formatEther(BigNumber.from(poolDetail?.cap).sub(BigNumber.from(poolDetail?.totalStaked)))).toFixed(2)} ${tokenDetails?.symbol}` : 
                '-'
              } 
            </div>
          </div>
        } */}
            {/* <div className="pool--sumary-block mobile-hidden">
            <div className={styles.textSecondary}>
              Lock-up term
            </div>
            <div className={styles.textPrimary}>
              {Number(poolDetail?.lockDuration) > 0 ? `${(Number(poolDetail?.lockDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days` : 'None'}
            </div>
          </div> */}
            <Box className="pool--sumary-block">
              <div className={styles.textSecondary}>
                Withdrawal delay (days)
              </div>
              {/* <div className={styles.textPrimary}>
              {Number(poolDetail?.delayDuration) > 0 ? `${(Number(poolDetail?.delayDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days` : 'None'}
            </div> */}
            </Box>
            <Box className={clsx("pool--sumary-block", styles.delayTierBoxs)} maxWidth={((delayTiers?.length || 0) * 110) + 'px'} width="100%">
              {
                (!!delayTiers?.length) && delayTiers.map((days: number, idx: number) => (
                  <div className={styles.delayTierBox} key={idx}>
                    <h4 className={styles.textSecondary}>
                      <img src={TIERS[idx + 1].icon} alt="" />
                      {TIERS[idx + 1]?.name}
                    </h4>
                    <h5>{days} day{days > 1 && 's'}</h5>
                  </div>
                ))
              }
            </Box>
          </div>
          <div className="pool--expand-text mobile-hidden">
            Details
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails className={styles.accorditionDetails} >
        <div className="note">
          Note: NEVER transfer coin/token directly to smart contract. All
          transactions need to go through GameFi's UI.
        </div>
        <div className="pool--detail">
          <div className="pool--detail-block" style={{ paddingRight: '10px' }}>
            {/* <div className="items-center mobile-flex-row justify-between w-full">
            <div className={styles.textSecondary}>
              Earned
            </div>
            <div className={styles.textPrimary}>
              {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)} {tokenDetails?.symbol}
            </div>
          </div> */}
            {/* <div className="items-center mobile-flex-row justify-between w-full">
            <div className={styles.textSecondary}>
              APR
            </div>
            <div className={styles.textAPR}>
              {
                Number(poolDetail?.lockDuration) === 0 &&
                <svg width="16" height="16" style={{marginRight: '4px'}} onClick={(e) => {e.stopPropagation();setShowROIModal(true)}} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.10754 3.28003H10.8738L8.17041 0.436157V2.33923C8.17041 2.85474 8.5885 3.28003 9.10754 3.28003Z" fill="#AEAEAE"/>
                  <path d="M10.9059 7.3855C8.53064 7.3855 6.59863 9.31738 6.59863 11.6927C6.59863 14.068 8.53064 16 10.9059 16C13.2812 16 15.2133 14.068 15.2133 11.6927C15.2133 9.31738 13.2812 7.3855 10.9059 7.3855ZM13.4579 14.4357C13.4001 14.4934 13.3281 14.5222 13.2524 14.5222C13.1803 14.5222 13.1046 14.4934 13.0505 14.4393L11.9476 13.3363C11.5223 13.6715 10.9816 13.8734 10.3977 13.8734C9.01721 13.8734 7.89624 12.756 7.89624 11.3792C7.89624 10.0023 9.01721 8.88489 10.3977 8.88489C11.7782 8.88489 12.8992 10.0023 12.8992 11.3792C12.8992 11.963 12.6974 12.5037 12.3549 12.9291L13.4579 14.0284C13.5696 14.1401 13.5696 14.324 13.4579 14.4357Z" fill="#AEAEAE"/>
                  <path d="M10.3979 9.46521C9.33826 9.46521 8.47314 10.3267 8.47314 11.3827C8.47314 12.4388 9.33472 13.3003 10.3979 13.3003C10.9207 13.3003 11.3964 13.0912 11.7424 12.7524C11.746 12.7488 11.7496 12.7451 11.7532 12.7416C11.7568 12.7379 11.764 12.7344 11.7676 12.7272C12.11 12.3811 12.3228 11.9054 12.3228 11.3827C12.3228 10.3231 11.4576 9.46521 10.3979 9.46521Z" fill="#AEAEAE"/>
                  <path d="M6.17712 10.4528H3.0448C2.88623 10.4528 2.75647 10.3231 2.75647 10.1644C2.75647 10.0059 2.88623 9.8761 3.0448 9.8761H6.36816C6.55188 9.40759 6.797 9.01099 7.09985 8.6145H3.0448C2.88623 8.6145 2.75647 8.48486 2.75647 8.32617C2.75647 8.1676 2.88623 8.03784 3.0448 8.03784H7.64771C8.5127 7.28088 9.65894 6.79797 10.9097 6.79797C11.0286 6.79797 11.126 6.80872 11.2701 6.81958V3.85669H9.10742C8.27124 3.85669 7.59363 3.17188 7.59363 2.33923V0H2.06445C1.35071 0 0.78125 0.583862 0.78125 1.30115V12.3019C0.78125 13.0192 1.35071 13.5886 2.06445 13.5886H6.40771C6.15906 13.012 6.02209 12.3632 6.02209 11.6855C6.01843 11.2603 6.07617 10.8492 6.17712 10.4528ZM3.0448 6.2356H6.69617C6.85474 6.2356 6.9845 6.36536 6.9845 6.52405C6.9845 6.68262 6.85474 6.81238 6.69617 6.81238H3.0448C2.88623 6.81238 2.75647 6.68262 2.75647 6.52405C2.75647 6.36536 2.88623 6.2356 3.0448 6.2356Z" fill="#AEAEAE"/>
                </svg>
              }
              {poolDetail?.APR}%
            </div>
          </div> */}
            {/* {
            poolDetail?.cap && BigNumber.from(poolDetail?.cap).gt(BigNumber.from('0')) &&
            <div className="items-center mobile-flex-row justify-between w-full">
              <div className={styles.textSecondary}>
                Remaining
              </div>
              <div className={styles.textPrimary}>
                {(+utils.formatEther(BigNumber.from(poolDetail?.cap).sub(BigNumber.from(poolDetail?.totalStaked)))).toFixed(2)} {tokenDetails?.symbol}
              </div>
            </div>
          } */}
            <div className="items-center mobile-flex-row justify-between w-full">
              <div className={styles.textSecondary}>
                Lock-up term
              </div>
              <div className={styles.textPrimary}>
                {Number(poolDetail?.lockDuration) > 0 ? `${(Number(poolDetail?.lockDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days` : 'None'}
              </div>
            </div>
            <div className="items-center mobile-flex-row justify-between w-full">
              <div className={styles.textSecondary}>
                Withdrawal delay time
              </div>
              <div className={styles.textPrimary}>
                {Number(poolDetail?.delayDuration) > 0 ? `${(Number(poolDetail?.delayDuration) / ONE_DAY_IN_SECONDS).toFixed(0)} days` : 'None'}
              </div>
            </div>

            <div className="pool--detail-block__grid items-center mobile-flex-row justify-between w-full">
              <div className={styles.textSecondary}>
                Total pool amount
              </div>
              <div className={styles.textPrimary}>

                {(poolDetail?.cap && BigNumber.from(poolDetail?.cap).gt(BigNumber.from('0'))) ? `${(+utils.formatEther(poolDetail?.cap)).toFixed(2)} ${tokenDetails?.symbol}` : 'Unlimited'}
              </div>
            </div>
            {
              poolDetail?.cap && BigNumber.from(poolDetail?.cap).gt(BigNumber.from('0')) &&
              <div className={styles.progressArea}>
                <div className={styles.progress}>
                  <span
                    className={`${styles.currentProgress} ${parseFloat(progress) > 0 ? "" : "inactive"
                      }`}
                    style={{
                      width: `${parseFloat(progress) > 99
                        ? 100
                        : Math.round(parseFloat(progress))
                        }%`,
                    }}
                  >
                    <img
                      className={styles.iconCurrentProgress}
                      src="/images/icons/icon_progress.svg"
                      alt=""
                    />
                  </span>
                </div>
                <div className={styles.currentPercentage}>({Number(progress).toFixed(0)}%)</div>
              </div>
            }


            <div className="pool--detail-block__grid items-center mobile-flex-row justify-between w-full">
              <div className={styles.textSecondary}>
                Start time join
              </div>
              <div className={styles.textPrimary}>
                {moment.unix(Number(poolDetail?.startJoinTime)).format("YYYY-MM-DD HH:mm")}
              </div>
            </div>
            <div className="pool--detail-block__grid items-center mobile-flex-row justify-between w-full">
              <div className={styles.textSecondary}>
                End time join
              </div>
              <div className={styles.textPrimary}>
                {moment.unix(Number(poolDetail?.endJoinTime)).format("YYYY-MM-DD HH:mm")}
              </div>
            </div>
            {
              BigNumber.from(poolDetail?.minInvestment || '0').gt(BigNumber.from('0')) &&
              <div className="pool--detail-block__grid items-center mobile-flex-row justify-between w-full">
                <div className={styles.textSecondary}>
                  Stake amount (Min)
                </div>
                <div className={styles.textPrimary}>
                  {(+utils.formatEther(poolDetail?.minInvestment)).toFixed(2)} {tokenDetails?.symbol}/1 person
                </div>
              </div>
            }
            {
              BigNumber.from(poolDetail?.maxInvestment || '0').gt(BigNumber.from('0')) &&
              <div className="pool--detail-block__grid items-center mobile-flex-row justify-between w-full">
                <div className={styles.textSecondary}>
                  Stake amount (Max)
                </div>
                <div className={styles.textPrimary}>
                  {(+utils.formatEther(poolDetail?.maxInvestment)).toFixed(2)} {tokenDetails?.symbol}/1 person
                </div>
              </div>
            }
            {
              Number(poolDetail?.stakingJoinedTime) > 0 && Number(poolDetail?.lockDuration) > 0 &&
              <div className="pool--detail-block__grid items-center mobile-flex-row justify-between w-full">
                <div className={styles.textSecondary}>
                  Expiry Date
                </div>
                <div className={styles.textPrimary}>
                  {moment.unix(Number(poolDetail?.stakingJoinedTime) + Number(poolDetail?.lockDuration)).format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
            }
            {
              Number(poolDetail?.stakingJoinedTime) > 0 && Number(poolDetail?.lockDuration) > 0 && BigNumber.from(poolDetail?.stakingAmount || '0').gt(BigNumber.from('0')) &&
              <div className="pool--detail-block__grid items-center mobile-flex-row justify-between w-full">
                <div className={styles.textSecondary}>
                  Estimated profit
                </div>
                <div className={styles.textPrimary}>
                  {
                    Number(utils.formatEther(BigNumber.from(poolDetail?.stakingAmount || '0')
                      .mul(BigNumber.from(poolDetail?.APR || '0')).div(BigNumber.from('100'))
                      .mul(BigNumber.from(poolDetail?.lockDuration)).div(BigNumber.from(ONE_YEAR_IN_SECONDS))
                    )).toFixed(2)
                  } {tokenDetails?.symbol}
                </div>
              </div>
            }
          </div>

          {/*
        <div className="pool--detail-block pool--detail-block__claim">
           <div>
            <div className={styles.textSecondary}>
              Earned
            </div>
            <div className={styles.textPrimary}>
              {(+utils.formatEther(poolDetail?.pendingReward)).toFixed(2)} {tokenDetails?.symbol}
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
        */}
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
                  backgroundColor="#72F34B"
                  style={{ color: '#000' }}
                />
              </div>
            </div>
          }

          {
            connectedAccount && tokenAllowance.gt(BigNumber.from('0')) &&
            <div className="pool--detail-block">
              <div style={{ marginBottom: '20px' }}>
                <div className={styles.textSecondary}>
                  Staking
                </div>
                <div className={styles.textPrimary}>
                  {numberWithCommas(utils.formatEther(poolDetail?.stakingAmount), 4)} {tokenDetails?.symbol}
                </div>
              </div>

              <div className="xs-flex-row justify-between" style={{ marginTop: 'auto' }}>
                {
                  (Number(poolDetail?.startJoinTime) > 0 && Number(poolDetail?.startJoinTime) < moment().unix()) &&
                  (Number(poolDetail?.endJoinTime) > 0 && Number(poolDetail?.endJoinTime) > moment().unix()) &&
                  (BigNumber.from(poolDetail?.cap).eq(BigNumber.from('0')) || BigNumber.from(poolDetail?.cap).sub(BigNumber.from(poolDetail?.totalStaked)).gt(BigNumber.from('0'))) &&
                  <Button
                    text="Stake"
                    onClick={() => setShowStakeModal(true)}
                    backgroundColor="#72F34B"
                    style={{ color: '#000' }}
                    disabled={
                      wrongChain ||
                      (Number(poolDetail?.startJoinTime) > 0 && Number(poolDetail?.startJoinTime) > moment().unix()) ||
                      (Number(poolDetail?.endJoinTime) > 0 && Number(poolDetail?.endJoinTime) < moment().unix())
                    }
                  />
                }
                {
                  BigNumber.from(poolDetail?.stakingAmount || '0').gt(BigNumber.from('0')) &&
                  <Button
                    text="Unstake"
                    onClick={() => setShowUnstakeModal(true)}
                    backgroundColor="#191920"
                    style={{
                      color: '#72F34B',
                      border: '1px solid #72F34B',
                      margin: 'auto 0px 10px 6px',
                    }}
                    disabled={
                      wrongChain ||
                      poolDetail?.stakingAmount === "0" ||
                      (Number(poolDetail?.lockDuration) > 0 && (Number(poolDetail?.stakingJoinedTime) + Number(poolDetail?.lockDuration)) > moment().unix())
                    }
                  />
                }
                {/* {
                  BigNumber.from(poolDetail?.stakingAmount || '0').gt(BigNumber.from('0')) &&
                  <Button
                    text="Switch Pool"
                    onClick={() => {
                      setIdSwitched(poolDetail.pool_id);
                      onShowSwitchPoolModal();
                    }}
                    backgroundColor="#3232DC"
                    style={{ width: 'unset', minWidth: '100px', marginLeft: '6px' }}
                    disabled={
                      wrongChain ||
                      poolDetail?.stakingAmount === "0" ||
                      (Number(poolDetail?.lockDuration) > 0 && (Number(poolDetail?.stakingJoinedTime) + Number(poolDetail?.lockDuration)) > moment().unix())
                    }
                  />
                } */}
              </div>
            </div>
          }

          {
            connectedAccount && tokenAllowance.gt(BigNumber.from('0')) && BigNumber.from(poolDetail?.pendingWithdrawal?.amount || '0').gt(BigNumber.from('0')) &&
            <div className="pool--detail-block">
              <div className="pool--detail-block__withdraw" style={{}}>
                <div>
                  <div className={styles.textSecondary}>
                    Withdrawal Amount
                  </div>
                  <div className={styles.textPrimary}>
                    {numberWithCommas(utils.formatEther(poolDetail?.pendingWithdrawal?.amount), 4)} {tokenDetails?.symbol}
                  </div>
                </div>
                <div style={{}}>
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
                backgroundColor="#72F34B"
                style={{ color: '#000' }}
                disabled={Number(poolDetail?.pendingWithdrawal?.applicableAt) > moment().unix() || wrongChain}
              />
            </div>
          }
        </div>
      </AccordionDetails>
      {/* <ModalSwitchPool
        open={showSwitchModal}
        onClose={onCloseSwitchModal}
        idSwitched={idSwitched}
        poolsList={poolsList}
        tokenDetails={tokenDetails}
        poolDetail={poolDetail}
        tokenBalance={tokenBalance}
        amount={stakeAmount}
        stakingAmount={Number(utils.formatEther(poolDetail?.stakingAmount)).toFixed(2)}
        onConfirm={onSwitchPool} /> */}
      <ModalStake
        open={showStakeModal}
        amount={stakeAmount}
        setAmount={setStakeAmount}
        tokenDetails={tokenDetails}
        logo={poolDetail?.logo}
        tokenBalance={tokenBalance}
        min={Number(utils.formatEther(poolDetail?.minInvestment || 0)).toFixed(2)}
        max={Number(utils.formatEther(poolDetail?.maxInvestment || 0)).toFixed(2)}
        stakingAmount={utils.formatEther(poolDetail?.stakingAmount || 0)}
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
        apr={Number(poolDetail?.APR) || 0}
        rewardTokenPrice={Number(poolDetail?.reward_token_price) || 1}
        rewardToken={tokenDetails}
        acceptedToken={tokenDetails}
        onClose={() => setShowROIModal(false)}
      />
    </Accordion>
  )
}

export default LinearPool;
