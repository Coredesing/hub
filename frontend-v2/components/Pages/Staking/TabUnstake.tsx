import { useState, useEffect, useMemo, useCallback, ChangeEvent } from 'react'
import { gtagEvent, safeToFixed } from '@/utils'
import { useWeb3Default, switchNetwork, GAFI } from '@/components/web3'
import { utils } from 'ethers'
import { useMyWeb3 } from '@/components/web3/context'
import WalletConnector from '@/components/Base/WalletConnector'
import StakeRight from '@/components/Pages/Staking/StakeRight'
import { useAppContext } from '@/context'
import toast from 'react-hot-toast'
import copy from 'copy-to-clipboard'

export default function TabUnstake ({ loadMyPending, pendingWithdrawal, goStake }) {
  const { tierMine, stakingPool, stakingMine, loadMyStaking, contractStaking } = useAppContext()

  const { now } = useAppContext()

  const hasPendingWithdrawalAvailable = useMemo(() => {
    return pendingWithdrawal?.time <= now
  }, [pendingWithdrawal, now])

  const { chainId: chainIDDefault } = useWeb3Default()
  const { library, account, network, balance } = useMyWeb3()

  const chainOK = useMemo(() => {
    if (!network || !chainIDDefault) {
      return false
    }

    return network?.id === chainIDDefault
  }, [network, chainIDDefault])

  const balanceOK = useMemo(() => {
    if (!balance) {
      return false
    }

    return balance.gt(0)
  }, [balance])

  const [step, setStep] = useState(1)
  const stepActive = useCallback((x) => {
    return step >= x
  }, [step])
  const lineActive = useCallback((x) => {
    if (step === 4) {
      return true
    }

    return stepActive(x)
  }, [step, stepActive])

  const [agreed, setAgreed] = useState(false)
  const [agreed1a, setAgreed1a] = useState(false)
  const [agreed1b, setAgreed1b] = useState(false)
  const [agreed1c, setAgreed1c] = useState(false)
  const [agreed2a, setAgreed2a] = useState(false)
  const [agreed2b, setAgreed2b] = useState(false)
  useEffect(() => {
    if (agreed1a && agreed1b && agreed1c && agreed2a) {
      if (pendingWithdrawal?.amount) {
        setAgreed(agreed2b)
        return
      }

      setAgreed(true)
      return
    }

    setAgreed(false)
  }, [setAgreed, agreed1a, agreed1b, agreed1c, agreed2a, agreed2b, pendingWithdrawal])

  const handleAgreement = (setter) => (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : !!target.value
    if (setter === setAgreed && !agreed) {
      return
    }

    if (setter === setAgreed && agreed) {
      setAgreed1a(false)
      setAgreed1b(false)
      setAgreed1c(false)
      setAgreed2a(false)
    }

    setter(value)
  }

  const [amount, setAmount] = useState('')
  const setAmountMax = useCallback(() => {
    setAmount(stakingMine?.tokenStaked)
  }, [stakingMine])

  function handleAmount (event: ChangeEvent<HTMLInputElement>) {
    const target = event.target
    const value = safeToFixed(target.value, 4)
    if (!value) {
      setAmount('')
      return
    }

    try {
      if (parseFloat(value) > parseFloat(stakingMine?.tokenStaked)) {
        setAmountMax()
        return
      }

      setAmount(value)
    } catch (err) {
    }
  }

  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [tx, setTx] = useState('')

  const stepOK1 = useMemo(() => {
    return agreed && account && chainOK && balanceOK
  }, [agreed, account, chainOK, balanceOK])

  const stepOK2 = useMemo(() => {
    try {
      if (!parseFloat(amount)) {
        return false
      }

      if (parseFloat(amount) > parseFloat(stakingMine?.tokenStaked)) {
        return false
      }

      return true
    } catch (err) {
      return false
    }
  }, [amount, stakingMine])

  const stepOK3 = useMemo(() => {
    return confirmed
  }, [confirmed])

  const chooseStep = useCallback((step) => {
    if (step >= 2 && !stepOK1) {
      return
    }

    if (step >= 3 && !stepOK2) {
      return
    }

    if (step >= 4 && !stepOK3) {
      return
    }

    if (step === 2) {
      gtagEvent('unstaking_step2')
    }

    if (step === 3) {
      gtagEvent('unstaking_step3', {
        value: amount || 0,
        virtual_currency_name: GAFI.symbol
      })
    }

    setStep(step)
  }, [setStep, stepOK1, stepOK2, stepOK3, amount])

  const confirmOrNext = useCallback(() => {
    if (confirmed) {
      setStep(4)
      return
    }

    if (confirming) {
      return
    }

    if (!contractStaking) {
      return
    }

    (async function () {
      try {
        gtagEvent('unstaking_unstake', {
          value: amount || 0,
          virtual_currency_name: GAFI.symbol
        })
        setConfirming(true)
        await contractStaking.linearWithdraw(stakingPool?.pool_id, utils.parseUnits(amount, GAFI.decimals))
          .then(tx => {
            setTx(tx.hash)
            return tx.wait(1).then(() => {
              gtagEvent('unstaking_unstaked', {
                value: amount || 0,
                virtual_currency_name: GAFI.symbol
              })
              loadMyStaking()
              loadMyPending()
              setConfirmed(true)
              setStep(4)
              toast.success('Successfully Unstaked Your $GAFI')
            })
          })
          .catch(err => {
            gtagEvent('unstaking_error', {
              value: amount || 0,
              virtual_currency_name: GAFI.symbol,
              code: err.code || 0
            })
            if (err.code === 4001) {
              toast.error('User Denied Transaction')
              return
            }

            toast.error('Unstaking Failed!')
          })
          .finally(() => {
            setConfirming(false)
          })
      } catch (err) {
        console.debug(err)
      } finally {
        setConfirming(false)
      }
    })()
  }, [confirmed, confirming, contractStaking, stakingPool, amount, setConfirmed, setConfirming, setStep, setTx, loadMyStaking, loadMyPending])

  const unstakeMore = useCallback(() => {
    setTx('')
    setConfirmed(false)
    setAmount('')
    setStep(2)
    gtagEvent('unstaking_step2')
  }, [setTx, setConfirmed, setAmount, setStep])

  useEffect(() => {
    setTx('')
    setConfirmed(false)
    setAmount('')
    setStep(1)
  }, [account, setTx, setConfirmed, setAmount, setStep])

  return <>
    <div className="md:px-10 md:py-8 bg-gradient-to-t from-gamefiDark-800">
      <div className="md:w-7/12 mx-auto relative mb-4 md:mb-10 overflow-hidden">
        <div className="flex gap-1 absolute top-3.5 w-full">
          <div className={`w-[12.5%] h-[2px] ${lineActive(1) ? 'bg-gradient-to-l from-gamefiGreen-500' : 'bg-gamefiDark-500'}`}></div>
          <div className={`w-[25%] h-[2px] ${lineActive(2) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}></div>
          <div className={`w-[25%] h-[2px] ${lineActive(3) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}></div>
          <div className={`w-[25%] h-[2px] ${lineActive(4) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}></div>
          <div className={`w-[12.5%] h-[2px] ${lineActive(5) ? 'bg-gradient-to-r from-gamefiGreen-500' : 'bg-gamefiDark-500'}`}></div>
        </div>

        <div className="flex relative pb-12">
          <div className="ml-[12.5%] absolute -left-4">
            <div onClick={() => chooseStep(1)} className={`w-8 h-8 rounded-full border-4 border-gamefiDark-900 flex justify-center items-center text-base font-bold cursor-pointer text-gamefiDark-900 hover:bg-gamefiDark-100 ${stepActive(1) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}>1</div>
            <span className={`text-xs md:text-sm font-bold uppercase w-40 inline-block text-center absolute -left-16 ${stepActive(1) ? '' : 'opacity-40'}`}>Warning</span>
          </div>
          <div className="ml-[37.5%] absolute -left-4">
            <div onClick={() => chooseStep(2)} className={`w-8 h-8 rounded-full border-4 border-gamefiDark-900 flex justify-center items-center text-base font-bold cursor-pointer text-gamefiDark-900 hover:bg-gamefiDark-100 ${stepActive(2) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}>2</div>
            <span className={`text-xs md:text-sm font-bold uppercase w-40 inline-block text-center absolute -left-16 ${stepActive(2) ? '' : 'opacity-40'}`}>Enter Amount</span>
          </div>
          <div className="ml-[62.5%] absolute -left-4">
            <div onClick={() => chooseStep(3)} className={`w-8 h-8 rounded-full border-4 border-gamefiDark-900 flex justify-center items-center text-base font-bold cursor-pointer text-gamefiDark-900 hover:bg-gamefiDark-100 ${stepActive(3) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}>3</div>
            <span className={`text-xs md:text-sm font-bold uppercase w-40 inline-block text-center absolute -left-16 ${stepActive(3) ? '' : 'opacity-40'}`}>Confirmation</span>
          </div>
          <div className="ml-[87.5%] absolute -left-4">
            <div onClick={() => chooseStep(4)} className={`w-8 h-8 rounded-full border-4 border-gamefiDark-900 flex justify-center items-center text-base font-bold cursor-pointer text-gamefiDark-900 hover:bg-gamefiDark-100 ${stepActive(4) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}>4</div>
            <span className={`text-xs md:text-sm font-bold uppercase w-40 inline-block text-center absolute -left-16 ${stepActive(4) ? '' : 'opacity-40'}`}>Completed</span>
          </div>
        </div>
      </div>

      { step === 1 && <>
        <div className="font-bold text-lg md:text-3xl uppercase">Warning</div>
        <p className="font-casual text-sm">Please read carefully before unstaking your GAFI</p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-2 md:mt-6">
          <div className="flex-1">
            <div className="bg-gray-500 bg-opacity-20 p-4 md:px-6 md:py-5 rounded w-full">
              <h3 className="text-lg font-bold uppercase mb-2">1. Unstaking policies</h3>
              <label className="leading-relaxed font-casual text-sm text-gray-300 flex items-start">
                <input type="checkbox" className="rounded bg-transparent border-white checked:text-gamefiGreen-700 dark mr-2" checked={agreed1a} onChange={handleAgreement(setAgreed1a)} />
                <p className="-mt-1">You will <strong>get a refund</strong> if you <strong>lose all future token releases in an IGO pool</strong> due to an unstake lowering your rank. The refund is calculated based on the number of tokens left in the pool, which you are not eligible to claim, and the token’s IGO price.</p>
              </label>
              <label className="leading-relaxed font-casual text-sm text-gray-300 flex items-start mt-4">
                <input type="checkbox" className="rounded bg-transparent border-white checked:text-gamefiGreen-700 dark mr-2" checked={agreed1b} onChange={handleAgreement(setAgreed1b)} />
                <p className="-mt-1">Within the last three working days of the month that you lost your ability to claim, <strong>this refund will be airdropped directly to your wallet address</strong>.</p>
              </label>

              <label className="leading-relaxed font-casual text-sm text-gray-300 flex items-start mt-4">
                <input type="checkbox" className="rounded bg-transparent border-white checked:text-gamefiGreen-700 dark mr-2" checked={agreed1c} onChange={handleAgreement(setAgreed1c)} />
                <p className="-mt-1">The forfeited token vestings will be redistributed to the GameFi.org Development fund, further developing the GameFi.org platform and ecosystem.</p>
              </label>

              <h3 className="text-lg font-bold uppercase mt-6 mb-2">2. Withdraw delay time</h3>
              { tierMine && <label className="leading-relaxed font-casual text-sm text-gray-300 flex items-start">
                <input type="checkbox" className="rounded bg-transparent border-white checked:text-gamefiGreen-700 dark mr-2" checked={agreed2a} onChange={handleAgreement(setAgreed2a)} />
                <p className="-mt-1">{ tierMine.id === 0 && <span>Your current rank is Start. You can withdraw after unstaking</span> }
                  { tierMine.id !== 0 && <span>Your current rank is <strong>{tierMine.name}</strong>, withdraw delay time is <strong>{tierMine.config.delay ? `${tierMine.config.delay} days` : '—'}</strong>. After <strong>{tierMine.config.delay ? `${tierMine.config.delay} days` : '—'}</strong>, you will be allowed to withdraw your $GAFI.</span> }</p>
              </label> }
              { !!pendingWithdrawal?.amount && <label className="leading-relaxed font-casual text-sm text-gray-300 flex items-start mt-4">
                <input type="checkbox" className="rounded bg-transparent border-white checked:text-gamefiGreen-700 dark mr-2" checked={agreed2b} onChange={handleAgreement(setAgreed2b)} />
                <p className="-mt-1">
                  { hasPendingWithdrawalAvailable && <span>Your pending withdrawal is <strong>ready to be claimed</strong>. </span> }<span>Your withdraw delay time <strong className="uppercase">will be reset</strong> if you continue to unstake.</span>
                </p>
              </label> }
            </div>
          </div>
          <StakeRight { ...{ loadMyPending, account, stakingMine, pendingWithdrawal } } className="hidden md:block" />
        </div>
      </> }

      { step === 2 && <>
        <div className="font-bold text-lg md:text-3xl uppercase">Unstake Amount</div>
        <p className="font-casual text-sm">The Amount of $GAFI you want to unstake</p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-2 md:mt-6">
          <div className="flex-1">
            <div className="bg-gray-500 bg-opacity-20 p-4 md:px-10 md:py-5 md:pb-10 rounded w-full">
              <p className="flex items-center font-casual text-sm w-full">
                <span className="truncate">Enter the amount of $GAFI you want to unstake</span>
                <span className="flex-none ml-auto text-xs">Current Staking:</span>
                <strong className="flex-none ml-2 text-xs">{stakingMine?.tokenStaked !== undefined ? `${safeToFixed(stakingMine?.tokenStaked, 4)} $GAFI` : 'Loading...'}</strong>
              </p>
              <div className="relative font-casual text-sm mt-2">
                <input className={`bg-transparent border w-full pl-4 ${stepOK2 ? 'border-gamefiGreen-700' : 'border-gamefiDark-400'}`} type="text" value={amount} onChange={handleAmount} />
                <button className="text-gamefiGreen-500 font-medium absolute inset-y-0 right-4" onClick={setAmountMax}>Max</button>
              </div>
            </div>
          </div>
          <StakeRight { ...{ loadMyPending, account, stakingMine, pendingWithdrawal } } className="hidden md:block" />
        </div>
      </> }

      { step === 3 && <>
        <div className="font-bold text-lg md:text-3xl uppercase">Confirmation</div>
        <p className="font-casual text-sm">After this step, your tokens will be successfully unstaked.
          <br />You will be allowed to withdraw your $GAFI after delay withdraw time. </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-2 md:mt-6">
          <div className="flex-1">
            <div className="bg-gray-500 bg-opacity-20 p-4 md:px-10 md:py-5 md:pb-10 rounded w-full">
              <p className="flex items-center font-casual text-sm w-full">
                <span className="truncate">Enter the amount of $GAFI you want to unstake</span>
                <span className="flex-none ml-auto text-xs">Current Staking:</span>
                <strong className="flex-none ml-2 text-xs">{stakingMine?.tokenStaked !== undefined ? `${safeToFixed(stakingMine?.tokenStaked, 4)} $GAFI` : 'Loading...'}</strong>
              </p>
              <div className="relative font-casual text-sm mt-2">
                <input className={'bg-transparent border w-full pl-4'} type="text" value={amount} readOnly disabled />
              </div>
            </div>
          </div>
          <StakeRight { ...{ loadMyPending, account, stakingMine, pendingWithdrawal } } className="hidden md:block" />
        </div>
      </> }

      { step === 4 && <>
        <div className="font-bold text-lg md:text-3xl uppercase">Completed</div>
        <p className="font-casual text-sm">You have successfully unstaked <strong>{amount} $GAFI</strong></p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-2 md:mt-6">
          <div className="flex-1">
            <div className="bg-gray-500 bg-opacity-20 p-4 md:px-10 md:py-5 md:pb-10 rounded w-full">
              <p className="flex items-center font-casual text-sm w-full">
                <span className="truncate">You can check the transaction hash below</span>
              </p>
              <div className="relative font-casual text-sm mt-2">
                <input className={'bg-transparent border w-full pl-4 pr-8 text-sm'} type="text" value={tx} readOnly disabled />
                <svg style={{ height: '1rem' }} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-2.5 right-2.5 cursor-pointer hover:text-gray-300" onClick={() => copy(tx)}>
                  <path d="M12.5 3.5H2.5V15.5H12.5V3.5Z" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.5 0.5H15.5V13.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.5 6.5H9.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.5 9.5H9.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.5 12.5H9.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="font-casual text-sm mt-4">
                <a
                  className="text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline"
                  href={`${network?.blockExplorerUrls?.[0]}/tx/${tx}`}
                  target="_blank" rel="noreferrer"
                >
                View on {network.name} Explorer
                </a>
              </div>
            </div>
          </div>
          <StakeRight { ...{ loadMyPending, account, stakingMine, pendingWithdrawal } } className="hidden md:block" />
        </div>
      </> }
    </div>

    { step === 1 && <div className="p-4 md:px-10 md:py-4 md:bg-gray-500 md:bg-opacity-20 font-casual text-sm flex items-center">
      <label className="leading-relaxed inline-block align-middle">
        <input type="checkbox" className="rounded bg-transparent border-white checked:text-gamefiGreen-700 dark mr-2" checked={agreed} onChange={handleAgreement(setAgreed)} />
        I fully understand and agree with all policies.
      </label>
      { !account && <WalletConnector buttonClassName="ml-auto font-mechanic"></WalletConnector> }
      { account && !chainOK && <button
        onClick={() => switchNetwork(library.provider, chainIDDefault)}
        className='flex-none ml-auto py-2 px-10 bg-gamefiGreen-500 text-gamefiDark-900 font-bold font-mechanic text-sm rounded-xs hover:opacity-95 cursor-pointer clipped-t-r'
      >
        Switch Network
      </button> }
      { account && chainOK && <button
        onClick={() => chooseStep(2)}
        className={`flex-none ml-auto py-2 px-10 font-bold font-mechanic text-sm rounded-xs hover:opacity-95 cursor-pointer clipped-t-r text-gamefiDark-900 ${stepOK1 ? 'bg-gamefiGreen-500' : 'bg-gray-500 bg-opacity-70'}`}
      >
        { balanceOK ? 'Next' : `Insufficient ${network?.currency}`}
      </button> }
    </div>}

    { step === 2 && <div className="p-4 md:px-10 md:py-4 md:bg-gray-500 md:bg-opacity-20 font-casual text-sm flex items-center">
      <button onClick={() => chooseStep(1)} className="ml-auto text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline">Back</button>
      <button
        onClick={() => chooseStep(3)}
        className={`flex-none ml-4 py-2 px-10 font-bold font-mechanic text-sm rounded-xs hover:opacity-95 cursor-pointer clipped-t-r text-gamefiDark-900 ${stepOK2 ? 'bg-gamefiGreen-500' : 'bg-gray-500 bg-opacity-70'}`}
      >
        Next
      </button>
    </div>}

    { step === 3 && <div className="p-4 md:px-10 md:py-4 md:bg-gray-500 md:bg-opacity-20 font-casual text-sm flex items-center">
      <button onClick={() => chooseStep(2)} className="ml-auto text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline">Back</button>
      <button
        onClick={confirmOrNext}
        className={`flex-none ml-4 py-2 px-10 font-bold font-mechanic text-sm rounded-xs hover:opacity-95 cursor-pointer clipped-t-r text-gamefiDark-900 ${stepOK2 ? 'bg-gamefiGreen-500' : 'bg-gray-500 bg-opacity-70'}`}
      >
        {confirming ? 'Confirming...' : (confirmed ? 'Confirmed. Next' : 'Confirm')}
      </button>
    </div>}

    { step === 4 && <div className="p-4 md:px-10 md:py-4 md:bg-gray-500 md:bg-opacity-20 font-casual text-sm flex items-center">
      <button onClick={unstakeMore} className="ml-auto text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline">I want to unstake more</button>
      <button
        onClick={goStake}
        className={`flex-none ml-4 py-2 px-10 font-bold font-mechanic text-sm rounded-xs hover:opacity-95 cursor-pointer clipped-t-r text-gamefiDark-900 ${stepOK2 ? 'bg-gamefiGreen-500' : 'bg-gray-500 bg-opacity-70'}`}
      >
        I want to stake more
      </button>
    </div>}

    <StakeRight { ...{ loadMyPending, account, stakingMine, pendingWithdrawal } } className="block md:hidden mt-6" />
  </>
}
