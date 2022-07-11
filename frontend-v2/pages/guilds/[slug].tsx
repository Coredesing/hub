import { TabPanel, Tabs } from '@/components/Base/Tabs'
import Layout from '@/components/Layout'
import Home from '@/components/Pages/Guilds/GuildDetail/Home'
import HeaderProfile from '@/components/Pages/Guilds/GuildDetail/HeaderProfile'
import News from '@/components/Pages/Guilds/GuildDetail/News'
import { GuildDetailContext } from '@/components/Pages/Guilds/GuildDetail/utils'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { fetchOneWithSlug } from '../api/hub/guilds'
import 'tippy.js/dist/tippy.css'

const GuildDetail = ({ guildData }: { guildData: any }) => {
  const router = useRouter()
  const setTab = useCallback((index: number) => {
    switch (index) {
    case 1: return router.push(`/guilds/${router.query.slug}?tab=news`)
    default: router.push(`/guilds/${router.query.slug}`)
    }
  }, [router])
  const tab = useMemo(() => {
    switch (router.query.tab) {
    case 'news': return 1
    default: return 0
    }
  }, [router.query.tab])

  return (
    <Layout title={`GameFi.org - ${guildData?.name || 'Guild'}`} description="" extended={!!guildData}>
      {
        !guildData && <div>
          <a onClick={() => {
            router.back()
          }} className="inline-flex items-center text-sm font-casual mb-6 hover:text-gamefiGreen-500 cursor-pointer">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5 8.5H1.5" stroke="currentColor" strokeMiterlimit="10" />
              <path d="M8.5 15.5L1.5 8.5L8.5 1.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="square" />
            </svg>
            Back
          </a>
          <div className="w-full h-32 flex items-center justify-center text-2xl font-bold uppercase">Guild Not Found</div>
        </div>
      }
      {
        guildData && <GuildDetailContext.Provider value={{
          guildData
        }}>
          <HeaderProfile />
          <div className="mx-auto">
            <Tabs
              titles={[
                'HOME',
                'NEWS'
              ]}
              currentValue={tab}
              onChange={(index) => {
                setTab(index)
              }}
              className="container mx-auto mt-10 px-4 lg:px-16"
            />
            <TabPanel value={tab} index={0}>
              <div className="py-8">
                <Home />
              </div>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <div className="container mx-auto py-8">
                <News />
              </div>
            </TabPanel>
          </div>
        </GuildDetailContext.Provider>
      }
    </Layout>
  )
}

export default GuildDetail

export async function getServerSideProps ({ params }) {
  if (!params?.slug) {
    return { props: { guildData: null } }
  }

  const guildData = await fetchOneWithSlug(params.slug)

  return { props: { guildData: guildData.data[0] } }
}
