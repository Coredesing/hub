import React, { Dispatch, SetStateAction, useEffect, useState, useCallback, useMemo, useContext } from 'react';
import { AppContext } from '../../../AppContext';
import { useDispatch } from 'react-redux';
import BigNumber from 'bignumber.js';
import NumberFormat from 'react-number-format';

import TransactionSubmitModal from '../../../components/Base/TransactionSubmitModal';
import Button from '../Button';
import useStyles from './style';

import { formatRoundDown, formatRoundUp, numberWithCommas } from '../../../utils/formatNumber';
import { ACCEPT_CURRENCY, NETWORK, TIERS } from '../../../constants';
import { PurchaseCurrency } from '../../../constants/purchasableCurrency';
import { TokenType } from '../../../hooks/useTokenDetails';
import getAccountBalance from '../../../utils/getAccountBalance';
import { connectWalletSuccess } from '../../../store/actions/wallet';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useTokenAllowance from '../../../hooks/useTokenAllowance';
import useUserPurchased from '../hooks/useUserPurchased';
import usePoolDepositAction from '../hooks/usePoolDepositAction';
import useTokenApprove from '../../../hooks/useTokenApprove';
import useAuth from '../../../hooks/useAuth';
import { withWidth, isWidthDown, isWidthUp } from '@material-ui/core';
import moment from "moment";
import {
  convertTimeToStringFormat,
  convertTimeToStringFormatWithoutGMT,
  convertUnixTimeToDateTime
} from "../../../utils/convertDate";
import { getIconCurrencyUsdt } from "../../../utils/usdt";
import useTokenSold from "../hooks/useTokenSold";
import { getEtherscanName } from "../../../utils/network";
import { alertFailure } from "../../../store/actions/alert";
import { Recapcha } from '../../../components/Base/Recapcha';
import { getApproveToken } from '../../../utils';

const REGEX_NUMBER = /^-?[0-9]{0,}[.]{0,1}[0-9]{0,6}$/;

type BuyTokenFormProps = {
  tokenDetails: TokenType | undefined,
  rate: number | undefined,
  poolAddress: string | undefined;
  maximumBuy: number;
  minimumBuy: number;
  poolAmount: number | undefined;
  purchasableCurrency: string | undefined;
  poolId: number | undefined;
  joinTime: Date | undefined;
  method: string | undefined;
  availablePurchase: boolean | undefined;
  ableToFetchFromBlockchain: boolean | undefined
  minTier: any | undefined
  isDeployed: boolean | undefined
  endBuyTimeInDate: Date | undefined
  startBuyTimeInDate: Date | undefined
  endJoinTimeInDate: Date | undefined
  tokenSold: string | undefined
  setBuyTokenSuccess: Dispatch<SetStateAction<boolean>>
  isClaimable: boolean | undefined
  currentUserTier: any,
  alreadyJoinPool: any,
  joinPoolSuccess: boolean,
  // existedWinner: any,
  disableAllButton: boolean,
  networkAvailable: string,
  poolDetailsMapping: any,
  poolDetails: any,
  isKyc?: boolean,
  isInPreOrderTime: boolean,
}

enum MessageType {
  error = 'error',
  warning = 'warning'
}

