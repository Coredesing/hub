import React, { ReactNode } from 'react'
type Props = {
  children: ReactNode;
}
const AccountContent = ({ children }: Props) => {
  return <div className="w-full">
    {children}
  </div>
}

export default AccountContent
