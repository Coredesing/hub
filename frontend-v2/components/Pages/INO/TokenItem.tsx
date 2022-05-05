import React from 'react'
import clsx from 'clsx'
import { ObjectType } from '@/utils/types'
import styles from './TokenItem.module.scss'
type Props = {
  onClick?: (value: any) => any;
  selected?: boolean;
  icon?: string;
  name?: string;
  item: ObjectType;
}
const TokenItem = ({ item, ...props }: Props) => {
  return <div
    onClick={() => props.onClick && props.onClick(item)}
    className={clsx('px-4 py-1 flex gap-2 rounded-sm items-center cursor-pointer',
      styles.currency,
      {
        [styles.active]: props.selected
      }
    )}>
    <img src={item.icon} alt="" className='rounded-full w-6 h-6' />
    <span className='font-semibold text-base'>{item.name}</span>
  </div>
}

export default TokenItem
