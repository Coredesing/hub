
type IconProps = {
  color?: string;
  className?: string;
  [k: string]: any;
}
export const BulletListIcon = ({ color = '#6C6D71', className, ...props }: IconProps) => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M15 0H7C6.4 0 6 0.4 6 1V3C6 3.6 6.4 4 7 4H15C15.6 4 16 3.6 16 3V1C16 0.4 15.6 0 15 0Z" fill={color} />
    <path d="M15 6H7C6.4 6 6 6.4 6 7V9C6 9.6 6.4 10 7 10H15C15.6 10 16 9.6 16 9V7C16 6.4 15.6 6 15 6Z" fill={color} />
    <path d="M15 12H7C6.4 12 6 12.4 6 13V15C6 15.6 6.4 16 7 16H15C15.6 16 16 15.6 16 15V13C16 12.4 15.6 12 15 12Z" fill={color} />
    <path d="M3 0H1C0.4 0 0 0.4 0 1V3C0 3.6 0.4 4 1 4H3C3.6 4 4 3.6 4 3V1C4 0.4 3.6 0 3 0Z" fill={color} />
    <path d="M3 6H1C0.4 6 0 6.4 0 7V9C0 9.6 0.4 10 1 10H3C3.6 10 4 9.6 4 9V7C4 6.4 3.6 6 3 6Z" fill={color} />
    <path d="M3 12H1C0.4 12 0 12.4 0 13V15C0 15.6 0.4 16 1 16H3C3.6 16 4 15.6 4 15V13C4 12.4 3.6 12 3 12Z" fill={color} />
  </svg>
}

export const GridIcon = ({ color = '#6C6D71', className, ...props }: IconProps) => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M6 0H1C0.4 0 0 0.4 0 1V6C0 6.6 0.4 7 1 7H6C6.6 7 7 6.6 7 6V1C7 0.4 6.6 0 6 0Z" fill={color} />
    <path d="M15 0H10C9.4 0 9 0.4 9 1V6C9 6.6 9.4 7 10 7H15C15.6 7 16 6.6 16 6V1C16 0.4 15.6 0 15 0Z" fill={color} />
    <path d="M6 9H1C0.4 9 0 9.4 0 10V15C0 15.6 0.4 16 1 16H6C6.6 16 7 15.6 7 15V10C7 9.4 6.6 9 6 9Z" fill={color} />
    <path d="M15 9H10C9.4 9 9 9.4 9 10V15C9 15.6 9.4 16 10 16H15C15.6 16 16 15.6 16 15V10C16 9.4 15.6 9 15 9Z" fill={color} />
  </svg>
}

export const MediumIcon = ({ color = '#fff', className, ...props }: IconProps) => {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M13.9998 28C21.7317 28 27.9998 21.732 27.9998 14C27.9998 6.26801 21.7317 0 13.9998 0C6.26777 0 -0.000244141 6.26801 -0.000244141 14C-0.000244141 21.732 6.26777 28 13.9998 28Z" fill="#2E2E2E" />
    <path d="M20.2749 9.78983L21.4665 8.6499V8.40039H17.3386L14.3967 15.7228L11.0497 8.40039H6.72149V8.6499L8.11342 10.3256C8.24907 10.4494 8.32 10.6305 8.30196 10.8128V17.3978C8.34489 17.6349 8.26774 17.8788 8.10098 18.0512L6.53296 19.9515V20.1979H10.9788V19.9483L9.41077 18.0512C9.2409 17.8782 9.16063 17.6386 9.19486 17.3978V11.7019L13.0975 20.201H13.5511L16.9068 11.7019V18.4724C16.9068 18.651 16.9068 18.6877 16.7898 18.8047L15.5827 19.9726V20.2228H21.4391V19.9732L20.2755 18.8339C20.1735 18.7568 20.1206 18.6274 20.1424 18.5017V10.1221C20.1206 9.99579 20.1729 9.86636 20.2749 9.78983Z" fill={color} />
  </svg>
}

