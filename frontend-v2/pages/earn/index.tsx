import Layout from '@/components/Layout'
import { fetchAll } from '@/pages/api/earn'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { format, formatDistanceStrict } from 'date-fns'
import Image from 'next/image'
import { BigNumber, Contract } from 'ethers'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { fetcher, printNumber, safeToFixed } from '@/utils'
import { useMyWeb3 } from '@/components/web3/context'
import ABIStakingPool from '@/components/web3/abis/StakingPool.json'
import { getLibraryDefaultFlexible } from '@/components/web3/utils'
import { getNetworkByAlias, switchNetwork } from '@/components/web3'
import toast from 'react-hot-toast'

const Earn = ({ pools: initPools }) => {
  const { account, network, library } = useMyWeb3()
  const [pools, setPools] = useState(initPools)

  const fetchPools = useCallback(() => {
    fetcher('/api/earn').then(body => {
      if (!body?.data) {
        return
      }

      setPools(body.data)
    })
  }, [setPools])

  const poolsByContract = useMemo(() => {
    return pools.reduce((acc, val) => {
      if (!val?.contractAddress) {
        return acc
      }

      const token = acc[val?.contractAddress]
      if (token?.pools) {
        token.pools.push(val)
        return acc
      }

      acc[val?.contractAddress] = {
        token: val?.token,
        tokenImage: val?.tokenImage,
        pools: [val]
      }

      return acc
    }, {})
  }, [pools])

  const [selected, setSelected] = useState({})
  const selectPool = useCallback((contractAddress, pool) => {
    setSelected(prevState => {
      return {
        ...prevState,
        [contractAddress]: pool
      }
    })
  }, [setSelected])
  useEffect(() => {
    Object.keys(poolsByContract).forEach(contractAddress => {
      const pools = (poolsByContract?.[contractAddress]?.pools || []).sort((a, b) => Number(b.lockDuration) - Number(a.lockDuration))
      const pool = pools?.[0]
      if (!pool) {
        return
      }

      selectPool(contractAddress, pool)
    })
  }, [poolsByContract, selectPool])

  const [open, setOpen] = useState({})
  const toggle = useCallback((contractAddress) => {
    setOpen(prevState => {
      return {
        ...prevState,
        [contractAddress]: !prevState[contractAddress]
      }
    })
  }, [setOpen])

  const [selectedExtended, setSelectedExtended] = useState({})
  useEffect(() => {
    const v = Object.keys(selected).reduce((acc, val) => {
      const cap = BigNumber.from(selected[val]?.cap)
      const staked = BigNumber.from(selected[val]?.totalStaked)
      const capParsed = formatUnits(cap, selected[val]?.decimals)
      const stakedParsed = formatUnits(staked, selected[val]?.decimals)
      const amountMin = BigNumber.from(selected[val]?.minInvestment)
      const amountMinParsed = formatUnits(amountMin, selected[val]?.decimals)

      acc[val] = {
        ...selected[val],
        cap,
        staked,
        capParsed,
        stakedParsed,
        amountMin,
        amountMinParsed,
        progress: Number(stakedParsed) / Number(capParsed) * 100,
        timeOpening: new Date(Number(selected[val]?.startJoinTime) * 1000),
        timeClosing: new Date(Number(selected[val]?.endJoinTime) * 1000)
      }

      return acc
    }, {})

    if (!account) {
      setSelectedExtended(v)
      return
    }

    const data = Object.keys(v).map(async (contractAddress) => {
      const library = await getLibraryDefaultFlexible(null, v[contractAddress]?.network)
      const contract = new Contract(contractAddress, ABIStakingPool, library)
      return [
        contractAddress,
        await contract.linearPendingReward(v[contractAddress]?.id, account),
        await contract.linearStakingData(v[contractAddress]?.id, account)
      ]
    })

    let minimum
    Promise.all(data).then(data => {
      data.forEach(([contractAddress, pendingReward, stakingData]) => {
        if (!minimum) {
          minimum = parseUnits('0.0001', v[contractAddress]?.decimals)
        }

        v[contractAddress].myPendingReward = pendingReward
        v[contractAddress].myPendingRewardParsed = formatUnits(pendingReward, v[contractAddress]?.decimals)
        v[contractAddress].myPendingRewardClaimable = pendingReward.gt(minimum)
        v[contractAddress].myStake = stakingData.balance
        v[contractAddress].myStakeParsed = formatUnits(stakingData.balance, v[contractAddress]?.decimals)
      })

      setSelectedExtended(v)
    })
  }, [selected, account])

  const networkIncorrect = useMemo(() => {
    return Object.keys(selected).reduce((acc, val) => {
      acc[val] = (selected[val]?.network || '').toLowerCase() !== network?.alias
      return acc
    }, {})
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
    } finally {
      fetchPools()
    }
  }, [library, fetchPools])

  return <Layout title="GameFi Earn">
    <div className="px-2 md:px-4 lg:px-16 mx-auto lg:block max-w-7xl mb-4 md:mb-8 lg:mb-10 xl:mb-16">
      <h1 className="uppercase font-bold text-4xl hidden">GameFi Earn</h1>
      <h3 className="font-medium text-xl mb-14 hidden">A Safe and Simple Way to Grow Your Digital Assets.</h3>
      <div className="mt-4 mb-14 mx-auto flex items-center justify-center max-w-[1128px]">
        <Image src={require('@/assets/images/earn/banner.png')} alt="" />
      </div>

      {Object.keys(poolsByContract).map(contractAddress => {
        const pools = (poolsByContract?.[contractAddress]?.pools || []).sort((a, b) => Number(a.lockDuration) - Number(b.lockDuration))
        const { token, tokenImage } = pools?.[0] || {}
        return <div key={contractAddress} className="rounded-sm shadow overflow-hidden">
          <div className="flex w-full items-center bg-gamefiDark-630/80 px-6 py-4">
            <div className="inline-flex items-center w-[12rem] truncate">
              <img src={tokenImage} alt={token} className="w-10 h-10 rounded-full mr-3" />
              <span className="text-xl uppercase font-semibold tracking-wide font-casual">{token}</span>
            </div>
            <div className="w-[10rem]">
              <p className="text-[13px] text-white font-bold uppercase text-opacity-50">APR</p>
              <span className="text-xl uppercase font-medium font-casual">{ Number(selected[contractAddress]?.APR).toFixed(2) }%</span>
            </div>
            <div className="w-[10rem]">
              <p className="text-[13px] text-white font-bold uppercase text-opacity-50">Remaining Quota</p>
              <span className="text-xl uppercase font-medium font-casual">{ Number(selected[contractAddress]?.APR).toFixed(2) }%</span>
            </div>
            <div>
              <p className="text-[13px] text-white font-bold uppercase text-opacity-50">Lock-in term</p>
              { pools && <div className="flex text-[12px] gap-x-2 mt-1 font-casual">{ pools.map(pool => <div key={pool.id} className={`px-2 py-1 rounded-sm border cursor-pointer ${selected[contractAddress] === pool ? 'border-gamefiGreen-500' : 'border-white/50'}`} onClick={() => {
                selectPool(contractAddress, pool)
              }}>
                {formatDistanceStrict(0, Number(pool.lockDuration) * 1000, { unit: 'day' })}
              </div>) }</div> }
            </div>
            <div className="ml-auto">
              <p className="text-[13px] text-white font-bold uppercase text-opacity-50">Applicable subject</p>
              <span className="text-base font-casual">Everyone</span>
            </div>
            <div className="w-[10rem] text-right">
              <div className="items-center justify-center py-2 rounded text-sm cursor-pointer inline-flex hover:text-gamefiGreen-500" onClick={() => toggle(contractAddress)}>
                { open[contractAddress]
                  ? <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                }
              </div>
            </div>
          </div>

          { open[contractAddress] && selectedExtended[contractAddress] && <div className="bg-gamefiDark-630/30 p-4">
            <div className="flex px-2">
              <div className="flex-1 border-r border-white/20 px-6 pl-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[13px] text-white font-bold uppercase text-opacity-50">Total Pool Cap</span>
                  <span className="text-[13px] text-white font-bold uppercase">{printNumber(selectedExtended[contractAddress].capParsed)} {token}</span>
                </div>
                <div className="bg-gamefiDark-900 rounded mb-1">
                  <div className="h-[5px] rounded bg-gradient-to-r from-yellow-300 to-gamefiGreen-500" style={{ width: `${selectedExtended[contractAddress].progress.toLocaleString('en-US')}%` }}></div>
                </div>
                <div className="font-casual text-xs text-white/50 mb-6">{selectedExtended[contractAddress].progress.toFixed(2)}%</div>
                <div className="flex justify-between mb-4 font-casual text-sm">
                  <span className="font-semibold">Opening Time</span>
                  <span>{format(selectedExtended[contractAddress].timeOpening, 'yyyy-MM-dd HH:mm:ss O')}</span>
                </div>
                <div className="flex justify-between mb-4 font-casual text-sm">
                  <span className="font-semibold">Closing Time</span>
                  <span>{format(selectedExtended[contractAddress].timeClosing, 'yyyy-MM-dd HH:mm:ss O')}</span>
                </div>
                <div className="flex justify-between mb-4 font-casual text-sm">
                  <span className="font-semibold">Minimum Investment</span>
                  <span>{printNumber(selectedExtended[contractAddress].amountMinParsed)} {token}</span>
                </div>
              </div>
              <div className="min-w-[12rem] px-6 border-r border-white/20 flex flex-col">
                <div>
                  <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-1">Your Current Interest</p>
                  <p className="text-base text-white font-casual font-medium">{safeToFixed(selectedExtended[contractAddress].myPendingRewardParsed, 2)} GAFI</p>
                </div>
                <div className="mt-auto">
                  { selectedExtended[contractAddress].myPendingRewardClaimable && !networkIncorrect[contractAddress] && <>
                    {/* <div onClick={() => restake(contractAddress, selected[contractAddress]?.id)} className="bg-gamefiGreen-600 hover:bg-opacity-80 uppercase p-px rounded-sm clipped-t-r text-[13px] font-bold text-center cursor-pointer mb-2">
                      <div className="bg-gamefiDark-650 clipped-t-r py-2 px-5 rounded-sm text-gamefiGreen-600 hover:text-opacity-80">Re-stake Reward</div>
                    </div> */}
                    <div onClick={() => claimReward(contractAddress, selected[contractAddress]?.id)} className="bg-gamefiGreen-600 hover:bg-opacity-80 uppercase py-2 px-5 rounded-sm clipped-b-l text-[13px] font-bold text-center cursor-pointer text-gamefiDark-800">
                      Claim Token
                    </div>
                  </>
                  }
                  { networkIncorrect[contractAddress] && <div
                    className="bg-gamefiGreen-600 hover:bg-opacity-80 uppercase py-2 px-5 rounded-sm clipped-b-l text-[13px] font-bold text-center cursor-pointer text-gamefiDark-800"
                    onClick={() => switchNetwork(library.provider, getNetworkByAlias(selected[contractAddress]?.network)?.id)}
                  >
                      Switch Network
                  </div> }
                  { (!selectedExtended[contractAddress].myPendingRewardClaimable && !networkIncorrect[contractAddress]) && <>
                    <div className="bg-gamefiDark-300 uppercase py-2 px-5 rounded-sm clipped-b-l text-[13px] font-bold text-center cursor-not-allowed text-gamefiDark-800">
                      Claim Token
                    </div>
                  </>
                  }
                </div>
              </div>
              <div className="min-w-[12rem] px-6 border-r border-white/20">
                <p className="text-[13px] text-white font-bold uppercase text-opacity-50 mb-1">Current Investment</p>
                <p className="text-base text-white font-casual font-medium">{safeToFixed(selectedExtended[contractAddress].myStakeParsed, 2)} GAFI</p>
              </div>
              <div className="min-w-[15rem] px-6">
              </div>
            </div>
          </div> }
        </div>
      }
      )}
    </div>
  </Layout>
}
export default Earn

export async function getStaticProps () {
  const pools = await fetchAll()
  return {
    props: {
      pools
    },
    revalidate: 60
  }
}
