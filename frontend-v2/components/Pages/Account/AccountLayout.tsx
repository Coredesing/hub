import React, { ReactNode } from 'react'
import LeftSideBar from '@/components/Pages/Account/LeftSideBar'
import AccountContent from '@/components/Pages/Account/AccountContent'
import AccountTopBar from '@/components/Pages/Account/AccountTopBar'

type Props = {
  className?: string;
  children: ReactNode;
}

const AccountLayout = ({ children, className }: Props) => {
  return <div className="flex flex-col lg:flex-row">
    <AccountTopBar />
    <LeftSideBar className="hidden lg:block px-7 py-12 md:-mt-24 flex-none w-56"></LeftSideBar>
    <AccountContent className={className}>
      {children}
    </AccountContent>
  </div>
}

export default AccountLayout
