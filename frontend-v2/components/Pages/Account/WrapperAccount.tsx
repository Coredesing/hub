import React, { ReactNode } from 'react'
import styles from './WrapperAccount.module.scss'
type Props = {
  children: ReactNode
}
const WrapperAccount = ({ children }: Props) => {
  return <div className={styles.wrapperAccount}>
    {children}
  </div>
}

export default WrapperAccount
