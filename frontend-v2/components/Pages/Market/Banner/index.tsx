import { useMyWeb3 } from '@/components/web3/context'
import Link from 'next/link'
import React from 'react'
import styles from './Banner.module.scss'
const Banner = () => {
  const { account } = useMyWeb3()
  return (
    <div className='w-full relative'>
      <img src={require('@/assets/images/marketplace-banner.png').default.src} className={`${styles.imgBanner} object-contain`} width="100%" height="574" alt="" />
      {
        account && <Link href={'/account/collections/assets'} passHref>
          <a className={`${styles.viewAssets} cursor-pointer z-10 absolute left-1/2 bottom-0 py-3 text-center text-13px bg-gamefiGreen-700 font-bold uppercase rounded-sm hover:bg-gamefiGreen-700/90`}>
            View My Assets
          </a>
        </Link>
      }
    </div>
  )
}

export default Banner