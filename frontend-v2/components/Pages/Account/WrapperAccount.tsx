import clsx from 'clsx'
import React, { ReactNode } from 'react'
import styles from './WrapperAccount.module.scss'
type Props = {
  children: ReactNode;
}
const WrapperAccount = ({ children }: Props) => {
  return <div className="px-1 md:px-4 lg:px-16 md:container mx-auto pb-4" style={{ display: 'grid', gridTemplateColumns: '235px 1fr' }}>
    {children}
  </div>
}

export default WrapperAccount
