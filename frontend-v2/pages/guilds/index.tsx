import Layout from '@/components/Layout'
import React from 'react'
import Image from 'next/image'
import { printNumber } from '@/utils'
import SearchInput from '@/components/Base/SearchInput'
import Dropdown from '@/components/Base/Dropdown'

const Guilds = () => {
  return (
    <Layout>
      <>
        <div className="container mx-auto px-4 lg:px-16 mt-8">
          <Image src={require('@/assets/images/gamefi-guild.png')} alt=""></Image>
        </div>
        <div className="container mx-auto px-4 lg:px-16 my-8">
          <div className="w-full grid grid-cols-8 gap-4">
            <div className="col-span-2 p-8 flex flex-col justify-center gap-4 bg-gamefiDark-630/30 rounded">
              <div className="w-full flex items-center">
                <div>
                  <Image src={require('@/assets/images/guilds/total-guilds.png')} alt=""></Image>
                </div>
                <div className="ml-2 flex-1 flex-col gap-2">
                  <div className="uppercase text-gamefiDark-100 text-sm font-semibold">Total Guilds</div>
                  <div className="font-medium text-xl leading-4">{printNumber(15000)}</div>
                </div>
              </div>
              <div className="w-full flex items-center">
                <div>
                  <Image src={require('@/assets/images/guilds/avg-scholar-count.png')} alt=""></Image>
                </div>
                <div className="ml-2 flex-1 flex-col gap-2">
                  <div className="uppercase text-gamefiDark-100 text-sm font-semibold">AVG Scholar Count</div>
                  <div className="font-medium text-xl leading-4">{printNumber(15000)}</div>
                </div>
              </div>
            </div>
            <div className="col-span-3 p-8 bg-gamefiDark-630/30 rounded">
            </div>
            <div className="col-span-3 p-8 bg-gamefiDark-630/30 rounded">
            </div>
            <div className="col-span-8 p-8 bg-gamefiDark-630/30 rounded">
              <div className="uppercase font-bold text-xl">Performance By Region</div>
            </div>
          </div>
          <div className="w-full my-14">
            <div className="w-full flex items-center">
              <div className="uppercase font-bold text-xl">Performance By Guild</div>
              <div className="flex-1 flex gap-2 justify-end">
                <div className="min-w-[400px]"><SearchInput placeholder="Search By Game"></SearchInput></div>
                <Dropdown items={[{
                  key: 'all-regions',
                  label: 'All Regions',
                  value: 'all-regions'
                }]}
                selected={{
                  key: 'all-regions',
                  label: 'All Regions',
                  value: 'all-regions'
                }}></Dropdown>
              </div>
            </div>
            <div className="w-full px-4 mt-6 mb-3 flex gap-1 md:gap-4 xl:gap-6 text-gamefiDark-100 text-sm uppercase font-medium leading-4">
              <div className="w-52">Guild</div>
              <div className="w-40">Game</div>
              <div className="w-40">Region</div>
              <div className="w-40">Daily Active <br></br> Discord Members</div>
              <div className="w-40">Activeness</div>
              <div className="w-40">Avg Scholar <br></br> Commission</div>
              <div className="w-40">Avg Guild <br></br> Commission</div>
              <div className="w-40">AVG SLP</div>
            </div>
            <div className="w-full flex gap-1 md:gap-4 xl:gap-6 items-center my-1 bg-gamefiDark-630/30 rounded-sm clipped-b-r p-4">
              <div className="w-52">This is Guild Name</div>
              <div className="w-40">Game Name</div>
              <div className="w-40">North America</div>
              <div className="w-40">
                <div className="w-full flex items-center gap-2 lg:pr-2">
                  <div>{printNumber(1500)}</div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'linear-gradient(269.43deg, #9075FF 19.03%, #AB9FF8 89.99%), #C4C4C4' }}>
                  </div>
                </div>
              </div>
              <div className="w-40">2.6%</div>
              <div className="w-40">
                <div className="w-full flex items-center gap-2 lg:pr-2">
                  <div>56%</div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'linear-gradient(269.53deg, #FFA800 -2.13%, #FFB800 94.16%)' }}>
                  </div>
                </div>
              </div>
              <div className="w-40">
                <div className="w-full flex items-center gap-2 lg:pr-2">
                  <div>56%</div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'linear-gradient(269.6deg, #FF9649 3.55%, #FFB379 86.23%)' }}>
                  </div>
                </div>
              </div>
              <div className="w-40">
                <div className="w-full flex items-center gap-2 lg:pr-2">
                  <div>44</div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'linear-gradient(269.73deg, #00C2FF 8.09%, #71DDFF 100%)' }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Layout>
  )
}

export default Guilds
