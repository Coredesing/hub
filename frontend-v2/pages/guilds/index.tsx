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
            <div className="w-full flex gap-1 text-gamefiDark-100 text-sm uppercase font-medium">
              <div>Guild</div>
              <div>Game</div>
              <div>Region</div>
              <div>Daily Active Discord Members</div>
              <div>Activeness</div>
              <div>Avg Scholar Commission</div>
              <div>Avg Guild Commission</div>
              <div>AVG SLP</div>
            </div>
            <div className="w-full"></div>
          </div>
        </div>
      </>
    </Layout>
  )
}

export default Guilds
