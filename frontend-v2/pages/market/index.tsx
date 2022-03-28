import React from 'react'
import Layout from '@/components/Layout'
import Image from 'next/image'
import HotCollections from '@/components/Pages/Market/HotCollections'
// import HotAuctions from '@/components/Pages/Market/HotAuctions'
import ListTrending from '@/components/Pages/Market/ListTrending'
import Discover from '@/components/Pages/Market/Discover'
// import Banner from '@/components/Pages/Market/Banner'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import { ObjectType } from '@/utils/types'
import TopCollections from '@/components/Pages/Market/TopCollections'

// import { useScreens } from '@/components/Pages/Home/utils'

const Market = ({ topCollections }: { topCollections: ObjectType[] }) => {
  // const screens = useScreens()
  return (
    <Layout title="GameFi Market">
      {
        <div className="relative w-full min-h-full">
          {/* <Banner /> */}
          <TopCollections items={topCollections} />
          {/* {
            !!topCollections?.length && topCollections.map((item) => <div>
              <img src="" alt="" />
              <div className="info">
                <div className="icon">
                  <GamefiIcon />
                  <RelatingIcon />
                  <div style={{ textAlign: 'left' }}>
                    <img src={item.logo} width="60" height="53" style={{ objectFit: 'contain' }} alt="" />
                  </div>
                </div>
                <div className="title firs-neue-font">
                  {item.title}
                </div>
              </div>
            </div>)
          } */}
          <div
            className="absolute top-0 right-0 md:h-96 md:w-72 h-60 w-28"
            style={{
              background: 'radial-gradient(74.55% 74.55% at 19.72% 25.45%, #C5BD06 0%, #00FF0A 100%)',
              opacity: '0.1',
              filter: 'blur(84px)'
            }}
          ></div>
          <div className="absolute bottom-0 right-0">
            <Image src={require('@/assets/images/bg-item-market.png')} width="221" height="247" alt=""></Image>
          </div>
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

export const getServerSideProps = async () => {
  try {
    const data = await fetcher(`${API_BASE_URL}/marketplace/first-edition-collections`)
    return {
      props: {
        topCollections: data?.data || []
      }
    }
  } catch (error) {
    console.log('error', error)
    return {
      props: {}
    }
  }
}
