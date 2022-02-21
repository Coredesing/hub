import React from 'react'
import Layout from '@/components/Layout'
import useGetPoolDetail from '@/hooks/useGetPoolDetail'
import AuctionDetail from '@/components/Pages/INO/AuctionDetail'
import MysteryBoxDetail from '@/components/Pages/INO/MysteryBoxDetail'
import { isAuctionBox, isMysteryBox } from '@/components/Pages/INO/utils'
import LoadingOverlay from '@/components/Base/LoadingOverlay'
import NotFound from '@/components/Pages/Notfound'

const AuctionBox = (props: any) => {
  const { loading, poolInfo } = useGetPoolDetail({ id: props?.id })
  const renderContent = () => {
    if (isAuctionBox(poolInfo.process)) {
      return <AuctionDetail poolInfo={poolInfo} />
    }
    if (isMysteryBox(poolInfo.token_type)) {
      return <MysteryBoxDetail poolInfo={poolInfo} />
    }
    return <NotFound backLink='/ino' />
  }
  return <Layout title="GameFi INO">
    {
      loading
        ? <>
          <LoadingOverlay loading></LoadingOverlay>
          <div className='h-52 w-full'></div>
        </>
        : (
          !poolInfo
            ? <NotFound backLink='/ino' />
            : renderContent()
        )
    }
  </Layout>
}

export default AuctionBox

export function getServerSideProps ({ params }) {
  if (!params?.id) {
    return { props: { id: '' } }
  }

  return { props: { id: params.id } }
}
