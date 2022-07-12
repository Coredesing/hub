import React from 'react'

type Props = {
  label: string;
  value: any;
}
const InfoBoxOrderItem = (props: Props) => {
  return <div className='py-3 px-5'>
    <span className="block font-bold text-white/50 mb-1 sm:text-base text-sm sm:text-left text-center">
      {props.label}
    </span>
    <span className='font-bold sm:text-2xl text-lg lg:text-left text-center block'>{props.value}</span>
  </div>
}

export default InfoBoxOrderItem
