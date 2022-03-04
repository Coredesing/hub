import React, { ReactNode } from 'react'
type Props = {
    className?: string;
    children: ReactNode;
}
const AccountContent = ({ className, children }: Props) => {
  return <div className={`w-full ${className}`}>
    {children}
  </div>
}

export default AccountContent
