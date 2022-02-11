import React, { MouseEventHandler } from 'react'
import clsx from 'clsx'
import styles from './button.module.scss'
import { ClipLoader } from 'react-spinners'

type Props = {
  onClick?: MouseEventHandler;
  disabled?: boolean;
  children: any;
  isLoading?: boolean;
  color?: 'grey' | 'green' | 'yellow' | 'disabled' | 'blue' | 'red';
  notClipPath?: boolean;
  noneStyle?: boolean;
  [k: string]: any;
}
export const ButtonBase = ({
  disabled,
  onClick,
  children,
  className,
  isLoading,
  color = 'grey',
  notClipPath,
  noneStyle,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      className={clsx(
        (!disabled ? styles[color] : ''), className,
        {
          [styles.base]: !noneStyle,
          [styles['clip-path-t-r']]: !notClipPath,
          [styles.disabled]: disabled
        })
      }
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading
        ? <div className='grid items-center' style={{ gridTemplateColumns: '28px auto', gap: '5px', placeContent: 'center' }}>
          <ClipLoader size={20} color='#fff' />
          {children}
        </div>
        : children}
    </button>
  )
}

export default React.memo(ButtonBase)