const BuyTokenForm: React.FC<BuyTokenFormProps> = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [openApproveModal, setApproveModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [estimateTokens, setEstimateTokens] = useState<number>(0);
  const [tokenAllowance, setTokenAllowance] = useState<number | undefined>(undefined);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [userPurchased, setUserPurchased] = useState<number>(0);
  const [poolBalance, setPoolBalance] = useState<number>(0);
  const [loadingPoolInfo, setLoadingPoolInfo] = useState<boolean>(false);

  const {
    tokenDetails,
    rate,
    poolAddress,
    maximumBuy,
    purchasableCurrency,
    poolId,
    availablePurchase,
    ableToFetchFromBlockchain,
    minTier,
    isDeployed,
    minimumBuy,
    poolAmount,
    startBuyTimeInDate,
    endBuyTimeInDate,
    endJoinTimeInDate,
    tokenSold,
    setBuyTokenSuccess,
    isClaimable,
    currentUserTier,
    joinPoolSuccess,
    alreadyJoinPool,
    // existedWinner,
    disableAllButton,
    networkAvailable,
    poolDetailsMapping,
    poolDetails,
    isKyc,
    isInPreOrderTime,
  } = props;

  const {
    loginError,
    currentConnectedWallet,
  } = useContext(AppContext);

  const currentAccount = currentConnectedWallet && currentConnectedWallet.addresses[0];
  const balance = currentConnectedWallet ? currentConnectedWallet.balances[currentAccount] : 0;

  const { connectedAccount, wrongChain } = useAuth();
  const { appChainID, walletChainID } = useTypedSelector(state => state.appNetwork).data;
  const connector = useTypedSelector(state => state.connector).data;

  const [verifiedCapcha, setVerifiedCapcha] = useState<string>('');
  const onVerifyCapcha = (token: string | null) => {
    setVerifiedCapcha(token || '')
  }

  const etherscanName = getEtherscanName({ networkAvailable });
  const {
    deposit,
    tokenDepositLoading,
    tokenDepositTransaction,
    depositError,
    tokenDepositSuccess
  } = usePoolDepositAction({ poolAddress, poolId, purchasableCurrency, amount: input, isClaimable, networkAvailable, captchaToken: verifiedCapcha});

  const { currencyIcon, currencyName } = getIconCurrencyUsdt({ purchasableCurrency, networkAvailable });
  const { retrieveTokenAllowance } = useTokenAllowance();
  const { retrieveUserPurchased } = useUserPurchased(tokenDetails, poolAddress, ableToFetchFromBlockchain);

  const tokenToApprove = useMemo(() => {
    return getApproveToken(appChainID, purchasableCurrency)
  }, [appChainID, purchasableCurrency]);

  const { approveToken, tokenApproveLoading, transactionHash } = useTokenApprove(
    tokenToApprove,
    connectedAccount,
    poolAddress,
    false
  );

  const { retrieveTokenBalance } = useTokenBalance(tokenToApprove, connectedAccount);

  const remainingAmount = formatRoundDown(
    new BigNumber(maximumBuy).minus(new BigNumber(userPurchased).multipliedBy(rate))
  );

  // Check if user already buy ICO token at the first time or not ?
  const firstBuy = localStorage.getItem('firstBuy') || undefined;
  let parsedFirstBuy = {} as any;
  if (firstBuy) {
    try {
      parsedFirstBuy = JSON.parse(firstBuy);
    }
    catch (err) {
      console.log(err.message);
    }
  }

  // Check if user already buy at least minimum tokens at the first time
  const connectedAccountFirstBuy =
    connectedAccount
      ? (
        parsedFirstBuy[poolAddress] ? parsedFirstBuy[poolAddress][connectedAccount] : false
      )
      : false;

  const availableMaximumBuy = useMemo(() => {
    // Check if max buy greater than total ICO coins sold
    const maxBuy = new BigNumber(remainingAmount);
    if (maxBuy.gt(tokenBalance)) {
      return (new BigNumber(tokenBalance).gt(0)) ? formatRoundDown(new BigNumber(tokenBalance)) : '0';
    }

    return maxBuy.gt(0) ? formatRoundDown(maxBuy) : '0';
  }, [tokenBalance, maximumBuy, userPurchased, poolAmount, tokenSold, rate]);

  const { retrieveTokenSold, tokenSold: totalUserTokenSold } = useTokenSold(tokenDetails, poolAddress, ableToFetchFromBlockchain);
  const poolErrorBeforeBuy = useMemo(() => {
    if (minimumBuy && input && new BigNumber(input || 0).lt(minimumBuy) && !connectedAccountFirstBuy && new Date() > startBuyTimeInDate) {
      return {
        message: `The minimum amount you must trade is ${new BigNumber(minimumBuy).toFixed(2)} ${currencyName}.`,
        type: MessageType.error
      }
    }

    // if (
    //   input &&
    //   new BigNumber(estimateTokens).gt(new BigNumber(poolAmount))
    // ) {
    //   return {
    //     message: `You can only buy  up to ${numberWithCommas(
    //       `${new BigNumber(poolAmount).minus(userPurchased || 0).toFixed()}`
    //     )} ${tokenDetails?.symbol}.`,
    //     type: MessageType.error
    //   }
    // }

    return;
  }, [endJoinTimeInDate, startBuyTimeInDate, minimumBuy, input, connectedAccountFirstBuy, estimateTokens, poolAmount, currencyName, totalUserTokenSold, tokenDetails?.symbol]);

  let enableApprove = false;
  let activeDisableStep1 = false;
  let activeStep2 = false;
  let activeStep2Bought = false;


  // Check whether current user's tier is valid or not
  /* const validTier = new BigNumber(userTier).gte(minTier); */

  // Check multiple conditions for purchasing time
  const purchasable =
    availablePurchase
    && estimateTokens > 0
    && !poolErrorBeforeBuy
    // && new BigNumber(input).lte(new BigNumber(maximumBuy))
    // && new BigNumber(input).lte(remainingAmount)
    // && new BigNumber(estimateTokens).lte(new BigNumber(poolAmount).minus(tokenSold))
    // && new BigNumber(tokenBalance).gte(new BigNumber(input))
    // && validTier
    && !wrongChain
    && !disableAllButton
    && ((purchasableCurrency !== PurchaseCurrency.ETH ? new BigNumber(tokenAllowance || 0).gt(0) : true));


  // Actually I don't know why i'm doing it right here :)))
  if (tokenAllowance != null || tokenAllowance != undefined) {
    if (
      (tokenAllowance <= 0 || new BigNumber(tokenAllowance).lt(new BigNumber(input)))
      && (purchasableCurrency && purchasableCurrency !== PurchaseCurrency.ETH)
      && !wrongChain && ableToFetchFromBlockchain && isDeployed
      // && (alreadyJoinPool || joinPoolSuccess)
      // && new BigNumber(maximumBuy).gt(0) 
      && !disableAllButton
    ) {
      enableApprove = true;
    }
    const isAlreadyJoinPool = (alreadyJoinPool || joinPoolSuccess);
    if (isAlreadyJoinPool) {
      // if (new BigNumber(maximumBuy).gt(0)) {
      //   if (new BigNumber(tokenAllowance).gt(0)) {
      //     enableApprove = false;
      //   } else {
      //     enableApprove = true;
      //   }
      // } else {
      //   enableApprove = false;
      // }
      if (new BigNumber(tokenAllowance).gt(0)) {
        enableApprove = false;
      } else {
        enableApprove = true;
      }
    }
    
    if (tokenAllowance > 0) {
      activeDisableStep1 = true;
      activeStep2 = true;
    }
    if (userPurchased > 0) {
      activeDisableStep1 = true;
      activeStep2 = true;
      activeStep2Bought = true;
    }
  }


  // Fetch User balance
  const fetchUserBalance = useCallback(async () => {
    if (appChainID && connectedAccount && connector) {
      const accountBalance = await getAccountBalance(appChainID, walletChainID, connectedAccount as string, connector);

      dispatch(
        connectWalletSuccess(
          connector,
          [connectedAccount],
          {
            [connectedAccount]: new BigNumber(accountBalance._hex).div(new BigNumber(10).pow(18)).toFixed(5)
          }
        )
      )
    }
  }, [connector, appChainID, walletChainID, connectedAccount]);

  const fetchPoolDetails = useCallback(async () => {
    if (tokenDetails && poolAddress && connectedAccount && tokenToApprove) {
      setTokenAllowance(await retrieveTokenAllowance(tokenToApprove, connectedAccount, poolAddress) as number);
      setUserPurchased(await retrieveUserPurchased(connectedAccount, poolAddress) as number);
      setWalletBalance(await retrieveTokenBalance(tokenDetails, connectedAccount) as number);
      setPoolBalance(await retrieveTokenBalance(tokenDetails, poolAddress) as number);
    }

  }, [tokenDetails, connectedAccount, tokenToApprove, poolAddress]);

  useEffect(() => {
    if(connectedAccount && tokenToApprove) {
      retrieveTokenBalance(tokenToApprove, connectedAccount).then(balance => {
        setTokenBalance(balance as number);
      })
    }
  }, [connectedAccount, tokenToApprove])

  useEffect(() => {
    if(!connectedAccount) {
      setTokenBalance(0);
    }
  }, [connectedAccount])

  useEffect(() => {
    if (maximumBuy && userPurchased && rate) {
      const remainingAmountObject = new BigNumber(remainingAmount);
      remainingAmountObject.gt(0) && setInput(remainingAmountObject.toFixed(2));
    }

    return () => {
      setInput("");
    }
  }, [maximumBuy, userPurchased, rate]);

  useEffect(() => {
    const fetchPoolDetailsBlockchain = async () => {
      await fetchPoolDetails();
      setLoadingPoolInfo(false);
    }

    loadingPoolInfo && fetchPoolDetailsBlockchain();
  }, [loadingPoolInfo]);

  // Handle for fetching pool general information 1 time
  useEffect(() => {
    const fetchTokenPoolAllowance = async () => {
      try {
        setLoadingPoolInfo(true);
      } catch (err) {
        setLoadingPoolInfo(false);
      }
    }

    ableToFetchFromBlockchain && connectedAccount && fetchTokenPoolAllowance();
  }, [connectedAccount, ableToFetchFromBlockchain]);

  // Check if has any error when deposit => close modal
  useEffect(() => {
    if (depositError) {
      setOpenSubmitModal(false);
    }
  }, [depositError]);

  // Re-fetch user balance when deposit successful
  useEffect(() => {
    const handleWhenDepositSuccess = async () => {
      setBuyTokenSuccess(true);
      await fetchUserBalance();
      await fetchPoolDetails();
    }

    tokenDepositSuccess && handleWhenDepositSuccess();
  }, [tokenDepositSuccess]);

  useEffect(() => {
    if (tokenDepositTransaction) {
      //  Clear input field and additional information field below and close modal
      setInput("");
      setEstimateTokens(0);

      if (!connectedAccountFirstBuy) {
        localStorage.setItem("firstBuy", JSON.stringify(Object.assign({}, {
          ...parsedFirstBuy,
          [poolAddress as string]: {
            ...parsedFirstBuy[poolAddress],
            [connectedAccount as string]: true
          }
        })));
      }
    }
  }, [tokenDepositTransaction, connectedAccountFirstBuy]);

  useEffect(() => {
    if (input && rate && purchasableCurrency) {
      const tokens = new BigNumber(input).multipliedBy(new BigNumber(1).div(rate)).toNumber()
      const tokenWithDecimal = new BigNumber(tokens).decimalPlaces(6).toNumber();
      setEstimateTokens(tokenWithDecimal);
    } else {
      setEstimateTokens(0);
    }
  }, [input, purchasableCurrency, rate]);

  const handleInputChange = async (e: any) => {
    const value = e.target.value.replaceAll(",", "");
    if (value === '' || REGEX_NUMBER.test(value)) {
      setInput(value);
    }
  }

  const validateDeposit = () => {
    // Check over buy Currency
    // Example:
    // Total Max Allocate: 300.43
    // Bought: 5
    // Remain: 295.43
    const currencyUserBought = formatRoundUp(new BigNumber(userPurchased).multipliedBy(poolDetails?.ethRate || 0)); // ROUND_UP: 4.999999999999999999987744 --> 5
    const remainCurrencyAvailable = formatRoundDown(new BigNumber(maximumBuy).minus(currencyUserBought)); // ROUND_DOWN: 295.435424132100000000012256 --> 295.43
    if (!verifiedCapcha) {
      dispatch(alertFailure(`Recaptcha requires verification.`));
      return false
    }
    const isOverMaxBuy = new BigNumber(input).gt(remainCurrencyAvailable);
    if (isOverMaxBuy) {
      dispatch(alertFailure(`You can only buy up to ${numberWithCommas(remainCurrencyAvailable, 2)} ${currencyName}`));
      return false;
    }

    // Check over Token
    const remainToken = new BigNumber(poolAmount).minus(tokenSold).toFixed();
    const isOverRemainToken = new BigNumber(estimateTokens).gt(remainToken);
    if (isOverRemainToken) {
      dispatch(alertFailure(`Not enough token for sale, you can only buy up to ${numberWithCommas(remainToken, 2)} ${tokenDetails?.symbol}`));
      return false;
    }

    return true;
  };

  const handleTokenDeposit = async () => {
    const isValid = validateDeposit();
    if (!isValid) {
      return false;
    }
    try {
      if (purchasableCurrency && ableToFetchFromBlockchain) {
        setOpenSubmitModal(true);
        setBuyTokenSuccess(false);

        // Call to smart contract to deposit token and refetch user balance
        await deposit();
      }
    } catch (err) {
      setOpenSubmitModal(false);
    }
  }

  const handleTokenApprove = async () => {
    try {
      setApproveModal(true);
      await approveToken();

      if (tokenDetails && poolAddress && connectedAccount && tokenToApprove) {
        setTokenAllowance(await retrieveTokenAllowance(tokenToApprove, connectedAccount, poolAddress) as number);
        setTokenBalance(await retrieveTokenBalance(tokenToApprove, connectedAccount) as number);
      }
    } catch (err) {
      setApproveModal(false);
    }
  }

  return (
    <div className={styles.buyTokenForm}>
      <div className={styles.leftBuyTokenForm}>
        <h2 className={styles.title}>Swap Tokens</h2>

        <div className={styles.buyTokenFormTitle}>
          <div className={styles.allowcationWrap}>
            <span className={styles.allowcationTitle}>Max Allocation: </span>
            <span className={styles.allocationContent}>
              {numberWithCommas(
                formatRoundDown(new BigNumber(maximumBuy))
              )} {currencyName}
            </span>
          </div>

          <div className={styles.allowcationWrap}>
            <span className={styles.allowcationTitle}>Have Bought: </span>
            <span className={styles.allocationContent}>
              {numberWithCommas(
                formatRoundUp(new BigNumber(userPurchased).multipliedBy(rate))  // Round UP with 2 decimal places: 1.369999 --> 1.37
              )} {currencyName}
            </span>
          </div>

          <div className={styles.allowcationWrap}>
            <span className={styles.allowcationTitle}>Remaining: </span>
            <span className={styles.allocationContent}>
              {numberWithCommas(
                new BigNumber(remainingAmount).lte(0)
                  ? '0'
                  : (
                    formatRoundDown(new BigNumber(remainingAmount)) // Round DOWN with 2 decimal places: 1.369999 --> 1.36
                  )
              )} {currencyName}
            </span>
          </div>

          <div className={styles.allowcationWrap}>
            <span className={styles.allowcationTitle}>{TIERS[currentUserTier?.level]?.name} Tier Buy Time: </span>
            <span className={styles.allocationContent}>
              {!!currentUserTier && !!currentUserTier.start_time && !!currentUserTier.end_time &&
                <>
                  {convertUnixTimeToDateTime(currentUserTier.start_time, 1) ?? 'TBA'} - <br />
                  {convertUnixTimeToDateTime(currentUserTier.end_time, 1) ?? 'TBA'}
                </>
              }
            </span>
          </div>
        </div>
      </div>

      <div className={styles.rightBuyTokenForm}>
        {
          purchasableCurrency.toUpperCase() !== ACCEPT_CURRENCY.ETH?.toUpperCase() &&
          <div className={styles.listStep}>
            <div className={`${!enableApprove ? '' : styles.stepOneActive} ${activeDisableStep1 && styles.activeDisableStep1} ${styles.step}`}>
              {activeDisableStep1 && <img src="/images/icon_avtive_step.svg" alt="" />}
              Step 1: Approve
            </div>
            <div className={`${activeStep2 && styles.stepTwoActive} ${styles.step}`}>
              {activeStep2Bought && <img src="/images/icon_avtive_step.svg" alt="" />}
              Step 2: Swap
            </div>
          </div>
        }

        <div className={styles.title2}>
          Your Wallet Balance&nbsp;
          <div className={styles.currencyName}>
            {numberWithCommas(parseFloat(tokenBalance.toString()).toFixed(6))}&nbsp;
            {currencyName}

            {/* {
              currentAccount && (!loginError ? `${balance} ${appChainID === ETH_CHAIN_ID ? "ETH" : "BNB"}` : '0')
            } */}
          </div>
        </div>

        <div className={styles.buyTokenInputForm}>
          <div className={styles.buyTokenInputWrapper}>
            <NumberFormat
              className={styles.buyTokenInput}
              placeholder={'Enter amount'}
              thousandSeparator={true}
              onChange={handleInputChange}
              decimalScale={6}
              value={input}
              defaultValue={maximumBuy || 0}
              max={tokenBalance}
              min={0}
              maxLength={255}
              disabled={wrongChain}
            />
            <span className={styles.purchasableCurrency}>
              {/* <img src={currencyIcon} alt={purchasableCurrency} className={styles.purchasableCurrencyIcon} /> */}
              {currencyName}
              <button
                className={styles.purchasableCurrencyMax}
                onClick={
                  () => {
                    setInput(formatRoundDown(availableMaximumBuy))
                  }
                }
              >
                Max
              </button>
            </span>
          </div>
        </div>

        {/* <p className={styles.buyTokenFee}>
          Your Balance: {numberWithCommas(`${walletBalance || 0}` )} {tokenDetails?.symbol}
        </p> */}

        <div className={styles.buyTokenEstimate}>
          <p className={styles.title2}>You will get approximately</p>
          <strong className={styles.buyTokenEstimateAmount}>{numberWithCommas(`${estimateTokens || 0}`, 2)} {tokenDetails?.symbol}</strong>
        </div>

        {
          <p className={`${poolErrorBeforeBuy?.type === MessageType.error ? `${styles.poolErrorBuy}` : `${styles.poolErrorBuyWarning}`}`}>
            {poolErrorBeforeBuy && poolErrorBeforeBuy.message}
          </p>
        }

        {(purchasableCurrency !== PurchaseCurrency.ETH) && (purchasableCurrency.toUpperCase() !== ACCEPT_CURRENCY.ETH?.toUpperCase()) &&
          <p className={styles.approveWarning}>{`You need to Approve once (and only once) before you can start purchasing.`}</p>
        }
        {
          !enableApprove && maximumBuy && maximumBuy > 0 &&
          <Recapcha onChange={onVerifyCapcha} className={styles.captchaContainer} />
        }

        <div className={styles.btnGroup}>
          <div>
            {
              purchasableCurrency.toUpperCase() !== ACCEPT_CURRENCY.ETH?.toUpperCase() &&
              <Button
                text={new BigNumber(tokenAllowance || 0).gt(0) ? 'Approved' : 'Approve'}
                backgroundColor={'#29C08A'}
                disabled={!enableApprove}
                onClick={handleTokenApprove}
                loading={tokenApproveLoading}
              />
            }
          </div>

          <div>
            <Button
              text={isInPreOrderTime ? 'Pre-order' : 'Swap'}
              backgroundColor={'#72F34B'}
              disabled={!purchasable || !verifiedCapcha}
              onClick={handleTokenDeposit}
              loading={tokenDepositLoading}
            />
          </div>
        </div>

        <TransactionSubmitModal
          opened={openSubmitModal}
          handleClose={() => { setOpenSubmitModal(false); }}
          transactionHash={tokenDepositTransaction}
        />
        <TransactionSubmitModal
          additionalText={`Please be patient and no need to approve again, you can check the transaction status on ${etherscanName}.`}
          opened={openApproveModal}
          handleClose={() => { setApproveModal(false); }}
          transactionHash={transactionHash}
        />
      </div>
    </div>
  )
}

export default withWidth()(BuyTokenForm);
