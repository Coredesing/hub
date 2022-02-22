import React from 'react'

type Props = {
  title?: string;
}
const NoItemFound = ({ title }: Props) => {
  return (
    <div className='flex items-center w-full h-32 justify-center'>
      <h1 className='uppercase text-4xl text-center font-bold'>{title || 'No Item Found'}</h1>
    </div>
  )
}

export default NoItemFound