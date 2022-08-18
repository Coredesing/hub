import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import Image from 'next/image'
import get from 'lodash.get'
import Link from 'next/link'

import stakeBanner from '@/assets/images/ranks/stakeGAFI.png'
import stakeBanner2 from '@/assets/images/ranks/stakeGAFI-2.svg'
import stakeBanner3 from '@/assets/images/ranks/stakeGAFI-3.png'
import stakeBanner4 from '@/assets/images/ranks/stakeGAFI-4.png'
import List from '@/components/Pages/Account/Rank/Quest/ListQuest'

const TabGetMoreExp = ({ data }) => {
  return (
    <div id="task-list" className="mt-8 w-full h-full">
      <div className="flex justify-between flex-col xl:flex-row">
        <div className="flex flex-col gap-3 mr-4 2xl:mr-[124px]">
          <div className="flex gap-3">
            <div className="uppercase font-mechanic font-bold text-[18px] leading-[100%] text-white">
              STAKING GAFI
            </div>
            {/* <Tippy
              content={
                <div>
                  You get 100 GXP for each GAFI staked<br></br>
                  You lost 100 GXP for
                  each GAFI unstaked
                </div>
              }
            >
              <div className="w-4 h-4 relative mr-36 cursor-pointer">
                <Image
                  src={require('@/assets/images/ranks/tooltip.svg')}
                  alt=""
                  layout="fill"
                ></Image>
              </div>
            </Tippy> */}
          </div>

          <div className="font-casual font-normal text-sm leading-[150%] text-white">
            Get 100 GXP per $GAFI staked
            <br />
            Lose 100 GXP per $GAFI staked
          </div>
        </div>
        <div className="relative flex-1">
          <div
            className={clsx(
              'h-[82px] rounded-[4px] bg-white relative overflow-hidden'
            )}
          >
            <div className="w-full h-full absolute z-0 top-0 left-0">
              <Image layout="fill" src={stakeBanner} alt=""></Image>
            </div>
            <div className="w-full h-full absolute z-10 top-0 left-0 text-black flex items-center pr-8">
              <div
                className="w-24 h-full relative bg-gamefiGreen-700 clipped-b-r-full"
                style={{ marginTop: 0, marginLeft: 0 }}
              >
                <Image layout="fill" src={stakeBanner2} alt=""></Image>
              </div>
              <span className="ml-2 mr-auto 2xl:ml-6 uppercase font-mechanic font-bold text-lg leading-[150%]">
                GET 100 GXP FOR EACH GAFI STAKED
              </span>
              <Link href="/staking">
                <a className="hidden sm:inline-flex bg-gamefiGreen-600 clipped-t-r rounded-sm cursor-pointer">
                  <span className="font-mechanic bg-[#7BF404] text-[#0D0F15] hover:text-[#0D0F15]/70 clipped-b-l py-2 px-[38px] rounded-sm leading-5 uppercase font-bold text-[13px]">
                    Stake gafi
                  </span>
                </a>
              </Link>
            </div>
          </div>

          <div className="absolute top-0 left-0 w-24 h-[82px] z-10">
            <Image layout="fill" src={stakeBanner3} alt=""></Image>
          </div>
          <div className="absolute -top-3 left-1 w-10 h-10 z-10">
            <Image layout="fill" src={stakeBanner4} alt=""></Image>
          </div>
        </div>
      </div>

      {[
        ...get(data, 'groupQuests', []),
        {
          _id: '1',
          name: 'Social activities',
          description: '',
          tooltipText: '',
          priority: 6,
          quests: [{ _id: 1 }, { _id: 2 }, { _id: 3 }, { _id: 4 }]
        }
      ].map((group) => (
        <List key={group._id} data={group}></List>
      ))}
    </div>
  )
}

export default TabGetMoreExp
