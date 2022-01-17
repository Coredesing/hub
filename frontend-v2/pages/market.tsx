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
    </div>
  </Layout>
)

export default Market
