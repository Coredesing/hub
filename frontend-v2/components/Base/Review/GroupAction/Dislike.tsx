import { ButtonIconPropData } from '@/components/Base/Review/GroupAction/types'

const ReviewGroupActionDislike = ({ selected, activeColor, inactiveColor, size }: ButtonIconPropData) => {
  return (
    <svg style={{
      height: size,
      width: size,
      display: 'block',
      color: selected ? activeColor : inactiveColor,
      fill: 'transparent'
    }} viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
      <path stroke={selected ? '#000000' : '#ffffff'} d="M5 0.75L1.25 0.75L1.25 9L5 9" strokeWidth="1.5" strokeMiterlimit="10" />
      <path stroke={selected ? '#000000' : '#ffffff'} d="M5 9L7.25 17.25C7.84674 17.25 8.41903 17.0129 8.84099 16.591C9.26295 16.169 9.5 15.5967 9.5 15L9.5 10.5L15.125 10.5C15.4494 10.5 15.7699 10.4298 16.0647 10.2943C16.3594 10.1589 16.6213 9.96125 16.8326 9.71505C17.0438 9.46886 17.1993 9.17991 17.2884 8.868C17.3775 8.5561 17.3981 8.22861 17.3487 7.908L16.541 2.658C16.4594 2.12718 16.1905 1.64306 15.7831 1.29314C15.3757 0.943213 14.8566 0.750563 14.3195 0.75L5 0.750001L5 9Z" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="square" />
    </svg>
  )
}

export default ReviewGroupActionDislike
