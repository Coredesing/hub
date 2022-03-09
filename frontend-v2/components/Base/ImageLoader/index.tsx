import { ObjectType } from '@/utils/types'
import React, { useState } from 'react'

type Props = {
  src: string;
  size?: 'small' | 'medium'
} & ObjectType

const ImageLoader = ({ src, size = 'medium', ...props }: Props) => {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {
        loading && <>
          {
            size === 'medium'
              ? <div className='shadow rounded-md w-full mx-auto'>
                <div className='animate-pulse flex flex-col justify-center items-center'>
                  <div className='rounded-full bg-slate-200 h-10 w-10 mb-4'></div>
                  <div className='space-y-6 w-full'>
                    <div className='h-4 bg-slate-200 rounded w-full'></div>
                    <div className='space-y-3'>
                      <div className='grid grid-cols-3 gap-4'>
                        <div className='h-4 bg-slate-200 rounded col-span-2'></div>
                        <div className='h-4 bg-slate-200 rounded col-span-1'></div>
                      </div>
                      <div className='h-4 bg-slate-200 rounded'></div>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div className='shadow rounded-md mx-auto w-full h-full animate-pulse flex flex-col gap-1 items-center justify-center' style={{ maxWidth: '30px' }}>
                <div className='h-4 rounded-full bg-slate-200 w-4'></div>
                <div className='h-2 bg-slate-200 rounded w-8'></div>
              </div>
          }

        </>
      }
      {
        <img
          src={src || ''}
          {...props}
          style={props.style ? { ...props.style, display: loading ? 'none' : '' } : { display: loading ? 'none' : '' }}
          onError={() => {
            setLoading(true)
          }}
          onLoad={() => {
            setTimeout(() => {
              setLoading(false)
            }, 1000)
          }}

        />
      }

    </>
  )
}

export default ImageLoader
