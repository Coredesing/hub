import { useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
// import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import Web3 from 'web3';
import toast from 'react-hot-toast';
import { useWeb3Default } from 'components/web3';
import { useMyWeb3 } from 'components/web3/context';

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
  // [ConnectorNames.BSC]: {
  //   method: 'eth_sign',
  //   params: [connectedAccount, MESSAGE_SIGNATURE]
  // },
  // [ConnectorNames.WalletConnect]: {
  //   method: 'eth_sign',
  //   params: [connectedAccount, MESSAGE_SIGNATURE]
  // },
  // [ConnectorNames.WalletLinkConnect]: {
  //   method: 'eth_sign',
  //   params: [connectedAccount, MESSAGE_SIGNATURE]
  // },
  // [ConnectorNames.MetaMask]: {
  //   method: 'personal_sign',
  //   params: [MESSAGE_SIGNATURE, connectedAccount]
  // },
})

const useWalletSignature = () => {
  const { library, account: connectedAccount } = useMyWeb3();
  const [error, setError] = useState("");
  const [signature, setSignature] = useState("");

  const signMessage = useCallback(async () => {
    try {
      if (connectedAccount && library) {
        library.provider.sendAsync({
          method: 'personal_sign',
          params: [MESSAGE_SIGNATURE, connectedAccount]
        }, (err, result) => {
          setSignature(result.result)
        })
      }
    } catch (err: any) {
      toast.error(err.message)
      console.log('[ERROR] - signMessage:', err);
      const errMsg = (err.message || (err as any).error);
      console.log('errMsg', errMsg)
      setError(errMsg);
    }
  }, [library, connectedAccount]);

  return {
    signMessage,
    signature,
    setSignature,
    error
  }
}

export default useWalletSignature;
