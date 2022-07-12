import Layout from '@/components/Layout'
import Carousel from '@/components/Pages/Ticket/Carousel'
import List, { TOKEN_TYPE } from '@/components/Pages/Ticket/List'
import ListAuction from '@/components/Pages/Ticket/ListAuction'
import ListOpening from '@/components/Pages/Ticket/ListOpening'
import ListUpcoming from '@/components/Pages/Ticket/ListUpcoming'
import { useAppContext } from '@/context'
import { useFetch } from '@/utils'

const Ticket = () => {
  const { now } = useAppContext()

  const { response } = useFetch(`/pools/mysterious-box?token_type=${TOKEN_TYPE}&limit=10&is_featured=1&is_display=1`)

  return (
    <Layout title="GameFi.org - Initial Game Offering" description="Launching limited in-game NFT offers with an early price, uniqueness & rewards bonused.">
      <>
        {response?.data?.data?.length ? <Carousel items={response?.data?.data || []} style={{ paddingBottom: '2rem' }} now={now}></Carousel> : <></>}
        <ListAuction now={now} />
        <ListOpening now={now} />
        <ListUpcoming now={now} />
        <List />
      </>
    </Layout>
  )
}

export default Ticket
