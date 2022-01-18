import React, { useEffect, useState } from 'react'
// import AlertMsg from './AlertMsg';
import { FormInputNumber } from '@/components/Base/FormInputNumber'
import { getContract } from '@/utils/web3'
import Erc20Json from '@/abi/Erc20.json'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import ButtonBase from '@/components/Base/Buttons/ButtonBase'
import Recaptcha from '@/components/Base/Recaptcha'
import { debounce } from '@/utils/index'
import { utils } from 'ethers'
import { numberWithCommas } from '@/utils/formatNumber'
import { getAccountBalance } from '@/utils/wallet'
import { getNetworkInfo } from '@/utils/network'
import Modal from '@/components/Base/Modal'
import classes from './c.module.scss'

type Props = {
  open: boolean,
  poolInfo: { [k: string]: any },
  [k: string]: any
}
const AuctionBoxModal = ({ open, poolInfo = {}, token = {}, auctionLoading, lastBidder = {}, rateEachBid, currencyPool, ...props }: Props) => {
  const { library, account } = useWeb3React()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [balance, setBalance] = useState<string | undefined>()
  const [renewBalance, setRenewBalance] = useState(true)

  useEffect(() => {
    if (!account || !token.address || !library) return setBalance('0')
    const getBalance = async () => {
      try {
        const handleSetBalance = (balance: any) => {
          balance = utils.formatEther(balance.toString())
          balance = new BigNumber(balance).toFixed(4)
          setBalance(numberWithCommas(balance, 4))
        }
        if (new BigNumber(token.address).isZero()) {
          const networkInfo = getNetworkInfo(poolInfo.network_available)
          const balance: any = await getAccountBalance('0x00', account, { appChainId: networkInfo.id, connectorName: networkInfo.name })
          handleSetBalance(balance)
        } else {
          const contract = getContract(token.address, Erc20Json)
          const balance = await contract.balanceOf(account)
          handleSetBalance(balance)
        }
        setRenewBalance(false)
      } catch (error) {
        console.log(error)
      }
    }
    renewBalance && getBalance()
  }, [library, account, token, renewBalance, poolInfo.network_available])

  const [minimumMarkup, setMinimumMarkup] = useState<any>()
  const [minimumBid, setMinimumBid] = useState<any>()
  useEffect(() => {
    if (!rateEachBid || !currencyPool?.price) return

    const MyNewNumber = BigNumber
    MyNewNumber.config({ ROUNDING_MODE: 0 })
    const decimals = 3
    if (lastBidder) {
      const minimumMarkup = (new MyNewNumber(new MyNewNumber(lastBidder.amount).multipliedBy(rateEachBid)).toFixed(decimals))
      const minimumBid = new MyNewNumber(lastBidder.amount).plus(minimumMarkup).toFixed(decimals)
      setMinimumMarkup(minimumMarkup)
      setMinimumBid(minimumBid)
    } else {
      const minimumMarkup = new MyNewNumber(new MyNewNumber(currencyPool?.price).multipliedBy(rateEachBid)).toFixed(decimals)
      const minimumBid = new MyNewNumber(currencyPool.price).plus(minimumMarkup).toFixed(decimals)
      setMinimumMarkup(minimumMarkup)
      setMinimumBid(minimumBid)
    }
  }, [lastBidder, currencyPool?.price, rateEachBid])

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (+value > 0 && error) {
      setError('')
    }

    if (+value > 0 && new BigNumber(+value).lt(minimumBid)) {
      setError('Your bid value must be greater than or equal to Minimum bid value')
    } else {
      setError('')
    }

    setValue(value)
  }

  const handleClose = () => {
    error && setError('')
    props.onClose && props.onClose()
    setValue('')
  }

  const [isVerified, setVerify] = useState<string | null>('')
  const recaptchaRef: any = React.useRef()
  const onChangeRecapcha = (value: string | null) => {
    setVerify(value)
  }
  const onRefreshRecaptcha = debounce(() => {
    if (!isVerified) return
    if (typeof recaptchaRef?.current?.resetCaptcha === 'function') {
      recaptchaRef.current.resetCaptcha()
    }
  }, 5000)

  const onPlaceBid = async () => {
    if (!props.onClick || !account) return
    onRefreshRecaptcha()
    // setOpenStatusModal({ status: 'processing', open: true, title: 'Adding', data: { value } });
    const result = await props.onClick(+value, isVerified)
    // if (result?.success) {
    //   setValue('');
    //   setRenewBalance(true);
    //   setOpenStatusModal({ status: 'success', open: true, title: 'Success add', data: { value } });
    // } else {
    //   setOpenStatusModal({ status: 'failed', open: true, title: 'Failed add', subTitle: result?.error || '' });
    // }
  }

  return (

    <Modal show={open} toggle={handleClose} style={{ background: '#28282E' }}>
      <div className={'p-10'}>
        <h3 className='text-white text-3xl font-semibold mb-4 text-center'>BID CONFIRMATION</h3>

        <div className={'flex justify-between gap-2 mb-4'}>
          <label className='text-white text-lg font-semibold'>{lastBidder ? 'Highest bid' : 'Starting price'}</label>
          <span className='text-white text-lg font-semibold'>{lastBidder?.amount ? lastBidder.amount : +currencyPool?.price || ''} {token.name}</span>
        </div>
        <div className="flex justify-between gap-2 mb-4">
          <label className='text-white text-lg font-semibold'>Minimum markup</label>
          <span className='text-white text-lg font-semibold'>{minimumMarkup} {token.name}</span>
        </div>
        <div className="flex justify-between gap-2 mb-1">
          <label className='text-white text-lg font-semibold'>Your bid</label>
          <span className='text-sm font-semibold'>(Your Balance: {balance} {token.name})</span>
        </div>
        <div className={classes.formGroup}>
          <FormInputNumber className="mb-7px-imp bg-black-imp font-24px-imp text-white-imp" value={value} onChange={onChangeValue} isPositive allowZero placeholder="Enter your amount" />
          <div className={classes.formInputIcon}>
            {(token.name || token.icon) && <img src={token.icon || `/images/icons/${(token.name || '').toLowerCase()}.png`} alt="" />}
            <span>{token.name}</span>
          </div>
          <span className='font-semibold text-sm'>Minimum bid value: <span className='text-gamefiGreen-700'>{minimumBid} {token.name}</span></span>
        </div>
        {/* {error && <AlertMsg message={error} />} */}
        <div className='mb-4'>
          <Recaptcha onChange={onChangeRecapcha} ref={recaptchaRef} />
        </div>
        <ButtonBase color='green' onClick={onPlaceBid} className={`${classes.btnBid} w-full`} disabled={!account || auctionLoading || !isVerified} isLoading={auctionLoading}>
          Place a Bid
        </ButtonBase>
      </div>
    </Modal>
  )
}

export default React.memo(AuctionBoxModal)
