import Layout from '@/components/Layout'
import { fetchAll } from '@/pages/api/earn'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { addSeconds, format, formatDistanceStrict } from 'date-fns'
import Image from 'next/image'
import { BigNumber, constants, Contract } from 'ethers'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { printNumber, safeToFixed } from '@/utils'
import { useMyWeb3 } from '@/components/web3/context'
import ABIStakingPool from '@/components/web3/abis/StakingPool.json'
import { getLibraryDefaultFlexible, useBalanceToken, useTokenAllowance, useTokenApproval } from '@/components/web3/utils'
import { getNetworkByAlias, switchNetwork, Token } from '@/components/web3'
import toast from 'react-hot-toast'
import Modal from '@/components/Base/Modal'
import type { Pool } from '@/pages/api/earn'

type PoolExtended = Pool & {
  totalCap?: BigNumber;
  staked?: BigNumber;
  totalCapParsed?: string;
  stakedParsed?: string;
  amountMin?: BigNumber;
  amountMinParsed?: string;
  remaining?: BigNumber;
  remainingParsed?: string;
  progress?: number;
  timeOpening?: Date;
  timeClosing?: Date;
  myPendingReward?: BigNumber;
  myPendingRewardParsed?: string;
  myPendingRewardClaimable?: boolean;
  myStake?: BigNumber;
  myStakeParsed?: string;
}

const Earn = ({ pools: initPools }) => {
  const [pools] = useState(initPools)
  const poolsByContract = useMemo<Record<string, Pool[]>>(() => {
    return pools.reduce((acc, val) => {
      if (!val?.contractAddress) {
        return acc
      }

      const items = acc[val?.contractAddress]
      if (items) {
        items.push(val)
        return acc
      }

      acc[val?.contractAddress] = [val]
      return acc
    }, {})
  }, [pools])

  return <Layout title="GameFi Earn">
    <div className="px-2 md:px-4 lg:px-16 mx-auto lg:block max-w-7xl mb-4 md:mb-8 lg:mb-10 xl:mb-16">
      <h1 className="uppercase font-bold text-4xl hidden">GameFi Earn</h1>
      <h3 className="font-medium text-xl mb-14 hidden">A Safe and Simple Way to Grow Your Digital Assets.</h3>
      <div className="mt-4 mb-14 mx-auto flex items-center justify-center max-w-[1128px]">
        <Image src={require('@/assets/images/earn/banner.png')} alt="" />
      </div>

      {Object.keys(poolsByContract).map(contractAddress => {
        const pools = (poolsByContract?.[contractAddress] || []).sort((a, b) => Number(a.lockDuration) - Number(b.lockDuration))
        return <ContractPools
          key={contractAddress}
          pools={pools}
          contractAddress={contractAddress}
        ></ContractPools>
      }
      )}
    </div>
  </Layout>
}

export default Earn

