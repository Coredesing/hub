import React from 'react'
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

export const TableRow = ({ children, className }: any) => {
  return <tr className={className}>
    {children}
  </tr>
}

export const TableCellHead = (props: any) => {
  return <th className={clsx('uppercase py-3 px-4 font-bold text-base text-left text-white/50 border-b border-white/10 bg-gamefiDark-800', props.className)}>{props.children}</th>
}

export const TableCell = (props: any) => {
  return <td className={clsx('py-3 px-4 text-left text-sm font-casual border-b border-white/10', props.className)}>{props.children}</td>
}

export const TableHead = (props: any) => {
  return <thead className={clsx(props.className)}>{props.children}</thead>
}

export const TableBody = (props: any) => {
  return <tbody className={clsx(props.className)}>{props.children}</tbody>
}
