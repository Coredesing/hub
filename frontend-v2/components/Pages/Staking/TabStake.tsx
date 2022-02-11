import { useState, useEffect, useMemo, useCallback, ChangeEvent } from 'react'
import { safeToFixed, shorten } from '@/utils'
import { useWeb3Default, switchNetwork, GAFI } from '@/components/web3'
import { utils, constants } from 'ethers'
import { useMyWeb3 } from '@/components/web3/context'
import { useBalanceToken, useTokenAllowance, useTokenApproval } from '@/components/web3/utils'
import WalletConnector from '@/components/Base/WalletConnector'
import StakeRight from '@/components/Pages/Staking/StakeRight'
import toast from 'react-hot-toast'
import copy from 'copy-to-clipboard'

export default function TabStake ({ pool, contractStaking, loadMyStaking, stakingMine, loadMyPending, pendingWithdrawal }) {
  const { chainId: chainIDDefault } = useWeb3Default()
  const { library, account, network, balance, balanceShort } = useMyWeb3()

  const chainOK = useMemo(() => {
    if (!network || !chainIDDefault) {
      return false
    }

    return network?.id === chainIDDefault
  }, [network, chainIDDefault])

  const { balance: balanceGAFI, balanceShort: balanceGAFIShort, updateBalance } = useBalanceToken(GAFI)
  const balanceGAFIOK = useMemo(() => {
    if (!balanceGAFI) {
      return false
    }

    return balanceGAFI.gt(0)
  }, [balanceGAFI])

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
    if (step === 5) {
      return true
    }

    return stepActive(x)
  }, [step, stepActive])

  const [agreed, setAgreed] = useState(false)
  function handleAgreement (event: ChangeEvent<HTMLInputElement>) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : !!target.value
    setAgreed(value)
  }

  const [amount, setAmount] = useState('')
  const setAmountMax = () => {
    setAmount(balanceGAFIShort)
  }

  function handleAmount (event: ChangeEvent<HTMLInputElement>) {
    const target = event.target
    const value = safeToFixed(target.value, 4)
    if (!value) {
      setAmount('')
      return
    }

    try {
      const valueInWei = utils.parseUnits(value, GAFI.decimals)
      if (valueInWei.gt(balanceGAFI)) {
        setAmountMax()
        return
      }

      setAmount(value)
    } catch (err) {
    }
  }

  const { allowance, load: loadAllowance, loading: loadingAllowance } = useTokenAllowance(GAFI, account, pool.pool_address)
  const { approve, loading: loadingApproval, error: errorApproval } = useTokenApproval(GAFI, pool.pool_address)
  const allowanceEnough = useMemo(() => {
    try {
      const valueInWei = utils.parseUnits(amount, GAFI.decimals)
      return allowance && allowance.gte(valueInWei)
    } catch (err) {
      return false
    }
  }, [allowance, amount])
  const approveAndReload = useCallback((amount) => {
    approve(amount).finally(() => {
      if (!errorApproval) {
        toast.success('Successfully Approved Your $GAFI')
      }

      loadAllowance().catch(err => { console.debug(err) })
    })
  }, [loadAllowance, approve, errorApproval])
  useEffect(() => {
    loadAllowance().catch(err => { console.debug(err) })
  }, [account, loadAllowance])

  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [tx, setTx] = useState('')

  useEffect(() => {
    if (step !== 3) {
      return
    }

    if (errorApproval) {
      toast.error(`Error: ${errorApproval.message}`)
    }
  }, [step, errorApproval])

  const stepOK1 = useMemo(() => {
    return agreed && account && chainOK && balanceOK && balanceGAFIOK
  }, [agreed, account, chainOK, balanceOK, balanceGAFIOK])

  const stepOK2 = useMemo(() => {
    try {
      const valueInWei = utils.parseUnits(amount, GAFI.decimals)
      if (valueInWei.gt(balanceGAFI)) {
        return false
      }

      return true
    } catch (err) {
      return false
    }
  }, [amount, balanceGAFI])

  const stepOK3 = useMemo(() => {
    return allowanceEnough
  }, [allowanceEnough])

  const stepOK4 = useMemo(() => {
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

    if (step >= 5 && !stepOK4) {
      return
    }

    setStep(step)
  }, [setStep, stepOK1, stepOK2, stepOK3, stepOK4])

  const approveOrNext = useCallback(() => {
    if (loadingAllowance || loadingApproval) {
      return
    }

    if (allowanceEnough) {
      chooseStep(4)
      return
    }

    approveAndReload(constants.MaxUint256)
  }, [loadingAllowance, loadingApproval, allowanceEnough, chooseStep, approveAndReload])
  const confirmOrNext = useCallback(() => {
    if (confirmed) {
      setStep(5)
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
        setConfirming(true)
        await contractStaking.linearDeposit(pool.pool_id, utils.parseUnits(amount, GAFI.decimals))
          .then(tx => {
            tx.wait(2).then(loadMyStaking)
            setTx(tx.hash)
            return tx.wait(1).then(() => {
              setConfirmed(true)
              setStep(5)
              updateBalance()
              toast.success('Successfully Staked Your $GAFI')
            })
          })
          .catch(err => {
            if (err.code === 4001) {
              toast.error('User Denied Transaction')
              return
            }

            toast.error('Staking Failed!')
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
  }, [confirmed, confirming, contractStaking, pool, amount, setConfirmed, setConfirming, setStep, setTx, loadMyStaking, updateBalance])

  const stakeMore = useCallback(() => {
    setTx('')
    setConfirmed(false)
    setAmount('')
    setStep(2)
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
          <div className={`w-[10%] h-[2px] ${lineActive(1) ? 'bg-gradient-to-l from-gamefiGreen-500' : 'bg-gamefiDark-500'}`}></div>
          <div className={`w-[20%] h-[2px] ${lineActive(2) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}></div>
          <div className={`w-[20%] h-[2px] ${lineActive(3) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}></div>
          <div className={`w-[20%] h-[2px] ${lineActive(4) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}></div>
          <div className={`w-[20%] h-[2px] ${lineActive(5) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}></div>
          <div className={`w-[10%] h-[2px] ${lineActive(6) ? 'bg-gradient-to-r from-gamefiGreen-500' : 'bg-gamefiDark-500'}`}></div>
        </div>

        <div className="flex relative pb-12">
          <div className="ml-[10%] absolute -left-4">
            <div onClick={() => chooseStep(1)} className={`w-8 h-8 rounded-full border-4 border-gamefiDark-900 flex justify-center items-center text-base font-bold cursor-pointer text-gamefiDark-900 hover:bg-gamefiDark-100 ${stepActive(1) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}>1</div>
            <span className={`text-xs md:text-sm font-bold uppercase w-40 inline-block text-center absolute -left-16 ${stepActive(1) ? '' : 'opacity-40'}`}>Pre-Stake</span>
          </div>
          <div className="ml-[30%] absolute -left-4">
            <div onClick={() => chooseStep(2)} className={`w-8 h-8 rounded-full border-4 border-gamefiDark-900 flex justify-center items-center text-base font-bold cursor-pointer text-gamefiDark-900 hover:bg-gamefiDark-100 ${stepActive(2) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}>2</div>
            <span className={`text-xs md:text-sm font-bold uppercase w-40 inline-block text-center absolute -left-16 ${stepActive(2) ? '' : 'opacity-40'}`}>Enter Amount</span>
          </div>
          <div className="ml-[50%] absolute -left-4">
            <div onClick={() => chooseStep(3)} className={`w-8 h-8 rounded-full border-4 border-gamefiDark-900 flex justify-center items-center text-base font-bold cursor-pointer text-gamefiDark-900 hover:bg-gamefiDark-100 ${stepActive(3) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}>3</div>
            <span className={`text-xs md:text-sm font-bold uppercase w-40 inline-block text-center absolute -left-16 ${stepActive(3) ? '' : 'opacity-40'}`}>Approve</span>
          </div>
          <div className="ml-[70%] absolute -left-4">
            <div onClick={() => chooseStep(4)} className={`w-8 h-8 rounded-full border-4 border-gamefiDark-900 flex justify-center items-center text-base font-bold cursor-pointer text-gamefiDark-900 hover:bg-gamefiDark-100 ${stepActive(4) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}>4</div>
            <span className={`text-xs md:text-sm font-bold uppercase w-40 inline-block text-center absolute -left-16 ${stepActive(4) ? '' : 'opacity-40'}`}>Confirmation</span>
          </div>
          <div className="ml-[90%] absolute -left-4">
            <div onClick={() => chooseStep(5)} className={`w-8 h-8 rounded-full border-4 border-gamefiDark-900 flex justify-center items-center text-base font-bold cursor-pointer text-gamefiDark-900 hover:bg-gamefiDark-100 ${stepActive(5) ? 'bg-gamefiGreen-500' : 'bg-gamefiDark-500'}`}>5</div>
            <span className={`text-xs md:text-sm font-bold uppercase w-40 inline-block text-center absolute -left-16 ${stepActive(5) ? '' : 'opacity-40'}`}>Completed</span>
          </div>
        </div>
      </div>

      { step === 1 && <>
        <div className="font-bold text-lg md:text-3xl uppercase">Pre - Stake</div>
        <p className="font-casual text-sm">The following conditions must be met to proceed</p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-2 md:mt-6">
          <div className="flex-1">
            <div className="bg-gray-500 bg-opacity-20 p-4 md:px-6 md:py-5 rounded flex items-center w-full">
              { account && <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-6 flex-none">
                <circle cx="18" cy="18" r="18" fill="#67CF02"/>
                <path d="M8.83325 18L15.2499 24.4167L27.1666 12.5" stroke="#212121" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg> }
              { !account && <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-6 flex-none">
                <circle cx="18" cy="18" r="18" fill="#DE4343"/>
                <path d="M24 12L12 24" stroke="#1A1C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12L15 15L18 18M24 24L21 21" stroke="#1A1C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg> }
              <span className="font-casual text-xs sm:text-sm md:text-base">Connect Your Wallet</span>
              { !account && <WalletConnector buttonClassName="ml-auto"></WalletConnector> }
              { account && <span className="font-casual text-xs md:text-sm opacity-50 ml-auto">{shorten(account)}</span> }
            </div>
            <div className="bg-gray-500 bg-opacity-20 p-4 md:px-6 md:py-5 rounded flex items-center w-full mt-6">
              { account && chainOK && <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-6 flex-none">
                <circle cx="18" cy="18" r="18" fill="#67CF02"/>
                <path d="M8.83325 18L15.2499 24.4167L27.1666 12.5" stroke="#212121" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg> }
              { (!account || !chainOK) && <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-6 flex-none">
                <circle cx="18" cy="18" r="18" fill="#DE4343"/>
                <path d="M24 12L12 24" stroke="#1A1C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12L15 15L18 18M24 24L21 21" stroke="#1A1C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              }
              <span className="font-casual text-xs sm:text-sm md:text-base">Switch to the BSC network</span>
              { account && !chainOK && <button
                onClick={() => switchNetwork(library.provider, chainIDDefault)}
                className='flex-none ml-auto py-3 px-8 bg-gamefiGreen-500 text-gamefiDark-900 font-bold text-[13px] uppercase rounded-xs hover:opacity-95 cursor-pointer clipped-t-r'
              >
                Switch Network
              </button> }
              { account && chainOK && <span className="font-casual text-xs md:text-sm opacity-50 ml-auto">{network.name}</span> }
            </div>
            <div className="bg-gray-500 bg-opacity-20 p-4 md:px-6 md:py-5 rounded flex items-center w-full mt-6">
              { account && chainOK && balanceGAFIOK && <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-6 flex-none">
                <circle cx="18" cy="18" r="18" fill="#67CF02"/>
                <path d="M8.83325 18L15.2499 24.4167L27.1666 12.5" stroke="#212121" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg> }
              { (!account || !chainOK || !balanceGAFIOK) && <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-6 flex-none">
                <circle cx="18" cy="18" r="18" fill="#DE4343"/>
                <path d="M24 12L12 24" stroke="#1A1C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12L15 15L18 18M24 24L21 21" stroke="#1A1C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg> }
              <span className="font-casual text-xs sm:text-sm md:text-base">$GAFI available to stake </span>
              { account && chainOK && balanceGAFI !== null && !balanceGAFIOK && <a
                href="https://pancakeswap.finance/swap?outputCurrency=0x89af13a10b32f1b2f8d1588f93027f69b6f4e27e&inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56"
                target="_blank"
                className='flex-none ml-auto py-2 px-8 bg-gamefiGreen-500 text-gamefiDark-900 font-bold text-sm rounded-xs hover:opacity-95 cursor-pointer clipped-t-r' rel="noreferrer"
              >
                Buy $GAFI
              </a> }
              { account && chainOK && balanceGAFI === null && <span className="font-casual text-xs md:text-sm opacity-50 ml-auto">Loading...</span> }
              { account && chainOK && balanceGAFIOK && <span className="font-casual text-xs md:text-sm opacity-50 ml-auto">{balanceGAFIShort} $GAFI</span> }
            </div>
            <div className="bg-gray-500 bg-opacity-20 p-4 md:px-6 md:py-5 rounded flex items-center w-full mt-6">
              { account && chainOK && balanceOK && <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-6 flex-none">
                <circle cx="18" cy="18" r="18" fill="#67CF02"/>
                <path d="M8.83325 18L15.2499 24.4167L27.1666 12.5" stroke="#212121" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg> }
              { (!account || !chainOK || !balanceOK) && <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-6 flex-none">
                <circle cx="18" cy="18" r="18" fill="#DE4343"/>
                <path d="M24 12L12 24" stroke="#1A1C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12L15 15L18 18M24 24L21 21" stroke="#1A1C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg> }
              <span className="font-casual text-xs sm:text-sm md:text-base">{network?.currency} available in wallet </span>
              { account && chainOK && balance !== null && !balanceOK && <span className="font-casual text-xs md:text-sm opacity-50 ml-auto">{network.currency} is required to pay transaction fees on the BSC network</span> }
              { account && chainOK && balanceOK && <span className="font-casual text-xs md:text-sm opacity-50 ml-auto">{balanceShort} {network.currency}</span> }
            </div>
          </div>
          <StakeRight { ...{ pool, contractStaking, loadMyStaking, loadMyPending, account, stakingMine, pendingWithdrawal } } className="hidden md:block" />
        </div>
      </> }

      { step === 2 && <>
        <div className="font-bold text-lg md:text-3xl uppercase">Stake Amount</div>
        <p className="font-casual text-sm">The Amount of $GAFI you want to stake</p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-2 md:mt-6">
          <div className="flex-1">
            <div className="bg-gray-500 bg-opacity-20 p-4 md:px-10 md:py-5 md:pb-10 rounded w-full">
              <p className="flex items-center font-casual text-sm w-full">
                <span className="truncate">Enter the amount of $GAFI you want to stake</span>
                <span className="flex-none ml-auto text-xs">Current Balance:</span>
                <strong className="flex-none ml-2 text-xs">{balanceGAFIShort}</strong>
              </p>
              <div className="relative font-casual text-sm mt-2">
                <input className={`bg-transparent border w-full pl-4 ${stepOK2 ? 'border-gamefiGreen-700' : 'border-gamefiDark-400'}`} type="text" value={amount} onChange={handleAmount} />
                <button className="text-gamefiGreen-500 font-medium absolute inset-y-0 right-4" onClick={setAmountMax}>Max</button>
              </div>
              <div className="font-casual text-sm mt-4">
                Need more $GAFI? <a
                  className="text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline"
                  href="https://pancakeswap.finance/swap?outputCurrency=0x89af13a10b32f1b2f8d1588f93027f69b6f4e27e&inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56"
                  target="_blank" rel="noreferrer"
                >
                Buy here
                </a>
              </div>
            </div>
          </div>
          <StakeRight { ...{ pool, contractStaking, loadMyStaking, loadMyPending, account, stakingMine, pendingWithdrawal } } className="hidden md:block" />
        </div>
      </> }

      { step === 3 && <>
        <div className="font-bold text-lg md:text-3xl uppercase">Approve</div>
        <p className="font-casual text-sm">In this step, you grant access to staking smart contract to accept your $GAFI.
          <br/>You need to Approve once and only one time.</p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-2 md:mt-6">
          <div className="flex-1">
            <div className="bg-gray-500 bg-opacity-20 p-4 md:px-10 md:py-5 md:pb-10 rounded w-full">
              <p className="flex items-center font-casual text-sm w-full">
                <span className="truncate">Enter the amount of $GAFI you want to stake</span>
                <span className="flex-none ml-auto text-xs">Current Balance:</span>
                <strong className="flex-none ml-2 text-xs">{balanceGAFIShort}</strong>
              </p>
              <div className="relative font-casual text-sm mt-2">
                <input className={'bg-transparent border w-full pl-4'} type="text" value={amount} readOnly disabled />
              </div>
            </div>
          </div>
          <StakeRight { ...{ pool, contractStaking, loadMyStaking, loadMyPending, account, stakingMine, pendingWithdrawal } } className="hidden md:block" />
        </div>
      </> }

      { step === 4 && <>
        <div className="font-bold text-lg md:text-3xl uppercase">Confirmation</div>
        <p className="font-casual text-sm">In this step, you deposit $GAFI into the staking smart contract.
          <br / >After this step, your tokens will be successfully staked</p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-2 md:mt-6">
          <div className="flex-1">
            <div className="bg-gray-500 bg-opacity-20 p-4 md:px-10 md:py-5 md:pb-10 rounded w-full">
              <p className="flex items-center font-casual text-sm w-full">
                <span className="truncate">Enter the amount of $GAFI you want to stake</span>
                <span className="flex-none ml-auto text-xs">Current Balance:</span>
                <strong className="flex-none ml-2 text-xs">{balanceGAFIShort}</strong>
              </p>
              <div className="relative font-casual text-sm mt-2">
                <input className={'bg-transparent border w-full pl-4'} type="text" value={amount} readOnly disabled />
              </div>
            </div>
          </div>
          <StakeRight { ...{ pool, contractStaking, loadMyStaking, loadMyPending, account, stakingMine, pendingWithdrawal } } className="hidden md:block" />
        </div>
      </> }

      { step === 5 && <>
        <div className="font-bold text-lg md:text-3xl uppercase">Completed</div>
        <p className="font-casual text-sm">You have successfully staked <strong>{amount} $GAFI</strong></p>
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
          <StakeRight { ...{ pool, contractStaking, loadMyStaking, loadMyPending, account, stakingMine, pendingWithdrawal } } className="hidden md:block" />
        </div>
      </> }
    </div>

    { step === 1 && <div className="p-4 md:px-10 md:py-4 md:bg-gamefiDark-700 font-casual text-sm flex items-center">
      <label className="leading-relaxed inline-block align-middle">
        <input type="checkbox" className="rounded bg-transparent border-white checked:text-gamefiGreen-700 dark mr-2" checked={agreed} onChange={handleAgreement} />
        I fully understand and agree with the <a className="text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline" href="#" target="_blank" rel="noopener nofollower">Ranking System</a> and <a className="text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline" href="#" target="_blank" rel="noopener nofollower">New Staking and Unstaking Policy</a>
      </label>
      <button
        onClick={() => chooseStep(2)}
        className={`flex-none ml-auto py-2 px-10 font-bold font-mechanic text-sm rounded-xs hover:opacity-95 cursor-pointer clipped-t-r text-gamefiDark-900 ${stepOK1 ? 'bg-gamefiGreen-500' : 'bg-gray-500 bg-opacity-70'}`}
      >
        Next
      </button>
    </div>}

    { step === 2 && <div className="p-4 md:px-10 md:py-4 md:bg-gamefiDark-700 font-casual text-sm flex items-center">
      <button onClick={() => chooseStep(1)} className="ml-auto text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline">Back</button>
      <button
        onClick={() => chooseStep(3)}
        className={`flex-none ml-4 py-2 px-10 font-bold font-mechanic text-sm rounded-xs hover:opacity-95 cursor-pointer clipped-t-r text-gamefiDark-900 ${stepOK2 ? 'bg-gamefiGreen-500' : 'bg-gray-500 bg-opacity-70'}`}
      >
        Next
      </button>
    </div>}

    { step === 3 && <div className="p-4 md:px-10 md:py-4 md:bg-gamefiDark-700 font-casual text-sm flex items-center">
      <button onClick={() => chooseStep(2)} className="ml-auto text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline">Back</button>
      <button
        onClick={approveOrNext}
        className={`flex-none ml-4 py-2 px-10 font-bold font-mechanic text-sm rounded-xs hover:opacity-95 cursor-pointer clipped-t-r text-gamefiDark-900 ${stepOK3 ? 'bg-gamefiGreen-500' : 'bg-gray-500 bg-opacity-70'}`}
      >
        {(loadingAllowance || loadingApproval) ? 'Loading...' : (allowanceEnough ? 'Approved. Next' : 'Approve')}
      </button>
    </div>}

    { step === 4 && <div className="p-4 md:px-10 md:py-4 md:bg-gamefiDark-700 font-casual text-sm flex items-center">
      <button onClick={() => chooseStep(3)} className="ml-auto text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline">Back</button>
      <button
        onClick={confirmOrNext}
        className={`flex-none ml-4 py-2 px-10 font-bold font-mechanic text-sm rounded-xs hover:opacity-95 cursor-pointer clipped-t-r text-gamefiDark-900 ${stepOK3 ? 'bg-gamefiGreen-500' : 'bg-gray-500 bg-opacity-70'}`}
      >
        {confirming ? 'Confirming...' : (confirmed ? 'Confirmed. Next' : 'Confirm')}
      </button>
    </div>}

    { step === 5 && <div className="p-4 md:px-10 md:py-4 md:bg-gamefiDark-700 font-casual text-sm flex items-center">
      <button
        onClick={stakeMore}
        className={`flex-none ml-auto py-2 px-10 font-bold font-mechanic text-sm rounded-xs hover:opacity-95 cursor-pointer clipped-t-r text-gamefiDark-900 ${stepOK4 ? 'bg-gamefiGreen-500' : 'bg-gray-500 bg-opacity-70'}`}
      >
        I want to stake more
      </button>
    </div>}

    <StakeRight { ...{ pool, contractStaking, loadMyStaking, loadMyPending, account, stakingMine, pendingWithdrawal } } className="block md:hidden mt-6" />
  </>
}
