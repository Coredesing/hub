import { useEffect } from 'react'
import { useRouter } from 'next/router'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import { callWidthGraphql } from '@/pages/api/hub/[slug]'
import { BackIcon } from '@/components/Base/Icon'
import HubProvider from '@/context/hubProvider'
import Layout from '@/components/Layout'
import ReviewCreate from '@/components/Base/Review/Create'

const Create = ({ data, notFound }) => {
  const router = useRouter()

  useEffect(() => {
    if (notFound) router.replace('/hub')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notFound])

  return (
    <Layout title="GameFi.org - Games" description="An ultimate gaming destination for gamers, investors, and other game studios.">
      <HubProvider>
        <div className="px-4 xl:p-16 2xl:px-36 container mx-auto lg:block">
          <a onClick={() => {
            router.back()
          }} className="inline-flex items-center text-[13px] font-casual mb-6 hover:text-gamefiGreen-500 cursor-pointer">
            <BackIcon />
            Back
          </a>
          <ReviewCreate data={data} currentResource="aggregator" />
        </div>
      </HubProvider>
    </Layout>
  )
}

export async function getServerSideProps ({ query }) {
  const { slug } = query

  try {
    const { data: allData } = await callWidthGraphql(slug)
    const detail = get(allData, 'aggregators.data[0]')

    if (isEmpty(detail)) {
      return { props: { data: {}, notFound: true } }
    }

    return { props: { data: { id: detail.id, ...detail.attributes } } }
  } catch (e) {
    return { props: { data: {} } }
  }
}

export default Create
