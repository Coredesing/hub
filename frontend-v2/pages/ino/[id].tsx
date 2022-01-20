import React from 'react'
import Layout from 'components/Layout'
import { GetStaticProps } from 'next'
import useGetPoolDetail from '@/hooks/useGetPoolDetail'
import AuctionDetail from 'components/Pages/INO/AuctionDetail'
import MysteryBoxDetail from 'components/Pages/INO/MysteryBoxDetail'
import { isAuctionBox, isMysteryBox } from 'components/Pages/INO/utils'

const AuctionBox = (props: any) => {
  const { params } = props
  const { loading, poolInfo } = useGetPoolDetail({ id: params?.id })
  const renderContent = () => {
    if (isAuctionBox(poolInfo.process)) {
      return <AuctionDetail poolInfo={poolInfo} />
    }
    if (isMysteryBox(poolInfo.token_type)) {
      return <MysteryBoxDetail poolInfo={poolInfo} />
    }
  }
  return <Layout title="GameFi Aggregator">
        {
            loading
              ? <h1 className="text-white">Loading...</h1>
              : (
                  !poolInfo
                    ? <h1 className="text-white">Page not found</h1>
                    : renderContent()
                )
        }
    </Layout>
}

export default AuctionBox

export async function getStaticPaths () {
  return {
    paths: [
      { params: { id: '' } }
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    return {
      props: { params: context.params }
    }
  } catch (error) {
    return { props: {} }
  }
}
