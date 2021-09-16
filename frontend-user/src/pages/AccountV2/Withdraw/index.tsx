import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _, { gt } from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import { withdraw, getWithdrawFee } from '../../../store/actions/sota-tiers';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { numberWithCommas } from '../../../utils/formatNumber';
import NumberFormat from 'react-number-format';
import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@material-ui/core';
import { sotaTiersActions } from "../../../store/constants/sota-tiers";
import useTokenDetails from "../../../hooks/useTokenDetails";
import useUserTier from "../../../hooks/useUserTier";
import ModalTransaction from "../ModalTransaction";
import ButtonLink from "../../../components/Base/ButtonLink";
import DefaultLayout from "../../../components/Layout/DefaultLayout";
import { ChainDefault, ETH_CHAIN_ID } from '../../../constants/network'
import { TOKEN_STAKE_NAMES, TOKEN_STAKE_SYMBOLS } from "../../../constants";
import { WrapperAlert } from '../../../components/Base/WrapperAlert';

const closeIcon = '/images/icons/close.svg';
const iconWarning = "/images/warning-red.svg";
const REGEX_NUMBER = /^-?[0-9]{0,}[.]{0,1}[0-9]{0,6}$/;

const TOKEN_ADDRESS = process.env.REACT_APP_PKF || '';
const TOKEN_UNI_ADDRESS = process.env.REACT_APP_UNI_LP || '';
const TOKEN_MANTRA_ADDRESS = process.env.REACT_APP_MANTRA_LP || '';

const CONVERSION_RATE = [
  {
    name: TOKEN_STAKE_NAMES.LP_PKF,
    rate: 800,
    symbol: TOKEN_STAKE_SYMBOLS.LP_PKF,
    address: process.env.REACT_APP_UNI_LP,
    key: 'UPKF',
    keyMainnet: 'UNI-V2'
  },
  {
    name: 'Staked sPKF',
    rate: 1,
    symbol: 'sPKF',
    address: process.env.REACT_APP_MANTRA_LP,
    key: 'sPKF',
    keyMainnet: 'sPKF'
  }
]

