import React, { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/Base/Modal'
import styles from './SerieContentModal.module.scss'
import clsx from 'clsx'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

type Props = {
  open?: boolean;
  onClose?: () => any;
  serieContents: any[];
  idShow?: number;
}

const SerieContentModal = ({ open, onClose, serieContents, idShow }: Props) => {
  const [current, setCurrent] = useState(serieContents[0])
  useEffect(() => {
    setCurrent(serieContents[idShow])
  }, [idShow])

  const onSelectItem = (id: number) => {
    setCurrent(serieContents[id])
  }
  return <Modal show={open} toggle={onClose}>
    <div className={clsx('px-8 pt-14 pb-8', styles.content)}>
      <h3 className='font-bold text-2xl mb-12'>SERIES CONTENT</h3>
      {/* <div className='grid gap-5 place-content-center place-items-center w-56 m-auto mb-10'>
        <div className="img">
          <img src={current.banner} key={current.id} alt="" className='w-56 h-72 bg-black object-contain' />
        </div>
        <div>
          <h4 className='text-lg uppercase font-bold text-center' key={current.name}>{current.name}</h4>
          <div>

          </div>
        </div>
      </div> */}
      {/* <div className="slides flex gap-2 items-center"> */}
      <Carousel
        className={styles.thumbs}
        showStatus={false}
        showIndicators={false}
        showThumbs
        swipeable
        // centerMode
        renderThumbs={() => {
          return serieContents && serieContents.length > 1 && serieContents.map((item, id) => {
            return <div key={id} onClick={() => onSelectItem(id)} className={clsx('cursor-pointer pt-2 px-4 pb-4 bg-black w-36 h-44 flex-grow-0 flex-shrink-0', styles.itemSlide)}>
              <img src={item.banner} alt="" className='w-28 h-28 object-contain mb-2' />
              <h3 className='text-sm font-casual text-center break-words break-all text-ellipsis w-full whitespace-nowrap overflow-hidden'>{item.name}</h3>
            </div>
          })
        }}
      >
        {
          serieContents.map((s, id) => <div key={id} className='grid gap-5 place-content-center place-items-center w-56 m-auto mb-10'>
            <div className="img">
              <img src={s.banner} key={s.id} alt="" className='w-56 h-72 bg-black object-contain' />
            </div>
            <div>
              <h4 className='text-lg uppercase font-bold text-center' key={s.name}>{s.name}</h4>
              <div>

              </div>
            </div>
          </div>)
        }
      </Carousel>
      {/* </div> */}
    </div>
  </Modal>
}

export default SerieContentModal
