import { useRef, useEffect } from 'react'
import Layout from 'components/Layout'
import imgNA from '@/assets/images/ranks/na.png'
import AccountLayout from '@/components/Pages/Account/AccountLayout'
import Image from 'next/image'
import Link from 'next/link'
import { safeToFixed } from '@/utils'
import { useAppContext } from '@/context'
import { useMyWeb3 } from '@/components/web3/context'
import Ranks from '@/components/Pages/Staking/Ranks'

const RankPage = () => {
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const { tierMine, stakingMine } = useAppContext()
  const { account } = useMyWeb3()

  return (
    <Layout title="My Rank - GameFi">
      <AccountLayout>
        <div className="py-10 px-4 xl:px-9 2xl:pr-32">
          <h3 className='hidden lg:block uppercase font-bold text-2xl mb-6'>My Rank</h3>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="p-px bg-gradient-to-r from-gamefiDark-500 via-gamefiDark-600 rounded">
              <div className="bg-gradient-to-r from-gamefiDark-700 via-gamefiDark-900 to-gamefiDark-900 rounded flex h-full sm:pr-10 md:pr-4 xl:pr-10">
                <div className="flex-1 md:flex-initial flex items-center">
                  {(!account || !tierMine) && <img src={imgNA.src} className="block w-20 mr-2" alt="No Rank" />}
                  {account && tierMine && <div className="block w-20 mr-1 md:mr-2"> <Image src={tierMine.image} layout='responsive' objectFit='contain' alt={tierMine.name} /> </div>}
                  <div>
                    <span className="font-bold text-sm uppercase text-white opacity-50">Current Rank</span>
                    {!account && <p className="sm:font-casual font-medium text-xs md:text-sm text-gamefiGreen-500 leading-6">Connect Wallet</p>}
                    {account && <p className="font-semibold text-2xl text-white leading-6">{tierMine ? tierMine.name : 'Loading...'}</p>}
                  </div>
                </div>
                <div className="sm:hidden flex flex-col justify-center gap-1">
                  <Link passHref={true} href="/unstaking">
                    <a className="inline-flex bg-gamefiGreen-600 hover:bg-gamefiGreen-700 p-px rounded-sm cursor-pointer">
                      <span className="font-mechanic bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-700 py-1 px-4 rounded-sm leading-5 uppercase font-bold text-[13px]">
                        Unstake
                      </span>
                    </a>
                  </Link>
                  <Link passHref={true} href="/staking">
                    <a className="inline-flex bg-gamefiGreen-600 hover:bg-gamefiGreen-700 p-px rounded-sm cursor-pointer">
                      <span className="font-mechanic text-gamefiDark-900 py-1 px-4 rounded-sm leading-5 uppercase font-bold text-[13px]">
                        Stake More
                      </span>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-px bg-gradient-to-r from-gamefiDark-500 via-gamefiDark-600 rounded">
              <div className="bg-gradient-to-r from-gamefiDark-700 via-gamefiDark-900 to-gamefiDark-900 rounded flex h-full">
                <div className="px-4 xl:px-10 py-4 flex-1 sm:flex-initial flex items-center">
                  <div>
                    <span className="font-bold text-sm uppercase text-white opacity-50">Your Stake</span>
                    {!account && <p className="sm:font-casual font-medium text-xs md:text-sm text-gamefiGreen-500 leading-6">Connect Wallet</p>}
                    {account && <p className="font-semibold text-2xl text-white leading-6">{stakingMine?.tokenStaked !== undefined ? safeToFixed(stakingMine?.tokenStaked, 4) : 'Loading...'}</p>}
                  </div>
                </div>
                <div className="px-4 xl:px-10 py-4 flex-1 sm:flex-initial flex items-center">
                  <div>
                    <span className="font-bold text-sm uppercase text-white opacity-50"><span className="hidden sm:inline">$GAFI Left To</span> Next Rank</span>
                    {!account && <p className="sm:font-casual font-medium text-xs md:text-sm text-gamefiGreen-500 leading-6">Connect Wallet</p>}
                    {account && <p className="font-semibold text-2xl text-white leading-6">{stakingMine?.nextTokens !== null ? safeToFixed(stakingMine?.nextTokens, 4) : 'Loading...'}</p>}
                  </div>
                </div>
                <div className="hidden sm:flex xl:px-10 py-4 flex-1 sm:flex-initial items-center">
                  <Link passHref={true} href="/unstaking">
                    <a className="inline-flex bg-gamefiGreen-600 hover:bg-gamefiGreen-700 clipped-b-l p-px rounded-sm cursor-pointer mr-1">
                      <span className="font-mechanic bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-700 clipped-b-l py-1 px-6 xl:py-2 xl:px-10 rounded-sm leading-5 uppercase font-bold text-[13px]">
                        Unstake
                      </span>
                    </a>
                  </Link>
                  <Link passHref={true} href="/staking">
                    <a className="inline-flex bg-gamefiGreen-600 hover:bg-gamefiGreen-700 clipped-t-r p-px rounded-sm cursor-pointer">
                      <span className="font-mechanic text-gamefiDark-900 clipped-t-r py-1 px-6 xl:py-2 xl:px-10 rounded-sm leading-5 uppercase font-bold text-[13px]">
                        Stake more
                      </span>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Ranks />
        </div>
      </AccountLayout>
    </Layout>
  )
}

export default RankPage
