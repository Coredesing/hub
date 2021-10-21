import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { userActions } from './store/constants/user';
import { logout } from './store/actions/user';
import { useTypedSelector } from './hooks/useTypedSelector';
import { getWeb3Instance, isMetaMaskInstalled } from './services/web3';
import { withRouter } from 'react-router-dom';
import InstallMetameask from './components/Base/InstallMetamask';
import BigNumber from 'bignumber.js';
import {adminRoute, checkIsAdminRoute, checkIsInvestorRoute, publicRoute} from "./utils";
import {alertFailure} from "./store/actions/alert";
BigNumber.config({ EXPONENTIAL_AT: 50 });

const NETWORK_ID_BSC = process.env.REACT_APP_REACT_APP_BSC_NETWORK_ID as string;
const NETWORK_ID = process.env.REACT_APP_NETWORK_ID as string;
const BACK_URL_NETWORK_CHANGE = 'BACK_URL_NETWORK_CHANGE';
const BACK_URL_NETWORK_CHANGE_OWNER = 'BACK_URL_NETWORK_CHANGE_OWNER';

const AppContainer = (props: any) => {
  const dispatch = useDispatch();
  const { data: loginUser } = useTypedSelector(state => state.user);
  const { data: loginInvestor } = useTypedSelector(state => state.investor);

  const web3Instance = getWeb3Instance();

  const onLoginWithoutLoginPage = async () => {
    if (isMetaMaskInstalled()) {
      const { history } = props;
      const { ethereum } = window as any;

      ethereum.request({
        method: 'net_version'
      }).then((currentNetworkId: string) => {
        localStorage.setItem('NETWORK_ID', currentNetworkId);
        dispatch({ type: userActions.USER_WALLET_CHANGED, payload: currentNetworkId });
      });

      web3Instance?.eth.getAccounts().then((accounts: any) => {
        if (accounts.length === 0) {
          dispatch({ type: userActions.USER_CONNECT_WALLET_LOCK });
          dispatch({ type: userActions.USER_WALLET_CHANGED, payload: '' });

          const pathName = history.location.pathname;
          if (pathName !== '/network-change' && pathName !== '/dashboard/network-change') {
            dispatch(logout(false));
            setTimeout(() => {
              history.push(adminRoute('/login'));
            }, 1500);
          }
        }
      });


    }
  };

  useEffect(()  => {
    onLoginWithoutLoginPage();
  }, [props.location.pathname]);

  useEffect(() => {
    const windowObj = window as any;
    const { ethereum } = windowObj;

    if (ethereum) {
      web3Instance?.eth?.getAccounts().then((accounts: any) => {
          accounts[0] && dispatch({
            type: userActions.USER_CONNECT_WALLET_SUCCESS,
            payload: accounts[0]
          });
      });

      ethereum.on('accountsChanged', function (accounts: any) {
        const account = accounts.length ? accounts[0] : '';

        if (account) {
          if (loginUser && account !== loginUser.wallet_address) {
            dispatch(logout());
          }
          if (loginInvestor && account !== loginInvestor.wallet_address) {
            dispatch(logout(true));
          } else {
            dispatch({
              type: userActions.USER_CONNECT_WALLET_SUCCESS,
              payload: account,
            });
          }
        } else {
          dispatch(logout());
          dispatch({
            type: userActions.USER_CONNECT_WALLET_LOCK,
          });
        }
      });

      ethereum.on('chainChanged', (newNetworkId: string) => {
        localStorage.setItem('NETWORK_ID', String(Number(newNetworkId)));
        dispatch({ type: userActions.USER_WALLET_CHANGED, payload: String(Number(newNetworkId)) });
        if (
          Number(NETWORK_ID) !== Number(newNetworkId) &&
          Number(NETWORK_ID_BSC) !== Number(newNetworkId)
        ) {
          // dispatch(alertFailure('Please change to correct Network !'));
        }

      });
    }
  }, [loginUser]);

  if (!isMetaMaskInstalled()) {
    return (
      <InstallMetameask />
    );
  }

  return (
    <>
      {props.children}
    </>
  );
};

export default withRouter(AppContainer);
