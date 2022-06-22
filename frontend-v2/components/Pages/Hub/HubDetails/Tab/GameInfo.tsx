import { useEffect, useState } from 'react'
import RenderEditorJs from '@/components/Base/RenderEditorJs'
import get from 'lodash.get'
import Image from 'next/image'
import Link from 'next/link'
import { imageCMS, isEmptyDataParse } from '@/utils'
import avatar from '@/assets/images/hub/avatar-scam.svg'

const GameInfo = ({ data = {}, tabRef }: { data: any; tabRef: any }) => {
  const [showImageAdvisors, setShowImageAdvisors] = useState(true)
  const [showImageStudio, setShowImageStudio] = useState(true)

  useEffect(() => {
    tabRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [tabRef])

  useEffect(() => {
    setShowImageAdvisors(showImage(data?.advisor))
    setShowImageStudio(showImage(data?.studio?.[0]?.teamMembers))
  }, [data?.advisor, data?.studio])

  const showImage = (data, error = false) => {
    if (error) return false

    const check = data?.some(e => get(e, 'avatar.data.attributes.url', false) === false)

    return !check
  }

  return (
    <>
      <div className='grid grid-cols-2 gap-5'>
        <div className='flex gap-4'>
          <div className='md:w-1 min-h-[69px] bg-[#303442]'></div>
          <div className='flex flex-col justify-center gap-2'>
            <div className='uppercase text-gray-500 text-sm font-mechanic font-bold'><span>Category</span></div>
            <div className='flex flex-wrap gap-2'>
              {data?.categories && data?.categories.map((e, i) => (
                <Link key={i} href={`/hub/list?category=${e?.attributes?.slug}`} passHref>
                  <a className="text-xs px-2 py-1.5 bg-gamefiDark-630/50 hover:bg-gamefiDark-630 rounded">
                    {e?.attributes?.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
        {!!data?.gameDownloads?.length && <div className='flex gap-4'>
          <div className='w-1 min-h-[69px] bg-[#303442]'></div>
          <div className='flex flex-col md:justify-center gap-2'>
            <div className='uppercase text-gray-500 text-sm font-mechanic font-bold'><span>Game Download</span></div>
            <div className='flex flex-wrap gap-2'>
              {data?.gameDownloads?.map((e, i) => (
                <a key={i} href={e?.link} className="text-xs px-2 py-1.5 bg-gamefiDark-630/50 hover:bg-gamefiDark-630 rounded" target="_blank" rel="noopenner noreferrer">
                  {e?.type}
                </a>
              ))}
            </div>
          </div>
        </div>}
      </div>
      { isEmptyDataParse(data?.playMode) && <>
        <div className="max-w-[740px] mx-auto mt-10 text-2xl uppercase mb-4 font-mechanic"><strong>Play Mode</strong></div>
        <RenderEditorJs data={data?.playMode} index={'playModel'}/>
      </>
      }

      { isEmptyDataParse(data?.playToEarnModel) && <>
        <div className="max-w-[740px] mx-auto mt-16 text-2xl uppercase mb-4 font-mechanic"><strong>Play-To-Earn Model</strong></div>
        <RenderEditorJs data={data?.playToEarnModel} index={'playToEarnModel'}/>
      </>
      }

      { isEmptyDataParse(data?.highlightFeatures) && <>
        <div className="max-w-[740px] mx-auto mt-16 text-2xl uppercase mb-4 font-mechanic"><strong>Highlight Features</strong></div>
        <RenderEditorJs data={data?.highlightFeatures} index={'highlightFeatures'}/>
      </>
      }

      { isEmptyDataParse(data?.roadmap) && <>
        <div className="max-w-[740px] mx-auto mt-16 text-2xl uppercase mb-4 font-mechanic"><strong>Roadmap</strong></div>
        <RenderEditorJs data={data?.roadmap} index={'roadmap'}/>
      </>
      }

      { !!data?.backers?.length && <>
        <div className="mt-16 text-2xl uppercase mb-4 font-mechanic"><strong>Backers</strong></div>
        <div className='grid grid-cols-3 md:grid-cols-4 gap-5'>
          { data?.backers?.map((e, i) => {
            const url = get(e, 'attributes.logo.data.attributes.url', '/')

            return (
              <Link key={i} href={get(e, 'attributes.link') || get(e, 'attributes.twitter')}>
                <a className="w-full md:py-9 md:px-7 grayscale hover:grayscale-0 hover:cursor-pointer" target="_blank">
                  <div className='w-full aspect-[16/9] relative '>
                    <Image alt="" key={i} src={imageCMS(url)} layout="fill" objectFit="contain"/>
                  </div>
                </a>
              </Link>
            )
          })}
        </div>
      </> }

      { !!data?.advisor?.length && <>
        <div className="mt-16 text-2xl uppercase mb-4 font-mechanic"><strong>Advisors</strong></div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-7'>
          { data?.advisor?.map((e, i) => {
            const url = get(e, 'avatar.data.attributes.url', false)
            const image = url ? imageCMS(url) : avatar

            if (showImageAdvisors) {
              return (
                <div key={i} className='grid sm:grid-cols-2 gap-5'>
                  <div className='w-full aspect-1 relative'>
                    <Image alt="" key={i} src={image} layout="fill" objectFit="contain" onError={() => setShowImageAdvisors(showImage(data?.advisor, true))}/>
                  </div>
                  <div className='flex flex-col'>
                    <strong className='flex justify-center sm:justify-start'>{e?.name}</strong>
                    <p>{e?.desc}</p>
                    <div className="inline-flex gap-6 justify-end my-4 md:mr-auto">
                      {e?.twitter && <a href={e?.twitter} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 2C15.4 2.3 14.8 2.4 14.1 2.5C14.8 2.1 15.3 1.5 15.5 0.7C14.9 1.1 14.2 1.3 13.4 1.5C12.8 0.9 11.9 0.5 11 0.5C9.3 0.5 7.8 2 7.8 3.8C7.8 4.1 7.8 4.3 7.9 4.5C5.2 4.4 2.7 3.1 1.1 1.1C0.8 1.6 0.7 2.1 0.7 2.8C0.7 3.9 1.3 4.9 2.2 5.5C1.7 5.5 1.2 5.3 0.7 5.1C0.7 6.7 1.8 8 3.3 8.3C3 8.4 2.7 8.4 2.4 8.4C2.2 8.4 2 8.4 1.8 8.3C2.2 9.6 3.4 10.6 4.9 10.6C3.8 11.5 2.4 12 0.8 12C0.5 12 0.3 12 0 12C1.5 12.9 3.2 13.5 5 13.5C11 13.5 14.3 8.5 14.3 4.2C14.3 4.1 14.3 3.9 14.3 3.8C15 3.3 15.6 2.7 16 2Z" fill="white"/>
                        </svg>
                      </a>}
                      {e?.linkedIn && <a href={e?.linkedIn} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.3 0H0.7C0.3 0 0 0.3 0 0.7V15.4C0 15.7 0.3 16 0.7 16H15.4C15.8 16 16.1 15.7 16.1 15.3V0.7C16 0.3 15.7 0 15.3 0ZM4.7 13.6H2.4V6H4.8V13.6H4.7ZM3.6 5C2.8 5 2.2 4.3 2.2 3.6C2.2 2.8 2.8 2.2 3.6 2.2C4.4 2.2 5 2.8 5 3.6C4.9 4.3 4.3 5 3.6 5ZM13.6 13.6H11.2V9.9C11.2 9 11.2 7.9 10 7.9C8.8 7.9 8.6 8.9 8.6 9.9V13.7H6.2V6H8.5V7C8.8 6.4 9.6 5.8 10.7 5.8C13.1 5.8 13.5 7.4 13.5 9.4V13.6H13.6Z" fill="white"/>
                        </svg>
                      </a>}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div key={i} className='flex flex-col px-6 py-4 bg-[#262A37]'>
                <span className='font-semibold text-base'>{e?.name}</span>
                <span className='mt-4'>{e?.desc}</span>
                <div className="inline-flex gap-6 justify-end mt-6 mr-auto">
                  {e?.twitter && <a href={e?.twitter} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 2C15.4 2.3 14.8 2.4 14.1 2.5C14.8 2.1 15.3 1.5 15.5 0.7C14.9 1.1 14.2 1.3 13.4 1.5C12.8 0.9 11.9 0.5 11 0.5C9.3 0.5 7.8 2 7.8 3.8C7.8 4.1 7.8 4.3 7.9 4.5C5.2 4.4 2.7 3.1 1.1 1.1C0.8 1.6 0.7 2.1 0.7 2.8C0.7 3.9 1.3 4.9 2.2 5.5C1.7 5.5 1.2 5.3 0.7 5.1C0.7 6.7 1.8 8 3.3 8.3C3 8.4 2.7 8.4 2.4 8.4C2.2 8.4 2 8.4 1.8 8.3C2.2 9.6 3.4 10.6 4.9 10.6C3.8 11.5 2.4 12 0.8 12C0.5 12 0.3 12 0 12C1.5 12.9 3.2 13.5 5 13.5C11 13.5 14.3 8.5 14.3 4.2C14.3 4.1 14.3 3.9 14.3 3.8C15 3.3 15.6 2.7 16 2Z" fill="white"/>
                    </svg>
                  </a>}
                  {e?.linkedIn && <a href={e?.linkedIn} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.3 0H0.7C0.3 0 0 0.3 0 0.7V15.4C0 15.7 0.3 16 0.7 16H15.4C15.8 16 16.1 15.7 16.1 15.3V0.7C16 0.3 15.7 0 15.3 0ZM4.7 13.6H2.4V6H4.8V13.6H4.7ZM3.6 5C2.8 5 2.2 4.3 2.2 3.6C2.2 2.8 2.8 2.2 3.6 2.2C4.4 2.2 5 2.8 5 3.6C4.9 4.3 4.3 5 3.6 5ZM13.6 13.6H11.2V9.9C11.2 9 11.2 7.9 10 7.9C8.8 7.9 8.6 8.9 8.6 9.9V13.7H6.2V6H8.5V7C8.8 6.4 9.6 5.8 10.7 5.8C13.1 5.8 13.5 7.4 13.5 9.4V13.6H13.6Z" fill="white"/>
                    </svg>
                  </a>}
                </div>
              </div>
            )
          })}
        </div>
      </> }

      { !!data?.studio?.[0]?.teamMembers?.length && <>
        <div className="mt-16 text-2xl uppercase mb-4 font-mechanic"><strong>Team members</strong></div>
        <div className={`grid md:grid-cols-3 ${showImageStudio ? 'md:grid-cols-5' : 'md:grid-cols-3'}  gap-5`}>
          { data?.studio?.[0]?.teamMembers?.map((e, i) => {
            const url = get(e, 'avatar.data.attributes.url', false)
            const image = url ? imageCMS(url) : avatar
            const linkIn = get(e, 'link', false)

            if (showImageStudio) {
              if (linkIn) {
                return (
                  <div key={i} className='flex flex-col items-center'>
                    <div className='w-full aspect-1 relative mb-4'>
                      <Link href={linkIn} passHref>
                        <a className='cursor-pointer' target="_blank">
                          <Image alt="" key={i} src={image} layout="fill" objectFit="contain" onError={() => setShowImageStudio(showImage(data?.advisor, true))}/>
                        </a>
                      </Link>
                    </div>
                    <Link href={linkIn} passHref>
                      <a className='cursor-pointer' target="_blank">
                        <span className='text-center capitalize'>{e?.name}</span>
                      </a>
                    </Link>
                    <span className='opacity-80 capitalize mt-2'>{e?.position}</span>
                  </div>
                )
              }
              return (
                <div key={i} className='flex flex-col items-center'>
                  <div className='w-full aspect-1 relative mb-4'>
                    <Image alt="" key={i} src={image} layout="fill" objectFit="contain" onError={() => setShowImageStudio(showImage(data?.advisor, true))}/>
                  </div>
                  <span className='text-center capitalize'>{e?.name}</span>
                  <span className='opacity-80 capitalize mt-2'>{e?.position}</span>
                </div>
              )
            }

            if (linkIn) {
              return (
                <div className='flex flex-col px-6 py-4 bg-[#262A37]'>
                  <Link key={i} href={linkIn} passHref>
                    <a className='cursor-pointer' target="_blank">
                      <span className='font-semibold text-base'>{e?.name}</span>
                    </a>
                  </Link>
                  <span className='font-medium text-sm mt-2'>{e?.position}</span>
                  <span className='mt-4'>{e?.desc}</span>
                </div>
              )
            }

            return (
              <div key={i} className='flex flex-col px-6 py-4 bg-[#262A37]'>
                <span className='font-semibold text-base'>{e?.name}</span>
                <span className='font-medium text-sm mt-2'>{e?.position}</span>
                <span className='mt-4'>{e?.desc}</span>
              </div>
            )
          })}
        </div>
      </>
      }
    </>
  )
}

export default GameInfo
