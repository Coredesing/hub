import React, { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './pool.module.scss'

type Props = {
  headContent?: ReactNode;
  bodyBannerContent: ReactNode;
  bodyDetailContent: ReactNode;
  footerContent?: ReactNode;
}
const PoolDetail = (props: Props) => {
  return (
    <div className={styles.contentPage}>
      {
        props.headContent && <div className='mb-5'>
          {props.headContent}
        </div>
      }
      <div className={clsx(styles.body, 'lg:grid-cols-2', 'grid-cols-1')}>
        <div className={styles.banner}>
          {props.bodyBannerContent}
        </div>
        <div>
          {props.bodyDetailContent}
        </div>
      </div>
      <div className={clsx(styles.footer, 'w-full')} style={{ minHeight: '300px' }}>
        {props.footerContent}
      </div>
    </div>
  )
}

export default PoolDetail
