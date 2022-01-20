import React from 'react';
import clsx from 'clsx';
import { ObjectType } from '@/common/types';
import styles from './BoxTypeItem.module.scss';
type Props = {
  onClick?: (value: any) => any;
  selected?: boolean;
  icon?: string;
  name?: string;
  item: ObjectType
}

const BoxTypeItem = ({ item, ...props }: Props) => {
  return <div
    onClick={() => props.onClick && props.onClick(item)}
    className={clsx('px-5 py-2 flex gap-2 rounded cursor-pointer', styles.boxType, {
      [styles.active]: props.selected
    })} >
    <img src={item.icon} alt="" className='rounded-full w-10 object-contain' />
    <span className='font-casual text-sm'>{item.name} {item.maxSupply ? `${item.totalSold}/${item.maxSupply}` : ''}</span>
  </div>
};

export default BoxTypeItem;
