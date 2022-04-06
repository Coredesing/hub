import { TabPanel, Tabs } from '@/components/Base/Tabs'
import Layout from '@/components/Layout'
import React, { useState } from 'react'

const GuildDetail = () => {
  const [tab, setTab] = useState(0)
  return (
    <Layout>
      <div className="container mx-auto px-4 xl:px-16">
        <Tabs
          titles={[
            'HOME',
            'RECRUITMENT',
            'ABOUT'
          ]}
          currentValue={tab}
          onChange={setTab}
          className="mt-10"
        />
        <TabPanel value={tab} index={0}>Home</TabPanel>
        <TabPanel value={tab} index={1}>Recruitment</TabPanel>
        <TabPanel value={tab} index={2}>About</TabPanel>
      </div>
    </Layout>
  )
}

export default GuildDetail
