import Layout from 'components/Layout'
import Image from 'next/image'

const Metaverse = () => (
  <Layout title="GameFi Metaverse">
    <div className="relative w-full min-h-full">
      <div className="container absolute top-20 left-0 right-0 mx-auto opacity-50 flex items-center justify-center" style={{ zIndex: '1' }}>
        <Image src={require('assets/images/coming-soon.png')} alt=""></Image>
      </div>
      <div className="container absolute top-48 left-0 right-0 mx-auto uppercase text-center font-bold" style={{ fontSize: '50px', lineHeight: '1', zIndex: '2' }}>
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
