import { isImageFile, isVideoFile } from '@/utils/index'
import React from 'react'
import styles from './BannerImagePool.module.scss'

type Props = {
  src: string;
}

const BannerImagePool = (props: Props) => {
  return <>
    {isImageFile(props.src) && <img className="w-full h-full object-contain" src={props.src} alt='banner' />}
    {
      isVideoFile(props.src) && <div className={styles.video}>
        <div>
          <video
            preload="auto"
            autoPlay
            loop
            muted
            controlsList="nodownload"
            key={props.src}
          >
            <source src={props.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    }

  </>
}

export default BannerImagePool