export const TwitterIcon = ({ color = '#fff', className, ...props }: IconProps) => {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M28 14C28 21.7321 21.7321 28 14 28C6.26791 28 0 21.7321 0 14C0 6.26791 6.26791 0 14 0C21.7321 0 28 6.26791 28 14Z" fill="#2E2E2E" />
    <path d="M28 14C28 21.7321 21.7321 28 14 28C6.26791 28 0 21.7321 0 14C0 6.26791 6.26791 0 14 0C21.7321 0 28 6.26791 28 14Z" fill="#2E2E2E" />
    <path d="M10.5028 21.6587C17.6156 21.6587 21.5053 15.7659 21.5053 10.6562C21.5053 10.4887 21.5019 10.3223 21.4942 10.1566C22.2491 9.61053 22.9054 8.9295 23.4232 8.15427C22.7302 8.4621 21.9846 8.66952 21.2024 8.76288C22.0009 8.28436 22.6138 7.52686 22.903 6.62387C22.1555 7.06693 21.3284 7.38885 20.4476 7.56253C19.7418 6.811 18.7369 6.34082 17.625 6.34082C15.4892 6.34082 13.7574 8.07266 13.7574 10.2074C13.7574 10.511 13.7914 10.806 13.8576 11.0892C10.644 10.9275 7.7941 9.38858 5.88708 7.04898C5.55469 7.62042 5.36349 8.28436 5.36349 8.99252C5.36349 10.3341 6.04623 11.5186 7.08423 12.2114C6.44998 12.192 5.85397 12.0174 5.33295 11.7275C5.33209 11.7438 5.33209 11.76 5.33209 11.7769C5.33209 13.6499 6.6651 15.2134 8.43433 15.5678C8.10962 15.6563 7.76782 15.7039 7.41492 15.7039C7.16583 15.7039 6.92358 15.6791 6.68796 15.6343C7.18036 17.1704 8.60779 18.2885 10.3005 18.3202C8.97671 19.3573 7.3096 19.9753 5.49786 19.9753C5.18597 19.9753 4.87814 19.9576 4.57544 19.9217C6.28677 21.0184 8.31876 21.6587 10.5028 21.6587Z" fill={color} />
  </svg>
}

export const TelegramIcon = ({ color = '#fff', className, ...props }: IconProps) => {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#2E2E2E" />
    <path d="M12.6405 16.0398L18.9674 20.8166L22.1612 7.18359L5.83911 13.6039L10.8057 15.249L19.8699 9.16899L12.6405 16.0398Z" fill={color} />
    <path d="M10.8059 15.249L12.1662 20.1438L12.6407 16.0397L19.8701 9.16895L10.8059 15.249Z" fill="#D2D2D7" />
    <path d="M14.6971 17.5925L12.1663 20.1441L12.6408 16.04L14.6971 17.5925Z" fill="#B9B9BE" />
  </svg>
}

