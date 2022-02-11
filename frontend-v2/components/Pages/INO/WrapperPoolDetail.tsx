import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import styles from './WrapperPoolDetail.module.scss'
type Props = {
  children: ReactNode;
}
const WrapperPoolDetail = ({ children }: Props) => {
  const router = useRouter()
  return <div>
    <div className={` ${styles.backLink}`}>
      <a onClick={() => router.back()} className='flex items-center gap-2 text-13px font-casual w-fit cursor-pointer'>
        <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.5 8.5H1.5" stroke="white" strokeMiterlimit="10" />
          <path d="M8.5 15.5L1.5 8.5L8.5 1.5" stroke="white" strokeMiterlimit="10" strokeLinecap="square" />
        </svg>
        <span>Back</span>
      </a>
    </div>
    {
      children
    }
  </div>
}

export default WrapperPoolDetail
