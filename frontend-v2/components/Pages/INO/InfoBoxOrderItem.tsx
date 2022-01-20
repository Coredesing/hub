import React from 'react'

type Props = {
  label: string;
  value: any;
}
const InfoBoxOrderItem = (props: Props) => {
  return <div className='py-3 px-5'>
    <span className="block font-bold text-white/50 mb-1">
      {props.label}
    </span>
    <span className='font-bold text-2xl'>{props.value}</span>
  </div>
}

export default InfoBoxOrderItem