export const WebsiteIcon = ({ color = '#fff', className, ...props }: IconProps) => {
  return <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M25 13C25 19.6275 19.6275 25 13 25C6.3725 25 1 19.6275 1 13C1 6.3725 6.3725 1 13 1C19.6275 1 25 6.3725 25 13Z" stroke="#AEAEAE" />
    <path d="M15.1411 10.6774C14.7903 8.51694 13.9629 7 13 7C12.0371 7 11.2097 8.51694 10.8589 10.6774H15.1411ZM10.6774 13C10.6774 13.5371 10.7065 14.0524 10.7573 14.5484H15.2403C15.2911 14.0524 15.3202 13.5371 15.3202 13C15.3202 12.4629 15.2911 11.9476 15.2403 11.4516H10.7573C10.7065 11.9476 10.6774 12.4629 10.6774 13ZM18.5331 10.6774C17.8411 9.03468 16.4403 7.76452 14.7105 7.25161C15.3008 8.06935 15.7073 9.30081 15.9202 10.6774H18.5331ZM11.2871 7.25161C9.55968 7.76452 8.15645 9.03468 7.46694 10.6774H10.0798C10.2903 9.30081 10.6968 8.06935 11.2871 7.25161ZM18.7919 11.4516H16.0169C16.0677 11.9597 16.0968 12.4798 16.0968 13C16.0968 13.5202 16.0677 14.0403 16.0169 14.5484H18.7895C18.9226 14.0524 18.9976 13.5371 18.9976 13C18.9976 12.4629 18.9226 11.9476 18.7919 11.4516ZM9.90323 13C9.90323 12.4798 9.93226 11.9597 9.98306 11.4516H7.20806C7.07742 11.9476 7 12.4629 7 13C7 13.5371 7.07742 14.0524 7.20806 14.5484H9.98064C9.93226 14.0403 9.90323 13.5202 9.90323 13ZM10.8589 15.3226C11.2097 17.4831 12.0371 19 13 19C13.9629 19 14.7903 17.4831 15.1411 15.3226H10.8589ZM14.7129 18.7484C16.4403 18.2355 17.8435 16.9653 18.5355 15.3226H15.9226C15.7097 16.6992 15.3032 17.9306 14.7129 18.7484ZM7.46694 15.3226C8.15887 16.9653 9.55968 18.2355 11.2895 18.7484C10.6992 17.9306 10.2927 16.6992 10.0798 15.3226H7.46694Z" fill={color} />
  </svg>
}

export const QuestionIcon = () => {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 0C3.13414 0 0 2.91 0 6.5C0 8.04875 0.58543 9.46906 1.55914 10.5856C1.2157 12.1578 0.0738281 13.5616 0.0601563 13.5781C0.0307133 13.6136 0.0110108 13.6581 0.00348772 13.7062C-0.00403532 13.7543 0.000951486 13.8039 0.0178308 13.8488C0.0347101 13.8937 0.0627407 13.9319 0.0984526 13.9588C0.134164 13.9857 0.17599 14 0.21875 14C2.03055 14 3.39035 13.0078 4.06328 12.3944C4.95715 12.7791 5.94973 13 7 13C10.8659 13 14 10.09 14 6.5C14 2.91 10.8659 0 7 0ZM7.65625 9.45125V10C7.65625 10.2762 7.46047 10.5 7.21875 10.5H6.78125C6.53953 10.5 6.34375 10.2762 6.34375 10V9.44594C6.03148 9.40375 5.73453 9.28375 5.47477 9.08781C5.30469 8.95938 5.28828 8.67812 5.43238 8.51344L5.91145 7.96594C6.01371 7.84906 6.16602 7.83344 6.29727 7.9025C6.38422 7.94813 6.47937 7.97188 6.57781 7.97188H7.47414C7.60156 7.97188 7.70492 7.85375 7.70492 7.70875C7.70492 7.59156 7.63602 7.4875 7.53758 7.45531L6.16848 7.00844C5.56008 6.81 5.07445 6.23625 4.99516 5.51875C4.88441 4.51656 5.51551 3.66156 6.34375 3.54844V3C6.34375 2.72375 6.53953 2.5 6.78125 2.5H7.21875C7.46047 2.5 7.65625 2.72375 7.65625 3V3.55406C7.96852 3.59625 8.26547 3.71625 8.52523 3.91219C8.69531 4.04063 8.71172 4.32188 8.56762 4.48656L8.08855 5.03406C7.98629 5.15094 7.83398 5.16656 7.70273 5.0975C7.6147 5.0515 7.51899 5.02783 7.42219 5.02812H6.52586C6.39844 5.02812 6.29508 5.14625 6.29508 5.29125C6.29508 5.40844 6.36398 5.5125 6.46242 5.54469L7.83152 5.99156C8.43992 6.19031 8.92555 6.76375 9.00484 7.48125C9.11559 8.48312 8.48449 9.33813 7.65625 9.45125Z" fill="white" />
  </svg>
}

export const CloseIcon = () => {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 1L4 4L7 7M13 13L10 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}
