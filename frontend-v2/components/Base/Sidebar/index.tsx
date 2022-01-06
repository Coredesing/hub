import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SidebarLink from './SidebarLink'

const Sidebar = () => {

  return (
    <>
      <div className="hidden h-full w-20 md:block md:w-24 lg:w-28 dark:bg-gamefiDark-700 overflow-y-auto hide-scrollbar" style={{boxShadow: 'inset -1px 0px 0px #303442'}}>
        <Link href="/" passHref>
          <div className="w-full md:py-7 lg:py-9 flex align-middle items-center justify-center cursor-pointer">
            <Image src={require('assets/images/gamefi.svg')} alt='gamefi'></Image>
          </div>
        </Link>
        <SidebarLink path='/'>
          <Image src={require('assets/images/icons/home.svg')} alt='home'></Image>
          <span className="mt-2">Home</span>
        </SidebarLink>
        <SidebarLink path='/aggregator'>
          <Image src={require('assets/images/icons/controller.svg')} alt='aggregator'></Image>
          <span className="mt-2">Aggregator</span>
        </SidebarLink>
        <SidebarLink path='/launchpad'>
          <Image src={require('assets/images/icons/spaceship.svg')}alt='launchpad'></Image>
          <span className="mt-2">Launchpad</span>
        </SidebarLink>
        <SidebarLink path='/market'>
          <Image src={require('assets/images/icons/shop.svg')} alt='market'></Image>
          <span className="mt-2">Market</span>
        </SidebarLink>
        <SidebarLink path='/staking'>
          <Image src={require('assets/images/icons/coin.svg')} alt='staking'></Image>
          <span className="mt-2">Staking</span>
        </SidebarLink>
        <SidebarLink path='/week'>
          <Image src={require('assets/images/icons/bookmark.svg')} alt='week'></Image>
          <span className="mt-2">Week</span>
        </SidebarLink>
        <SidebarLink path='/metaverse'>
          <Image src={require('assets/images/icons/planet.svg')}alt='metaverse'></Image>
          <span className="mt-2">Metaverse</span>
        </SidebarLink>
        <div className="mx-2"></div>
      </div>
    </>
  )
}

export default Sidebar