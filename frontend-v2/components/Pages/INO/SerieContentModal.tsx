import React, { useEffect, useState } from 'react'
import Modal from '@/components/Base/Modal'
import styles from './SerieContentModal.module.scss'
import clsx from 'clsx'
import { Carousel } from 'react-responsive-carousel'

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
  }, [idShow, serieContents])

  const onSelectItem = (id: number) => {
    setCurrent(serieContents[id])
  }
  return <Modal show={open} toggle={onClose} className={styles.modal}>
    <div className={clsx('px-8 pt-14 pb-8', styles.content)}>
      <h3 className='font-bold text-2xl mb-5 font-mechanic'>SERIES CONTENT</h3>
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
        className={styles.carousel}
        showStatus={false}
        showIndicators={false}
        selectedItem={idShow}
        // autoPlay={true}
        stopOnHover={true}
        showThumbs={true}
        thumbWidth={170}
        swipeable={true}
        // infiniteLoop={true}
        // interval={3000}
        // showThumbs
        // swipeable
        // centerMode
        renderThumbs={() => {
          return serieContents && serieContents.length > 1 && serieContents.map((item, id) => <div
            key={`thumb-${item.id}`}
            className={clsx(styles.itemThumb, 'p-px cursor-pointer item-thumb')}
          >
            <div onClick={() => onSelectItem(id)} className={clsx('cursor-pointer pt-2 px-4 pb-4 bg-black')}>
              <img src={item.banner} alt="" className='w-28 h-16 object-contain mb-2' />
              <h3 className='text-13px font-casual text-center break-words break-all text-ellipsis w-full whitespace-nowrap overflow-hidden'>{item.name}</h3>
            </div>
          </div>)
        }}
      >
        {
          serieContents.map((s, id) => <div key={id} className={clsx(styles.itemSlide, 'grid gap-5 place-content-center place-items-center m-auto mb-10 font-mechanic')}>
            <div className={styles.itemSlideImage}>
              <img src={s.banner} key={s.id} alt="" className=' w-ful h-full object-contain' />
            </div>
            <div className='sm:w-auto sm:h-auto w-40 h-auto'>
              <h4 className='text-lg uppercase font-bold text-center' key={s.name}>{s.name}</h4>
              <div className={clsx(styles.itemDesc, 'text-base')}>
                {s.description}
              </div>
            </div>
          </div>)
        }
      </Carousel>
      {/* </div> */}
    </div >
  </Modal >
}

export default SerieContentModal
