import { useRouter } from 'next/router'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import { callWidthGraphql } from '@/pages/api/hub/[slug]'
import { BackIcon } from '@/components/Base/Icon'
import Layout from '@/components/Layout'
import ReviewCreate from '@/components/Base/Review/Create'

const Create = ({ data }) => {
  const router = useRouter()

  return (
    <Layout title="GameFi.org - Games" description="An ultimate gaming destination for gamers, investors, and other game studios.">
      <div className="px-4 xl:p-16 2xl:px-36 container mx-auto lg:block">
        <a onClick={() => {
          router.back()
        }} className="inline-flex items-center text-[13px] font-casual mb-6 hover:text-gamefiGreen-500 cursor-pointer">
          <BackIcon/>
          Back
        </a>
        <ReviewCreate data={data} currentResource="aggregator" />
      </div>
    </Layout>
  )
}

export async function getServerSideProps ({ query }) {
  const { slug } = query

  try {
    const { data: allData } = await callWidthGraphql(slug)
    const guildData = get(allData, 'aggregators.data[0]')

    if (isEmpty(guildData)) {
      return { props: { data: {} } }
    }

    return { props: { data: { id: guildData.id, ...guildData.attributes } } }
  } catch (e) {
    return { props: { data: {} } }
  }
}

export default Create
