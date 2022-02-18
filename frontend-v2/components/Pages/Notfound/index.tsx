import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import styles from './Notfound.module.scss'

const NotFound = ({ backLink }: { backLink?: string }) => {
  const router = useRouter()

  return (
    <div className={clsx(styles.page, 'w-full flex flex-col items-center justify-center p-5')}>
      <div className='mb-5'>
        <Image src={require('@/assets/images/404.png')} />
      </div>
      <h3 className='mb-3 uppercase text-lg lg:text-3xl font-medium text-center'>Sorry, we were unable to find that page</h3>
      <button
        onClick={() => router.push(backLink || '/')}
        className={clsx(styles.button, 'uppercase bg-gamefiGreen-700 px-4 py-2 text-black font-semibold')}>
        Go back
      </button>
    </div>
  )
}

export default NotFound