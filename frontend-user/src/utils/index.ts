import BigNumber from 'bignumber.js';
import _ from 'lodash';
import {ADMIN_URL_PREFIX, API_URL_PREFIX, ETHERSCAN_BASE_URL, IMAGE_URL_PREFIX, NETWORK_AVAILABLE} from "../constants";
import axios from "axios";


export function formatPrecisionAmount(amount: any, precision: number = 18): string {
  const rawValue = new BigNumber(`${amount}`).toFixed(precision);
  return (amount && parseFloat(amount) !== Infinity) ? new BigNumber(rawValue).toFormat() : '0';
}

export const routeWithPrefix = (prefix = ADMIN_URL_PREFIX, url = '') => {
  const truncateUrl = _.trim(url, '/');
  return `/${prefix}/${truncateUrl}`;
};

export const adminRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `/${ADMIN_URL_PREFIX}/${truncateUrl}`;
  return resUrl;
};

export const publicRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `/${truncateUrl}`;
  return resUrl;
};

export const checkIsAdminRoute = (pathname: string) => {
  return (pathname.indexOf(`/${ADMIN_URL_PREFIX}`) !== -1) || (pathname === '/dashboard/login');
};

export const checkIsLoginRoute = (pathname: string) => {
  return pathname.indexOf(`/login`) !== -1;
};

export const checkIsInvestorRoute = (pathname: string) => {
  return (pathname.indexOf(`/buy-token`) !== -1) ||  (pathname === '/login');
};

export const apiRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `/${API_URL_PREFIX}/${truncateUrl}`;
  return resUrl;
};

export const imageRoute = (url = '') => {
  const truncateUrl = _.trim(url, '/');
  const resUrl = `${process.env.REACT_APP_API_BASE_URL || ''}/${IMAGE_URL_PREFIX}/${truncateUrl}`;
  return resUrl;
};

export const etherscanRoute = (address = '', poolDetail: any = null) => {
  let network = '';
  if (poolDetail) {
    switch (poolDetail.network_available) {
      case NETWORK_AVAILABLE.BSC:
        network = process.env.REACT_APP_BSC_CHAIN_ID + '';
        break;
      
      case NETWORK_AVAILABLE.POLYGON:
        network = process.env.REACT_APP_POLYGON_CHAIN_ID + '';
        break;
      
      case NETWORK_AVAILABLE.ETH:
        network = process.env.REACT_APP_ETH_CHAIN_ID + '';
        break;
    }
  }

  const networkId = network || localStorage.getItem('NETWORK_ID') || process.env.REACT_APP_NETWORK_ID || '1';
  const baseUrl = ETHERSCAN_BASE_URL[networkId];
  const truncateUrl = _.trim(address, '/');
  const resUrl = `${baseUrl}/${truncateUrl}`;
  return resUrl;
};

export const etherscanAddressRoute = (address = '', poolDetail: any = null) => {
  return etherscanRoute(`address/${address}`, poolDetail);
};

export const etherscanTransactionRoute = (address = '', poolDetail: any = null) => {
  return etherscanRoute(`tx/${address}`, poolDetail);
};

export const getTransactionRowType = (transaction: any) => {
  if (transaction?.type === 'Refund') {
    return 'Refund';
  }
  if (transaction?.type === 'TokenClaimed') {
    return 'Claim';
  }
  return 'Buy';
};

export const getETHPrices = async () => {
  // To use:
  // useEffect(() => {
  //   getPrices().then((resPrices: any) => {
  //     setPrices(resPrices);
  //   });
  // }, []);

  return await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    .then(function (response) {
      let resData = JSON.parse(JSON.stringify(response));
      resData = (resData && resData.data) || {};
      return (resData && resData.ethereum && resData.ethereum.usd) || 0;
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const fixGasLimit = (type = 'deposit') => {
  let overrides = {};
  if (process.env.NODE_ENV !== 'production') {
    if (type == 'deposit') {
      overrides = {
        gasLimit: 200000,
        gasPrice: 10000000000,
      };
    } else if (type == 'approve') {
      overrides = {
        gasLimit: 500000,
        gasPrice: 50000000000,
      };
    } else if (type == 'claim') {
      overrides = {
        gasLimit: 200000,
        gasPrice: 10000000000,
      };
    } else if (type == 'buy') {
      overrides = {
        gasLimit: 500000,
        gasPrice: 10000000000,
      };
    }
  }

  return overrides;
};

export const fixGasLimitWithProvider = (library: any, type = 'deposit') => {
  let overrides = {};
  return overrides;

  const provider = (library?.provider as any);
  if (provider?.isWalletLink) {
    overrides = fixGasLimit(type);
    console.log('Provider is WalletLink:', provider);
    console.log('Gas Limit: ', overrides);
  }

  return overrides;
};

export const checkIsWalletLink = (library: any) => {
  const provider = (library?.provider as any);
  if (provider?.isWalletLink) {
    console.log('Provider is WalletLink:', provider);
  }
  return !!provider?.isWalletLink;
};

export const disconnectWalletLink = (library: any) => {
  const provider = (library?.provider as any);
  provider?.close && provider?.close();
};

export const formatNumber = (num: number) => {
  if(num < 10) {
    return String(`0${num}`);
  }
  return num;
}

type Timestamp = number;
export const getDiffTime = (date1: Timestamp, date2: Timestamp) => {
  let difftime = date1 - date2;
  const days = Math.floor(difftime / 1000 / 60 / (60 * 24));
  difftime = difftime - days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(difftime / 1000 / 60 / 60);
  difftime = difftime - hours * 1000 * 60 * 60;
  const minutes = Math.floor(difftime / 1000 / 60);
  difftime = difftime - minutes * 1000 * 60;
  const seconds = Math.floor(difftime / 1000);
  return {
    days, hours, minutes, seconds,
  }
}


export const caclDiffTime = (time: {[k in string]: any}): {[k in string]: any} => {
  if (time.seconds === 0) {
      time.seconds = 59;
      if (time.minutes === 0) {
          time.minutes = 59;
          if (time.hours === 0) {
              if (time.days > 0) {
                  time.days -= 1;
                  time.hours = 23;
              }
          } else {
              time.hours -= 1;
          }
      } else {
          time.minutes -= 1;
      }
  } else {
      time.seconds -= 1;
  }

  return time;
}

export const isEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const debounce = (fn: Function, timer: number) => {
  let timeout: any;
  return function (args?: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(args);
    }, timer)
  }
}

export const formatCampaignStatus = (status: string) => {
  const stt = String(status).toLowerCase();
  if(stt === 'filled') return 'Opening';
  if(stt === 'ended') return 'Ended';
  if(stt === 'upcoming') return 'Upcoming';
  return status;
}