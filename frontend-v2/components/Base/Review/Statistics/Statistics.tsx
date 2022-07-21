import { printNumber } from '@/utils'
import ReviewGroupActionLike from '@/components/Base/Review/GroupAction/Like'
import ReviewGroupActionDislike from '@/components/Base/Review/GroupAction/Dislike'
import ReviewGroupActionComment from '@/components/Base/Review/GroupAction/Comment'

type ReviewStatisticsProps = {
  like: number;
  dislike: number;
  comment: number;
  showComment?: boolean;
}

const ReviewStatistics = ({ like, dislike, comment, showComment = false }: ReviewStatisticsProps) => (
  <div className="flex md:gap-10 gap-[30px] mb-4 md:mb-0 invisible min-w-0">
    <div className="flex gap-3 items-center">
      <ReviewGroupActionLike
        selected={false}
        activeColor={'black'}
        inactiveColor={'white'}
        size={'16px'}
      />
      <div className="font-casual not-italic font-medium text-[13px] leading-[150%] text-white opacity-60">
        {printNumber(like || '-')}
      </div>
    </div>
    <div className="flex gap-3 items-center">
      <ReviewGroupActionDislike
        selected={false}
        activeColor={'black'}
        inactiveColor={'white'}
        size={'16px'}
      />
      <div className="font-casual not-italic font-medium text-[13px] leading-[150%] text-white opacity-60">
        {printNumber(dislike || '-')}
      </div>
    </div>
    {showComment && (
      <div className="flex gap-3 items-center">
        <ReviewGroupActionComment
          selected={false}
          activeColor={'black'}
          inactiveColor={'white'}
          size={'16px'}
        />
        <div className="font-casual not-italic font-medium text-[13px] leading-[150%] text-white opacity-60">
          {printNumber(comment || '-')}
        </div>
      </div>
    )}
  </div>
)

export default ReviewStatistics
