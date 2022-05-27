import { format } from 'date-fns'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
type Props = {
  className?: string;
  item: any;
}

const PostItem = ({ className, item }: Props) => {
  return (
    <div className="bg-gamefiDark-630/30 rounded flex flex-col gap-0">
      <Link href={`/insight/${item.slug}`} passHref={true}>
        <a className="block relative w-full aspect-[16/9]" target="_blank" rel="noopener noreferer">
          <Image src={item.feature_image} layout="fill" alt={item.title} objectFit={'cover'}></Image>
        </a>
      </Link>

      <p className="font-casual text-[13px] text-white text-opacity-50 mt-4 block px-4">
        {format(new Date(item.published_at), 'MMM d, yyyy')}
        <span className="mx-2">•</span>
        {item.reading_time} min read
      </p>

      <div className="w-auto max-w-xl px-4 pt-3 pb-6">
        <Link href={`/insight/${item.slug}`} passHref={true}>
          <a className="line-clamp-2 font-semibold text-xl !leading-shi mt-2 mb-2 xl:mb-4 hover:underline tracking-wide">{item.title}</a>
        </Link>
        <div className="line-clamp-2 font-casual text-sm text-white text-opacity-75">{item.excerpt}</div>
      </div>
    </div>
  )
}

export default PostItem
