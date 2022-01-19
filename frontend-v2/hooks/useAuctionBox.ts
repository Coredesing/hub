import { useState, useCallback, useEffect } from 'react';
import AuctionPoolAbi from '@/abi/AuctionPool.json';
import BN from 'bignumber.js';
import { ObjectType } from '@/common/types';
import { utils, Contract } from 'ethers';
import useApiBoxSignature from './useApiBoxSignature';
import toast from 'react-hot-toast';
import { handleErrMsg } from '@/utils/handleErrorContract';
import { useWeb3Default } from 'components/web3';
import { useMyWeb3 } from 'components/web3/context';

type PoolDepositActionParams = {
    poolId?: number;
    connectedAccount?: string;
    poolDetails?: any;
    currencyInfo?: any;
    poolAddress?: string;
    subBoxId?: number;
}

const useAuctionBox = ({ poolId, currencyInfo, poolAddress, subBoxId }: PoolDepositActionParams) => {
    const { library, account } = useMyWeb3()
    const { walletSignMessage, signature, setSignature, error } = useApiBoxSignature('/user/auction-box')
    const [amount, setAmount] = useState(0);
    const [auctionTxHash, setAuctionTxHash] = useState("");
    const [auctionSuccess, setAuctionSuccess] = useState<boolean>(false);
    const [auctionLoading, setAuctionLoading] = useState<boolean>(false);

    const auctionBox = useCallback(async (amount: number, captchaToken: string) => {
        setAuctionLoading(false);
        setAuctionSuccess(false);
        // if (!amount) return dispatch(alertFailure("Amount must be greater than zero"));
        setAmount(amount);
        if (account && poolId && library) {
            try {
                setAuctionLoading(true);

                await walletSignMessage({
                    campaign_id: poolId,
                    captcha_token: captchaToken,
                    sub_box_id: subBoxId,
                    amount: utils.parseEther(new BN(amount).toString()).toString(),
                    token: currencyInfo?.address,
                });
            } catch (err) {
                console.log('error', err)
                setAuctionLoading(false);
                toast.error("Error when signing message");
            }
        }
    }, [poolId, account, library, walletSignMessage, currencyInfo, poolAddress, subBoxId]);

    useEffect(() => {
        if (error && auctionLoading) {
            setAuctionLoading(false);
        }
    }, [error]);

    useEffect(() => {
        if (!signature || !auctionLoading || !currencyInfo) return;
        const handleAuctionBox = async () => {
            try {
                const contract = new Contract(poolAddress as string, AuctionPoolAbi, library);
                const options: ObjectType = {};
                if (new BN(currencyInfo.address as string).isZero()) {
                    options.value = utils.parseEther((new BN(amount)).toString())
                }
                const tx = await contract.bid(currencyInfo.address, utils.parseEther(amount + '').toString(), subBoxId, signature, options);
                setSignature("");
                setAuctionTxHash(tx.hash);
                toast.loading("Request is processing!")
                const result = await tx.wait(1);
                setAuctionLoading(false);
                if (+result?.status === 1) {
                    toast.success("Box Auction Successful")
                    setAuctionSuccess(true);
                } else {
                    toast.error("Box Auction Failed");
                    setAuctionSuccess(false);
                }
            } catch (error: any) {
                console.log(';error', error)
                setSignature('');
                setAuctionLoading(false);
                const msgError = handleErrMsg(error)
                toast.error(msgError)
            }
        }

        handleAuctionBox();
    }, [signature, auctionLoading, amount]);

    return {
        auctionBox,
        auctionTxHash,
        auctionSuccess,
        auctionLoading
    }
}

export default useAuctionBox;
