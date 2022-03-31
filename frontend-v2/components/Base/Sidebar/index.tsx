import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SidebarLink from './SidebarLink'

const Sidebar = () => {
  return (
    <>
      <div className="hidden h-full w-20 md:block md:w-24 lg:w-28 dark:bg-gamefiDark-800 overflow-y-auto hide-scrollbar" style={{ boxShadow: 'inset -1px 0px 0px #303442' }}>
        <Link href="/" passHref>
          <div className="w-full md:py-7 lg:py-9 flex align-middle items-center justify-center cursor-pointer">
            <Image src={require('@/assets/images/gamefi.svg')} alt='gamefi'></Image>
          </div>
        </Link>
        <SidebarLink path='/'>
          <Image src={require('@/assets/images/icons/home.svg')} alt='home'></Image>
          <span className="mt-2">Home</span>
        </SidebarLink>
        <SidebarLink path='/hub'>
          <Image src={require('@/assets/images/icons/controller.svg')} alt='hub'></Image>
          <span className="mt-2">Hub</span>
        </SidebarLink>
        <SidebarLink path='https://hub.gamefi.org/#/pools/token' external={true}>
          <Image src={require('@/assets/images/icons/spaceship.svg')} alt='launchpad'></Image>
          <span className="mt-2">IGO</span>
        </SidebarLink>
        <SidebarLink path='/ino'>
          <Image src={require('@/assets/images/icons/nft.svg')} alt='INO'></Image>
          <span className="mt-2">INO</span>
        </SidebarLink>
        <SidebarLink path='/market'>
          <Image src={require('@/assets/images/icons/shop.svg')} alt='market'></Image>
          <span className="mt-2">Market</span>
        </SidebarLink>
        <SidebarLink path='/staking'>
          <Image src={require('@/assets/images/icons/coin.svg')} alt='staking'></Image>
          <span className="mt-2">Staking</span>
        </SidebarLink>
        <SidebarLink path='/earn'>
          <Image src={require('@/assets/images/icons/earn.svg')} alt='earn'></Image>
          <span className="mt-2">Earn</span>
        </SidebarLink>
        <SidebarLink path='/insight'>
          <Image src={require('@/assets/images/icons/news.svg')} alt='insight'></Image>
          <span className="mt-2">Insight</span>
        </SidebarLink>
        <SidebarLink path='/metaverse'>
          <Image src={require('@/assets/images/icons/planet.svg')}alt='metaverse'></Image>
          <span className="mt-2">Metaverse</span>
        </SidebarLink>
        <div className="mx-2"></div>
      </div>
    </>
  )
}

export default Sidebar
