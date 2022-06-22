import React, { ReactNode } from 'react'
type Props = {
    className?: string;
    children: ReactNode;
}
const AccountContent = ({ className, children }: Props) => {
  return <div className={`${className} overflow-hidden`} style={{ width: 'calc(100% - 14rem)' }}>
    {children}
  </div>
}

export default AccountContent
