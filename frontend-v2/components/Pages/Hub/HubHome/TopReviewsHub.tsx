import React, { useState, useEffect, useRef } from 'react'
import get from 'lodash.get'
import Image from 'next/image'
import { imageCMS, fetcher, shorten } from '@/utils'
import isEmpty from 'lodash.isempty'
import Avatar from '@/components/Pages/Hub/Reviews/Avatar'
import clsx from 'clsx'
import Link from 'next/link'
import { nFormatter } from '@/components/Pages/Hub/utils'
import { normalize } from '@/graphql/utils'
import { Pagination } from '@egjs/flicking-plugins'
import { useScreens } from '@/components/Pages/Home/utils'
import Flicking, { ViewportSlot } from '@egjs/react-flicking'
import HubTitle from '../HubTitle'

const STARS = [1, 2, 3, 4, 5]

function Star ({ hightLight, halfSar }) {
  return halfSar
    ? (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" >
        <g clipPath="url(#clip0_3831_4653)">
          <path d="M13.251 4.75881L9.47452 4.21019L7.7849 0.788063C7.48915 0.190437 6.5109 0.190437 6.21515 0.788063L4.5264 4.21019L0.749023 4.75881C0.0341484 4.86294 -0.255477 5.74494 0.264273 6.25244L2.99777 8.91594L2.3529 12.6776C2.23127 13.3898 2.98027 13.9367 3.62252 13.5998L7.00002 11.8244L10.3784 13.6007C11.0154 13.9341 11.7705 13.3959 11.648 12.6784L11.0031 8.91681L13.7366 6.25331C14.2555 5.74494 13.9659 4.86294 13.251 4.75881Z" fill="#3E4251" />
          <mask id="mask0_3831_4653" maskUnits="userSpaceOnUse" x="0" y="0" width="7" height="14">
            <rect width="7" height="14" fill="#C4C4C4" />
          </mask>
          <g mask="url(#mask0_3831_4653)">
            <path d="M13.251 4.75881L9.47452 4.21019L7.7849 0.788063C7.48915 0.190437 6.5109 0.190437 6.21515 0.788063L4.5264 4.21019L0.749023 4.75881C0.0341484 4.86294 -0.255477 5.74494 0.264273 6.25244L2.99777 8.91594L2.3529 12.6776C2.23127 13.3898 2.98027 13.9367 3.62252 13.5998L7.00002 11.8244L10.3784 13.6007C11.0154 13.9341 11.7705 13.3959 11.648 12.6784L11.0031 8.91681L13.7366 6.25331C14.2555 5.74494 13.9659 4.86294 13.251 4.75881Z" fill="#FFB800" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_3831_4653">
            <rect width="14" height="14" fill="white" />
          </clipPath>
        </defs>
      </svg>
    )
    : (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill={hightLight ? '#FFB800' : '#6E6E79'} strokeMiterlimit="10" d="M13.251 4.75881L9.47452 4.21019L7.7849 0.788063C7.48915 0.190437 6.5109 0.190437 6.21515 0.788063L4.5264 4.21019L0.749023 4.75881C0.0341484 4.86294 -0.255477 5.74494 0.264273 6.25244L2.99777 8.91594L2.3529 12.6776C2.23127 13.3898 2.98027 13.9367 3.62252 13.5998L7.00002 11.8244L10.3784 13.6007C11.0154 13.9341 11.7705 13.3959 11.648 12.6784L11.0031 8.91681L13.7366 6.25331C14.2555 5.74494 13.9659 4.86294 13.251 4.75881Z" />
      </svg>

    )
}

