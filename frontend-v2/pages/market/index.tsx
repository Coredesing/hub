import React from 'react'
import Layout from '@/components/Layout'
import Image from 'next/image'
import HotCollections from '@/components/Pages/Market/HotCollections'
// import HotAuctions from '@/components/Pages/Market/HotAuctions'
import ListTrending from '@/components/Pages/Market/ListTrending'
import Discover from '@/components/Pages/Market/Discover'
// import { useScreens } from '@/components/Pages/Home/utils'

const Market = () => {
  // const screens = useScreens()
  return (
    <Layout title="GameFi Market">
      {
        // screens.mobile || screens.tablet
        //   ? <div className="relative w-full min-h-full">
        //     <div className="container absolute top-20 left-0 right-0 mx-auto opacity-50 flex items-center justify-center" style={{ zIndex: '1' }}>
        //       <Image src={require('@/assets/images/coming-soon.png')} alt=""></Image>
        //     </div>
        //     <div className="container absolute flex items-center justify-center top-12 left-0 right-0 mx-auto uppercase text-center font-bold" style={{ fontSize: '50px', lineHeight: '1', zIndex: '2' }}>
        //     Marketplace <br></br>Coming Soon
        //     </div>
        //     <Image
        //       src={require('@/assets/images/market-banner.png')}
        //       alt=""
        //       layout="fill"
        //       objectFit="cover"
        //       className="mt-48"
        //     ></Image>
        //   </div> : 
        <div className="relative w-full min-h-full pt-28">
          <div
            className="absolute top-0 right-0"
            style={{
              background: 'radial-gradient(74.55% 74.55% at 19.72% 25.45%, #C5BD06 0%, #00FF0A 100%)',
              width: '250px',
              height: '559px',
              opacity: '0.1',
              filter: 'blur(184px)'
            }}
          ></div>
          <div className="absolute bottom-0 right-0">
            <Image src={require('@/assets/images/bg-item-market.png')} width="221" height="247" alt=""></Image>
          </div>
          {/* <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
            <Image src={require('@/assets/images/market-coming-soon.png')} alt="" className="-z-0"></Image>
          </div> */}
          <HotCollections></HotCollections>
          {/* <HotAuctions></HotAuctions> */}
          <ListTrending></ListTrending>
          <Discover></Discover>
        </div>
      }
    </Layout>
  )
}

export default Market
