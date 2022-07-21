import ReviewListWrapper from '@/components/Base/Review/ListWrapper'

const Reviews = ({ data, slug }) => {
  return (
    <div className="container mx-auto px-4 lg:px-16">
      <ReviewListWrapper data={data} slug={slug} currentResource="guilds" />
    </div>
  )
}

export default Reviews
