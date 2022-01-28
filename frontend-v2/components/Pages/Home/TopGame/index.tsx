import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useScreens } from '../utils'

type Props = {
  item: any,
  isTop?: boolean,
  like?: any
}
const TopGame = ({ item, isTop, like }: Props) => {
  const screens = useScreens()
  return <div className={`w-full md:px-0 lg:h-64 flex flex-col overflow-hidden rounded ${isTop ? `${screens.tablet && 'h-96'} h-auto` : 'h-auto'}`}>
    <div className={'w-full md:h-3/4 relative overflow-hidden'}>
      <div className="absolute -top-1 -right-1 h-7 w-32 clipped-b-l-full bg-gamefiDark-900 flex align-middle items-center justify-center">
        <Image src={require('assets/images/icons/red-heart.svg')} alt=""></Image>
        <div className="ml-2">{like?.total_like || 0}</div>
      </div>
      <Link href={`/aggregator/${item.slug}`} passHref>
        <img src={item?.top_favourite_link} alt='favorite-img' style={{ width: '100%', height: screens.mobile ? '180px' : '100%', objectFit: 'cover' }} className="hover:cursor-pointer" />
      </Link>
    </div>
    <div className="md:h-1/4 relative py-4 bg-gamefiDark-650">
      {
        isTop && <div className="absolute left-3 -top-6 rounded border-2 bg-black border-gamefiDark-900 w-16 h-16 flex items-center justify-center">
          <img src={item?.icon_token_link} alt="" style={{ width: '2rem', objectFit: 'cover' }}></img>
        </div>
      }
      <Link href={`/aggregator/${item.slug}`} passHref>
        <div className={`${isTop ? 'ml-24' : 'justify-center'} h-full flex items-center align-middle font-semibold py-4 cursor-pointer hover:underline`}>
          {item?.game_name}
        </div>
      </Link>
    </div>
  </div>
}

export default TopGame
