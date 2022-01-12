import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { typeDisplayFlex } from '@styles/CommonStyle';
import AlertMsg from './AlertMsg';
import { ButtonYellow } from './ButtonYellow';
import { ResultStaked } from '../types';
import { FormInputNumber } from '@base-components/FormInputNumber';
import { getContract } from '@utils/contract';
import Erc20Json from '@abi/Erc20.json';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import DialogBidStatus, { StatusType } from './DialogBidStatus';
import ButtonBase from '@base-components/Buttons/ButtonBase';
import Recapcha from '@base-components/Recapcha';
import { debounce } from '@utils/index';
import { utils } from 'ethers';
import { numberWithCommas } from '@utils/formatNumber';

const commaNumber = require('comma-number');
const closeIcon = '/images/icons/close.svg';
const useStyles = makeStyles({
  paper: {
    maxWidth: '440px',
    minWidth: '300px',
    position: 'relative',
    background: '#171717',
    fontFamily: 'Rajdhani ',
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: '20px 10px',
  },
  btnClose: {
    position: 'absolute',
    right: '6px',
    top: '6px',
    minWidth: 'unset',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
  },
  btnView: {
    padding: '7px 10px',
    fontFamily: 'inherit',
    background: '#72F34B',
    color: '#000',
    fontSize: '15px',
    borderRadius: '4px',
    '&:hover': {
      background: '#5ec73e',
      color: '#000',
    }
  },
  content: {
    marginTop: '45px',
    '& h3': {
      textAlign: 'center',
      fontSize: '36px',
      lineHeight: '36px',
      marginBottom: '24px',
      fontFamily: 'inherit',
      color: '#fff'
    },
    // '& h5': {
    //   textAlign: 'center',
    //   fontSize: '16px',
    //   marginBottom: '15px',
    //   fontFamily: 'inherit',
    //   color: '#fff'
    // },
    // '& p': {
    //   textAlign: 'center',
    //   fontSize: '15px',
    //   fontFamily: 'inherit',
    //   color: '#fff',
    //   padding: '10px',
    //   borderRadius: '4px',
    //   background: '#2E2E2E',
    // }
  },
  actions: {
    // display: 'grid',
    // justifyContent: 'center',
  },
  mb0: {
    marginBottom: '0px !important',
  },
  boxGroup: {
    ...typeDisplayFlex,
    justifyContent: 'space-between',
    marginBottom: '22px',
    '&:last-child': {
      marginBottom: '0px !important',
    },
    '& label': {
      fontFamily: 'inherit',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '18px',
      lineHeight: '24px',
      color: '#fff',
    },
    '& span': {
      fontFamily: 'inherit',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '24px',
      color: '#fff',
      textTransform: 'uppercase',
      '& img': {
        width: '18px',
        height: '18px',
        marginRight: '6px'
      }
    }
  },
  formGroup: {
    marginBottom: '14px',
    position: 'relative',
    '& input': {
      width: '100%',
      background: '#171717',
      border: '1px solid #44454B',
      boxSizing: 'border-box',
      borderRadius: '4px',
      fontFamily: 'inherit !important',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '22px',
      color: '#AEAEAE',
      padding: '11px 13px',
      marginBottom: '3px',
      outline: 'none',
      paddingRight: '90px',
    },
    '& span': {
      dislay: 'block',
      width: '100%',
      fontFamily: 'inherit !important',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '16px',
      color: '#AEAEAE',
    },
    '& .icon': {
      position: 'absolute',
      display: 'grid',
      gridTemplateColumns: '22px auto',
      alignItems: 'center',
      top: '15px',
      right: '15px',
      gap: '7px',
      '& img': {
        width: '22px',
        height: '22px',
      },
      '& span': {
        fontSize: '24px',
        fontWeight: 600,
        fontFamily: 'inherit',
        color: '#fff',
      }
    }
  },
  btnBid: {
    textTransform: 'unset',
    width: '100%',
    marginTop: '0px !important',
    fontFamily: 'inherit !important',
    fontSize: '16px',
  }
})

