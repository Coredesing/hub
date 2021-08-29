import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import {approve, getAllowance} from '../../../store/actions/sota-token';
import {deposit, getUserInfo, getUserTier} from '../../../store/actions/sota-tiers';
import {useWeb3React} from '@web3-react/core';
import BigNumber from 'bignumber.js';
import {CONVERSION_RATE} from '../../../constants';
import {numberWithCommas} from '../../../utils/formatNumber';
import NumberFormat from 'react-number-format';
import {Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress} from '@material-ui/core';
import useTokenDetails from "../../../hooks/useTokenDetails";
import ModalTransaction from "../ModalTransaction";
import {sotaTiersActions} from "../../../store/constants/sota-tiers";
import {sotaTokenActions} from "../../../store/constants/sota-token";
import useUserTier from "../../../hooks/useUserTier";
import ButtonLink from "../../../components/Base/ButtonLink";
import DefaultLayout from "../../../components/Layout/DefaultLayout";
import { ETH_CHAIN_ID } from '../../../constants/network'
import {getBalance} from "../../../store/actions/balance";
import { WrapperAlert } from '../../../components/Base/WrapperAlert';

const closeIcon = '/images/icons/close.svg';
const iconWarning = "/images/warning-red.svg";
const REGEX_NUMBER = /^-?[0-9]{0,}[.]{0,1}[0-9]{0,6}$/;

const TOKEN_ADDRESS = process.env.REACT_APP_PKF || '';
const TOKEN_UNI_ADDRESS = process.env.REACT_APP_UNI_LP || '';
const TOKEN_MANTRA_ADDRESS = process.env.REACT_APP_MANTRA_LP || '';

const DEPOSIT_STAGE = {
  APPROVED: 0,
  NEED_APPROVE: 1,
  STAKE: 2
}
const tickIcon = '/images/icons/tick_blue.svg'

