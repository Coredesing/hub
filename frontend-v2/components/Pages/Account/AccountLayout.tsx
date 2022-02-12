import React, { ReactNode } from 'react'
import LeftSideBar from '@/components/Pages/Account/LeftSideBar'
import AccountContent from '@/components/Pages/Account/AccountContent'
import AccountTopBar from '@/components/Pages/Account/AccountTopBar'

const AccountLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col lg:flex-row">
    <AccountTopBar />
    <LeftSideBar></LeftSideBar>
    <AccountContent>
      {children}
    </AccountContent>
  </div>
}

export default AccountLayout
