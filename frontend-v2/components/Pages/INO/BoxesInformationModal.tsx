import React, { useLayoutEffect } from 'react'
import Modal from '@/components/Base/Modal'
import styles from './BoxesInformationModal.module.scss'
import clsx from 'clsx'
import { Carousel } from 'react-responsive-carousel'

type Props = {
  open?: boolean;
  onClose?: () => any;
  items: any[];
  idShow?: number;
}

const BoxesInformationModal = ({ open, onClose, items, idShow }: Props) => {
  useLayoutEffect(() => {
    const boxInformationsCarouselList = document.querySelector('.box-informations')
    if (!boxInformationsCarouselList || !open) return
    const btnPrev = boxInformationsCarouselList.querySelector('.control-arrow.control-prev')
    const btnNext = boxInformationsCarouselList.querySelector('.control-arrow.control-next')

    const handleKeydown = (e: any) => {
      if (e.code === 'ArrowLeft') {
        if ((btnPrev as any)?.click) {
          (btnPrev as any).click()
        }
      }
      if (e.code === 'ArrowRight') {
        if ((btnNext as any)?.click) {
          (btnNext as any).click()
        }
      }
    }
    if (!document.onkeydown) {
      document.onkeydown = handleKeydown
    } else {
      const onKeyDown: any = document.onkeydown
      document.onkeydown = (e) => {
        onKeyDown(e)
        handleKeydown(e)
      }
    }
  }, [open])

  return <Modal show={open} toggle={onClose} className={styles.modal}>
    <div className={clsx('px-8 pt-14 pb-8', styles.content)}>
      <div className='relative'>
        <h3 className='font-bold text-2xl mb-5 font-mechanic uppercase'>Information</h3>
        <Carousel
          className={`${styles.carousel} box-informations`}
          showStatus={false}
          showIndicators={false}
          selectedItem={idShow || 0}
          stopOnHover={true}
          showThumbs={true}
          swipeable={true}
          renderThumbs={() => {
            return items && items.length > 1 && items.map((item) => <div
              key={`thumb-${item.id}`}
              className={clsx(styles.itemThumb, 'p-px cursor-pointer item-thumb')}
            >
              <div className={clsx('cursor-pointer pt-2 px-4 pb-4')}>
                <div className="thumb-img">
                  <img src={item.banner} alt="" className='w-28 h-16 object-contain mb-4 relative' />
                </div>
                <h3 className='text-13px font-casual text-center break-words break-all text-ellipsis w-full whitespace-nowrap overflow-hidden'>{item.name}</h3>
              </div>
            </div>)
          }}
        >
          {
            items.map((box, id) => <div key={id} className={clsx(styles.itemSlide, 'flex md:flex-row flex-col gap-12 mb-10 font-mechanic')}>
              <div className='md:w-2/5 w-full'>
                <div className={styles.itemSlideImage}>
                  <img src={box.image} className={'w-60 h-32 object-contain relative'} alt="" />
                </div>
              </div>
              <div className='md:w-3/5 w-full overflow-auto' style={{ maxHeight: '300px' }}>
                <h3 className='text-lg font-semibold font-mechanic uppercase text-left mb-4'>{box.name}</h3>
                <div className='text-left text-sm font-casual mb-7'>
                  {box.description}
                </div>
                <div className='text-left flex gap-10'>
                  <div>
                    <span className='block font-mechanic text-13px font-bold uppercase text-white/50'>TOTAL SALE</span>
                    <span className='block text-base font-casual font-medium'>{box.maxSupply || box.limit} Items</span>
                  </div>
                  <div>
                    <span className='block font-mechanic text-13px font-bold uppercase text-white/50'>Remaining</span>
                    <span className='block text-base font-casual font-medium'>{(+(box.maxSupply || box.limit) - (+box.totalSold || 0)) || (box.maxSupply || box.limit)} Items</span>
                  </div>
                </div>
              </div>
            </div>)
          }

        </Carousel>
        {
          items.length > 1 && <div className={styles.divider}> </div>
        }
      </div>
    </div >
  </Modal >
}

export default BoxesInformationModal
