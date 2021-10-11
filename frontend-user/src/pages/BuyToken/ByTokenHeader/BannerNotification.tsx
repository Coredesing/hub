import React, { useCallback, useEffect, useState } from 'react';
import { trimMiddlePartAddress } from "../../../utils/accountAddress";
import useStyles from "./styles";
import { ACCEPT_CURRENCY, PUBLIC_WINNER_STATUS, TIERS } from "../../../constants";
import { formatRoundDown, formatRoundUp, numberWithCommas } from "../../../utils/formatNumber";
import { PurchaseCurrency } from "../../../constants/purchasableCurrency";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import useTokenAllowance from "../../../hooks/useTokenAllowance";
import BigNumber from 'bignumber.js';
import useUserPurchased from "../hooks/useUserPurchased";
import moment from 'moment'
import momentTimezone from 'moment-timezone';
import { convertTimeToStringFormat } from '../../../utils/convertDate';
import { PoolStatus } from '../../../utils/getPoolStatus';
import useDetectClaimConfigApplying from "../hooks/useDetectClaimConfigApplying";
import { WrapperAlert } from '../../../components/Base/WrapperAlert';
import { AlertKYC } from '../../../components/Base/AlertKYC';
import LinkMui from '@material-ui/core/Link';
import { getApproveToken } from '../../../utils';
import { Link } from 'react-router-dom';

