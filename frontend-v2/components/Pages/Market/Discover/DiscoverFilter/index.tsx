import Dropdown from '@/components/Base/Dropdown'
// import { BNB, BUSD_BSC, GAFI } from '@/components/web3'
import { ObjectType } from '@/utils/types'
import React, { useState } from 'react'
import isNumber from 'is-number'
// import { ethers } from 'ethers'

type Props = {
  onApply: (params: ObjectType) => any;
  disabled?: boolean;
}
const DiscoverFilter = ({ onApply, disabled }: Props) => {
  // const currencies = useMemo(() => [
  //   { ...BNB, address: ethers.constants.AddressZero },
  //   GAFI,
  //   BUSD_BSC
  // ], [])
  const [isShowFilter, setShowFilter] = useState(false)
  // const [currency, setCurrency] = useState(currencies[0].address)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const onChangeMinPrice = (e: any) => {
    const value = e.target.value
    if (!value) {
      return setMinPrice('')
    }
    if (isNaN(+value) || !isNumber(+value)) return
    setMinPrice(value)
  }

  const onChangeMaxPrice = (e: any) => {
    const value = e.target.value
    if (!value) {
      return setMaxPrice('')
    }
    if (isNaN(+value) || !isNumber(+value)) return
    setMaxPrice(value)
  }

  const handleApply = () => {
    onApply({
      // currency: currency,
      min_price: minPrice,
      max_price: maxPrice
    })
    setShowFilter(false)
  }

  const handleRefresh = () => {
    onApply({
      currency: '',
      min_price: '',
      max_price: ''
    })
    // setCurrency('')
    setMinPrice('')
    setMaxPrice('')
    setShowFilter(false)
  }

  return (
    <Dropdown disabled={disabled} isFilter={true} isShow={isShowFilter} onHandleFilter={() => setShowFilter(!isShowFilter)} classes={{ buttonSelected: 'h-10' }}>
      <>
        <div className="flex items-center justify-between">
          <div className="text-xl uppercase font-semibold">Filter</div>
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input className="text-gamefiGreen-700 w-5 h-5 mr-2 focus:ring-gamefiGreen-700 focus:ring-opacity-25 border border-transparent rounded-xs clipped-b-l-sm cursor-pointer" defaultChecked checked readOnly type="checkbox" />
              Show Advance Filters
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-items-center">
          <div className="uppercase font-semibold">Basic</div>
        </div>
        {/* <div className="mt-4 flex items-center">
          <div className="font-medium w-20 mr-6">Sale Types</div>
          <div className="flex items-center mr-4">
            <label className="inline-flex items-center">
              <input className="text-gamefiGreen-700 w-5 h-5 mr-2 focus:ring-gamefiGreen-700 focus:ring-opacity-25 border border-transparent rounded-xs clipped-b-l-sm cursor-pointer" type="checkbox" />
              Fixed Price
            </label>
          </div>
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input className="text-gamefiGreen-700 w-5 h-5 mr-2 focus:ring-gamefiGreen-700 focus:ring-opacity-25 border border-transparent rounded-xs clipped-b-l-sm cursor-pointer" type="checkbox" />
              Live Auction
            </label>
          </div>
        </div> */}
        {/* <div className="mt-4 flex align-middle sm:flex-row sm:items-center flex-col items-start">
          <div className="font-medium w-24 mr-6">Currency</div>
          <div className='flex flex-wrap'>
            {
              currencies.map(c => <button key={c.symbol} className="flex items-center mr-4" onClick={() => setCurrency(c.address)}>
                <input id={c.symbol} type="radio" name="radio" className="hidden" checked={currency === c.address} onChange={() => setCurrency(c.address)} />
                <label htmlFor={c.symbol} className="flex items-center cursor-pointer">
                  <span className="w-4 h-4 inline-block mr-2 rounded-full border border-grey flex-no-shrink"></span>
                  {c.name}
                </label>
              </button>)
            }
          </div>
        </div> */}
        <div className="mt-4 flex align-middle sm:flex-row sm:items-center flex-col items-start">
          <div className="font-medium w-24 mr-6">Price</div>
          <div className='flex flex-col sm:flex-row items-center'>
            <div className="relative flex">
              <input
                value={minPrice}
                maxLength={10}
                onChange={onChangeMinPrice}
                // disabled={!currency}
                // readOnly={!currency}
                className="appearance-none border border-gamefiDark-400 rounded-sm bg-transparent px-2 py-1 focus:outline-none" style={{ width: '166px' }} placeholder="Min Price" />
              <div className="absolute left-0 mt-2 rounded-r bg-gamefiDark-400" style={{ width: '2px', height: '18px' }}></div>
            </div>
            <div className="mx-3 sm:block hidden">to</div>
            <div className="relative flex sm:mt-0 mt-2">
              <input
                value={maxPrice}
                maxLength={10}
                onChange={onChangeMaxPrice}
                // disabled={!currency}
                // readOnly={!currency}
                className="appearance-none border border-gamefiDark-400 rounded-sm bg-transparent px-2 py-1 focus:outline-none w-40" style={{ width: '166px' }} placeholder="Max Price" />
              <div className="absolute left-0 mt-2 rounded-r bg-gamefiDark-400" style={{ width: '2px', height: '18px' }}></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 right-5 flex items-center align-middle">
          <div className="ml-auto flex">
            <button
              onClick={handleRefresh}
              className="uppercase mr-2 text-xs font-semibold opacity-50">Reset Filter</button>
            <button onClick={handleApply} className="px-4 py-2 bg-gamefiGreen-700 hover:opacity-90 rounded-sm clipped-t-r text-black text-sm font-semibold flex items-center">
              Apply Filter
              <span className="ml-2">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1613_290)">
                    <path d="M1.5 7H15.5" stroke="#212121" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" strokeLinejoin="round" />
                    <path d="M11.5 2L16.5 7L11.5 12" stroke="#212121" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1613_290">
                      <rect width="18" height="13" fill="white" transform="translate(0 0.5)" />
                    </clipPath>
                  </defs>
                </svg>

              </span>
            </button>
          </div>
        </div>
      </>
    </Dropdown>
  )
}

export default DiscoverFilter
