import GameDetails from '@/pages/hub/[slug]'
import { fetchOneWithSlug } from '@/pages/api/aggregator'

export async function getServerSideProps ({ params }) {
  if (!params?.slug) {
    return { props: { data: {} } }
  }
  const data = await fetchOneWithSlug(params.slug)
  if (!data?.data) {
    return { props: { data: {} } }
  }
  return { props: { data: data.data } }
}

export default GameDetails
