import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  item: any;
  isTop?: boolean;
  like?: any;
}
const TopGame = ({ item, isTop, like }: Props) => {
  return <div className="w-full flex flex-col overflow-hidden rounded">
    <div className={'w-full relative overflow-hidden'}>
      <div className="absolute -top-1 -right-1 h-7 w-32 clipped-b-l-full bg-gamefiDark-900 flex align-middle items-center justify-center">
        <Image src={require('@/assets/images/icons/red-heart.svg')} alt=""></Image>
        <div className="ml-2">{like?.total_like || 0}</div>
      </div>
      <div className="w-full">
        <Link href={`/hub/${item.slug}`} passHref>
          <img src={item?.top_favourite_link} alt='favorite-img' style={{ width: '100%', aspectRatio: isTop ? '2' : '1', objectFit: 'cover' }} className="hover:cursor-pointer" />
        </Link>
      </div>
    </div>
    <div className="md:h-16 relative py-4 bg-gamefiDark-630/30">
      {
        isTop && <div className="absolute left-3 -top-6 rounded border-2 bg-black border-gamefiDark-900 w-16 h-16 flex items-center justify-center">
          <img src={item?.icon_token_link} alt="" style={{ width: '100%', objectFit: 'cover' }}></img>
        </div>
      }
      <Link href={`/hub/${item.slug}`} passHref>
        <div className={`${isTop ? 'ml-24' : 'justify-center'} h-full flex items-center align-middle font-semibold py-4 cursor-pointer hover:underline`}>
          {item?.game_name}
        </div>
      </Link>
    </div>
  </div>
}

export default TopGame