type Props = {
  open: boolean,
  bidInfo: { [k: string]: any },
  [k: string]: any
}
const AuctionBoxModal = ({ open, bidInfo = {}, token = {}, auctionLoading, lastBidder = {}, rateEachBid, currencyPool, ...props }: Props) => {
  const { library, account } = useWeb3React();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState<string | undefined>();
  const [renewBalance, setRenewBalance] = useState(true);

  useEffect(() => {
    if (!account || !token) return setBalance('0');
    const getBalance = async () => {
      try {
        const contract = getContract(token.address, Erc20Json, library, account);
        let balance = await contract.balanceOf(account);
        balance = utils.formatEther(balance.toString());
        balance = new BigNumber(balance).toFixed(4);
        setBalance(numberWithCommas(balance, 4));
        setRenewBalance(false);
      } catch (error) {
        console.log(error);
      }
    }
    (renewBalance || account) && library && token && getBalance();
  }, [library, account, token, renewBalance]);

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (+value > 0 && error) {
      setError('');
    }
    setValue(value);
  };

  const handleClose = () => {
    error && setError('');
    props.onClose && props.onClose();
  };


  const [isVerified, setVerify] = useState<string | null>('bbb');
  const recaptchaRef: any = React.useRef();
  const onChangeRecapcha = (value: string | null) => {
    setVerify(value);
  }
  const onRefreshRecaptcha = debounce(() => {
    if (!isVerified) return;
    if (typeof recaptchaRef?.current?.resetCaptcha === 'function') {
      recaptchaRef.current.resetCaptcha();
    }
  }, 5000);

  const [openStatusModal, setOpenStatusModal] = useState<{ status?: StatusType, open: boolean, subTitle?: string, title?: string, data?: { [k: string]: any } }>({ open: false });
  const onPlaceBid = async () => {
    if (!props.onClick || !account) return;
    onRefreshRecaptcha();
    // setOpenStatusModal({ status: 'processing', open: true, title: 'Adding', data: { value } });
    const result = await props.onClick(+value, isVerified);
    // if (result?.success) {
    //   setValue('');
    //   setRenewBalance(true);
    //   setOpenStatusModal({ status: 'success', open: true, title: 'Success add', data: { value } });
    // } else {
    //   setOpenStatusModal({ status: 'failed', open: true, title: 'Failed add', subTitle: result?.error || '' });
    // }
  };

  const onCloseStatusModal = useCallback(
    () => {
      setOpenStatusModal({ open: false });
    },
    [setOpenStatusModal],
  )

  const [minimumMarkup, setMinimumMarkup] = useState<any>();
  useEffect(() => {
    if(!rateEachBid) return;
    if(lastBidder) {
      console.log('lastBidder', lastBidder)
      // const minimum = utils.formatEther(lastBidder.amount);
      // console.log('minimum', minimum)
    } else {
      setMinimumMarkup(currencyPool?.price)
    }
  }, [lastBidder, currencyPool?.price, rateEachBid ])


  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      classes={{
        paper: classes.paper
      }}
    >
      <DialogBidStatus {...openStatusModal} bidInfo={bidInfo} onClose={onCloseStatusModal} />
      <Button autoFocus onClick={handleClose} color="primary" className={classes.btnClose}>
        <img src={closeIcon} alt="" />
      </Button>
      <DialogContent className={classes.content}>
        <h3>BID CONFIRMATION</h3>

        <div className={classes.boxGroup}>
          <label>Highest bid</label>
          <span>{lastBidder?.amount || '0'} {token.name}</span>
        </div>
        <div className={classes.boxGroup}>
          <label>{lastBidder ? 'Minimum markup' : 'Starting price'}</label>
          <span>{lastBidder ? 0 : currencyPool?.price} {token.name}</span>
        </div>
        <div className={`${classes.boxGroup} mb-7px-imp flex items-center`}>
          <label>Your bid</label>
          <span className='font-14px-imp text-transform-unset'>(Your Balance: {balance} {token.name})</span>
        </div>
        <div className={classes.formGroup}>
          <FormInputNumber className="mb-7px-imp bg-black-imp font-24px-imp text-white-imp" value={value} onChange={onChangeValue} isPositive allowZero placeholder="Enter your amount" />
          <div className="icon">
            {
              token.name && <img src={`/images/icons/${(token.name || '').toLowerCase()}.png`} alt="" />
            }
            <span>{token.name}</span>
          </div>
          <span>Minimum bid value: <span className='text-green-imp font-weight-600'>{+token.price || ''} {token.name}</span></span>
        </div>
        {error && <AlertMsg message={error} />}
        <div className="divider mt-16px-imp mb-16px-imp"></div>
        <Recapcha onChange={onChangeRecapcha} ref={recaptchaRef} />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <ButtonBase color='green' onClick={onPlaceBid} className={classes.btnBid} disabled={!account || !isVerified || auctionLoading} isLoading={auctionLoading}>
          Place a Bid
        </ButtonBase>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(AuctionBoxModal);