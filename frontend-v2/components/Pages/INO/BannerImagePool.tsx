import { isImageFile, isVideoFile } from '@/utils/index'
import React from 'react'

type Props = {
  src: string;
}

const BannerImagePool = (props: Props) => {
  return <>
    {isImageFile(props.src) && <img className="w-full h-full object-contain" src={props.src} />}
    {
      isVideoFile(props.src) && <div className="video">
        <video
          preload="auto"
          autoPlay
          loop
          muted
          key={props.src}
        >
          <source src={props.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    }

  </>
}

export default BannerImagePool
