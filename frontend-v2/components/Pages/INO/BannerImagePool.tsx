import React from 'react'

type Props = {
  src: string;
}

const BannerImagePool = (props: Props) => {
  return <>
    <img className="w-full h-full object-contain" src={props.src} />
  </>
}

export default BannerImagePool
