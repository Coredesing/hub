import Layout from '@/components/Layout'
import React from 'react'
import MarketplaceDetail from '@/components/Pages/INO/MarketplaceDetail'
import { fetchOneCollection } from '@/pages/api/market/collection/[slug]'
import LoadingOverlay from '@/components/Base/LoadingOverlay'
import NotFound from '@/components/Pages/Notfound'
import { useNFTInfo } from '@/components/Pages/Market/utils'

const MarketplaceDetailPage = ({ projectInfo, params }: any) => {

  const {loading, tokenInfo} = useNFTInfo(projectInfo, params.id)

  return <Layout title="GameFi Market">
    {
      loading
        ? <LoadingOverlay loading></LoadingOverlay>
        : (
          !projectInfo || !tokenInfo
            ? <NotFound backLink='/market' />
            : <MarketplaceDetail projectInfo={projectInfo} tokenInfo={tokenInfo} />
        )
    }
  </Layout>
}

export default MarketplaceDetailPage

export async function getServerSideProps({ params }) {
  if (!params?.slug) {
    return { props: { projectInfo: null } }
  }
  if (!params?.id) {
    return { props: { projectInfo: null } }
  }
  const data = await fetchOneCollection(params.slug)
  if (!data?.data) {
    return { props: { projectInfo: null } }
  }

  return { props: { projectInfo: data.data, params } }
}
