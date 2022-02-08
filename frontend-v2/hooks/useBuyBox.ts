import { useState, useCallback } from 'react'
import AuctionPoolAbi from '@/components/web3/abis/AuctionPool.json'
import { ObjectType } from '@/utils/types'
import { utils, Contract, BigNumber } from 'ethers'
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
    eventId: number;
}

const useBuyBox = ({ poolId, currencyInfo, poolAddress, subBoxId, eventId }: PoolDepositActionParams) => {
  const { library, account } = useMyWeb3()
  const { apiSignMessgae } = useApiSignature('/user/deposit-box')
  const [txHash, setTxHash] = useState('')
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const buyBox = useCallback(async (amount: number, captchaToken: string) => {
    try {
      setLoading(false)
      setSuccess(false)
      const signature = await apiSignMessgae({
        campaign_id: poolId,
        captcha_token: captchaToken,
        sub_box_id: subBoxId,
        event_id: eventId,
        amount: amount,
        token: currencyInfo.address
      })

      const contract = new Contract(poolAddress, AuctionPoolAbi, library.getSigner())
      const options: ObjectType = {}
      const _amount = utils.parseEther(BigNumber.from(amount).toString()).toString()
      if (BigNumber.from(currencyInfo.address as string).isZero()) {
        options.value = _amount
      }
      const tx = await contract.bid(currencyInfo.address, _amount, subBoxId, signature, options)
      setTxHash(tx.hash)
      toast.loading('Request is processing!')
      const result = await tx.wait(1)
      setLoading(false)
      if (+result?.status === 1) {
        toast.success('Buy Box Successful')
        setSuccess(true)
      } else {
        toast.error('Buy Box Failed')
        setSuccess(false)
      }
    } catch (error: any) {
      console.log(';error', error)
      setLoading(false)
      const msgError = handleErrMsg(error)
      toast.error(msgError)
    }
  }, [poolId, account, library, currencyInfo, poolAddress, subBoxId])

  return {
    buyBox,
    txHash,
    success,
    loading
  }
}

export default useBuyBox
