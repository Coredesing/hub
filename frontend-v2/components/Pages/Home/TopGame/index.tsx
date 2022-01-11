/* eslint-disable @next/next/no-img-element */
import React from 'react'

type Props = {
  item: any
}
const TopGame = ({ item }: Props) => {
  return <div className="w-full flex flex-col h-64 overflow-hidden">
    <img src={item.top_favourite_link} alt='favorite-img' width="100%" height="100%" />
  </div>
}

export default TopGame