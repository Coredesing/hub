import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gtagEvent } from '@/utils'

export default function TopRight () {
  return (
    <div className="mb-8 bg-gamefiDark-630/30 rounded pb-4">
      <div className="mb-6">
        <Image layout="responsive" src={require('@/assets/images/hub/top-right-home.png')} alt="" className="w-full" />
      </div>
      <div className="mb-4 px-4">
        <Link href="/hub/list" passHref>
          <a className="bg-gamefiGreen-700 text-[13px] text-gamefiDark-900 py-2.5 rounded-xs clipped-t-r hover:opacity-90 cursor-pointer block" onClick={() => {
            gtagEvent('hub_explore')
          }}>
            <div className="flex align-middle items-center justify-center">
              <span className="mr-2 uppercase font-bold text-xs">Explore all Games</span>
            </div>
          </a>
        </Link>
      </div>
    </div>
  )
}
