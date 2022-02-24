import Layout from '@/components/Layout'
import React from 'react'
import MarketplaceDetail from '@/components/Pages/INO/MarketplaceDetail'
import { fetchOneCollection } from '@/pages/api/market/collection/[slug]'
import AccountContent from '@/components/Pages/Account/AccountContent'
import NotFound from '@/components/Pages/Notfound'
import AccountLayout from '@/components/Pages/Account/AccountLayout'
import { PropagateLoader } from 'react-spinners'
import { useNFTInfo } from '@/components/Pages/Market/utils'

const MarketplaceDetailPage = ({ projectInfo, params }: any) => {
  
  const {loading, tokenInfo} = useNFTInfo(projectInfo, params.id)

  return <Layout title="GameFi Market">
    <AccountLayout>
      <AccountContent>
        {
          loading
            ? <div className='flex items-center w-full h-96 justify-center'><PropagateLoader color='#fff'></PropagateLoader></div>
            : (
              !projectInfo || !tokenInfo
                ? <NotFound backLink='' />
                : <MarketplaceDetail projectInfo={projectInfo} tokenInfo={tokenInfo} />
            )
        }
      </AccountContent>
    </AccountLayout>

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
