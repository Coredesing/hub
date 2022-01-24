import Layout from 'components/Layout'
import Image from 'next/image'

const Metaverse = () => (
  <Layout title="GameFi Metaverse">
    <div className="relative w-full min-h-full">
      <div className="container absolute top-20 left-0 right-0 mx-auto z-10 opacity-50">
        <Image src={require('assets/images/coming-soon.png')} alt=""></Image>
      </div>
      <div className="container absolute top-52 left-0 right-0 mx-auto z-20 uppercase text-center font-bold" style={{ fontSize: '84px', lineHeight: '80%' }}>
        Metaverse <br></br>Coming Soon
      </div>
      <Image
        src={require('assets/images/metaverse-background.png')}
        alt=""
        layout="fill"
        objectFit="cover"
      ></Image>
    </div>
  </Layout>
)

export default Metaverse
