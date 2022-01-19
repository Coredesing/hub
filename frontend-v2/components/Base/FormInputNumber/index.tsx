import React from 'react'
import clsx from 'clsx'
import isNumber from 'is-number'
import styles from './form-input.module.scss'

interface IProps {
  value: any,
  onChange: (event: any) => void,
  isInteger?: boolean,
  isPositive?: boolean,
  allowZero?: boolean,
  min?: number,
  max?: number,
  [k: string]: any
}
export const FormInputNumber = (props: IProps) => {
  const { value, onChange, allowZero, isPositive, isInteger, className, ...otherProps } =
    props
  const [val, setVal] = React.useState('')

  React.useEffect(() => {
    setVal(value)
  }, [value])

  const _onChange = (event: any) => {
    let { value: valInput } = event.target
    if (valInput === '') {
      setVal(valInput)
      onChange(event)
      return
    }
    if (!isNaN(+valInput) && isNumber(+valInput)) {
      if (!allowZero && valInput.charAt(0) === '0') {
        valInput = valInput.replace(/0/i, '')
      }
      if (typeof props.min === 'number') {
        if (+valInput < props.min) {
          setVal(value)
          return
        }
      }
      if (typeof props.max === 'number') {
        if (+valInput > props.max) {
          setVal(value)
          return
        }
      }
      event.target.value = valInput
      if (isInteger && isPositive) {
        if (!valInput.includes('.') && !valInput.includes('-')) {
          setVal(valInput)
          onChange(event)
        }
        return
      }
      if (isInteger) {
        if (!valInput.includes('.')) {
          setVal(valInput)
          onChange(event)
        }
        return
      }
      if (isPositive) {
        if (!valInput.includes('-')) {
          setVal(valInput)
          onChange(event)
        }
        return
      }
      setVal(valInput)
      onChange(event)
    } else {
      const v = valInput.slice(0, -1)
      setVal(v)
    }
  }

  return (
    <input
      className={clsx(
        styles.input,
        props.type === 'number' && styles['hide-arrow-number'],
        className
      )}
      value={val}
      onChange={_onChange}
      {...otherProps}
    />
  )
}
