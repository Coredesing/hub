import { printNumber } from '@/utils'
import { DisLike, Like, Comment } from './GroupAction'

type Props = {
  like: number;
  dislike: number;
  comment: number;
  showComment?: boolean;
}

export default function Statistics ({ like, dislike, comment, showComment = false }: Props) {
  return (
    <div className="flex md:gap-10 gap-[30px] mb-4 md:mb-0 invisible">
      <div className="flex gap-3 items-center">
        <Like
          selected={false}
          activeColor={'black'}
          inactiveColor={'white'}
          size={'16px'}
        ></Like>
        <div className="font-casual not-italic font-medium text-[13px] leading-[150%] text-white opacity-60">
          {printNumber(like || '-')}
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <DisLike
          selected={false}
          activeColor={'black'}
          inactiveColor={'white'}
          size={'16px'}
        ></DisLike>
        <div className="font-casual not-italic font-medium text-[13px] leading-[150%] text-white opacity-60">
          {printNumber(dislike || '-')}
        </div>
      </div>
      {showComment && (
        <div className="flex gap-3 items-center">
          <Comment
            selected={false}
            activeColor={'black'}
            inactiveColor={'white'}
            size={'16px'}
          ></Comment>
          <div className="font-casual not-italic font-medium text-[13px] leading-[150%] text-white opacity-60">
            {printNumber(comment || '-')}
          </div>
        </div>
      )}
    </div>
  )
}
