/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Image from 'next/image'

type Props = {
  item: any,
  isTop?: boolean,
  like?: any
}
const TopGame = ({ item, isTop, like }: Props) => {
  return <div className={`w-full px-3 md:px-0 lg:h-64 flex flex-col overflow-hidden rounded ${isTop ? 'h-96' : 'h-auto'}`}>
    <div className={'w-full md:h-3/4 relative overflow-hidden'}>
      <div className="absolute -top-1 -right-1 h-7 w-32 clipped-b-l-full bg-gamefiDark-900 flex align-middle items-center justify-center">
        <Image src={require('assets/images/icons/red-heart.svg')} alt=""></Image>
        <div className="ml-2">{like?.total_like || 0}</div>
      </div>
      <img src={item.top_favourite_link} alt='favorite-img' width="100%" />
    </div>
    <div className="md:h-1/4 relative py-4 bg-gamefiDark-650">
      {
        isTop && <div className="absolute left-3 -top-8 rounded border-2 border-gamefiDark-900">
          <img src={item.screen_shots_1} alt="" style={{ width: '4rem', height: '4rem' }}></img>
        </div>
      }
      <div className={`${isTop ? 'ml-24' : 'justify-center'} h-full flex items-center align-middle font-semibold py-4`}>{item.game_name}</div>
    </div>
  </div>
}

export default TopGame