function BannerNotification(props: any) {
  const styles = useStyles();
  const {
    poolDetails,
    ableToFetchFromBlockchain,
    winnersList,
    // verifiedEmail,
    currentUserTier,
    // existedWinner,
    currencyName,
    userBuyLimit,
    startBuyTimeInDate,
    endBuyTimeInDate,
    isOverTimeApplyWhiteList,
    alreadyJoinPool,
    joinPoolSuccess,
    connectedAccount,
    // isKYC,
    announcementTime,
    purchasableCurrency,
    whitelistCompleted,
    whitelistLoading,
    scrollToWinner,
    poolAddress,
    tokenDetails,
    maximumBuy,
    countDownDate,
    checkKyc,
  } = props;
  const { appChainID, walletChainID } = useTypedSelector(state => state.appNetwork).data;

  // Fet User Claim Info
  const userClaimInfo = useTypedSelector(state => state.claimUserInfo).data;
  const userPurchasedValue = userClaimInfo?.userPurchased || 0;
  const userClaimed = userClaimInfo?.userClaimed || 0;
  const {
    currentClaim,
    currentClaimIndex,
    nextClaim,
    nextClaimIndex,
    maximumTokenClaimUtilNow,
  } = useDetectClaimConfigApplying(
    poolDetails,
    userPurchasedValue,
    userClaimed
  );

  // Fetch Token Allow
  const tokenToApprove = getApproveToken(appChainID, purchasableCurrency);
  const [tokenAllowance, setTokenAllowance] = useState<number | undefined>(undefined);
  const [userPurchased, setUserPurchased] = useState<number>(0);
  const [isDisplayDefaultMessage, setIsDisplayDefaultMessage] = useState<boolean>(false);

  const { retrieveTokenAllowance } = useTokenAllowance();
  const { retrieveUserPurchased } = useUserPurchased(tokenDetails, poolAddress, ableToFetchFromBlockchain);
  const fetchPoolDetails = useCallback(async () => {
    // console.log('tokenDetails, poolAddress, connectedAccount, tokenToApprove', tokenDetails, poolAddress, connectedAccount, tokenToApprove)
    if (tokenDetails && poolAddress && connectedAccount && tokenToApprove) {
      setTokenAllowance(await retrieveTokenAllowance(tokenToApprove, connectedAccount, poolAddress) as number);
      setUserPurchased(await retrieveUserPurchased(connectedAccount, poolAddress) as number);
    }
  }, [tokenDetails, connectedAccount, tokenToApprove, poolAddress]);

  useEffect(() => {
    const loadPool = async () => {
      await fetchPoolDetails();
    };
    loadPool();
  }, [connectedAccount, ableToFetchFromBlockchain]);

  useEffect(() => {
    if (connectedAccount && currentUserTier && currentUserTier.max_buy >= 0) {
      setIsDisplayDefaultMessage(true);
    }
  }, [connectedAccount, currentUserTier]);

  const now = new Date();
  const readyAllowance = ((purchasableCurrency !== PurchaseCurrency.ETH ? new BigNumber(tokenAllowance || 0).gt(0) : true));
  const isInBuying = startBuyTimeInDate && endBuyTimeInDate && startBuyTimeInDate < now && now < endBuyTimeInDate;
  const releaseTimeInDate = poolDetails?.releaseTime ? new Date(Number(poolDetails?.releaseTime) * 1000) : undefined;

  // Convert from max buy USDT to max buy Token
  const userPurchasedUsdt = formatRoundUp(
    new BigNumber(userPurchased || 0).multipliedBy(poolDetails.ethRate || poolDetails.eth_conversion_rate || 1)
  );

  return (
    <>
      {poolDetails && 'checking' in checkKyc && !checkKyc.checking && !checkKyc?.isKYC && connectedAccount &&
        <AlertKYC connectedAccount={connectedAccount} />
      }

      {checkKyc?.isKYC && currentUserTier?.level < poolDetails?.minTier &&
        <WrapperAlert type="error">
          <span>
            You haven't achieved min tier (
            {TIERS[poolDetails?.minTier]?.name || ''}
            ) to apply for Whitelist yet. To upgrade your Tier, please click&nbsp;
            <Link
              to="/staking-pools"
              style={{ color: 'white', textDecoration: 'underline', fontWeight: 600 }}
            > here </Link>
          </span>
          {' '}.
        </WrapperAlert>
      }

      {
        (poolDetails?.campaignStatus === PoolStatus.Closed) &&
        <WrapperAlert type="info">
          <span>
            The pool is over. Thank you for your participation
          </span>
        </WrapperAlert>
      }

      {
        (poolDetails?.campaignStatus === PoolStatus.Filled) &&
        <WrapperAlert type="info">
          <span>
            The pool is full. Thank you for your participation. You can claim your token on {releaseTimeInDate && convertTimeToStringFormat(releaseTimeInDate)}.
          </span>
        </WrapperAlert>
      }

      {
        (poolDetails?.campaignStatus === PoolStatus.Claimable)
        && new BigNumber(formatRoundDown(maximumTokenClaimUtilNow, 2)).gt(0)
        // && !!currentClaimIndex
        &&
        <WrapperAlert type="info">
          <span>
            You can claim your tokens now. Check Claim Policy and click Claim Tokens button.
          </span>
        </WrapperAlert>
      }

      {
        isInBuying &&
        <WrapperAlert type="info">
          {
            purchasableCurrency.toUpperCase() === ACCEPT_CURRENCY.ETH?.toUpperCase()
              ?
              (new BigNumber(userPurchasedUsdt).lt(maximumBuy) ?    // userPurchased < maximumBuy
                <span>The pool is open now. Click Swap button to buy tokens.</span>
                :
                <span>
                  You have reached your&nbsp;
                  <span style={{ color: '#ff673e' }}>{numberWithCommas(`${userBuyLimit}`)} {currencyName} </span>&nbsp;
                  individual cap. Refer to Your Allocation for details.
                </span>
              )
              :
              (!readyAllowance ?
                <span>The pool is open now. You must first approve {currencyName} (one time only).</span>
                :
                (new BigNumber(userPurchasedUsdt).lt(maximumBuy) ?    // userPurchased < maximumBuy
                  <span>You have approved successfully. Enter the {currencyName} amount to swap tokens.</span>
                  :
                  <span>
                    You have reached your&nbsp;
                    <span style={{ color: '#ff673e' }}>{numberWithCommas(`${userBuyLimit}`)} {currencyName} </span>&nbsp;
                    individual cap. Refer to Your Allocation for details.
                  </span>
                )
              )
          }
        </WrapperAlert>
      }

      {
        (alreadyJoinPool || joinPoolSuccess) && !whitelistCompleted && !whitelistLoading && (currentUserTier && currentUserTier.level < 3) &&
        !((winnersList && winnersList.total > 0) && (poolDetails?.publicWinnerStatus === PUBLIC_WINNER_STATUS.PUBLIC)) &&
        <div className={styles.whitelistPending}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48578 0 0 4.48578 0 10C0 15.5142 4.48578 20 10 20C15.5142 20 20 15.5142 20 10C20 4.48578 15.5142 0 10 0ZM14.7559 15.1724C14.5934 15.3349 14.38 15.4167 14.1667 15.4167C13.9534 15.4167 13.7399 15.3349 13.5776 15.1724L9.41086 11.0059C9.25415 10.8501 9.16672 10.6383 9.16672 10.4167V5C9.16672 4.53918 9.53995 4.16672 10 4.16672C10.4601 4.16672 10.8333 4.53918 10.8333 5V10.0717L14.7559 13.9941C15.0816 14.3201 15.0816 14.8466 14.7559 15.1724Z" fill="#090B1B" />
          </svg>
          <p>
            We are experiencing some technical difficulties in verifying your social requirements. We will check and verify WITHIN 1 DAY.<br />
            Click Whitelist Status button to check your status. Once all social requirements are met, your whitelist application will be approved.
          </p>

        </div>
      }

      {
        (alreadyJoinPool || joinPoolSuccess) && whitelistCompleted && !whitelistLoading && startBuyTimeInDate &&
        !((winnersList && winnersList.total > 0) && (poolDetails?.publicWinnerStatus === PUBLIC_WINNER_STATUS.PUBLIC)) &&
        !isOverTimeApplyWhiteList &&
        <div className={styles.whitelistSuccess}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.0625 14.375L13.4375 15L13.0016 15.1492L10.0602 16.1555L7.10352 17.1668L4.17734 18.168L1.5625 19.0625H0.9375V18.4375L1.47227 17.1539L2.23242 15.3293L2.99258 13.5051L3.80859 11.5469L4.51289 9.85664L5.27305 8.03242L5.625 7.1875L6.25 6.5625L9.1875 9.5L12.5621 12.8746L14.0625 14.375Z" fill="#D69651" />
            <path d="M7.10391 17.1668L4.17773 18.168L1.47266 17.154L2.23281 15.3293L7.10391 17.1668Z" fill="#C78640" />
            <path d="M13.0021 15.1491L10.0607 16.1553L2.99316 13.505L3.80918 11.5468L13.0021 15.1491Z" fill="#C78640" />
            <path d="M12.5629 12.8745L4.51367 9.85657L5.27383 8.03235L9.18828 9.49993L12.5629 12.8745Z" fill="#C78640" />
            <path d="M7.8125 6.25L9.11924 4.94326C9.283 4.7795 9.375 4.55739 9.375 4.3258C9.375 4.15491 9.32485 3.98777 9.23078 3.8451C9.1367 3.70243 9.00283 3.5905 8.84576 3.52318L8.03208 3.17446C7.47874 2.93732 6.99738 2.55901 6.63618 2.0774L6.25 1.5625L7.1875 0.9375C7.59258 1.54511 8.18863 2.00037 8.88141 2.2313L9.25361 2.35537C9.65295 2.48848 10.0003 2.74387 10.2464 3.08536C10.4926 3.42685 10.625 3.83713 10.625 4.25807C10.625 4.73683 10.4537 5.19981 10.1422 5.56331L8.75 7.1875L7.8125 6.25Z" fill="#FFC431" />
            <path d="M12.1875 4.6875L11.875 2.8125L13.75 3.4375L12.1875 4.6875Z" fill="#D1E4FF" />
            <path d="M10.2422 1.55505L10.3941 0.948803L11.6439 1.2619L11.492 1.86815L10.2422 1.55505Z" fill="#FB6A83" />
            <path d="M13.2637 1.29846L14.2011 0.673133L14.548 1.19313L13.6105 1.81846L13.2637 1.29846Z" fill="#FFC431" />
            <path d="M5.94727 3.50989L6.55351 3.35801L6.86661 4.60783L6.26036 4.75971L5.94727 3.50989Z" fill="#6173E8" />
            <path d="M13.75 12.1875L15.0567 10.8808C15.2205 10.717 15.4426 10.625 15.6742 10.625C15.8451 10.625 16.0122 10.6751 16.1549 10.7692C16.2976 10.8633 16.4095 10.9972 16.4768 11.1542L16.8255 11.9679C17.0627 12.5213 17.441 13.0026 17.9226 13.3638L18.4375 13.75L19.0625 12.8125C18.4549 12.4074 17.9996 11.8114 17.7687 11.1186L17.6446 10.7464C17.5115 10.347 17.2561 9.99971 16.9146 9.75358C16.5731 9.50745 16.1629 9.375 15.7419 9.375C15.2632 9.375 14.8002 9.54626 14.4367 9.85784L12.8125 11.25L13.75 12.1875Z" fill="#6173E8" />
            <path d="M16.25 8.125L18.125 8.4375L17.5 6.5625L16.25 8.125Z" fill="#FFC431" />
            <path d="M18.1367 9.44092L18.743 9.28904L19.0561 10.5389L18.4498 10.6908L18.1367 9.44092Z" fill="#FB6A83" />
            <path d="M18.1826 6.39172L18.808 5.45429L19.328 5.80117L18.7026 6.7386L18.1826 6.39172Z" fill="#D1E4FF" />
            <path d="M15.2422 13.7489L15.3941 13.1426L16.6439 13.4557L16.492 14.062L15.2422 13.7489Z" fill="#6173E8" />
            <path d="M10 8.75L11.2446 7.29703C11.6487 6.82517 12.217 6.5245 12.8345 6.45589L12.87 6.45195C13.3996 6.39391 13.8978 6.17157 14.2947 5.8161C14.6916 5.46063 14.9673 4.98985 15.0831 4.46979V4.46978C15.1523 4.15827 15.3053 3.87157 15.5255 3.64062C15.7457 3.40966 16.0248 3.24323 16.3327 3.15926L18.75 2.5L19.0625 3.75L17.3726 4.12553C17.0389 4.19969 16.734 4.36952 16.4952 4.61424C16.2564 4.85896 16.0942 5.16796 16.0282 5.50344L16.0194 5.54859C15.9085 6.11265 15.619 6.62606 15.1938 7.01291C14.7686 7.39975 14.2301 7.63949 13.6581 7.69669L13.6212 7.70038C12.9035 7.77041 12.2424 8.12036 11.7809 8.67442C11.3713 9.16689 10.9375 9.6875 10.9375 9.6875L10 8.75Z" fill="#FB6A83" />
          </svg>
          <p>
            You have successfully applied the whitelist. Please stay tuned for the winner announcement on {momentTimezone.tz(announcementTime, moment.tz.guess()).format("dddd, MMMM DD, YYYY")}.
          </p>

        </div>
      }

      {
        ableToFetchFromBlockchain && (winnersList && +winnersList.total > 0)
        // && verifiedEmail 
        &&
        (poolDetails?.publicWinnerStatus == PUBLIC_WINNER_STATUS.PUBLIC) && (now.valueOf() < startBuyTimeInDate.valueOf()) &&
        // (currentUserTier && currentUserTier.level == TIER_LEVELS.DOVE) &&
        <>
          {connectedAccount && (userBuyLimit > 0 ? <WrapperAlert type="info">
            <span>
              The whitelist winners are out! Congratulations on your&nbsp;
              <span style={{ color: '#ff673e' }}>{numberWithCommas(`${userBuyLimit}`)} {currencyName} </span>
              allocation for {poolDetails?.title}. {' '}
              You can view the list of winners&nbsp;
              <LinkMui
                style={{
                  color: '#72F34B',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  scrollToWinner();
                }}
              >here</LinkMui>.
            </span>
          </WrapperAlert>
            : isDisplayDefaultMessage && <WrapperAlert type="error">
              <span>
                Sorry, you have not been chosen as whitelist winner.
              </span>
            </WrapperAlert>
          )}

        </>
      }
    </>
  );
}

export default BannerNotification;
