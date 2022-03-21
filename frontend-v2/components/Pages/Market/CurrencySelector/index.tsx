import { Address, ObjectType } from '@/utils/types'
import Image from 'next/image'
import React, { useCallback } from 'react'
import { currencies } from '../constant'

type Props = {
  onChange?: (currency?: ObjectType) => any;
  selected?: Address;
} & ObjectType

const CurrencySelector = ({ onChange, selected, ...props }: Props) => {
  const isActive = useCallback((currency: ObjectType) => {
    return currency.address === selected
  }, [selected])

  const onSelectCurrency = useCallback((item: ObjectType) => {
    onChange && onChange(item)
  }, [onChange])

  return (
    <div className="font-casual">
      <div className={'flex gap-x-1.5 bg-gamefiDark-700 rounded p-1.5'} style={props.style}>
        {currencies.map(currenncy => {
          return <div key={currenncy.address} className={'flex items-center rounded flex-none cursor-pointer py-1 px-2'} onClick={() => onSelectCurrency(currenncy)} style={{ backgroundColor: isActive(currenncy) ? (currenncy.colorAlt || currenncy.color) : 'transparent' }}>
            <div className={`flex-none w-4 h-4 relative contrast-200 brightness-200 grayscale ${isActive(currenncy) ? 'opacity-100' : 'opacity-50'} hover:opacity-100`}><Image src={currenncy.icon} alt={currenncy.name} layout="fill" /></div>
            {isActive(currenncy) && <span className={'ml-2 text-xs'}>{currenncy.symbol}</span>}
          </div>
        })}
      </div>
    </div>
  )
}

export default CurrencySelector
