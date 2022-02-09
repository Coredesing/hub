import clsx from 'clsx'
import React, { ReactNode } from 'react'
import styles from './WrapperAccount.module.scss'
type Props = {
  children: ReactNode;
}
const WrapperAccount = ({ children }: Props) => {
  return <div className={clsx(styles.wrapperContent, 'px-1 md:px-4 lg:px-16 md:container mx-auto pb-4')}>
    {children}
  </div>
}

export default WrapperAccount
