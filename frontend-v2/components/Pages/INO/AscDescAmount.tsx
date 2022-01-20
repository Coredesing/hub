import clsx from 'clsx';
import React from 'react';
import styles from './AscDescAmount.module.scss'
const AscDescAmount = () => {
  return <>
    <div className='mb-1'>
      <div  className='flex justify-between gap-2 w-60 items-baseline'>
        <h4 className='font-bold text-base uppercase'>AMOUNT</h4>
        <span className='text-white/50 text-xs font-medium font-casual'>(Balance: 0.343 BNB)</span>
      </div>
    </div>
    <div className='flex items-center mb-2'>
      <div className={clsx('px-3 uppercase text-xs flex items-center font-medium w-12 justify-center cursor-pointer bg-gamefiGreen-700 text-black', styles['change-amount'], styles['clip-path-b-l'])}>Min</div>
      <div className='px-2 text-lg font-semibold border-t border-b border-white/50 border-r flex items-center w-8 justify-center cursor-pointer'>-</div>
      <div className='px-5 text-lg font-bold border-t border-b border-r  border-white/50 flex items-center w-20 justify-center cursor-pointer'>23</div>
      <div className='px-2 text-lg font-semibold border-t border-b border-white/50 border-r flex items-center w-8 justify-center cursor-pointer'>+</div>
      <div className={clsx('px-3 uppercase text-xs bg-gamefiGreen-700 text-black font-medium flex items-center justify-center w-12 cursor-pointer', styles['change-amount'], styles['clip-path-t-r'])}>Max</div>
    </div>
    <div className='flex justify-between gap-2 w-60'>
      <span className='text-white/80 uppercase text-xs  font-casual'>BOUGHT/MAX</span>
      <span className='text-xs font-casual'>10/10</span>
    </div>
  </>;
};

export default AscDescAmount;
