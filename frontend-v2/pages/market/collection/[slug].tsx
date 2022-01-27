import Layout from 'components/Layout'
import { fetchOneCollection } from 'pages/api/market/collection/[slug]'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Discover from 'components/Pages/Market/Discover'

const CollectionDetail = ({ data }) => {
  console.log(data)
  return (
    <Layout title="Market - GameFi">
      {data?.id
        ? <div className="container w-full mx-auto">
          <div className="relative w-full mt-14 rounded-xs flex" style={{ height: '300px' }}>
            <img src={data?.default_image} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></img>
            <img src={data?.logo} alt="logo" className="absolute -bottom-8 w-20 h-20 left-0 right-0 mx-auto border-4 border-gamefiDark-900 rounded-full"></img>
          </div>
          <div className="w-full text-center font-bold text-2xl mt-14">{data?.name}</div>
          <div className="w-full flex items-center justify-center mt-4">
            <div className="mr-4">
              <a href={data?.website || '#'} target="_blank" rel="noopener noreferrer">
                <Image src={require('assets/images/icons/website.svg')} alt="website"></Image>
              </a>
            </div>
            <div className="mr-4">
              <a href={data?.telegram || '#'} target="_blank" rel="noopener noreferrer">
                <Image src={require('assets/images/icons/telegram.svg')} alt="telegram"></Image>
              </a>
            </div>
            <div className="mr-4">
              <a href={data?.twitter || '#'} target="_blank" rel="noopener noreferrer">
                <Image src={require('assets/images/icons/twitter.svg')} alt="twitter"></Image>
              </a>
            </div>
            <div>
              <a href={data?.medium || '#'} target="_blank" rel="noopener noreferrer">
                <Image src={require('assets/images/icons/medium.svg')} alt="medium"></Image>
              </a>
            </div>
          </div>
          <div className="w-full text-center font-medium mt-6">{data?.description}</div>
          <div className="w-full mt-14">
            <Discover></Discover>
          </div>
        </div>
        : <div className="container w-full mx-auto flex items-center justify-center uppercase font-bold text-3xl" style={{ height: 'calc(100vh - 400px)' }}>Collection Not Found!</div>}
    </Layout>
  )
}

export async function getServerSideProps ({ params }) {
  if (!params?.slug) {
    return { props: { data: {} } }
  }

  const data = await fetchOneCollection(params.slug)

  if (!data.data) {
    return { props: { data: {} } }
  }

  return { props: { data: data.data } }
}

export default CollectionDetail
