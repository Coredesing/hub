import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  items?: any[];
  likes?: any[];
}

const GameFiCarousel = ({ items, likes }: Props) => {
  const getLikeById = (id: any) => {
    return likes && likes.find(item => item.game_id === id)
  }

  return <div className="container mx-auto hidden lg:flex lg:flex-col items-center justify-center pl-40 pr-32 mt-14">
    <div className="relative flex w-full items-stretch">
      {/* Start layout */}
      <div className="absolute top-[27px] -left-[143px]">
        <svg width="143" height="1" viewBox="0 0 143 1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="143" height="1.00001" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 143 1.52588e-05)" fill="url(#paint0_linear_1461_2150)"/>
          <defs>
            <linearGradient id="paint0_linear_1461_2150" x1="-2.41011e-10" y1="1.00388" x2="184.5" y2="1.00389" gradientUnits="userSpaceOnUse">
              <stop stopColor="#485068"/>
              <stop offset="1" stopColor="#1A1E29" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[197px] xl:left-[364px] -top-[35px]">
        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="51.2248" height="1.00001" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 0.707031 36.8234)" fill="url(#paint0_linear_1461_2115)"/>
          <defs>
            <linearGradient id="paint0_linear_1461_2115" x1="0" y1="1.00388" x2="66.0907" y2="1.00388" gradientUnits="userSpaceOnUse">
              <stop stopColor="#485068"/>
              <stop offset="1" stopColor="#1A1E29" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute top-0 left-0 w-[200px] xl:w-[367px] bg-gamefiDark-900 h-[28px] tracking-widest text-xs uppercase font-semibold z-[1]" style={{
        marginTop: '-1px',
        marginLeft: '-1px',
        clipPath: 'polygon(0 0, 100% 0%, calc(100% - 28px) 100%, 0% 100%)'
      }}><span className="text-gamefiGreen-700">Featured</span> Games</div>
      <div className="absolute -top-[25px] left-[438px] xl:left-[588px] 2xl:left-[735px]">
        <svg width="457" height="25" viewBox="0 0 457 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M24.2349 1L0.707107 24.5569L0 23.8498L23.8498 0H24.0001H457V1H24.2349Z" fill="url(#paint0_linear_1461_2146)"/>
          <defs>
            <linearGradient id="paint0_linear_1461_2146" x1="36.0023" y1="1.03921" x2="329.137" y2="-18.9666" gradientUnits="userSpaceOnUse">
              <stop stopColor="#485068"/>
              <stop offset="1" stopColor="#1A1E29" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-0 left-[438px] xl:left-[588px] 2xl:left-[735px]">
        <svg width="433" height="1" viewBox="0 0 433 1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="433" height="1" transform="matrix(1 0 0 -1 0 1)" fill="url(#paint0_linear_1461_2145)"/>
          <defs>
            <linearGradient id="paint0_linear_1461_2145" x1="-1.18707e-05" y1="0.995927" x2="433" y2="0.00400263" gradientUnits="userSpaceOnUse">
              <stop stopColor="#485068"/>
              <stop offset="1" stopColor="#1A1E29" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* End layout */}

      {/* Start navigation */}
      <div className="absolute -left-[70px] top-[50px] cursor-pointer select-none">
        <div className="hidden 2xl:block"><Image src={require('@/assets/images/icons/arrow-left.png')} alt="" width={32} height={300}></Image></div>
        <div className="hidden xl:block 2xl:hidden"><Image src={require('@/assets/images/icons/arrow-left.png')} width={28} height={233} alt="" className="object-cover"></Image></div>
        <div className="block xl:hidden"><Image src={require('@/assets/images/icons/arrow-left.png')} alt="" width={20} height={180} className="object-cover"></Image></div>
      </div>

      <div className="absolute -right-[40px] top-[50px] cursor-pointer select-none">
        <div className="hidden 2xl:block"><Image src={require('@/assets/images/icons/arrow-right.png')} alt="" width={32} height={300}></Image></div>
        <div className="hidden xl:block 2xl:hidden"><Image src={require('@/assets/images/icons/arrow-right.png')} width={28} height={233} alt="" className="object-cover"></Image></div>
        <div className="block xl:hidden"><Image src={require('@/assets/images/icons/arrow-right.png')} alt="" width={20} height={180} className="object-cover"></Image></div>
      </div>
      {/* End navigation */}

      <div className="overflow-hidden flex relative w-full">
        {items && items.map(item => (
          <div key={`game-${item.id}`} className="flex">
            <div className="clipped-t-r w-[450px] xl:w-[600px] 2xl:w-[747px]">
              <video className="clipped-t-r" style={{ aspectRatio: '16/9', objectFit: 'cover' }} muted controls poster={item.screen_shots_1}>
                <source src={item.intro_video} type="video/mp4"></source>
            Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex-1 w-[510px] pl-8 pr-[200px] py-4">
              <div className="lg:text-lg xl:text-xl 2xl:text-3xl font-bold uppercase text-left">{item.game_name}</div>
              <div className="flex align-middle items-center w-full mt-3 xl:mt-5">
                <div className="flex align-middle items-center text-sm">
                  <Image src={require('@/assets/images/icons/heart.svg')} alt="heart"/>
                  <p className="ml-2 tracking-widest text-gray-200">{getLikeById(item.id)?.total_like || 0}</p>
                </div>
                <div className="flex align-middle items-center ml-4 text-left">
                  <Image src={require('@/assets/images/icons/game-console.svg')} alt="game-console"/>
                  <p
                    className="ml-2 tracking-widest uppercase text-gray-200 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis text-left"
                    style={{ maxWidth: '180px' }}
                  >{item.developer}</p>
                </div>
              </div>
              <div className="mt-3 xl:mt-5">
                <p className="font-casual text-left font-light leading-5 md:text-xs lg:text-sm text-gray-300 max-h-24 2xl:max-h-32 overflow-y-scroll">{item.short_description}</p>
              </div>
              <div className="mt-6 xl:mt-10">
                <Link href={`/hub/${item?.slug}`} passHref>
                  <div className="bg-gamefiGreen-600 text-gamefiDark-900 py-2 px-6 rounded-xs clipped-t-r hover:opacity-90 w-36 cursor-pointer">
                    <a className="flex align-middle items-center">
                      <div className="mr-2 uppercase font-bold text-xs">View more</div>
                      <Image src={require('@/assets/images/icons/arrow-right-dark.svg')} alt="right" />
                    </a>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Start thumbs */}
    <div className="flex mt-4">
      {items && items.map(item => <div key={`thumb-${item.id}`} className="w-full h-full border border-transparent hover:border-gamefiGreen-600 cursor-pointer p-[2px]">
        <img src={item.screen_shots_1} className="w-full aspect-[16/9]" alt=""></img>
      </div>)}
    </div>
    {/* End thumbs */}
  </div>
}

export default GameFiCarousel
