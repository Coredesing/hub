import { ObjectType } from '@/utils/types'
import React, { useEffect, useMemo, useState } from 'react'
import FilterDropdown from '../Home/FilterDropdown'

type Props = {
  rankings: ObjectType[];
  isLive?: boolean;
}

const TopRanking = ({ rankings, isLive }: Props) => {

  return (
    <div>
      <div className="w-full relative bg-gamefiDark-600" style={{ height: '1px' }}>
        <div className="absolute top-0 left-0 bg-gamefiDark-600 clipped-b-r-full-sm inline-block" style={{ height: '4px', width: '60px', marginTop: '0', marginLeft: '0' }}></div>
      </div>

      <table className="mt-4 w-full">
        <thead>
          <tr>
            <th scope="col" className="py-3 px-4 font-bold text-xs md:text-sm uppercase text-white opacity-50 text-left">
              Rank
            </th>
            <th scope="col" className="py-3 px-4 font-bold text-xs md:text-sm uppercase text-white opacity-50 text-left">
              Wallet Address
            </th>
            <th scope="col" className="py-3 px-4 font-bold text-xs md:text-sm uppercase text-white opacity-50 text-left">
              Amount ($GAFI)
            </th>
            <th scope="col" className="py-3 px-4 font-bold text-xs md:text-sm uppercase text-white opacity-50 text-left">
              {isLive ? 'Last Staking' : 'Snapshot Time'}
            </th>
          </tr>
        </thead>
        <tbody>
          {(rankings || []).map((x, index) => <tr key={index} className="border-b border-gamefiDark-600 font-casual">
            <td className="py-4 px-4 text-sm whitespace-nowrap">
              {index + 1}
            </td>
            <td className="py-4 px-4 text-sm whitespace-nowrap">
              {x.wallet_address}
            </td>
            <td className="py-4 px-4 text-sm whitespace-nowrap">
              {x.amount}
            </td>
            <td className="py-4 px-4 text-sm whitespace-nowrap">
              {x.snapshot_at ? x.snapshot_at.toLocaleString('en-ZA', { timeZoneName: 'short', hour12: false }) : '—'}
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}

export default TopRanking