export default function TopReviewsHub () {
  const [data, setData] = useState([])
  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ]

  const [plugins] = useState([
    [new Pagination({
      type: 'bullet',
      renderBullet: () => {
        return '<div class="h-[2px] w-[64px] bg-gamefiDark-400"></div>'
      }
    })],
    [new Pagination({
      type: 'bullet',
      renderBullet: () => {
        return '<div class="h-[2px] w-[64px] bg-gamefiDark-400"></div>'
      }
    })],
    [new Pagination({
      type: 'bullet',
      renderBullet: () => {
        return '<div class="h-[2px] w-[64px] bg-gamefiDark-400"></div>'
      }
    })],
    [new Pagination({
      type: 'bullet',
      renderBullet: () => {
        return '<div class="h-[2px] w-[64px] bg-gamefiDark-400"></div>'
      }
    })]
  ])

  const screens = useScreens()
  useEffect(() => {
    fetcher('/api/hub/home', { method: 'POST', body: JSON.stringify({ query: 'GET_REVIEWS_AGGREGATORS' }) }).then(({ data }) => {
      const aggregators = normalize(data?.aggregators?.data)
      setData(aggregators.map((v: { slug: any; id: any }, i: number) => {
        const reviews = get(v, 'reviews', []).map(d => ({ ...d, rate: d?.author?.rates?.find(t => t.aggregator?.slug === v.slug)?.rate }))
        const value = { ...v, reviews, id: v.id, ref: refs[i], plugins: plugins[i], url: imageCMS(get(v, 'verticalThumbnail.url')) }
        return value
      }) || [])
    }).catch((err) => console.debug('err', err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const prev = (ref) => () => {
    if (!ref.current) {
      return
    }

    ref.current.prev().catch(() => { })
  }
  const next = (ref) => () => {
    if (!ref.current) {
      return
    }

    ref.current.next().catch((e) => console.debug(e))
  }

  const groupButton = (className, ref) => (
    <div className={className}>
      <div className="mr-1">
        <Image src={require('@/assets/images/hub/back.png')} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={prev(ref)} />
      </div>
      <div className="" >
        <Image src={require('@/assets/images/hub/next.png')} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={next(ref)} />
      </div>
    </div>
  )

  return (
    <div className="mb-6">
      {!isEmpty(data) && < HubTitle title="Top Review" source="review" />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-5 mb-6">
        {!isEmpty(data)
          ? data.map(item => (
            <div
              // style={{
              //   background: 'linear-gradient(90.68deg, #292C36 55.27%, rgba(41, 44, 54, 0) 99.82%)'
              // }}
              key={`TopReviewsHub-${item.id}`}
              className=" overflow-hidden group">
              <div className="h-full bg-gamefiDark-630/30 group-hover:bg-[#292C36] rounded w-full flex flex-col xl:flex-row items-stretch justify-between gap-3 font-casual">
                <div className="h-full relative">
                  <a href={`/hub/${item?.slug}`} className="w-full bg-black h-full">
                    <div
                      className="absolute z-10 h-1/4 w-full items-center bottom-0 left-0 pt-2 flex justify-center"
                      style={{ background: 'linear-gradient(180deg, rgba(41, 44, 54, 0) 0%, #292C36 68.84%)' }}
                    >
                      <div className="inline-flex pt-3 font-casual text-[13px] font-medium text-white/60">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.5 1.5H1.5C1.23478 1.5 0.98043 1.60536 0.792893 1.79289C0.605357 1.98043 0.5 2.23478 0.5 2.5V10.5C0.5 10.7652 0.605357 11.0196 0.792893 11.2071C0.98043 11.3946 1.23478 11.5 1.5 11.5H4.5V15.5L9.167 11.5H14.5C14.7652 11.5 15.0196 11.3946 15.2071 11.2071C15.3946 11.0196 15.5 10.7652 15.5 10.5V2.5C15.5 2.23478 15.3946 1.98043 15.2071 1.79289C15.0196 1.60536 14.7652 1.5 14.5 1.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M2.5 8.5H8.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M11.5 8.5H13.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="pl-3 pr-1">{nFormatter(item.totalReviews)}</span>
                      Reviews
                      </div>
                    </div>
                    <div className="xl:h-[280px] 2xl:h-[322px] xl:min-w-[234px] relative">
                      <img src={item.url} alt="" className="w-full h-full aspect-[16/9] md:aspect-[234/322] object-cover rounded-sm"></img>
                    </div>
                  </a>
                </div>

                {/* <div className=""> */}
                <div className="flex-1 flex flex-col p-5 md:pt-2 pr-2 md:pb-5 relative">
                  {groupButton('justify-end hidden md:flex', item.ref)}
                  <Link href={`/hub/${item.slug}`} passHref>
                    <a className="group-hover:text-gamefiGreen-700 text-white/60 font-semibold text-[15px] mb-3">
                      {item.name}
                    </a>
                  </Link>
                  <div className={clsx(screens['2xl'] ? 'xl:max-w-[350px]' : 'xl:max-w-[290px]')}>
                    {/* <div className="xl:max-w-[290px] 3xl:max-w-[350px]"> */}
                    <Flicking circular={true} key={`ReviewsHub-${item.id}`} plugins={item.plugins} ref={item.ref} align="center" interruptable={true}>
                      {item.reviews.map(v => {
                        const rate = get(v, 'rate')
                        return <div
                          className="w-full  pb-12"
                          key={`commnent-${item.id}-${v.id}`}
                        >
                          <div className="whitespace-pre-line">

                            <a href={`/hub/${get(item, 'slug')}/reviews/${get(v, 'id')}`}
                              className="text-xl mb-4 font-normal 2xl:line-clamp-4 line-clamp-3 hover:underline"
                            >
                              {get(v, 'review') || ''}
                            </a>

                            <div className="flex mb-6">
                              <a href={`/user/${get(v, 'author.id')}`} className="w-11 h-11 mr-3">
                                <Avatar
                                  url={imageCMS(get(v, 'author.avatar.url'))}
                                  size={44}
                                  className="rounded-full"
                                />
                              </a>
                              <div className="flex flex-col justify-around">
                                <a href={`/user/${get(v, 'author.id')}`} className="font-semibold text-[13px]">{shorten(get(v, 'author.username'))}</a>
                                {
                                  rate
                                    ? <div className="flex">
                                      {STARS.map(v => (
                                        <div key={`RateAction-${v}`} className="mr-1">
                                          <Star halfSar={rate > v && Math.trunc(rate) === v} hightLight={rate >= v} />
                                        </div>
                                      ))}
                                    </div>
                                    : <div></div>
                                }
                              </div>
                            </div>

                            <div className="flex">
                              <div className="flex mr-5 items-center">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clipPath="url(#clip0_6342_5295)">
                                    <path d="M3.5 7.5H0.5V15.5H3.5V7.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5.5 15.5H12.4C12.855 15.4999 13.2963 15.3447 13.6512 15.06C14.0061 14.7753 14.2533 14.3781 14.352 13.934L15.463 8.934C15.5281 8.64133 15.5265 8.33778 15.4584 8.04579C15.3903 7.75381 15.2574 7.48088 15.0696 7.24717C14.8818 7.01347 14.6439 6.82498 14.3734 6.69565C14.1029 6.56632 13.8068 6.49945 13.507 6.5H9.5V2.5C9.5 1.96957 9.28929 1.46086 8.91421 1.08579C8.53914 0.710714 8.03043 0.5 7.5 0.5L5.5 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_6342_5295">
                                      <rect width="16" height="16" fill="white" />
                                    </clipPath>
                                  </defs>
                                </svg>
                                <span className="pl-3 text-[13px] font-medium text-white/60">{nFormatter(v.likeCount)}</span>
                              </div>
                              <div className="flex mr-5 items-center">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clipPath="url(#clip0_6342_5301)">
                                    <path d="M3.5 0.5H0.5V8.5H3.5V0.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5.5 0.5H12.4C12.855 0.500078 13.2963 0.655276 13.6512 0.939979C14.0061 1.22468 14.2533 1.62187 14.352 2.066L15.463 7.066C15.5281 7.35867 15.5265 7.66222 15.4584 7.95421C15.3903 8.24619 15.2574 8.51912 15.0696 8.75283C14.8818 8.98653 14.6439 9.17502 14.3734 9.30435C14.1029 9.43368 13.8068 9.50055 13.507 9.5H9.5V13.5C9.5 14.0304 9.28929 14.5391 8.91421 14.9142C8.53914 15.2893 8.03043 15.5 7.5 15.5L5.5 9.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_6342_5301">
                                      <rect width="16" height="16" fill="white" />
                                    </clipPath>
                                  </defs>
                                </svg>
                                <span className="pl-3 text-[13px] font-medium text-white/60">{nFormatter(v.dislikeCount)}</span>
                              </div>
                              <div className="flex mr-5 items-center">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14.5 1.5H1.5C0.948 1.5 0.5 1.948 0.5 2.5V10.5C0.5 11.052 0.948 11.5 1.5 11.5H4.5V15.5L9.167 11.5H14.5C15.052 11.5 15.5 11.052 15.5 10.5V2.5C15.5 1.948 15.052 1.5 14.5 1.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="pl-3 text-[13px] font-medium text-white/60">{nFormatter(v.commentCount)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      })}
                      <ViewportSlot>
                        <div className="flicking-pagination !relative flex items-center !bottom-3 md:!bottom-1 gap-1"></div>
                        <div></div>
                      </ViewportSlot>
                    </Flicking>
                  </div>
                  {groupButton('justify-end flex md:hidden absolute bottom-5 right-2 z-10', item.ref)}
                </div>
              </div>
            </div>
          ))
          : <></>}
      </div>
    </div>
  )
}
