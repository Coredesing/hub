import Layout from 'components/Layout'
import AccountLayout from '@/components/Pages/Account/AccountLayout'
import { useMyWeb3 } from '@/components/web3/context'
import { useEffect, useState } from 'react'
import { fetcher } from '@/utils'
import Level from '@/components/Pages/Account/Rank/Level'
import { TabPanel, Tabs } from '@/components/Base/Tabs'
import TabGetMoreExp from '@/components/Pages/Account/Rank/TabGetMoreExp'
import TabEarnHistory from '@/components/Pages/Account/Rank/TabEarnHistory'
import TabLeaderBoard from '@/components/Pages/Account/Rank/TabLeaderBoard'

const RankPage = () => {
  const [data, setData] = useState({})
  const [tab, setTab] = useState(0)
  const [rankData, setRankData] = useState({ ranks: [], specialRank: {} })
  const [earnHistories, setEarnHistories] = useState([])
  const [leaderBoardData, setLeaderBoardData] = useState([])

  const { account: walletId } = useMyWeb3()

  const onChangeTab = (tab) => {
    setTab(tab)
  }

  useEffect(() => {
    fetcher('/api/account/ranks/getRanks', {
      method: 'GET'
    })
      .then((res) => {
        const { data, error } = res
        if (!error) {
          setRankData(data)
        }
      })
      .catch(() => [])
    fetcher('/api/account/ranks/getLeaderBoard', {
      method: 'GET'
    })
      .then((res) => {
        const { data, error } = res
        if (!error) {
          setLeaderBoardData(data)
        }
      })
      .catch(() => [])
  }, [])

  useEffect(() => {
    if (walletId) {
      fetcher('/api/account/ranks/getUserRankAndQuests', {
        method: 'POST',
        body: JSON.stringify({ walletId })
      })
        .then((res) => {
          setData(res.data)
        })
        .catch(() => {})
    }

    fetcher('/api/account/ranks/earnHistory', {
      method: 'POST',
      body: JSON.stringify({ walletId })
    }).then((res) => {
      const { data, error } = res
      if (!error) {
        setEarnHistories(data)
      }
    })
  }, [walletId])

  return (
    <Layout title="GameFi.org - My EXP">
      <AccountLayout>
        <div className="py-10 px-4 xl:px-9 w-full flex-1">
          <h3 className="hidden lg:block uppercase font-bold text-2xl mb-6">
            My EXP
          </h3>
          <section id="rank-info">
            <Level
              data={data}
              ranks={rankData.ranks}
              specialRank={rankData.specialRank}
            ></Level>

            <div id="tabReview" className="">
              <Tabs
                titles={['TASK LIST', 'LEADER BOARD', 'HISTORY']}
                currentValue={tab}
                onChange={onChangeTab}
                className="mt-2 sm:mt-6 lg:mt-10 sticky top-0 bg-gamefiDark-900 z-50"
              />

              <div>
                <TabPanel value={tab} index={0}>
                  <TabGetMoreExp data={data}></TabGetMoreExp>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <TabLeaderBoard
                    data={leaderBoardData}
                    ranks={rankData}
                  ></TabLeaderBoard>
                </TabPanel>
                <TabPanel value={tab} index={2}>
                  <TabEarnHistory data={earnHistories}></TabEarnHistory>
                </TabPanel>
              </div>
            </div>
          </section>
        </div>
      </AccountLayout>
    </Layout>
  )
}

export default RankPage
