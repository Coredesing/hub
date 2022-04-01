import { useState, useCallback } from 'react'
import AuctionPoolAbi from '@/components/web3/abis/AuctionPool.json'
import BN from 'bignumber.js'
import { ObjectType } from '@/utils/types'
import { utils, Contract } from 'ethers'
import useApiSignature from './useApiSignature'
import toast from 'react-hot-toast'
import { handleErrMsg } from '@/utils/handleErrorContract'
import { useMyWeb3 } from '@/components/web3/context'

type PoolDepositActionParams = {
    poolId?: number;
    connectedAccount?: string;
    poolDetails?: any;
    currencyInfo?: any;
    poolAddress?: string;
    subBoxId?: number;
}

const useAuctionBox = ({ poolId, currencyInfo, poolAddress, subBoxId }: PoolDepositActionParams) => {
  const { library } = useMyWeb3()
  const { apiSignMessage } = useApiSignature('/user/auction-box')
  const [auctionTxHash, setAuctionTxHash] = useState('')
  const [auctionSuccess, setAuctionSuccess] = useState<boolean>(false)
  const [auctionLoading, setAuctionLoading] = useState<boolean>(false)

  const auctionBox = useCallback(async (amount: number, captchaToken: string) => {
    try {
      setAuctionLoading(false)
      setAuctionSuccess(false)
      // if (!amount) return dispatch(alertFailure("Amount must be greater than zero"));
      const signature = await apiSignMessage({
        campaign_id: poolId,
        captcha_token: captchaToken,
        sub_box_id: subBoxId,
        amount: utils.parseEther(new BN(amount).toString()).toString(),
        token: currencyInfo?.address
      })

      const contract = new Contract(poolAddress, AuctionPoolAbi, library.getSigner())
      const options: ObjectType = {}
      if (new BN(currencyInfo.address as string).isZero()) {
        options.value = utils.parseEther((new BN(amount)).toString())
      }
      const tx = await contract.bid(currencyInfo.address, utils.parseEther(`${amount}`).toString(), subBoxId, signature, options)
      setAuctionTxHash(tx.hash)
      toast.loading('Request is processing!')
      const result = await tx.wait(1)
      setAuctionLoading(false)
      if (+result?.status === 1) {
        toast.success('Box Auction Successful')
        setAuctionSuccess(true)
      } else {
        toast.error('Box Auction Failed')
        setAuctionSuccess(false)
      }
    } catch (error: any) {
      console.debug('error', error)
      setAuctionLoading(false)
      const msgError = handleErrMsg(error)
      toast.error(msgError)
    }
  }, [poolId, library, currencyInfo, poolAddress, subBoxId, apiSignMessage])

  return {
    auctionBox,
    auctionTxHash,
    auctionSuccess,
    auctionLoading
  }
}

export default useAuctionBox