const Deposit = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const commonStyles = useCommonStyle();

  const [depositAmount, setDepositAmount] = useState('');
  const [disableDeposit, setDisableDeposit] = useState(true);

  const {tokenDetails: tokenPKFDetails} = useTokenDetails(TOKEN_ADDRESS, 'eth');
  const {tokenDetails: tokenUniLPDetails} = useTokenDetails(TOKEN_UNI_ADDRESS, 'eth');
  const {tokenDetails: tokenMantraLPDetails} = useTokenDetails(TOKEN_MANTRA_ADDRESS, 'eth');
  const [listTokenDetails, setListTokenDetails] = useState([]) as any;
  const [openModalTransactionSubmitting, setOpenModalTransactionSubmitting] = useState(false)
  const [transactionHashes, setTransactionHashes] = useState([]) as any;

  const { data: depositTransaction, error: depositError } = useSelector((state: any) => state.deposit);
  const { data: approveTransaction, error: approveError } = useSelector((state: any) => state.approve);

  const {data: allowance = 0} = useSelector((state: any) => state.allowance);
  const {data: userInfo = {}} = useSelector((state: any) => state.userInfo);
  const {data: balance = {}} = useSelector((state: any) => state.balance);
  const {loading} = useSelector((state: any) => state.approve);
  const {account: connectedAccount, library} = useWeb3React();
  const {data: appChainID} = useSelector((state: any) => state.appNetwork);
  const {data: rates} = useSelector((state: any) => state.rates);

  const [stage, setStage] = useState(DEPOSIT_STAGE.NEED_APPROVE)

  const [currentToken, setCurrentToken] = useState(undefined) as any;
  const [currentBalance, setCurrentBalance] = useState('0');
  const [currentStaked, setCurrentStaked] = useState('0');
  const [currentAllowance, setCurrentAllowance] = useState('0');
  const [currentRate, setCurrentRate] = useState(0);

  const {total} = useUserTier(connectedAccount || '', 'eth')

  const setDefaultToken = () => {
    if(!currentToken) {
      setCurrentToken(listTokenDetails[0])
      setCurrentBalance(balance.pkf)
      setCurrentStaked(userInfo.pkfStaked)
      setCurrentAllowance(allowance.pkf)
      setCurrentRate(1)
    } else if (currentToken.symbol === 'PKF') {
      setCurrentBalance(balance.pkf)
      setCurrentStaked(userInfo.pkfStaked)
      setCurrentAllowance(allowance.pkf)
    } else if ((currentToken.symbol === CONVERSION_RATE[0].key && appChainID.appChainID === '5')
      || (currentToken.symbol === CONVERSION_RATE[0].keyMainnet && appChainID.appChainID === '1')) {
      setCurrentBalance(balance.uni)
      setCurrentStaked(userInfo.uniStaked)
      setCurrentAllowance(allowance.uni)
    } else if ((currentToken.symbol === CONVERSION_RATE[1].key && appChainID.appChainID === '5')
      || (currentToken.symbol === CONVERSION_RATE[1].keyMainnet && appChainID.appChainID === '1')) {
      setCurrentBalance(balance.mantra)
      setCurrentStaked(userInfo.mantraStaked)
      setCurrentAllowance(allowance.mantra)
    }
  }

  useEffect(() => {
    if(connectedAccount) {
      dispatch(getUserInfo(connectedAccount));
      dispatch(getAllowance(connectedAccount));
      dispatch(getBalance(connectedAccount));
    }
  }, [connectedAccount, dispatch]);

  useEffect(() => {
    if(!currentAllowance || currentAllowance === '0') {
      setStage(DEPOSIT_STAGE.NEED_APPROVE)
    } else {
      setStage(DEPOSIT_STAGE.APPROVED)
    }
  }, [currentAllowance])

  useEffect(() => {
    if(depositTransaction?.hash) {
      setTransactionHashes([...transactionHashes, {tnx: depositTransaction.hash, isApprove: false}]);
      setOpenModalTransactionSubmitting(false);
      dispatch({
        type: sotaTiersActions.DEPOSIT_SUCCESS,
        payload: undefined,
      });
    }
    if(depositError.message) setOpenModalTransactionSubmitting(false);
  }, [depositTransaction, depositError])

  useEffect(() => {
    if(approveTransaction?.hash) {
      setTransactionHashes([...transactionHashes, {tnx: approveTransaction.hash, isApprove: true}]);
      setOpenModalTransactionSubmitting(false);
      setStage(DEPOSIT_STAGE.STAKE)
      dispatch({
        type: sotaTokenActions.APPROVE_SUCCESS,
        payload: undefined,
      });
    }
    if(approveError.message) setOpenModalTransactionSubmitting(false);
  }, [approveTransaction, approveError])

  useEffect(() => {
    setListTokenDetails([tokenPKFDetails, tokenUniLPDetails, tokenMantraLPDetails]);
  }, [tokenPKFDetails, tokenUniLPDetails, tokenMantraLPDetails]);

  useEffect(() => {
    setDefaultToken();
  }, [allowance, balance, userInfo, listTokenDetails])

  useEffect(() => {
    if (depositAmount === '' || depositAmount === '0') {
      setDisableDeposit(true)
      return
    }
    if (!connectedAccount) return
    if (!isNaN(parseFloat(currentBalance))
      && !isNaN(parseFloat(depositAmount))) {
      const tokenBalance = new BigNumber(currentBalance).multipliedBy(new BigNumber(10).pow(18))
      const amount = new BigNumber(depositAmount).multipliedBy(new BigNumber(10).pow(18))
      const zero = new BigNumber('0')
      setDisableDeposit(tokenBalance.lt(amount) || amount.lte(zero))
    }
  }, [connectedAccount, balance, depositAmount, currentToken]);

  useEffect(() => {
    if (listTokenDetails.length === 0 || rates.length === 0 || !currentToken) return
    if (currentToken?.symbol === listTokenDetails[0]?.symbol) {
      setCurrentRate(1)
    } else if (currentToken?.symbol === listTokenDetails[1]?.symbol) {
      if (rates?.data && rates?.data.length > 0) {
        setCurrentRate(parseFloat(rates?.data[0]?.rate));
      }
    } else if (currentToken?.symbol === listTokenDetails[2]?.symbol) {
      setCurrentRate(parseFloat(rates?.data[1]?.rate))
    }
  }, [rates, currentToken, listTokenDetails])

  const onDeposit = () => {
    if (disableDeposit) return
    dispatch(deposit(connectedAccount, depositAmount, library, currentToken.address));
    setOpenModalTransactionSubmitting(true);
    setDepositAmount('')
    setDefaultToken();
  }

  const onApprove = () => {
    dispatch(approve(connectedAccount, library, currentToken.address));
    setOpenModalTransactionSubmitting(true);
  }

  const handleClose = () => {
    setDepositAmount('')
    setDefaultToken();
  }

  const handleSelectToken = (e: any) => {
    const tokens = listTokenDetails.filter((tokenDetails: any) => {
      return tokenDetails.symbol === e.target.value
    })
    setCurrentToken(tokens[0])
    if (e.target.value === 'PKF') {
      setCurrentBalance(balance.pkf)
      setCurrentStaked(userInfo.pkfStaked)
      setCurrentAllowance(allowance.pkf)
    } else if ((e.target.value === CONVERSION_RATE[0].key && appChainID.appChainID === '5')
      || (e.target.value === CONVERSION_RATE[0].keyMainnet && appChainID.appChainID === '1')) {
      setCurrentBalance(balance.uni)
      setCurrentStaked(userInfo.uniStaked)
      setCurrentAllowance(allowance.uni)
    } else if ((e.target.value === CONVERSION_RATE[1].key && appChainID.appChainID === '5')
      || (e.target.value === CONVERSION_RATE[1].keyMainnet && appChainID.appChainID === '1')) {
      setCurrentBalance(balance.mantra)
      setCurrentStaked(userInfo.mantraStaked)
      setCurrentAllowance(allowance.mantra)
    }
  }
  const handleChange = (e: any) => {
    const value = e.target.value.replaceAll(",", "")
    if (value === '' || REGEX_NUMBER.test(value)) {
      setDepositAmount(value);
    }
  }

  return (
    <DefaultLayout>
      <div className={styles.wrapper}>
        <div className="modal-content">
          <div id="alert-dialog-slide-title" className="modal-content__head">
            <h2 className="title">You
              have <span>{numberWithCommas(total)} Points</span> staked</h2>
            {stage != DEPOSIT_STAGE.APPROVED && <p
              className={styles.description}>{stage === DEPOSIT_STAGE.NEED_APPROVE ? 'You need to Approve once (and only once) before you can start staking.'
              : 'You have approved successfully. Enter amount then click Stake button.'}
            </p>}
          </div>
          {stage !== DEPOSIT_STAGE.APPROVED && <div className={styles.stages}>
            <div className={`stage active`} style={{opacity: stage === DEPOSIT_STAGE.STAKE ? '0.5' : '1'}}>
              {stage === DEPOSIT_STAGE.STAKE && <img src={tickIcon} alt=""/>}
              Step 1: Approve
            </div>
            <div className={`stage + ${stage === DEPOSIT_STAGE.STAKE && ' active'}`}>Step 2: Stake</div>
          </div>}
          <div className="modal-content__body">
            <select name="select_token" id="select-token" onChange={(e) => handleSelectToken(e)}>
              {listTokenDetails && listTokenDetails.slice(0, listTokenDetails.length - 1).map((tokenDetails: any, index: number) => {
                return <option value={tokenDetails?.symbol} key={index}>{
                  index === 0 ? 'Polkafoundry (PKF)' : `${CONVERSION_RATE[index - 1]?.name} (${CONVERSION_RATE[index - 1]?.symbol})`
                }</option>
              })}
            </select>

            <div className={styles.group}>
              <div className="balance">
                <span>Your wallet balance</span>
                <span>{!currentBalance ? 0 : numberWithCommas(currentBalance)} {
                  currentToken?.symbol
                  === 'PKF' ? 'PKF' : 'LP-PKF'
                  //   : (appChainID.appChainID === '5' && currentToken?.symbol === CONVERSION_RATE[0].key ||
                  //   appChainID.appChainID === '1' && currentToken?.symbol === CONVERSION_RATE[0].keyMainnet) ? CONVERSION_RATE[0]?.symbol : CONVERSION_RATE[1]?.symbol
                }</span>
              </div>
              <div className="subtitle">
                <span>Input amount to stake</span>
              </div>
              <div className="input-group">
                <NumberFormat
                  type="text"
                  placeholder={'0'}
                  thousandSeparator={true}
                  onChange={e => handleChange(e)}
                  decimalScale={6}
                  value={depositAmount}
                  min={0}
                  maxLength={255}
                />
                <button className="btn-max" id="btn-max-deposit" onClick={() => setDepositAmount(currentBalance)}>MAX
                </button>
              </div>
              <div className="balance" style={{marginTop: '16px'}}>
                <span>Equivalent</span>
                <span>{numberWithCommas((parseFloat(depositAmount) * currentRate || 0).toString())} Points</span>
              </div>
            </div>
          </div>
          <DialogActions className="modal-content__foot">
            {stage === DEPOSIT_STAGE.NEED_APPROVE ? <button
              className={"btn btn-approve" + (loading || (appChainID.appChainID !== ETH_CHAIN_ID) || (appChainID.walletChainID !== ETH_CHAIN_ID) ? 'disabled' : '')}
              onClick={onApprove}
              disabled={loading}
            >Approve</button> : <button
              className={"btn btn-staking " + (disableDeposit || (appChainID.appChainID !== ETH_CHAIN_ID) || (appChainID.walletChainID !== ETH_CHAIN_ID) ? 'disabled' : '')}
              onClick={onDeposit}
            >Stake</button>}
            <ButtonLink
              text={'Cancel'}
              to={'/account?tab=1'}
              className="btn btn-cancel"
              onClick={handleClose}
            />
          </DialogActions>
          {appChainID.appChainID !== ETH_CHAIN_ID && <WrapperAlert type='error'>
            <span>Please switch to the ETH network to Stake/Unstake</span>
          </WrapperAlert>}
        </div>
        <Dialog
          open={openModalTransactionSubmitting}
          keepMounted
          onClose={() => setOpenModalTransactionSubmitting(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          className={commonStyles.loadingTransaction}
        >
          <DialogContent className="content">
            <img src={closeIcon} onClick={() => setOpenModalTransactionSubmitting(false)}/>
            <span className={commonStyles.nnb1824d}>Transaction Submitting</span>
            <CircularProgress color="primary" />
          </DialogContent>
        </Dialog>

        {transactionHashes.length > 0 && <ModalTransaction
          transactionHashes={transactionHashes}
          setTransactionHashes={setTransactionHashes}
          open={transactionHashes.length > 0}
        />}
      </div>
    </DefaultLayout>
  );
};

export default Deposit;
