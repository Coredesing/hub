import React, { useState } from 'react'
import Image from 'next/image'
import ToolboxItem from './ToolboxItem'
import MenuLink from './MenuLink'
import WalletConnector from '../WalletConnector'
import Topbar from '../Topbar'
import Badge from '../Badge'
import { useAppContext } from '@/context'

const Toolbox = () => {
  const [showMenu, setShowMenu] = useState(false)

  const igoPoolCount = useAppContext()?.igoPool?.count || 0

  return (
    <>
      <div className="fixed w-full bottom-0 grid grid-cols-5 md:hidden dark:bg-gamefiDark-700" style={{ boxShadow: 'inset -1px 0px 0px #303442', zIndex: '1000' }}>
        <ToolboxItem path='/'>
          <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.6329 9.226L12.6329 0.226001C12.4542 0.0799443 12.2306 0.000152588 11.9999 0.000152588C11.7691 0.000152588 11.5455 0.0799443 11.3669 0.226001L0.366855 9.226C0.166181 9.39532 0.0401479 9.63677 0.0159702 9.89821C-0.00820746 10.1597 0.0714096 10.4201 0.237631 10.6234C0.403851 10.8266 0.643339 10.9563 0.904384 10.9845C1.16543 11.0127 1.42708 10.9371 1.63285 10.774L2.99985 9.656V21C2.99985 21.2652 3.10521 21.5196 3.29275 21.7071C3.48028 21.8946 3.73464 22 3.99985 22H9.99986V16H13.9999V22H19.9999C20.2651 22 20.5194 21.8946 20.707 21.7071C20.8945 21.5196 20.9999 21.2652 20.9999 21V9.656L22.3669 10.774C22.4682 10.8595 22.5856 10.924 22.7121 10.9638C22.8386 11.0035 22.9718 11.0177 23.1038 11.0055C23.2359 10.9932 23.3642 10.9549 23.4812 10.8926C23.5983 10.8304 23.7019 10.7454 23.7858 10.6428C23.8698 10.5401 23.9325 10.4218 23.9703 10.2947C24.008 10.1676 24.0202 10.0342 24.0059 9.90237C23.9917 9.77052 23.9514 9.64282 23.8873 9.52671C23.8233 9.41059 23.7368 9.30837 23.6329 9.226Z" fill="currentColor"/>
          </svg>
        </ToolboxItem>
        <ToolboxItem path='/hub'>
          <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8H7c-3.86 0-7 3.14-7 7s3.14 7 7 7h10c3.86 0 7-3.14 7-7s-3.14-7-7-7Zm-7 8H8v2H6v-2H4v-2h2v-2h2v2h2v2Zm5 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM13 2a1 1 0 0 0-2 0v4h2V2Z" fill="currentColor" />
          </svg>
        </ToolboxItem>
        <ToolboxItem path='/ino'>
          <svg width="30" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" fill="#25262F" />
            <path d="M8.187 15H7.24c-.16 0-.24-.076-.24-.229V8.23C7 8.076 7.08 8 7.24 8h.855c.16 0 .267.05.32.152l2.305 4.126h.046v-4.05c0-.152.08-.228.24-.228h.946c.16 0 .24.076.24.229v6.542c0 .153-.08.229-.24.229h-.833a.384.384 0 0 1-.365-.218l-2.282-4.05h-.046v4.04c0 .152-.08.228-.24.228ZM14.885 15h-.97c-.16 0-.24-.076-.24-.229V8.23c0-.153.08-.229.24-.229h3.64c.152 0 .228.076.228.229v.74c0 .152-.076.229-.228.229H15.26c-.091 0-.137.04-.137.12v1.687c0 .087.046.13.137.13h1.951c.16 0 .24.076.24.229v.73c0 .159-.08.239-.24.239h-1.95c-.092 0-.138.04-.138.12v2.318c0 .153-.08.229-.24.229ZM21.083 15h-.959c-.167 0-.25-.076-.25-.229V9.317c0-.08-.043-.12-.126-.12h-1.301c-.16 0-.24-.076-.24-.228v-.74c0-.153.08-.229.24-.229h4.313c.16 0 .24.076.24.229v.74c0 .152-.08.229-.24.229h-1.3c-.092 0-.137.04-.137.12v5.453c0 .153-.08.229-.24.229Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M3 5a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v7.143a1 1 0 0 1-2 0V5a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h13a1 1 0 1 1 0 2H6a3 3 0 0 1-3-3V5Z" fill="currentColor" />
            <path d="m29.57 20.098-3.668-3.667a.334.334 0 0 0-.235-.098h-3a.333.333 0 0 0-.334.334v3c0 .088.036.173.098.235l1.236 1.236v1.529a.333.333 0 0 0 .666 0V19a.667.667 0 1 1 .667-.667v4.138l1.098 1.098a.331.331 0 0 0 .471 0l3-3a.333.333 0 0 0 0-.471Z" fill="currentColor" />
          </svg>
        </ToolboxItem>
        <ToolboxItem path='/igo'>
          <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#spaceship-mask)" fill="currentColor">
              <path d="M23.58.424a1 1 0 0 0-.761-.294C8.79.862 3.609 13.358 3.559 13.484a1 1 0 0 0 .22 1.08l5.657 5.657a1 1 0 0 0 1.085.218c.125-.051 12.554-5.291 13.348-19.253a1 1 0 0 0-.29-.762Zm-8.166 10.99a2 2 0 1 1-2.829-2.828 2 2 0 0 1 2.829 2.828ZM1.113 18.844a2.843 2.843 0 1 1 4.022 4.022C4.024 23.977 0 24 0 24s0-4.046 1.113-5.156ZM10.357 2.341a8.91 8.91 0 0 0-7.835 2.484c-.534.54-1 1.144-1.384 1.8a1 1 0 0 0 .155 1.215l1.99 1.99a26.623 26.623 0 0 1 7.074-7.489ZM21.659 13.643a8.91 8.91 0 0 1-2.484 7.835c-.54.535-1.145 1-1.8 1.384a1 1 0 0 1-1.215-.155l-1.99-1.989a26.621 26.621 0 0 0 7.489-7.075Z" />
            </g>
            <defs>
              <clipPath id="spaceship-mask">
                <path fill="#fff" d="M0 0h24v24H0z" />
              </clipPath>
            </defs>
          </svg>
          <Badge count={igoPoolCount} className='absolute top-3 left-1/2 ml-1.5'></Badge>
        </ToolboxItem>
        {
          showMenu
            ? <button className="cursor-pointer" onClick={() => setShowMenu(false)}>
              <Image src={require('@/assets/images/icons/x.svg')} alt='x'></Image>
            </button>
            : <button
              className={'relative w-full py-4 flex flex-col align-middle items-center justify-center uppercase text-xs lg:text-sm font-semibold cursor-pointer opacity-40'}
              onClick={() => setShowMenu(true)}
            >
              <Image src={require('@/assets/images/icons/menuToggler.svg')} alt='menu'></Image>
            </button>
        }
      </div>
      <div className={`flex flex-col fixed left-0 top-0 bottom-0 right-0 md:hidden dark:bg-gamefiDark-900 overflow-auto hide-scrollbar menu-slide-up ${showMenu ? 'h-full' : 'h-0'}`} style={{ boxShadow: 'inset -1px 0px 0px #303442', zIndex: '99' }}>
        <Topbar className="flex-none"></Topbar>
        <div className="flex-1 overflow-y-auto">
          <MenuLink onClick={() => setShowMenu(false)} path='/'>
            <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.6329 9.226L12.6329 0.226001C12.4542 0.0799443 12.2306 0.000152588 11.9999 0.000152588C11.7691 0.000152588 11.5455 0.0799443 11.3669 0.226001L0.366855 9.226C0.166181 9.39532 0.0401479 9.63677 0.0159702 9.89821C-0.00820746 10.1597 0.0714096 10.4201 0.237631 10.6234C0.403851 10.8266 0.643339 10.9563 0.904384 10.9845C1.16543 11.0127 1.42708 10.9371 1.63285 10.774L2.99985 9.656V21C2.99985 21.2652 3.10521 21.5196 3.29275 21.7071C3.48028 21.8946 3.73464 22 3.99985 22H9.99986V16H13.9999V22H19.9999C20.2651 22 20.5194 21.8946 20.707 21.7071C20.8945 21.5196 20.9999 21.2652 20.9999 21V9.656L22.3669 10.774C22.4682 10.8595 22.5856 10.924 22.7121 10.9638C22.8386 11.0035 22.9718 11.0177 23.1038 11.0055C23.2359 10.9932 23.3642 10.9549 23.4812 10.8926C23.5983 10.8304 23.7019 10.7454 23.7858 10.6428C23.8698 10.5401 23.9325 10.4218 23.9703 10.2947C24.008 10.1676 24.0202 10.0342 24.0059 9.90237C23.9917 9.77052 23.9514 9.64282 23.8873 9.52671C23.8233 9.41059 23.7368 9.30837 23.6329 9.226Z" fill="currentColor"/>
            </svg>
            <span>Home</span>
          </MenuLink>
          <MenuLink onClick={() => setShowMenu(false)} path='/igo'>
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#spaceship-mask)" fill="currentColor">
                <path d="M23.58.424a1 1 0 0 0-.761-.294C8.79.862 3.609 13.358 3.559 13.484a1 1 0 0 0 .22 1.08l5.657 5.657a1 1 0 0 0 1.085.218c.125-.051 12.554-5.291 13.348-19.253a1 1 0 0 0-.29-.762Zm-8.166 10.99a2 2 0 1 1-2.829-2.828 2 2 0 0 1 2.829 2.828ZM1.113 18.844a2.843 2.843 0 1 1 4.022 4.022C4.024 23.977 0 24 0 24s0-4.046 1.113-5.156ZM10.357 2.341a8.91 8.91 0 0 0-7.835 2.484c-.534.54-1 1.144-1.384 1.8a1 1 0 0 0 .155 1.215l1.99 1.99a26.623 26.623 0 0 1 7.074-7.489ZM21.659 13.643a8.91 8.91 0 0 1-2.484 7.835c-.54.535-1.145 1-1.8 1.384a1 1 0 0 1-1.215-.155l-1.99-1.989a26.621 26.621 0 0 0 7.489-7.075Z" />
              </g>
              <defs>
                <clipPath id="spaceship-mask">
                  <path fill="#fff" d="M0 0h24v24H0z" />
                </clipPath>
              </defs>
            </svg>
            <span>IGO</span>
            <Badge count={igoPoolCount} className='ml-auto'></Badge>
          </MenuLink>
          <MenuLink onClick={() => setShowMenu(false)} path='/hub'>
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8H7c-3.86 0-7 3.14-7 7s3.14 7 7 7h10c3.86 0 7-3.14 7-7s-3.14-7-7-7Zm-7 8H8v2H6v-2H4v-2h2v-2h2v2h2v2Zm5 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM13 2a1 1 0 0 0-2 0v4h2V2Z" fill="currentColor" />
            </svg>
            <span>Hub</span>
          </MenuLink>
          <MenuLink onClick={() => setShowMenu(false)} path='/guilds'>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6C10.343 6 9 4.657 9 3C9 1.343 10.343 0 12 0C13.657 0 15 1.343 15 3C15 4.657 13.657 6 12 6Z" fill="currentColor"/>
              <path d="M4 19V11C4 9.87 4.391 8.838 5.026 8H2C0.895 8 0 8.895 0 10V16H2V21C2 21.552 2.448 22 3 22H5C5.552 22 6 21.552 6 21V19H4Z" fill="currentColor"/>
              <path d="M14 24H10C9.448 24 9 23.552 9 23V17H6V11C6 9.343 7.343 8 9 8H15C16.657 8 18 9.343 18 11V17H15V23C15 23.552 14.552 24 14 24Z" fill="currentColor"/>
              <path d="M4 7C2.895 7 2 6.105 2 5C2 3.895 2.895 3 4 3C5.105 3 6 3.895 6 5C6 6.105 5.105 7 4 7Z" fill="currentColor"/>
              <path d="M20 19V11C20 9.87 19.609 8.838 18.974 8H22C23.105 8 24 8.895 24 10V16H22V21C22 21.552 21.552 22 21 22H19C18.448 22 18 21.552 18 21V19H20Z" fill="currentColor"/>
              <path d="M20 7C21.105 7 22 6.105 22 5C22 3.895 21.105 3 20 3C18.895 3 18 3.895 18 5C18 6.105 18.895 7 20 7Z" fill="currentColor"/>
            </svg>
            <span>Guild Hub</span>
          </MenuLink>
          <MenuLink onClick={() => setShowMenu(false)} path='/ino'>
            <svg width="30" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" fill="#25262F" />
              <path d="M8.187 15H7.24c-.16 0-.24-.076-.24-.229V8.23C7 8.076 7.08 8 7.24 8h.855c.16 0 .267.05.32.152l2.305 4.126h.046v-4.05c0-.152.08-.228.24-.228h.946c.16 0 .24.076.24.229v6.542c0 .153-.08.229-.24.229h-.833a.384.384 0 0 1-.365-.218l-2.282-4.05h-.046v4.04c0 .152-.08.228-.24.228ZM14.885 15h-.97c-.16 0-.24-.076-.24-.229V8.23c0-.153.08-.229.24-.229h3.64c.152 0 .228.076.228.229v.74c0 .152-.076.229-.228.229H15.26c-.091 0-.137.04-.137.12v1.687c0 .087.046.13.137.13h1.951c.16 0 .24.076.24.229v.73c0 .159-.08.239-.24.239h-1.95c-.092 0-.138.04-.138.12v2.318c0 .153-.08.229-.24.229ZM21.083 15h-.959c-.167 0-.25-.076-.25-.229V9.317c0-.08-.043-.12-.126-.12h-1.301c-.16 0-.24-.076-.24-.228v-.74c0-.153.08-.229.24-.229h4.313c.16 0 .24.076.24.229v.74c0 .152-.08.229-.24.229h-1.3c-.092 0-.137.04-.137.12v5.453c0 .153-.08.229-.24.229Z" fill="currentColor" />
              <path fillRule="evenodd" clipRule="evenodd" d="M3 5a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v7.143a1 1 0 0 1-2 0V5a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h13a1 1 0 1 1 0 2H6a3 3 0 0 1-3-3V5Z" fill="currentColor" />
              <path d="m29.57 20.098-3.668-3.667a.334.334 0 0 0-.235-.098h-3a.333.333 0 0 0-.334.334v3c0 .088.036.173.098.235l1.236 1.236v1.529a.333.333 0 0 0 .666 0V19a.667.667 0 1 1 .667-.667v4.138l1.098 1.098a.331.331 0 0 0 .471 0l3-3a.333.333 0 0 0 0-.471Z" fill="currentColor" />
            </svg>
            <span>INO</span>
          </MenuLink>
          <MenuLink onClick={() => setShowMenu(false)} path='/marketplace'>
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#shop-mask)" fill="currentColor">
                <path d="m23.857 6.485-3-5A1 1 0 0 0 20 1H4a1 1 0 0 0-.857.485l-3 5A1 1 0 0 0 0 7a3.993 3.993 0 0 0 3.983 4h.008a3.974 3.974 0 0 0 2.674-1.025 3.976 3.976 0 0 0 5.332 0 3.976 3.976 0 0 0 5.337 0A3.993 3.993 0 0 0 24 7a1 1 0 0 0-.143-.515ZM20.016 13a6.01 6.01 0 0 1-2.679-.628l-.015.007a5.948 5.948 0 0 1-4.564.31 6.115 6.115 0 0 1-.76-.314l-.011.005a5.937 5.937 0 0 1-4.563.309 6.099 6.099 0 0 1-.759-.314A5.99 5.99 0 0 1 3.991 13 6.154 6.154 0 0 1 3 12.91V23a1 1 0 0 0 1 1h6v-6h4v6h6a1 1 0 0 0 1-1V12.906c-.325.058-.654.09-.984.094Z" />
              </g>
              <defs>
                <clipPath id="shop-mask">
                  <path fill="#fff" d="M0 0h24v24H0z" />
                </clipPath>
              </defs>
            </svg>
            <span>Marketplace</span>
          </MenuLink>
          <MenuLink onClick={() => setShowMenu(false)} path='/staking'>
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4v4c0 1.657 2.686 3 6 3s6-1.343 6-3V4" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M1 8v4c0 1.657 2.686 3 6 3 1.537 0 2.938-.29 4-.765" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M1 12v4c0 1.657 2.686 3 6 3 1.537 0 2.939-.289 4-.764" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M7 7c3.314 0 6-1.343 6-3s-2.686-3-6-3-6 1.343-6 3 2.686 3 6 3Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              <path d="M11 12v4c0 1.657 2.686 3 6 3s6-1.343 6-3v-4" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M11 16v4c0 1.657 2.686 3 6 3s6-1.343 6-3v-4" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
              <path d="M17 15c3.314 0 6-1.343 6-3s-2.686-3-6-3-6 1.343-6 3 2.686 3 6 3Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
            </svg>
            <span>Staking</span>
          </MenuLink>
          <MenuLink onClick={() => setShowMenu(false)} path='/earn'>
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 16h-3.3a8.82 8.82 0 0 1 .266 2.011 1 1 0 0 1-1 .989H7v-2h8a4 4 0 0 0-4-4H7c-1.2-1.711-3.695-2-4.9-2H0v8.5l8.192 3.763c1.008.503 2.171.6 3.248.268L24 19.667S23.208 16 20 16Z" fill="currentColor" />
              <path d="M15 0a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm1 9h-2V3h2v6Z" fill="currentColor" />
            </svg>
            <span>Earn</span>
          </MenuLink>
          <MenuLink onClick={() => setShowMenu(false)} path='/insight'>
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 0H5C3.346 0 2 1.346 2 3v17.5C2 22.43 3.57 24 5.5 24H21a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1ZM11 2h6v9l-3-2-3 2V2Zm9 20H5.5c-.827 0-1.5-.673-1.5-1.5S4.673 19 5.5 19H20v3Z" fill="currentColor" />
            </svg>
            <span>Insight</span>
          </MenuLink>
          <MenuLink onClick={() => setShowMenu(false)} path='/metaverse'>
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#planet-mask)">
                <path d="M11.076 21.231a8.308 8.308 0 1 0 0-16.615 8.308 8.308 0 0 0 0 16.615Z" fill="currentColor" />
                <circle cx="10.615" cy="8.769" r="1.385" fill="#1B1D26" />
                <circle cx="14.769" cy="14.769" r=".923" fill="#1B1D26" />
                <path d="m19.721 16.692-.445.227.226.445.418.823c.468.923.712 1.647.786 2.153.028.187.028.31.021.383a1.967 1.967 0 0 1-.536-.05c-.623-.124-1.492-.467-2.566-1.068-2.13-1.19-4.778-3.232-7.389-5.842-2.61-2.61-4.65-5.258-5.842-7.388-.6-1.074-.943-1.944-1.068-2.567a1.966 1.966 0 0 1-.05-.536c.075-.006.197-.006.385.021.507.074 1.232.32 2.155.788l.823.419.446.226.226-.446.837-1.645.226-.446-.445-.227-.823-.418C6.046 1.006 5.009.614 4.073.477c-.9-.132-2.024-.065-2.843.754-.901.9-.888 2.168-.695 3.136C.742 5.4 1.24 6.565 1.91 7.764c1.35 2.415 3.571 5.269 6.314 8.012 2.743 2.742 5.596 4.963 8.012 6.314 1.199.67 2.363 1.167 3.397 1.374.967.194 2.235.207 3.136-.694.818-.818.885-1.943.754-2.841-.137-.935-.528-1.972-1.065-3.03l-.418-.823-.227-.446-.445.226-1.647.836Zm.988 4.128v-.002.002ZM3.18 3.29h.002-.002Z" fill="currentColor" stroke="#1B1D26" strokeMiterlimit="10" strokeLinecap="square" />
              </g>
              <defs>
                <clipPath id="planet-mask">
                  <path fill="#fff" d="M0 0h24v24H0z" />
                </clipPath>
              </defs>
            </svg>
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
