import clsx from 'clsx';
import React from 'react'
import styles from './LeftSideBar.module.scss';
import Link from 'next/link';
const LeftSideBar = () => {
  return <div className={clsx('px-7 py-12', styles.leftSideBar)}>
    <h3 className='mb-11 font-bold text-2xl'>My Account</h3>
    <div className="grid">
      <div className='mb-6'>
        <div className='flex gap-2 items-center'>
          <img src="" alt="" className='w-4 h-4 bg-black rounded-full' />
          <Link href={'/account/profile'}><a className='uppercase text-sm font-bold'>My ProFile</a></Link>
        </div>
      </div>
      <div className='mb-6'>
        <div className='flex gap-2 items-center'>
          <img src="" alt="" className='w-4 h-4 bg-black rounded-full' />
          <Link href={'/account/profile'}><a className='uppercase text-sm font-bold'>My Tier</a></Link>
        </div>
      </div>
      <div className='mb-6'>
        <div className='flex gap-2 items-center'>
          <img src="" alt="" className='w-4 h-4 bg-black rounded-full' />
          <Link href={'/account/profile'}><a className='uppercase text-sm font-bold'>IGO Pools</a></Link>
        </div>
      </div>
      <div className='mb-6'>
        <div className='flex gap-2 items-center'>
          <img src="" alt="" className='w-4 h-4 bg-black rounded-full' />
          <div className='flex gap-2 items-center justify-between'>
            <Link href={'/account/profile'}>
              <a className='uppercase text-sm font-bold block'>Collections</a>
            </Link>
          </div>
        </div>
        <div className='pl-10 mt-4'>
          <div className='flex gap-2 items-center mb-4'>
            <Link href={'/account/collections/assets'}><a className='uppercase text-sm font-bold text-gamefiGreen-700'>All Assets</a></Link>
          </div>
          <div className='flex gap-2 items-center mb-4'>
            <Link href={'/account/collections/on-sale'}><a className='uppercase text-sm font-bold'>On sale </a></Link>
          </div>
          <div className='flex gap-2 items-center mb-4'>
            <Link href={'/account/collections/favorites'}><a className='uppercase text-sm font-bold'>Favorites</a></Link>
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default LeftSideBar;
