import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

import axios, { HeadersSignature } from '../../../services/axios';
import { alertFailure, alertSuccess } from '../../../store/actions/alert';
import useWalletSignature from '../../../hooks/useWalletSignature';

type PoolDepositActionParams = {
  poolId?: number;
  connectedAccount?: string;
  poolDetails?: any;
}

const useOrderBox = ({ poolId }: PoolDepositActionParams) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React();
  const [statusOrderBox, setStatusOrderBox] = useState<boolean>(false);
  const [orderBoxLoading, setOrderBoxLoading] = useState<boolean>(false);
  const { signature, signMessage, setSignature, error } = useWalletSignature();
  const [amount, setAmount] = useState(0);

  const orderBox = useCallback(async (amount: number) => {
    setStatusOrderBox(false);
    if (!amount) return dispatch(alertFailure("Amount must be greater than zero"));
    setAmount(amount);
    if (account && poolId && library) {
      try {
        setOrderBoxLoading(true);

        await signMessage();
      } catch (err) {
        setOrderBoxLoading(false);
        dispatch(alertSuccess("Error when signing message"));
      }
    }
  }, [poolId, account, library, signMessage, amount]);

  useEffect(() => {
    if (error && orderBoxLoading) {
      setOrderBoxLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (!signature || !orderBoxLoading) return;
    const handleBuyBox = async () => {
      const response = await axios.post(`/pool/${poolId}/nft-order`, {
        signature,
        wallet_address: account,
        amount,
      }, HeadersSignature) as any;

      if (response.data?.status === 200) {
        setStatusOrderBox(true);
        dispatch(alertSuccess("Order successfully!"));
      } else {
        dispatch(alertFailure(response.data.message));
      }

      setSignature("");
      setOrderBoxLoading(false);
    }

    handleBuyBox();
  }, [signature, orderBoxLoading, amount]);

  return {
    orderBox,
    orderBoxLoading,
    statusOrderBox
  }
}

export default useOrderBox;
