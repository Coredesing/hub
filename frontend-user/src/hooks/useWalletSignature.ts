import { useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';

import { TRANSACTION_ERROR_MESSAGE } from '../constants/alert';
import { alertFailure } from '../store/actions/alert';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { ConnectorNames, connectorNames } from '../constants/connectors';
import Web3 from 'web3';
const web3 = new Web3();

const MESSAGE_INVESTOR_SIGNATURE = process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE || "";

const rawMessage = MESSAGE_INVESTOR_SIGNATURE;
const rawMessageLength = new Blob([rawMessage]).size
const message = ethers.utils.toUtf8Bytes("\x19Ethereum Signed Message:\n" + rawMessageLength + rawMessage)
const messageHash = ethers.utils.keccak256(message);

export const getParamsWithConnector = (connectedAccount: string) => ({
  [ConnectorNames.BSC]: {
    method: 'eth_sign',
    params: [connectedAccount, MESSAGE_INVESTOR_SIGNATURE]
  },
  [ConnectorNames.WalletConnect]: {
    method: 'eth_sign',
    params: [connectedAccount, MESSAGE_INVESTOR_SIGNATURE]
  },
  [ConnectorNames.WalletLinkConnect]: {
    method: 'eth_sign',
    params: [connectedAccount, MESSAGE_INVESTOR_SIGNATURE]
  },
  [ConnectorNames.Fortmatic]: {
    method: 'personal_sign',
    params: [MESSAGE_INVESTOR_SIGNATURE, connectedAccount]
  },
  [ConnectorNames.MetaMask]: {
    method: 'personal_sign',
    params: [MESSAGE_INVESTOR_SIGNATURE, connectedAccount]
  },
})

const useWalletSignature = () => {
  const dispatch = useDispatch();
  const connector = useTypedSelector(state => state.connector).data;
  const { library, account: connectedAccount } = useWeb3React();
  const [error, setError] = useState("");
  const [signature, setSignature] = useState("");

  const signMessage = useCallback(async () => {
    try {
      if (connectedAccount && library && connector) {
        const paramsWithConnector = getParamsWithConnector(connectedAccount)[connector as connectorNames];
        const provider = library.provider;

        setError("");

        if (connector === ConnectorNames.WalletConnect) {
          const params = [
            connectedAccount,
            messageHash
          ]
          await (library as any).provider.enable();

          var signature = await (library as any).provider.wc.signMessage(params);
          signature && setSignature(signature);
          console.log(signature);
        } else if (connector === ConnectorNames.WalletLinkConnect) {
          console.log('WalletLinkConnect Provider===========>', provider, ConnectorNames);
          const params = [
            MESSAGE_INVESTOR_SIGNATURE,
            connectedAccount,
          ]
          await (library as any).provider.enable();
          const wlProvider = (library as any).provider;
          console.log('wlProvider', wlProvider);

          const signature = await wlProvider._personal_sign(params);
          console.log('signature', signature);
          signature && signature.result && setSignature(signature.result);
        } else {
          if ((window as any).ethereum?.isCoin98 || (window as any).coin98) {
            web3.setProvider(provider);
            const signature = await web3.eth.personal.sign(MESSAGE_INVESTOR_SIGNATURE, connectedAccount, '');
            setSignature(signature);
            return;
          }

          await (provider as any).sendAsync({
            method: paramsWithConnector.method,
            params: paramsWithConnector.params
          }, async function (err: Error, result: any) {
            if (err || result.error) {
              const errMsg = (err.message || (err as any).error) || result.error.message
              console.log('Error when signing message: ', errMsg);
              dispatch(alertFailure(errMsg || TRANSACTION_ERROR_MESSAGE));
              setError(errMsg);
            } else {
              result.result && setSignature(result.result);
            }
          })
        }
      }
    } catch (err: any) {
      console.log('[ERROR] - signMessage:', err);
      dispatch(alertFailure(err.message || TRANSACTION_ERROR_MESSAGE));
      setError(err.message);
    }
  }, [library, connector, connectedAccount]);

  return {
    signMessage,
    signature,
    setSignature,
    error
  }
}

export default useWalletSignature;
