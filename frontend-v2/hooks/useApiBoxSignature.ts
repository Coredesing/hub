
import { useEffect, useState } from 'react';
import useWalletSignature from './useWalletSignature';
import axios, { HeadersSignature } from '@/utils/axios';
import { useWeb3React } from '@web3-react/core';
import { ObjectType } from '@/common/types';
import toast from 'react-hot-toast';

type ApiSignatureType = {
  campaignId: string | number;
  captchaToken: string;
  amount: number;
  subBoxId: number;
  eventId: number;
  tokenAddress?: string;
}

const useApiSignature = (apiUrl = '/user/deposit-box') => {
  const { account } = useWeb3React()
  const { signature: walletSignature, signMessage, setSignature: setWalletSignature, error: errorWalletSignature } = useWalletSignature();
  const [signature, setSignature] = useState('');
  const [dataSignToApi, setDataSignToApi] = useState<{[k: string]: any}>()
  const [error, setError] = useState('');

  const apiSignMessage = async ({
    campaignId,
    captchaToken,
    amount, 
    subBoxId,
    eventId,
    tokenAddress
  }: ApiSignatureType) => {
    try {
      error && setError('');
      setDataSignToApi({
        campaign_id: campaignId,
        captcha_token: captchaToken,
        sub_box_id: subBoxId,
        event_id: eventId,
        amount: amount,
        token: tokenAddress,
      })
      await signMessage();
    } catch (error) {
      toast.error("Something went wrong when sign message")
      setError("Something went wrong when sign message")
    }
  }

  const walletSignMessage = async (data: ObjectType<any>) => {
    try {
      error && setError('');
      setDataSignToApi(data)
      await signMessage();
    } catch (error) {
      console.log('error', error)
      toast.error("Something went wrong when sign message")
      setError("Something went wrong when sign message")
    }
  }

  const getSignatureFromApi = async (walletSignature: string) => {
    try {
      const response = await axios.post(apiUrl, {
        wallet_address: account,
        signature: walletSignature,
        ...dataSignToApi,        
      }, HeadersSignature);
      const result = response.data;
      if(result?.status === 200 && result.data) {
        setSignature(result.data.signature);
        setDataSignToApi({});
      } else {
        toast.error("Something went wrong when sign message")
        setError("Something went wrong when sign message")
      }
      setWalletSignature('')
    } catch (error) {
      setWalletSignature('')
      toast.error("Something went wrong when sign message")
      setError("Something went wrong when sign message")
    }
  }

  useEffect(() => {
    if (walletSignature) {
      getSignatureFromApi(walletSignature)
    }
  }, [walletSignature])

  return {
    signature,
    setSignature,
    apiSignMessage,
    error: errorWalletSignature || error,
    walletSignMessage,
  }
}

export default useApiSignature;
