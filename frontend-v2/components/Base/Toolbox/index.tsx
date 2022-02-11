import React, { useState } from 'react'
import Image from 'next/image'
import ToolboxItem from './ToolboxItem'
import MenuLink from './MenuLink'
import WalletConnector from '../WalletConnector'
import Topbar from '../Topbar'

const Toolbox = () => {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <>
      <div className="fixed w-full bottom-0 grid grid-cols-5 md:hidden dark:bg-gamefiDark-700" style={{ boxShadow: 'inset -1px 0px 0px #303442', zIndex: '99' }}>
        <ToolboxItem path='/'>
          <Image src={require('@/assets/images/icons/home.svg')} alt='home'></Image>
        </ToolboxItem>
        <ToolboxItem path='/aggregator'>
          <Image src={require('@/assets/images/icons/controller.svg')} alt='aggregator'></Image>
        </ToolboxItem>
        <ToolboxItem path='/ino'>
          <Image src={require('@/assets/images/icons/nft.svg')} alt='ino'></Image>
        </ToolboxItem>
        <ToolboxItem path='https://hub.gamefi.org'>
          <Image src={require('@/assets/images/icons/spaceship.svg')} alt='launchpad'></Image>
        </ToolboxItem>
        {/* <ToolboxItem path='/market'>
          <Image src={require('@/assets/images/icons/shop.svg')} alt='market'></Image>
        </ToolboxItem>
        <ToolboxItem path='/metaverse'>
          <Image src={require('@/assets/images/icons/planet.svg')} alt='metaverse'></Image>
        </ToolboxItem> */}
        <button
          className={'relative w-full py-4 flex flex-col align-middle items-center justify-center uppercase text-xs lg:text-sm font-semibold cursor-pointer opacity-40'}
          onClick={() => setShowMenu(true)}
        >
          <Image src={require('@/assets/images/icons/menuToggler.svg')} alt='menu'></Image>
        </button>
      </div>
      <div className={`flex flex-col fixed left-0 top-0 bottom-0 right-0 md:hidden dark:bg-gamefiDark-900 overflow-auto hide-scrollbar menu-slide-up ${showMenu ? 'h-full' : 'h-0'}`} style={{ boxShadow: 'inset -1px 0px 0px #303442', zIndex: '99' }}>
        <Topbar className="flex-none"></Topbar>
        <div className="flex-1 overflow-y-auto">
          <MenuLink path='/'>
            <Image src={require('@/assets/images/icons/home.svg')} alt='home'></Image>
            <span>Home</span>
          </MenuLink>
          <MenuLink path='/aggregator'>
            <Image src={require('@/assets/images/icons/controller.svg')} alt='aggregator'></Image>
            <span>Aggregator</span>
          </MenuLink>
          <MenuLink path='https://hub.gamefi.org'>
            <Image src={require('@/assets/images/icons/spaceship.svg')} alt='launchpad'></Image>
            <span>Launchpad</span>
          </MenuLink>
          <MenuLink path='/ino'>
            <Image src={require('@/assets/images/icons/nft.svg')} alt='ino'></Image>
            <span>INO</span>
          </MenuLink>
          <MenuLink path='/market'>
            <Image src={require('@/assets/images/icons/shop.svg')} alt='market'></Image>
            <span>Market</span>
          </MenuLink>
          <MenuLink path='/staking'>
            <Image src={require('@/assets/images/icons/coin.svg')} alt='staking'></Image>
            <span>Staking</span>
          </MenuLink>
          {/* <MenuLink path='/week'>
            <Image src={require('@/assets/images/icons/bookmark.svg')} alt='week'></Image>
            <span>Week</span>
          </MenuLink> */}
          <MenuLink path='/metaverse'>
            <Image src={require('@/assets/images/icons/planet.svg')} alt='metaverse'></Image>
            <span>Metaverse</span>
          </MenuLink>
        </div>
        <div className="px-6">
          <WalletConnector></WalletConnector>
        </div>
        <div className="mx-2"></div>
        <div className={`${showMenu ? 'grid grid-cols-5' : 'hidden'} w-full bg-gamefiDark-900`}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div className="py-4 flex align-middle items-center justify-center">
            <button className="cursor-pointer" onClick={() => setShowMenu(false)}>
              <Image src={require('@/assets/images/icons/x.svg')} alt='x'></Image>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Toolbox
