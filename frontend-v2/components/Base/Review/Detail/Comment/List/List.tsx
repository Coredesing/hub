import ReviewDetailCommentItem from '@/components/Base/Review/Detail/Comment/List/Item'

interface ReviewDetailCommentListProps {
  comments: any;
  likeStatus: any;
  currentResource: 'guilds' | 'hub';
}

const ReviewDetailCommentList = ({ comments, likeStatus, currentResource }: ReviewDetailCommentListProps) => {
  return comments.map((comment, index) => (
    <ReviewDetailCommentItem key={`comment_${index}`} data={comment} index={index} defaultLikeStatus={likeStatus?.[comment.id] ?? ''} currentResource={currentResource} />
  ))
}

export default ReviewDetailCommentList
