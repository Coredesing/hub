/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Image from 'next/image'

type Props = {
  item: any,
  isTop?: boolean,
  like?: any
}
const TopGame = ({ item, isTop, like }: Props) => {
  return <div className={`w-full h-40 md:h52 lg:h-64 2xl:h-80 flex flex-col overflow-hidden rounded ${isTop && 'col-span-2'}`}>
    <div className={`w-full h-3/4 relative overflow-hidden`}>
      <div className="absolute -top-1 -right-1 h-7 w-36 clipped-b-l-full bg-gamefiDark-900 flex align-middle items-center justify-center">
        <Image src={require('assets/images/icons/red-heart.svg')} alt=""></Image>
        <div className="ml-2">{like || 0}</div>
      </div>
      <img src={item.top_favourite_link} alt='favorite-img' width="100%" />
    </div>
    <div className="h-1/4 relative bg-gamefiDark-650">
      {
        isTop && <div className="absolute left-3 -top-8 rounded border-2 border-gamefiDark-900">
          <img src={item.screen_shots_1} alt="" style={{width: '4rem', height: '4rem'}}></img>
        </div>
      }
      <div className={`${isTop ? 'ml-24' : 'justify-center'} h-full flex items-center align-middle font-semibold`}>{item.game_name}</div>
    </div>
  </div>
}

export default TopGame