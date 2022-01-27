import React, { ReactNode } from 'react'
type Props = {
  children: ReactNode
}
const WrapperAccount = ({ children }: Props) => {
  return <div className="px-1 md:px-4 lg:px-16 md:container mx-auto lg:block pb-4">
    {children}
  </div>
}

export default WrapperAccount
