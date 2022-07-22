import ReviewListWrapper from '@/components/Base/Review/ListWrapper'

const Reviews = ({ data, slug }) => {
  return (
    <div>
      <ReviewListWrapper data={data} slug={slug} currentResource="hub" />
    </div>
  )
}

export default Reviews
