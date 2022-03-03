import clsx from 'clsx'
import React from 'react'
import styles from './Input.module.scss'
type Props = {
  classes?: {
    formInput?: string;
    input?: string;
  };
  [k: string]: any;
};

const Input = ({ classes, ...props }: Props) => {
  return <div className={clsx(styles.formInput, classes?.formInput)}>
    <input type="text" {...props} className={classes?.input} />
    <span></span>
  </div>
}

export default Input
