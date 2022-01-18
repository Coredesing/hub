import { useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
// import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';

// import { alertFailure } from '../store/actions/alert';
import { ConnectorNames } from '@/constants/network';
import Web3 from 'web3';
import toast from 'react-hot-toast';

const web3 = new Web3();

const MESSAGE_SIGNATURE = process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE || "";

const rawMessage = MESSAGE_SIGNATURE;
const rawMessageLength = (() => {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser) {
    return new Blob([rawMessage]).size;
  }
  return 0;
})()
const message = ethers.utils.toUtf8Bytes("\x19Ethereum Signed Message:\n" + rawMessageLength + rawMessage)
const messageHash = ethers.utils.keccak256(message);

export const getParamsWithConnector = (connectedAccount: string) => ({
  [ConnectorNames.BSC]: {
    method: 'eth_sign',
    params: [connectedAccount, MESSAGE_SIGNATURE]
  },
  [ConnectorNames.WalletConnect]: {
    method: 'eth_sign',
    params: [connectedAccount, MESSAGE_SIGNATURE]
  },
  [ConnectorNames.WalletLinkConnect]: {
    method: 'eth_sign',
    params: [connectedAccount, MESSAGE_SIGNATURE]
  },
  [ConnectorNames.MetaMask]: {
    method: 'personal_sign',
    params: [MESSAGE_SIGNATURE, connectedAccount]
  },
})

const useWalletSignature = () => {
  // const dispatch = useDispatch();
  const connector: any = ConnectorNames.MetaMask //|| useSelector((state: any) => state.connector).data;
  const { library, account: connectedAccount } = useWeb3React();
  const [error, setError] = useState("");
  const [signature, setSignature] = useState("");

  const signMessage = useCallback(async () => {
    try {
      if (connectedAccount && library && connector) {
        const paramsWithConnector = getParamsWithConnector(connectedAccount)[connector as any];
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
            MESSAGE_SIGNATURE,
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
            const signature = await web3.eth.personal.sign(MESSAGE_SIGNATURE, connectedAccount, '');
            setSignature(signature);
            return;
          }

          await (provider as any).sendAsync({
            method: paramsWithConnector.method,
            params: paramsWithConnector.params
          }, async function (err: Error, result: any) {
            debugger
            if (err || result.error) {
              const errMsg = (err.message || (err as any).error) || result.error.message
              console.log('Error when signing message: ', errMsg);
              // dispatch(alertFailure(errMsg));
              setError(errMsg);
            } else {
              console.log('result', result)
              result.result && setSignature(result.result);
            }
          })
        }
      }
    } catch (err: any) {
      debugger
      toast.error(err.message)
      console.log('[ERROR] - signMessage:', err);
      const errMsg = (err.message || (err as any).error);
      console.log('errMsg', errMsg)
      // dispatch(alertFailure(errMsg));
      setError(errMsg);
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
