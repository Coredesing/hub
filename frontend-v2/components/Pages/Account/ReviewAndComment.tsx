import { useState } from 'react'
import get from 'lodash.get'
import { TabPanel, Tabs } from '@/components/Base/Tabs'
import TabReviews from '@/components/Pages/Account/Review/TabReviews'
import TabComments from '@/components/Pages/Account/Review/TabComments'

const ReviewAndComment = ({ data, status, showReviewFilter = false, user, meta = {} }) => {
  const [tab, setTab] = useState(0)

  const totalComment = get(data, 'commentMeta.meta.pagination.total', 0)
  const totalReviews = get(data, 'reviewMeta.meta.pagination.total', 0)

  const onChangeTab = (tab) => {
    setTab(tab)
  }

  return (
    <div id="tabReview">
      <Tabs
        titles={[
          'Reviews',
          'Comments'
        ]}
        currentValue={tab}
        onChange={onChangeTab}
        className="mt-2 sm:mt-6 lg:mt-10 sticky top-0 bg-gamefiDark-900 z-50"
      />
      <div>
        <TabPanel value={tab} index={0}>
          <TabReviews
            user={user}
            status={status}
            totalReviews={totalReviews}
            reviews={data.reviews}
            showFilter={showReviewFilter}
            meta={meta}
          />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <TabComments comments={data.comments} totalComment={totalComment}/>
        </TabPanel>
      </div>
    </div>
  )
}

export default ReviewAndComment
