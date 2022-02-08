
import { useCallback, useEffect, useState } from 'react';
import useWalletSignature from './useWalletSignature';
import axios from '@/utils/axios';
import { useWeb3React } from '@web3-react/core';
import { ObjectType } from '@/utils/types';
import toast from 'react-hot-toast';
import { useMyWeb3 } from '@/components/web3/context';

export const HeadersSignature = {
  headers: {
    msgSignature: process.env.NEXT_PUBLIC_MESSAGE_SIGNATURE
  }
}

type ApiSignatureType = {
  campaignId: string | number;
  captchaToken: string;
  amount: number;
  subBoxId: number;
  eventId: number;
  tokenAddress?: string;
}

const useApiSignature = (url: string) => {
  const { signMessage } = useWalletSignature();
  const { account } = useMyWeb3();
  const apiSignMessgae = useCallback(async (data: ObjectType) => {
    try {
      const signature = await signMessage();
      const response = await axios.post(url, {
        wallet_address: account,
        signature,
        ...data,
      }, HeadersSignature);
      const result = response.data;
      if (result.status === 200 && result.data) {
        return result.data.signature;
      }
      throw new Error(result?.message)
    } catch (error) {
      throw new Error(error?.message || 'Something went wrong when sign message')
    }
  }, [account])

  return {
    apiSignMessgae
  }

}

export default useApiSignature;