const ContractPools = ({ pools, contractAddress }: {
  pools: Pool[];
  contractAddress: string;
}) => {
  const poolFirst = useMemo<Pool | undefined>(() => {
    return pools?.[0]
  }, [pools])
  const { account, network, library } = useMyWeb3()

  const [open, setOpen] = useState<boolean>(false)
  const [selected, setSelected] = useState<Pool | undefined>()
  useEffect(() => {
    setSelected(pools?.[0])
  }, [pools])

  const [selectedExtended, setSelectedExtended] = useState<PoolExtended | undefined>()
  useEffect(() => {
    if (!selected) {
      setSelectedExtended(undefined)
      return
    }

    const v: PoolExtended = selected
    v.totalCap = BigNumber.from(selected?.cap)
    v.staked = BigNumber.from(selected?.totalStaked)
    v.remaining = v.totalCap.sub(v.staked)
    v.amountMin = BigNumber.from(selected?.minInvestment)
    v.totalCapParsed = formatUnits(v.totalCap, selected?.tokenDecimals)
    v.stakedParsed = formatUnits(v.staked, selected?.tokenDecimals)
    v.remainingParsed = formatUnits(v.remaining, selected?.tokenDecimals)
    v.amountMinParsed = formatUnits(v.amountMin, selected?.tokenDecimals)
    v.progress = Number(v.stakedParsed) / Number(v.totalCapParsed) * 100
    v.timeOpening = new Date(Number(selected?.startJoinTime) * 1000)
    v.timeClosing = new Date(Number(selected?.endJoinTime) * 1000)

    if (!account) {
      setSelectedExtended(v)
      return
    }

    (async () => {
      let minimum
      const library = await getLibraryDefaultFlexible(null, v?.network)
      const contract = new Contract(contractAddress, ABIStakingPool, library)
      const [pendingReward, stakingData] = [
        await contract.linearPendingReward(v?.id, account),
        await contract.linearStakingData(v?.id, account)
      ]
      if (!minimum) {
        minimum = parseUnits('0.0001', v?.tokenDecimals)
      }

      v.myPendingReward = pendingReward
      v.myPendingRewardParsed = formatUnits(pendingReward, v?.tokenDecimals)
      v.myPendingRewardClaimable = pendingReward.gt(minimum)
      v.myStake = stakingData.balance
      v.myStakeParsed = formatUnits(stakingData.balance, v?.tokenDecimals)
      setSelectedExtended(v)
    })()
  }, [selected, account, contractAddress])

  const networkIncorrect = useMemo(() => {
    return (selected?.network || '').toLowerCase() !== network?.alias
  }, [selected, network])

  const claimReward = useCallback(async (contractAddress, poolID) => {
    if (!library) {
      toast.error('Wallet is not connected')
      return
    }

    try {
      const contract = new Contract(contractAddress, ABIStakingPool, library.getSigner())
      const tx = await contract.linearClaimReward(poolID)
      await tx.wait(1)
      toast.success('Claim successfully')
    } catch {
      toast.error('Error occurred. Please try again')
    }
  }, [library])

  const [currentPool, setCurrentPool] = useState<Pool | undefined>()
  const currentToken = useMemo<Token>(() => {
    if (!currentPool) {
      return
    }

    return {
      name: currentPool?.token,
      symbol: currentPool?.token,
      address: currentPool?.tokenAddress,
      decimals: currentPool?.tokenDecimals,
      image: currentPool?.tokenImage
    }
  }, [currentPool])
  const { balance: balanceToken, balanceShort: balanceTokenShort } = useBalanceToken(currentToken)
  const [amount, setAmount] = useState<string>('')
  useEffect(() => {
    setAmount('')
  }, [currentPool])
  const estimatedInterest = useMemo<number>(() => {
    if (!currentPool) {
      return 0
    }

    const apr = Number(currentPool?.APR || 0)
    return apr * Number(amount) / 100
  }, [amount, currentPool])

  const setAmountMax = () => {
    setAmount(balanceTokenShort)
  }
  const handleAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = safeToFixed(target.value, 4)
    if (!value) {
      setAmount('')
      return
    }

    try {
      const valueInWei = parseUnits(value, currentToken.decimals)
      if (valueInWei.gt(balanceToken)) {
        setAmountMax()
        return
      }

      setAmount(value)
    } catch (err) {
    }
  }

  const { allowance, load: loadAllowance, loading: loadingAllowance } = useTokenAllowance(currentToken, account, contractAddress)
  useEffect(() => {
    loadAllowance().catch(err => { console.debug(err) })
  }, [account, loadAllowance])

  const { approve, loading: loadingApproval, error: errorApproval } = useTokenApproval(currentToken, contractAddress)
  useEffect(() => {
    if (!errorApproval) {
      return
    }

    toast.error(`Error: ${errorApproval.message}`)
  }, [errorApproval])
  const allowanceEnough = useMemo(() => {
    if (!amount) {
      return true
    }

    try {
      const valueInWei = parseUnits(amount, currentToken?.decimals)
      return allowance && allowance.gte(valueInWei)
    } catch (err) {
      return false
    }
  }, [allowance, amount, currentToken])
  const approveAndReload = useCallback((amount) => {
    return approve(amount)
      .then(ok => {
        if (ok) {
          toast.success(`Successfully approved your ${currentToken?.symbol}`)
          return loadAllowance()
        }
      })
      .catch(() => {
        loadAllowance().catch(err => { console.debug(err) })
      })
  }, [loadAllowance, approve, currentToken])

  const stake = useCallback(async () => {
    if (!currentPool || !currentToken) {
      return
    }

    if (!allowanceEnough) {
      return
    }

    if (!amount) {
      toast.error(`Please input your amount of ${currentToken.symbol}`)
      return
    }

    if (!library) {
      toast.error('Wallet is not connected')
      return
    }

    try {
      const contract = new Contract(contractAddress, ABIStakingPool, library.getSigner())
      const tx = await contract.linearDeposit(currentPool.id, parseUnits(amount, currentToken.decimals))
      await tx.wait(1)
      toast.success('Stake successfully')
    } catch (err) {
      if (err.code === 4001) {
        toast.error('User Denied Transaction')
        return
      }

      console.debug(err)
      toast.error('Error occurred. Please try again')
    }
  }, [library, currentPool, currentToken, amount, contractAddress, allowanceEnough])

  const approveOrStake = useCallback(() => {
    if (loadingAllowance || loadingApproval) {
      return
    }

    if (allowanceEnough) {
      return stake()
    }

    return approveAndReload(constants.MaxUint256).then(stake)
  }, [loadingAllowance, loadingApproval, allowanceEnough, approveAndReload, stake])

  return <div className="rounded-sm shadow overflow-hidden">
    <div className="flex w-full items-center bg-gamefiDark-630/80 px-6 py-4">
      <div className="inline-flex items-center w-[10rem] truncate">
        <img src={poolFirst?.tokenImage} alt={poolFirst?.token} className="w-10 h-10 rounded-full mr-3" />
        <span className="text-xl uppercase font-semibold tracking-wide font-casual">{poolFirst?.token}</span>
      </div>
      <div className="min-w-[8rem]">
        <p className="text-[13px] text-white font-bold uppercase text-opacity-50">APR</p>
        <span className="text-xl uppercase font-medium font-casual">{ Number(selected?.APR).toFixed(2) }%</span>
      </div>
      <div className="min-w-[12rem]">
        <p className="text-[13px] text-white font-bold uppercase text-opacity-50">Remaining Quota</p>
        <div className="text-base uppercase font-medium font-casual my-0.5">{ printNumber(selectedExtended?.remainingParsed) } {poolFirst?.token}</div>
      </div>
      <div>
        <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-0.5">Lock-in term</p>
        { pools && <div className="flex text-[12px] gap-x-2 font-casual">{ pools.map(pool => <div key={pool.id} className={`px-2 py-1 rounded-sm border cursor-pointer ${selected === pool ? 'border-gamefiGreen-500' : 'border-white/50'}`} onClick={() => {
          setSelected(pool)
        }}>
          {formatDistanceStrict(0, Number(pool.lockDuration) * 1000, { unit: 'day' })}
        </div>) }</div> }
      </div>
      <div className="ml-auto">
        <p className="text-[13px] text-white font-bold uppercase text-opacity-50">Applicable subjects</p>
        <span className="text-base font-casual">Everyone</span>
      </div>
      <div className="min-w-[5rem] text-right">
        <div className="items-center justify-center py-2 rounded text-sm cursor-pointer inline-flex hover:text-gamefiGreen-500" onClick={() => setOpen(!open)}>
          { open
            ? <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
            : <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          }
        </div>
      </div>
    </div>

    { open && selectedExtended && <div className="bg-gamefiDark-630/30 p-4">
      <div className="flex px-2">
        <div className="flex-1 border-r border-white/20 px-6 pl-3">
          <div className="flex justify-between mb-1">
            <span className="text-[13px] text-white font-bold uppercase text-opacity-50">Total Pool Cap</span>
            <span className="text-[13px] text-white font-bold uppercase">{printNumber(selectedExtended.totalCapParsed)} {poolFirst?.token}</span>
          </div>
          <div className="bg-gamefiDark-900 rounded mb-1">
            <div className="h-[5px] rounded bg-gradient-to-r from-yellow-300 to-gamefiGreen-500" style={{ width: `${selectedExtended.progress.toLocaleString('en-US')}%` }}></div>
          </div>
          <div className="font-casual text-xs text-white/50 mb-6">{selectedExtended.progress.toFixed(2)}%</div>

          <div className="flex justify-between mb-4 font-casual text-sm">
            <span className="font-semibold">Opening Time</span>
            <span>{format(selectedExtended.timeOpening, 'yyyy-MM-dd HH:mm:ss O')}</span>
          </div>
          <div className="flex justify-between mb-4 font-casual text-sm">
            <span className="font-semibold">Closing Time</span>
            <span>{format(selectedExtended.timeClosing, 'yyyy-MM-dd HH:mm:ss O')}</span>
          </div>
          <div className="flex justify-between mb-4 font-casual text-sm">
            <span className="font-semibold">Minimum Investment</span>
            <span>{printNumber(selectedExtended.amountMinParsed)} {poolFirst?.token}</span>
          </div>
        </div>
        <div className="min-w-[12rem] px-6 border-r border-white/20 flex flex-col">
          <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-1">Your Current Interest</p>
          <p className="text-base text-white font-casual font-medium">{safeToFixed(selectedExtended.myPendingRewardParsed, 2)} {poolFirst?.token}</p>
          <div className="mt-auto">
            { selectedExtended.myPendingRewardClaimable && !networkIncorrect && <>
              {/* <div onClick={() => restake(contractAddress, selected?.id)} className="bg-gamefiGreen-600 hover:bg-opacity-80 uppercase p-px rounded-sm clipped-t-r text-[13px] font-bold text-center cursor-pointer mb-2">
                      <div className="bg-gamefiDark-650 clipped-t-r py-2 px-5 rounded-sm text-gamefiGreen-600 hover:text-opacity-80">Re-stake Reward</div>
                    </div> */}
              <div onClick={() => claimReward(contractAddress, selected?.id)} className="bg-gamefiGreen-600 hover:bg-opacity-80 uppercase py-2 px-5 rounded-sm clipped-b-l text-[13px] font-bold text-center cursor-pointer text-gamefiDark-800">
                Collect Interest
              </div>
            </>
            }
            { networkIncorrect && <div
              className="bg-gamefiGreen-600 hover:bg-opacity-80 uppercase py-2 px-5 rounded-sm clipped-b-l text-[13px] font-bold text-center cursor-pointer text-gamefiDark-800"
              onClick={() => switchNetwork(library.provider, getNetworkByAlias(selected?.network)?.id)}
            >
              Switch Network
            </div> }
            { (!selectedExtended.myPendingRewardClaimable && !networkIncorrect) && <>
              <div className="bg-gamefiDark-300 uppercase py-2 px-5 rounded-sm clipped-b-l text-[13px] font-bold text-center cursor-not-allowed text-gamefiDark-800">
                Collect Interest
              </div>
            </>
            }
          </div>
        </div>
        <div className="min-w-[12rem] px-6 border-r border-white/20 flex flex-col">
          <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-1">Current Investment</p>
          <p className="text-base text-white font-casual font-medium">{safeToFixed(selectedExtended.myStakeParsed, 2)} GAFI</p>
          <div className="mt-auto">
            <Modal
              show={!!currentPool}
              toggle={(x: boolean) => setCurrentPool(x && selectedExtended)}
              className={'!bg-gamefiDark-650 !max-w-2xl'}
            >
              <div className="px-8 pt-10 pb-6">
                <p className="text-xl uppercase font-medium font-casual mb-2">
                  Stake {currentToken?.symbol}
                </p>
                <div className="bg-gamefiDark-900 rounded mb-1">
                  <div className="h-[5px] rounded bg-gradient-to-r from-yellow-300 to-gamefiGreen-500" style={{ width: `${selectedExtended.progress.toLocaleString('en-US')}%` }}></div>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-[13px] text-white font-bold uppercase text-opacity-50">{selectedExtended.progress.toFixed(2)}%</span>
                  <span className="text-[13px] text-white font-bold uppercase">{printNumber(selectedExtended.totalCapParsed)} {currentToken?.symbol}</span>
                </div>

                <div className="flex gap-6 mt-4 pt-4 border-t border-white/20">
                  <div className="w-full">
                    <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-1">Pool</p>
                    { pools && <div className="flex text-[12px] gap-x-2 font-casual">{ pools.map(pool => <div key={pool.id} className={`px-2 py-1 rounded-sm border cursor-pointer ${selected === pool ? 'border-gamefiGreen-500' : 'border-white/50'}`} onClick={() => {
                      setSelected(pool)
                    }}>
                      {formatDistanceStrict(0, Number(pool.lockDuration) * 1000, { unit: 'day' })}
                    </div>) }</div> }
                    <div className="mb-6"></div>
                    <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-1">Amount ({currentToken?.symbol})</p>
                    <div className="relative">
                      <input
                        type="text"
                        className="font-casual text-sm w-full px-2 py-1 rounded-sm border-white/50 cursor-pointer bg-gamefiDark-630/10 focus:bg-gamefiDark-630 text-white"
                        placeholder={`Minimum: ${printNumber(selectedExtended.amountMinParsed)} ${currentToken?.symbol}`}
                        value={amount}
                        onChange={handleAmount}
                      />
                      <div className="uppercase font-semibold absolute inset-y-0 right-2 flex justify-center items-center hover:text-gamefiGreen-500 cursor-pointer" onClick={setAmountMax}>Max</div>
                    </div>
                    <p className="text-xs font-casual leading-loose mb-6">Balance: {balanceTokenShort} {currentToken?.symbol}</p>
                  </div>
                  <div className="w-full">
                    <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-1">Applicable Subjects</p>
                    <p className="font-casual text-sm mb-6">Everyone</p>

                    <div className="flex justify-between mb-6">
                      <div>
                        <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-1">Estimated Interest ({currentToken?.symbol})</p>
                        <p className="font-casual text-sm">{estimatedInterest} {currentToken?.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-1">APR</p>
                        <p className="font-casual text-sm">{ Number(selected?.APR).toFixed(2) }%</p>
                      </div>
                    </div>

                    <div className="flex justify-between mb-6">
                      <div>
                        <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-1">Start Date</p>
                        <p className="font-casual text-sm">Now</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-1">Maturity Date</p>
                        <p className="font-casual text-sm">{ format(addSeconds(new Date(), Number(selected.lockDuration)), 'yyyy-MM-dd') }</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-1">
                    <div className="flex gap-2">
                      { !networkIncorrect && <div onClick={approveOrStake} className="flex-1 flex justify-center items-end bg-gamefiGreen-600 hover:bg-opacity-80 uppercase p-2 rounded-sm clipped-b-l text-[13px] font-bold text-center cursor-pointer text-gamefiDark-800">
                        Stake Now
                      </div> }
                      { networkIncorrect && <div
                        className="flex justify-center items-end bg-gamefiGreen-600 hover:bg-opacity-80 uppercase py-2 px-5 rounded-sm clipped-b-l text-[13px] font-bold text-center cursor-pointer text-gamefiDark-800"
                        onClick={() => switchNetwork(library.provider, getNetworkByAlias(selected?.network)?.id)}
                      >
                        Switch Network
                      </div> }
                      <a
                        className="flex-1 bg-gamefiGreen-600 hover:bg-opacity-80 uppercase p-px rounded-sm clipped-t-r text-[13px] font-bold text-center cursor-pointer"
                        href={selected?.buyURL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="bg-gamefiDark-650 clipped-t-r p-2 rounded-sm text-gamefiGreen-600 hover:text-opacity-80">Buy {currentToken?.symbol}</div>
                      </a>
                    </div>
                  </div>
                  <div className="flex-1"></div>
                </div>
              </div>
            </Modal>
            { !networkIncorrect && <>
              <div onClick={() => setCurrentPool(selectedExtended)} className="bg-gamefiGreen-600 hover:bg-opacity-80 uppercase py-2 px-5 rounded-sm clipped-t-r text-[13px] font-bold text-center cursor-pointer text-gamefiDark-800">
                Stake
              </div>
            </>
            }
            { networkIncorrect && <div
              className="bg-gamefiGreen-600 hover:bg-opacity-80 uppercase py-2 px-5 rounded-sm clipped-b-l text-[13px] font-bold text-center cursor-pointer text-gamefiDark-800"
              onClick={() => switchNetwork(library.provider, getNetworkByAlias(selected?.network)?.id)}
            >
              Switch Network
            </div> }
          </div>
        </div>
        <div className="min-w-[15rem] px-6">
        </div>
      </div>
    </div> }
  </div>
}

export async function getStaticProps () {
  const pools = await fetchAll()
  return {
    props: {
      pools
    },
    revalidate: 60
  }
}
