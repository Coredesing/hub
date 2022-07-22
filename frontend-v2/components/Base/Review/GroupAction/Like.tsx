import { ButtonIconPropData } from '@/components/Base/Review/GroupAction/types'

const ReviewGroupActionLike = ({ selected, activeColor, inactiveColor, size }: ButtonIconPropData) => {
  return (
    <svg style={{
      height: size,
      width: size,
      display: 'block',
      color: selected ? activeColor : inactiveColor,
      fill: 'transparent'
    }} viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
      <path stroke={selected ? '#000000' : '#ffffff'} d="M5 17.25H1.25V9H5" strokeWidth="1.5" strokeMiterlimit="10" />
      <path stroke={selected ? '#000000' : '#ffffff'} d="M5 9L7.25 0.75C7.84674 0.75 8.41903 0.987053 8.84099 1.40901C9.26295 1.83097 9.5 2.40326 9.5 3V7.5H15.125C15.4494 7.50001 15.7699 7.57017 16.0647 7.70565C16.3594 7.84114 16.6213 8.03875 16.8326 8.28495C17.0438 8.53114 17.1993 8.82009 17.2884 9.132C17.3775 9.4439 17.3981 9.77139 17.3487 10.092L16.541 15.342C16.4594 15.8728 16.1906 16.3569 15.7831 16.7069C15.3757 17.0568 14.8566 17.2494 14.3195 17.25H5V9Z" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="square" />
    </svg>
  )
}

export default ReviewGroupActionLike
