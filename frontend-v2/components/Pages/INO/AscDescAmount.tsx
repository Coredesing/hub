import clsx from 'clsx'
import { FormInputNumber } from 'components/Base/FormInputNumber'
import React from 'react'
import styles from './AscDescAmount.module.scss'
type Props = {
  value: number;
  maxBuy: number;
  onChangeValue: (val: any) => any;
  bought: number;
}
const AscDescAmount = ({ value, maxBuy, onChangeValue, bought }: Props) => {
  const remaining = +maxBuy - +bought || 0
  const onDesc = () => {
    onChangeValue(value - 1 > -1 ? value - 1 : 0)
  }
  const onAsc = () => {
    if (value + 1 <= remaining) { onChangeValue(value + 1) }
  }
  const onSetMax = () => {
    onChangeValue(remaining)
  }
  const onSetMin = () => {
    onChangeValue(1)
  }
  const onChangeInput = (event: any) => {
    const value = +event.target.value || 0
    onChangeValue(value)
  }
  return <>
    <div className='mb-1'>
      <div className='flex justify-between gap-2 w-60 items-baseline'>
        <h4 className='font-bold text-base uppercase'>AMOUNT</h4>
        <span className='text-white/50 text-xs font-medium font-casual'>(Balance: 0.343 BNB)</span>
      </div>
    </div>
    <div className='flex items-center mb-2'>
      <div
        className={clsx('px-3 uppercase text-xs flex items-center font-medium w-12 justify-center cursor-pointer bg-gamefiGreen-700 text-black',
          styles['h-30px'],
          styles['clip-path-b-l'],
          {
            [styles.disabled]: !remaining || value === 1
          }
        )}
        onClick={onSetMin}>Min</div>
      <div
        className={clsx('px-2 text-lg font-semibold border-t border-b border-white/50 border-r flex items-center w-8 justify-center cursor-pointer', styles['h-30px'])}
        onClick={onDesc}>-</div>
      <div className={clsx('px-5 text-lg font-bold border-t border-b border-r  border-white/50 flex items-center w-20 justify-center cursor-pointer', styles['h-30px'])}>
        <FormInputNumber
          value={value}
          onChange={onChangeInput}
          isPositive isInteger
          max={remaining}
          className={clsx(styles.input)} />
      </div>
      <div className={clsx('px-2 text-lg font-semibold border-t border-b border-white/50 border-r flex items-center w-8 justify-center cursor-pointer', styles['h-30px'])} onClick={onAsc}>+</div>
      <div
        className={clsx('px-3 uppercase text-xs bg-gamefiGreen-700 text-black font-medium flex items-center justify-center w-12 cursor-pointer',
          styles['h-30px'],
          styles['clip-path-t-r'],
          {
            [styles.disabled]: value === remaining
          }
        )}
        onClick={onSetMax}>Max</div>
    </div>
    <div className='flex justify-between gap-2 w-60'>
      <span className='text-white/80 uppercase text-xs  font-casual'>BOUGHT/MAX</span>
      <span className='text-xs font-casual'>{bought}/{maxBuy}</span>
    </div>
  </>
}

export default AscDescAmount
