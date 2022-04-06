import React, { useMemo } from 'react'
import Image from 'next/image'
import GameFiPerformance from './GameFiPerformance'
import { prettyPrice, priceChange } from '../utils'
import { useFetch } from '@/utils'

const Performance = () => {
  const url = '/home/performances'
  const { response, loading } = useFetch(url)

  const performances = useMemo<any[]>(() => {
    return response?.data?.performances || []
  }, [response])

  const gamefi = useMemo(() => {
    return response?.data?.gamefi
  }, [response])

  return (
    <div className="container px-4 lg:px-16 mx-auto mt-20 pb-10 relative">
      <div className="mx-auto relative" style={{ maxWidth: '600px' }}>
        <Image src={require('@/assets/images/performance.png')} alt=""></Image>
        <div className="text-3xl font-bold uppercase absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">Performance</div>
      </div>
      <div className="w-full">
        { loading && (
          <div className="flex gap-2 justify-center items-center uppercase font-casual font-semibold absolute z-10 inset-0 bg-gamefiDark-900 bg-opacity-90">
            <svg className="animate-spin w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
              Loading...
          </div>
        ) }
        {gamefi && <GameFiPerformance item={gamefi}></GameFiPerformance>}
      </div>
      <div className="mt-14 relative">
        <div className="flex mb-2 px-3 py-4 sm:px-6 sm:py-">
          <div className="uppercase text-gray-400 font-bold text-sm w-20 hidden md:block">CMC Rank</div>
          <div className="uppercase text-gray-400 font-bold text-sm flex-1 pr-2 text-left">Name</div>
          <div className="uppercase text-gray-400 font-bold text-sm xl:w-36 w-20">Price</div>
          <div className="uppercase text-gray-400 font-bold text-sm w-20 xl:w-36 hidden lg:block">CHG 24H</div>
          <div className="uppercase text-gray-400 font-bold text-sm w-16 xl:w-32 hidden xl:block">CHG 7D</div>
          <div className="uppercase text-gray-400 font-bold text-sm w-48 hidden 2xl:block">Market Cap</div>
          <div className="uppercase text-gray-400 font-bold text-sm w-48 hidden lg:block">Vol (24H)</div>
          <div className="uppercase text-gray-400 font-bold text-sm w-14">IGO ROI</div>
        </div>
        <div className="relative mb-8">
          { loading && (
            <div className="flex gap-2 justify-center items-center uppercase font-casual font-semibold absolute z-10 inset-0 bg-gamefiDark-900 bg-opacity-90">
              <svg className="animate-spin w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
                Loading...
            </div>
          ) }

          { performances && performances.map(item =>
            <div key={`performances-${item.rank}`}>
              <div className="flex items-center bg-gamefiDark-800 rounded-xs mb-2 px-3 py-4 sm:p-6">
                <div className="w-20 items-center hidden md:block">
                    # {item.rank}
                </div>
                <div className="flex-1 font-casual text-sm pr-2">
                  <div className="text-xs sm:text-sm line-clamp-1 text-gray-300">{item.name}</div>
                </div>
                <div className="flex-none font-casual text-sm pr-2 xl:w-36 w-20">
                  <div className="text-sm line-clamp-1 text-gray-300">${parseFloat(item.price).toFixed(2)}</div>
                </div>
                <div className="flex-none font-casual text-sm pr-2 w-20 xl:w-36 hidden lg:block">
                  <div className="text-sm line-clamp-1 text-gray-300">{priceChange(item.price_change_24h || 0)}</div>
                </div>
                <div className="flex-none font-casual text-sm pr-2 w-16 xl:w-32 hidden xl:block">
                  <div className="text-sm line-clamp-1 text-gray-300">{priceChange(item.price_change_7d || 0)}</div>
                </div>
                <div className="flex-none font-casual text-sm pr-2 w-48 hidden 2xl:block">
                  <div className="text-sm line-clamp-1 text-gray-300">{prettyPrice(item.market_cap || 0)}</div>
                </div>
                <div className="flex-none font-casual text-sm pr-2 w-48 hidden lg:block">
                  <div className="text-sm line-clamp-1 text-gray-300">{prettyPrice(item.volume_24h || 0)}</div>
                </div>
                <div className="flex-none font-casual text-sm pr-2 w-14">
                  <div className="text-sm line-clamp-1 text-gray-300">{parseFloat(item.ido_roi).toFixed(2)}x</div>
                </div>
              </div>
            </div>
          ) }
        </div>
      </div>
    </div>
  )
}

export default Performance
