import { ButtonIconPropData } from '@/components/Base/Review/GroupAction/types'

const ReviewGroupActionComment = ({ selected, activeColor, inactiveColor, size }: ButtonIconPropData) => {
  return (
    <svg style={{
      height: size,
      width: size,
      display: 'block',
      color: selected ? activeColor : inactiveColor,
      fill: 'transparent'
    }} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path stroke={selected ? '#000000' : '#ffffff'} d="M16.3125 1.6875H1.6875C1.0665 1.6875 0.5625 2.1915 0.5625 2.8125V11.8125C0.5625 12.4335 1.0665 12.9375 1.6875 12.9375H5.0625V17.4375L10.3129 12.9375H16.3125C16.9335 12.9375 17.4375 12.4335 17.4375 11.8125V2.8125C17.4375 2.1915 16.9335 1.6875 16.3125 1.6875Z" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="square" />
    </svg>
  )
}

export default ReviewGroupActionComment
