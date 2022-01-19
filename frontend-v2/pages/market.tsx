import ListSwiper, { SwiperItem } from 'components/Base/ListSwiper'
import Layout from 'components/Layout'
import Image from 'next/image'

const Market = () => (
  <Layout title="GameFi Market">
    <div className="relative w-full min-h-full">
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
        <Image src={require('assets/images/bg-item-market.png')} width="221" height="247" alt=""></Image>
      </div>
      <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
        <Image src={require('assets/images/market-banner.png')} alt=""></Image>
      </div>
      <div>
        <div className="md:px-4 lg:px-16 md:container mx-auto mt-20 pb-14">
          <ListSwiper showItemsNumber={4} step={4} transition='0.5s'>
            <SwiperItem>
              <div className="border border-gamefiGreen-50" style={{ height: '236px' }}>1</div>
            </SwiperItem>
            <SwiperItem>2</SwiperItem>
            <SwiperItem>3</SwiperItem>
            <SwiperItem>4</SwiperItem>
            <SwiperItem>5</SwiperItem>
            <SwiperItem>6</SwiperItem>
            <SwiperItem>7</SwiperItem>
            <SwiperItem>8</SwiperItem>
            <SwiperItem>9</SwiperItem>
            <SwiperItem>10</SwiperItem>
          </ListSwiper>
        </div>
      </div>
    </div>
  </Layout>
)

export default Market
