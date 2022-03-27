import { ObjectType } from '@/utils/types'
import React, { useEffect, useRef, useState } from 'react'
import Flicking from '@egjs/react-flicking'
import { Sync } from '@egjs/flicking-plugins'
import '@egjs/flicking/dist/flicking.css'
import Item from './Item'
import styles from './TopCollections.module.scss'

type Props = {
  items: ObjectType[]
}

const TopCollections = ({ items }: Props) => {
  const flicking0 = useRef()
  return (
    <Flicking
      ref={flicking0}
      className="mb-4 w-full"
      bounce={5}
    >
      {
        !!items?.length && items.map((item, idx) => <div style={{ minHeight: '608px' }} className={`${styles.item} relative w-full`}><Item item={item} /></div>)
      }
    </Flicking>
  )
}

export default TopCollections