import React from 'react'
import clsx from 'clsx'
import { ObjectType } from '@/utils/types'
import styles from './BoxTypeItem.module.scss'
type Props = {
  onClick?: (value: any) => any;
  selected?: boolean;
  icon?: string;
  name?: string;
  item: ObjectType;
}

const BoxTypeItem = ({ item, ...props }: Props) => {
  return <div
    onClick={() => props.onClick && props.onClick(item)}
    className={clsx('flex gap-2 rounded cursor-pointer items-center ', styles.boxType, {
      [styles.active]: props.selected
    })} >
    <img src={item.icon} alt="" className='rounded object-contain w-6 h-6' />
    <span className='font-casual text-sm flex gap-1 items-center'>
      <span className={clsx(styles.name, 'block')}>{item.name}</span>
      <span className='font-semibold'>{(item.maxSupply || item.limit) ? `${item.totalSold || 0}/${item.maxSupply || item.limit}` : ''}</span>
    </span>
  </div>
}

export default BoxTypeItem
