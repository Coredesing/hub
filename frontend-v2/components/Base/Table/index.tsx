import React from 'react'
import styles from './table.module.scss'
import clsx from 'clsx'

export const Table = (props: any) => {
  return (
        <div className={clsx('rounded-sm overflow-hidden', props.className)}>
            <table className='w-full'>
                {
                    props.children
                }
            </table>
        </div>
  )
}

export const TableRow = (props: any) => {
  return <tr>
        {props.children}
    </tr>
}

export const TableCellHead = (props: any) => {
  return <th className={clsx('uppercase py-3 px-4 font-semibold text-lg text-left', styles['table-cell'])}>{props.children}</th>
}

export const TableCell = (props: any) => {
  return <td className={clsx('py-3 px-4 text-left text-lg font-casual', styles['table-cell'])}>{props.children}</td>
}

export const TableHead = (props: any) => {
  return <thead className={clsx(styles['table-head'])}>{props.children}</thead>
}

export const TableBody = (props: any) => {
  return <tbody className={clsx(styles['table-body'])}>{props.children}</tbody>
}
