import { useState, useCallback } from 'react'
import PresaleBoxAbi from '@/components/web3/abis/PreSaleBox.json'
import { ObjectType } from '@/utils/types'
import { utils, Contract, BigNumber } from 'ethers'
import useApiSignature from './useApiSignature'
import toast from 'react-hot-toast'
import { handleErrMsg } from '@/utils/handleErrorContract'
import { useMyWeb3 } from '@/components/web3/context'
import BigNumberJs from 'bignumber.js'

type PoolDepositActionParams = {
  poolId?: number;
  connectedAccount?: string;
  poolDetails?: any;
  currencyInfo?: any;
  poolAddress?: string;
  subBoxId?: number;
  priceOfBox: number;
  eventId: number;
}

const useBuyBox = ({ poolId, currencyInfo, poolAddress, subBoxId, eventId, priceOfBox }: PoolDepositActionParams) => {
  const { library } = useMyWeb3()
  const { apiSignMessage } = useApiSignature('/user/deposit-box')
  const [txHash, setTxHash] = useState('')
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const buyBox = useCallback(async (amount: number, captchaToken: string) => {
    try {
      setLoading(true)
      setSuccess(false)
      setTxHash('')
      const signature = await apiSignMessage({
        campaign_id: poolId,
        captcha_token: captchaToken,
        sub_box_id: subBoxId,
        event_id: eventId,
        amount: amount,
        token: currencyInfo.address
      })

      const contract = new Contract(poolAddress, PresaleBoxAbi, library.getSigner())
      const options: ObjectType = {}
      if (BigNumber.from(currencyInfo.address as string).isZero()) {
        options.value = utils.parseEther((new BigNumberJs(amount).multipliedBy(new BigNumberJs(priceOfBox))).toString())
      }

      const tx = await contract.claimBox(eventId, currencyInfo.address, amount, subBoxId, signature, options)
      setTxHash(tx.hash)
      toast.loading('Request is processing!', { duration: 2000 })
      const result = await tx.wait(1)
      setLoading(false)
      if (+result?.status === 1) {
        toast.success('Buy box successfully')
        setSuccess(true)
      } else {
        toast.error('Buy box failed')
        setSuccess(false)
      }
    } catch (error: any) {
      setLoading(false)
      const msgError = handleErrMsg(error)
      toast.error(msgError)
    }
    setLoading(false)
  }, [poolId, library, currencyInfo, poolAddress, subBoxId, apiSignMessage, eventId, priceOfBox])

  return {
    buyBox,
    txHash,
    success,
    loading
  }
}

export default useBuyBox
