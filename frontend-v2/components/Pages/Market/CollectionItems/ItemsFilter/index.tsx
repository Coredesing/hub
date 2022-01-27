import Dropdown from 'components/Base/Dropdown'
import React, { useState } from 'react'

const ItemsFilter = () => {
  const [currency, setCurrency] = useState('bnb')
  return (
    <Dropdown isFilter={true}>
      <>
        <div className="flex items-center justify-between">
          <div className="text-xl uppercase font-semibold">Filter</div>
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input className="text-gamefiGreen-700 w-5 h-5 mr-2 focus:ring-gamefiGreen-700 focus:ring-opacity-25 border border-transparent rounded-xs clipped-b-l-sm cursor-pointer" type="checkbox" />
            Show Advance Filters
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-items-center">
          <div className="uppercase font-semibold">Basic</div>
        </div>
        <div className="mt-4 flex items-center">
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
        </div>
        <div className="mt-4 flex items-center align-middle">
          <div className="font-medium w-20 mr-6">Currency</div>
          <button className="flex items-center mr-4" onClick={(e: any) => setCurrency('bnb')}>
            <input id="bnb" type="radio" name="radio" className="hidden" checked={currency === 'bnb'} onChange={(e: any) => setCurrency('bnb')}/>
            <label htmlFor="bnb" className="flex items-center cursor-pointer">
              <span className="w-4 h-4 inline-block mr-2 rounded-full border border-grey flex-no-shrink"></span>
              BNB
            </label>
          </button>
          <button className="flex items-center mr-4" onClick={(e: any) => setCurrency('busd')}>
            <input id="busd" type="radio" name="radio" className="hidden" checked={currency === 'busd'} onChange={(e: any) => setCurrency('busd')} />
            <label htmlFor="busd" className="flex items-center cursor-pointer">
              <span className="w-4 h-4 inline-block mr-2 rounded-full border border-grey flex-no-shrink"></span>
              BUSD
            </label>
          </button>
          <button className="flex items-center mr-4" onClick={(e: any) => { setCurrency('gafi') }}>
            <input id="gafi" type="radio" name="radio" className="hidden" checked={currency === 'gafi'} onChange={(e: any) => setCurrency('gafi')} />
            <label htmlFor="gafi" className="flex items-center cursor-pointer">
              <span className="w-4 h-4 inline-block mr-2 rounded-full border border-grey flex-no-shrink"></span>
              GAFI
            </label>
          </button>
        </div>
        <div className="mt-4 flex items-center align-middle">
          <div className="font-medium w-20 mr-6">Price</div>
          <div className="relative flex">
            <input className="appearance-none border border-gamefiDark-400 rounded-sm bg-transparent px-2 py-1 focus:outline-none" placeholder="Min Price">
            </input>
            <div className="absolute left-0 mt-2 rounded-r bg-gamefiDark-400" style={{ width: '2px', height: '18px' }}></div>
          </div>
          <div className="mx-2">to</div>
          <div className="relative flex">
            <input className="appearance-none border border-gamefiDark-400 rounded-sm bg-transparent px-2 py-1 focus:outline-none" placeholder="Max Price">
            </input>
            <div className="absolute left-0 mt-2 rounded-r bg-gamefiDark-400" style={{ width: '2px', height: '18px' }}></div>
          </div>
        </div>
        <div className="absolute bottom-8 right-5 flex items-center align-middle">
          <div className="ml-auto flex">
            <button className="uppercase mr-2 text-xs font-semibold opacity-50">Reset Filter</button>
            <button className="px-4 py-2 bg-gamefiGreen-700 hover:opacity-90 rounded-sm clipped-t-r text-black text-sm font-semibold flex items-center">
              Apply Filter
              <span className="ml-2">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1613_290)">
                    <path d="M1.5 7H15.5" stroke="#212121" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" strokeLinejoin="round"/>
                    <path d="M11.5 2L16.5 7L11.5 12" stroke="#212121" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1613_290">
                      <rect width="18" height="13" fill="white" transform="translate(0 0.5)"/>
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

export default ItemsFilter
