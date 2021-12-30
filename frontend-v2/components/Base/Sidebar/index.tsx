import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SidebarLink from './SidebarLink'

const Sidebar = () => {
  return (
    <>
      <div className="hidden h-full md:block md:w-24 lg:w-28 dark:bg-gamefiDark-700" style={{boxShadow: 'inset -1px 0px 0px #303442'}}>
        <Link href="/">
          <div className="w-full md:py-7 lg:py-9 flex align-middle items-center justify-center cursor-pointer">
            <Image src={require('assets/images/gamefi.svg')}></Image>
          </div>
        </Link>
        <SidebarLink path='/'>
          <Image src={require('assets/images/home.svg')}></Image>
          <span className="mt-1">Home</span>
        </SidebarLink>
        <SidebarLink path='/aggregator'>
          <Image src={require('assets/images/controller.svg')}></Image>
          <span className="mt-1">Aggregator</span>
        </SidebarLink>
        <div className="mx-2"></div>
      </div>
      <div className="flex align-middle items-center justify-between md:hidden w-full py-4 px-6 dark:bg-gamefiDark-700" style={{boxShadow: 'inset -1px 0px 0px #303442'}}>
        <Link href="/">
          <div className="flex align-middle items-center cursor-pointer">
            <Image src={require('assets/images/gamefi.svg')}></Image>
          </div>
        </Link>
        <div className="flex align-middle items-center cursor-pointer">
            <Image src={require('assets/images/menuToggler.svg')}></Image>
          </div>
      </div>
    </>
  )
}

export default Sidebar