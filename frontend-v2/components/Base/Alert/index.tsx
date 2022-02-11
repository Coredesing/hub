import clsx from 'clsx'
import React, { ReactNode } from 'react'
import { QuestionIcon } from '../Icon'
import styles from './Alert.module.scss'
type Props = {
  type?: 'danger' | 'info' | 'warn';
  children?: string | ReactNode;
  className?: string;
}

const Alert = ({ type = 'info', children, className }: Props) => {
  return <div className={clsx(styles.alert, 'w-full', styles[type], className)}>
    <div className="flex gap-2 items-center justify-center font-casual text-sm">
      { type === 'info' && <QuestionIcon /> }
      { type === 'danger' && <QuestionIcon /> }
      { type === 'warn' && <QuestionIcon /> }
      {children}
    </div>
  </div>
}

export default React.memo(Alert)
