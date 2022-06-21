import { format } from 'date-fns'
import Link from 'next/link'
import React from 'react'
import { checkPathImage } from '@/utils/image'
type Props = {
  className?: string;
  item: any;
}

const PostItem = ({ item }: Props) => {
  return (
    <div className="flex flex-1 gap-4 items-center">
      <Link href={`/insight/${item?.slug}`} passHref={true}>
        <a className="block relative w-full aspect-[16/9]">
          <img src={checkPathImage(item?.feature_image)} alt={item.title} className="rounded-[2px] object-cover" />
        </a>
      </Link>
      <div className="w-full">
        <Link href={`/insight/${item?.slug}`} passHref={true}>
          <a className="hidden md:line-clamp-2 font-semibold text-base xl:text-lg !leading-shi hover:underline tracking-wide font-mechanic">{item?.title}</a>
        </Link>
        <p className="font-casual text-xs xl:text-[13px] text-white text-opacity-50 my-1 xl:my-2">
          {format(new Date(item?.published_at), 'MMM d, yyyy')}
          <span className="inline mx-2">•</span>
          <span className="inline">{item?.reading_time} min read</span>
        </p>
        <a className="line-clamp-3 md:hidden font-semibold text-base xl:text-lg !leading-shi hover:underline tracking-wide font-mechanic">{item?.title}</a>
        <div className="hidden md:line-clamp-3 font-casual text-sm text-white text-opacity-75 mt-4">
          {item?.excerpt}
        </div>
      </div>
    </div>
  )
}

export default PostItem
