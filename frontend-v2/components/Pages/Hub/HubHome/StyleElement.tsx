import React from 'react'
import { checkPathImage } from '@/utils/image'
import clsx from 'clsx'
import Link from 'next/link'

export const WrapperSection = (props: any) => {
  return (
    <div className="w-full items-center gap-4 pb-14 sm:pb-6 xl:pb-10">
      {props.children}
    </div>
  )
}

export const WrapperItem = (props: any) => {
  return <div {...props}>
    {props.children}
  </div>
}

export const WrapperHorizontalItem = ({ item, children, className }: any) => {
  return (
    <Link href={`/hub/${item?.slug}`} passHref>
      <div
        className={clsx('py-2 pr-4 bg-gamefiDark-630/30 rounded w-full flex items-stretch justify-between gap-3 font-casual cursor-pointer group relative bg-gradient-to-r from-[#292C36] to-[rgba(41, 44, 54, 0)] hover:from-[#373C48] hover:[rgba(55, 60, 72, 0)]', className)}>
        <span className="w-12 h-12 bg-black">
          <img src={checkPathImage(item.url)} alt="" className="w-full h-full object-cover rounded-sm"></img>
        </span>
        <div className="flex-1 flex tracking-normal">
          {children}
        </div>
      </div>
    </Link >
  )
}