const Withdraw = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const commonStyles = useCommonStyle();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [disableWithdraw, setDisableWithdraw] = useState(true);

  const { tokenDetails: tokenPKFDetails } = useTokenDetails(TOKEN_ADDRESS, ChainDefault.shortName || '');
  const { tokenDetails: tokenUniLPDetails } = useTokenDetails(TOKEN_UNI_ADDRESS, ChainDefault.shortName || '');
  const { tokenDetails: tokenMantraLPDetails } = useTokenDetails(TOKEN_MANTRA_ADDRESS, ChainDefault.shortName || '');
  const [listTokenDetails, setListTokenDetails] = useState([]) as any;
  const [openModalTransactionSubmitting, setOpenModalTransactionSubmitting] = useState(false)
  const [transactionHashes, setTransactionHashes] = useState([]) as any;

  const { data: withdrawTransaction, error: withdrawError } = useSelector((state: any) => state.withdraw);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { data: withdrawFee = {} } = useSelector((state: any) => state.withdrawFee);
  const { account: connectedAccount, library } = useWeb3React();
  const { data: appChainID } = useSelector((state: any) => state.appNetwork);
  const { data: rates } = useSelector((state: any) => state.rates);

  const [currentToken, setCurrentToken] = useState(undefined) as any;
  const [currentStaked, setCurrentStaked] = useState('0');
  const [currentRate, setCurrentRate] = useState(0);

  const { total } = useUserTier(connectedAccount || '', ChainDefault.shortName || '');

  const setDefaultToken = () => {
    if (!currentToken) {
      setCurrentToken(listTokenDetails[0])
      setCurrentStaked(userInfo.pkfStaked)
      setCurrentRate(1)
    } else if (currentToken.symbol === 'PKF') {
      setCurrentStaked(userInfo.pkfStaked)
    } else if ((currentToken.symbol === CONVERSION_RATE[0].key && appChainID.appChainID === '5')
      || (currentToken.symbol === CONVERSION_RATE[0].keyMainnet && appChainID.appChainID === '1')) {
      setCurrentStaked(userInfo.uniStaked)
    } else if ((currentToken.symbol === CONVERSION_RATE[1].key && appChainID.appChainID === '5')
      || (currentToken.symbol === CONVERSION_RATE[1].keyMainnet && appChainID.appChainID === '1')) {
      setCurrentStaked(userInfo.mantraStaked)
    }
  }

  useEffect(() => {
    if (withdrawTransaction?.hash) {
      setTransactionHashes([...transactionHashes, { tnx: withdrawTransaction.hash, isApprove: false }]);
      setOpenModalTransactionSubmitting(false);
      dispatch({
        type: sotaTiersActions.WITHDRAW_SUCCESS,
        payload: undefined,
      });
    }
    if (withdrawError.message) setOpenModalTransactionSubmitting(false);
  }, [withdrawTransaction, withdrawError])

  useEffect(() => {
    setListTokenDetails([tokenPKFDetails, tokenUniLPDetails, tokenMantraLPDetails]);
  }, [tokenPKFDetails, tokenUniLPDetails, tokenMantraLPDetails]);

  useEffect(() => {
    setDefaultToken()
  }, [userInfo, listTokenDetails])

  const onWithDraw = () => {
    if (disableWithdraw) return
    dispatch(withdraw(connectedAccount, withdrawAmount, library, currentToken.address));
    setOpenModalTransactionSubmitting(true);
    setWithdrawAmount('');
    setDefaultToken();
  }

  const handleClose = () => {
    setWithdrawAmount('');
    setDefaultToken();
  }

  useEffect(() => {
    if (withdrawAmount === '' || withdrawAmount === '0') {
      setDisableWithdraw(true)
      return
    }
    if (!connectedAccount) return
    if (!isNaN(parseFloat(currentStaked))
      && !isNaN(parseFloat(withdrawAmount))) {
      const staked = new BigNumber(currentStaked).multipliedBy(new BigNumber(10).pow(18))
      const amount = new BigNumber(withdrawAmount).multipliedBy(new BigNumber(10).pow(18))
      const zero = new BigNumber('0')
      setDisableWithdraw(staked.lt(amount) || amount.lte(zero));
    }
  }, [connectedAccount, userInfo, withdrawAmount, currentToken]);

  useEffect(() => {
    dispatch(getWithdrawFee(connectedAccount, withdrawAmount === '' ? '0' : withdrawAmount))
  }, [withdrawAmount])

  useEffect(() => {
    if (listTokenDetails.length == 0 || rates.length == 0 || !currentToken) return
    if (currentToken?.symbol == listTokenDetails[0]?.symbol) {
      setCurrentRate(1)
    } else if (currentToken?.symbol == listTokenDetails[1]?.symbol) {
      setCurrentRate(parseFloat(rates?.data[0]?.rate))
    } else if (currentToken?.symbol == listTokenDetails[2]?.symbol) {
      setCurrentRate(parseFloat(rates?.data[1]?.rate))
    }
  }, [rates, currentToken, listTokenDetails])

  const handleSelectToken = (e: any) => {
    const tokens = listTokenDetails.filter((tokenDetails: any) => {
      return tokenDetails.symbol == e.target.value
    })
    setCurrentToken(tokens[0])
    if (e.target.value == 'PKF') {
      setCurrentStaked(userInfo.pkfStaked)
    } else if (e.target.value == CONVERSION_RATE[0].key && appChainID.appChainID == '5'
      || e.target.value == CONVERSION_RATE[0].keyMainnet && appChainID.appChainID == '1') {
      setCurrentStaked(userInfo.uniStaked)
    } else if (e.target.value == CONVERSION_RATE[1].key && appChainID.appChainID == '5'
      || e.target.value == CONVERSION_RATE[1].keyMainnet && appChainID.appChainID == '1') {
      setCurrentStaked(userInfo.mantraStaked)
    }
  }
  const handleChange = (e: any) => {
    const value = e.target.value.replaceAll(",", "")
    if (value === '' || REGEX_NUMBER.test(value)) {
      setWithdrawAmount(value);
    }
  }

  return (
    <DefaultLayout>
      <div className={styles.modalWithdraw}>
        {appChainID.appChainID !== ETH_CHAIN_ID
          && <WrapperAlert type='error'> Please switch to the ETH network to Unstake.</WrapperAlert>}
        <div className="modal-content">
          <div id="alert-dialog-slide-title" className="modal-content__head">
            <h2 className="title">You
              have <span>{numberWithCommas(total)} Points</span> staked</h2>
          </div>
          <div className="modal-content__body">
            <select name="select_token" id="select-token" onChange={(e) => handleSelectToken(e)}>
              {listTokenDetails && listTokenDetails.map((tokenDetails: any, index: number) => {
                return <option value={tokenDetails?.symbol} key={index}>{
                  index === 0 ? 'Polkafoundry (PKF)' : `${CONVERSION_RATE[index - 1]?.name} (${CONVERSION_RATE[index - 1]?.symbol})`
                }</option>
              })}
            </select>
            <div className={styles.group}>
              <div className="balance">
                <span>Your wallet staked</span>
                <span>{_.isEmpty(currentStaked) ? 0 : numberWithCommas(currentStaked)} {
                  currentToken?.symbol
                    === 'PKF' ? 'PKF'
                    : (currentToken?.symbol === CONVERSION_RATE[0].keyMainnet && appChainID.appChainID === '1' ||
                      currentToken?.symbol === CONVERSION_RATE[0].key && appChainID.appChainID === '5') ? CONVERSION_RATE[0]?.symbol : CONVERSION_RATE[1]?.symbol
                }</span>
              </div>
              <div className="subtitle">
                <span>Input amount to unstake</span>
              </div>
              <div className="input-group">
                <NumberFormat
                  type="text"
                  placeholder={'0'}
                  thousandSeparator={true}
                  onChange={e => handleChange(e)}
                  decimalScale={6}
                  value={withdrawAmount}
                  min={0}
                  maxLength={255}
                />
                <div>
                  <button className="btn-max" id="btn-max-withdraw" onClick={() => setWithdrawAmount(currentStaked)}>MAX
                  </button>
                </div>
              </div>
              <div className="balance" style={{ marginTop: '16px' }}>
                <span>Equivalent</span>
                <span>{numberWithCommas((parseFloat(withdrawAmount) * currentRate || 0).toString())} Points</span>
              </div>
            </div>
          </div>
          <DialogActions className="modal-content__foot">
            <button
              className={"btn btn-staking " + (disableWithdraw || (appChainID.appChainID !== ETH_CHAIN_ID) || (appChainID.walletChainID !== ETH_CHAIN_ID) ? 'disabled' : '')}
              onClick={onWithDraw}
            >Unstake
            </button>
            <ButtonLink
              text={'Cancel'}
              to={'/account?tab=1'}
              className="btn btn-cancel"
              onClick={handleClose}
            />
          </DialogActions>
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
            <img src={closeIcon} onClick={() => setOpenModalTransactionSubmitting(false)} />
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

export default Withdraw;
