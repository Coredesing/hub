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

export const DocumentCopyIcon = () => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 3.5H2.5V15.5H12.5V3.5Z" stroke="#CFCFCF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 0.5H15.5V13.5" stroke="#CFCFCF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 6.5H9.5" stroke="#CFCFCF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 9.5H9.5" stroke="#CFCFCF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 12.5H9.5" stroke="#CFCFCF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

export const SolanaIcon = () => {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <rect width="32" height="32" fill="url(#pattern0)" />
    <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_1822_3731" transform="scale(0.00390625)" />
      </pattern>
      <image id="image0_1822_3731" width="256" height="256" xlinkHref="data:image/png;base64,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" />
    </defs>
  </svg>
}

export const TerraIcon = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <path fill="#0e3ca5" d="M34.4 62.108c2.192 8.109 10.056 14.3 14.027 14.041.14-.009 15.064-2.791 23.234-16.442 6.358-10.623 4.193-20.878-4.454-21.1-3.111.227-36.984 8.053-32.807 23.5m32.006-52.084-.009-.008.012-.007a37.951 37.951 0 0 0-40-5.772A22.386 22.386 0 0 0 24 5.414c-.532.283-1.065.565-1.582.873l.126.039a17.255 17.255 0 0 0-4 3.792C7.649 24.509 44.159 34.969 63.679 35c8.98 6.45 11.501-18.147 2.727-24.977Z" />
    <path fill="#5493f7" d="M28.609 10.315C23.6 17.853 6.888 23.165 4.14 22.338l-.018-.038c.112-.227.227-.453.343-.678a40.2 40.2 0 0 1 11.913-13.9q1.542-1.131 3.193-2.114a11.823 11.823 0 0 1 5.523-1.468c7.44.142 3.555 6.115 3.515 6.175M24.5 63.591c.36 2.369-.009 11.725-.494 12.514-.417.025-1.286.078-3.8-1.334A40.054 40.054 0 0 1 2.039 27.364q.2-.6.42-1.2C5.346 30 8.683 33.47 11.52 37.344c2.7 3.688 6.417 9.7 7.173 10.986 4.7 7.976 5.444 12.9 5.8 15.261M80 40.007A39.9 39.9 0 0 1 77.216 54.7c-4.711 5.063-36.477-7.4-36.788-7.538-4.346-1.9-17.57-7.7-18.763-16.8C19.949 17.273 46.509 8.15 58.181 7.8c1.4.017 5.659.066 8.142 2.083A39.911 39.911 0 0 1 80 40.007M58.5 75.486c-3.463 1.616-7.275.439-6.285-2.933 1.9-6.476 18.507-13.115 22.174-13.475.452-.045.644.263.444.615A40.4 40.4 0 0 1 58.5 75.486" />
  </svg>
}

export const IconError = ({ className }: { className?: string }) => {
  return <svg className={className || ''} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="18" fill="#DE4343" />
    <path d="M24 12L12 24" stroke="#1A1C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    <path d="M12 12L15 15L18 18M24 24L21 21" stroke="#1A1C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
  </svg>
}

export const IconOK = ({ className }: { className?: string }) => {
  return <svg className={className || ''} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="18" fill="#67CF02" />
    <path d="M8.83325 18L15.2499 24.4167L27.1666 12.5" stroke="#212121" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
  </svg>
}

export const IconWarning = ({ className }: { className?: string }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" className={className || ''} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#ffc329"></circle>
    <line x1="12" y1="8" x2="12" y2="12" stroke="#212121" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" vectorEffect="non-scaling-stroke"></line>
    <line x1="12" y1="16" x2="12.01" y2="16" stroke="#212121" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" vectorEffect="non-scaling-stroke"></line>
  </svg>
}

export const GamefiIcon = () => {
  return <svg width="136" height="19" viewBox="0 0 136 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.9357 12.3373H8.72226C8.5042 12.3373 8.39517 12.2329 8.39517 12.0242V7.84896C8.39517 7.61701 8.5042 7.50103 8.72226 7.50103H19.5524C19.94 7.50103 20.3156 7.59381 20.679 7.77938C21.0667 7.94175 21.4059 8.1737 21.6966 8.47525C22.0116 8.77679 22.2539 9.11313 22.4235 9.48426C22.6173 9.85539 22.7142 10.2265 22.7142 10.5977V15.7123C22.7142 16.1066 22.6173 16.4894 22.4235 16.8605C22.2539 17.2084 22.0116 17.5332 21.6966 17.8347C21.4059 18.1131 21.0667 18.345 20.679 18.5306C20.3156 18.6929 19.94 18.7741 19.5524 18.7741H3.19816C2.81051 18.7741 2.42285 18.6929 2.03519 18.5306C1.67177 18.345 1.33257 18.1131 1.0176 17.8347C0.726855 17.5332 0.48457 17.2084 0.290742 16.8605C0.096914 16.4894 0 16.1066 0 15.7123V4.16085C0 3.78972 0.096914 3.41859 0.290742 3.04746C0.48457 2.67633 0.726855 2.35159 1.0176 2.07324C1.33257 1.77169 1.67177 1.53974 2.03519 1.37737C2.42285 1.1918 2.81051 1.09902 3.19816 1.09902H22.3871C22.6052 1.09902 22.7142 1.2034 22.7142 1.41216V6.00491C22.7142 6.21367 22.6052 6.31805 22.3871 6.31805H5.81484V13.5203H16.9357V12.3373Z" fill="#72F34B" />
    <path d="M41.3265 7.1183C41.3265 6.93273 41.1811 6.83995 40.8904 6.83995C40.6966 6.83995 40.4785 6.94433 40.2362 7.15309C40.0182 7.33866 39.8122 7.53582 39.6184 7.74458L39.6548 7.70979L36.6746 11.1891H41.3265V7.1183ZM47.105 5.27424V18.4262C47.105 18.6582 46.996 18.7741 46.7779 18.7741H41.6899C41.4477 18.7741 41.3265 18.6582 41.3265 18.4262V15.9559H32.9313L30.7144 18.635C30.6902 18.7277 30.5933 18.7741 30.4237 18.7741H24.4635C24.2939 18.7741 24.1849 18.7161 24.1364 18.6002C24.0879 18.461 24.1001 18.3334 24.1727 18.2174L36.6383 2.35159C37.244 1.88767 38.0193 1.56293 38.9642 1.37737C39.9092 1.1918 40.8904 1.09902 41.908 1.09902C42.6833 1.09902 43.3859 1.16861 44.0159 1.30778C44.6701 1.42376 45.2152 1.64412 45.6513 1.96886C46.1116 2.2936 46.463 2.72272 46.7052 3.25622C46.9718 3.78972 47.105 4.46239 47.105 5.27424Z" fill="#72F34B" />
    <path d="M55.5641 18.7741H50.4761C50.2338 18.7741 50.1127 18.6582 50.1127 18.4262V3.56936C50.1127 3.26782 50.1975 2.96627 50.3671 2.66473C50.5367 2.36318 50.7668 2.09643 51.0576 1.86448C51.3725 1.63252 51.7239 1.44695 52.1115 1.30778C52.4992 1.16861 52.911 1.09902 53.3472 1.09902H54.7645C55.4672 1.16861 56.1456 1.41216 56.7997 1.82968C57.4539 2.22401 57.9748 2.72272 58.3625 3.3258L63.6685 11.7458L69.0109 3.3258C69.3985 2.72272 69.9073 2.22401 70.5373 1.82968C71.1915 1.41216 71.8699 1.16861 72.5725 1.09902H73.9898C74.4259 1.09902 74.8378 1.16861 75.2255 1.30778C75.6374 1.44695 75.9887 1.63252 76.2794 1.86448C76.5944 2.09643 76.8367 2.36318 77.0063 2.66473C77.1759 2.96627 77.2607 3.26782 77.2607 3.56936V18.4262C77.2607 18.6582 77.1395 18.7741 76.8973 18.7741H71.8093C71.567 18.7741 71.4458 18.6582 71.4458 18.4262V10.2149C70.4283 11.8386 69.4833 13.2652 68.6111 14.4945C67.7631 15.7007 67.1089 16.6053 66.6486 17.2084C66.1156 17.8811 65.6189 18.3102 65.1586 18.4958C64.6982 18.6813 64.3348 18.7741 64.0683 18.7741H63.3051C62.869 18.7741 62.4571 18.6813 62.0694 18.4958C61.706 18.3102 61.2578 17.8811 60.7247 17.2084C60.2402 16.6053 59.5618 15.7007 58.6895 14.4945C57.8415 13.2652 56.9088 11.8386 55.8912 10.2149V18.4262C55.8912 18.6582 55.7821 18.7741 55.5641 18.7741Z" fill="#72F34B" />
    <path d="M97.0138 7.50103H87.6737C87.4557 7.50103 87.3466 7.61701 87.3466 7.84896V12.0242C87.3466 12.2329 87.4557 12.3373 87.6737 12.3373H99.6305C100.018 12.3373 100.394 12.2561 100.757 12.0938C101.145 11.9082 101.484 11.6763 101.775 11.3979C102.09 11.0964 102.332 10.7716 102.502 10.4237C102.695 10.0526 102.792 9.66982 102.792 9.2755V4.16085C102.792 3.78972 102.695 3.41859 102.502 3.04746C102.332 2.67633 102.09 2.35159 101.775 2.07324C101.484 1.77169 101.145 1.53974 100.757 1.37737C100.394 1.1918 100.018 1.09902 99.6305 1.09902H83.4943C83.1067 1.09902 82.719 1.1918 82.3313 1.37737C81.9679 1.53974 81.6287 1.77169 81.3138 2.07324C81.023 2.35159 80.7807 2.67633 80.5869 3.04746C80.3931 3.41859 80.2962 3.78972 80.2962 4.16085V15.7123C80.2962 16.1066 80.3931 16.4894 80.5869 16.8605C80.7807 17.2084 81.023 17.5332 81.3138 17.8347C81.6287 18.1131 81.9679 18.345 82.3313 18.5306C82.719 18.6929 83.1067 18.7741 83.4943 18.7741H102.465C102.683 18.7741 102.792 18.6582 102.792 18.4262V13.8682C102.792 13.6363 102.683 13.5203 102.465 13.5203H86.111V6.31805H97.0138V7.50103Z" fill="#72F34B" />
    <path d="M106.233 18.1131H111.175V11.8502H125.567V7.81417H111.175V6.00491H125.603V1.55133H108.958C108.619 1.55133 108.292 1.63252 107.977 1.79489C107.662 1.93406 107.371 2.13123 107.105 2.38638C106.838 2.64153 106.62 2.93148 106.451 3.25622C106.305 3.58096 106.233 3.9057 106.233 4.23044V18.1131ZM111.175 18.7741H106.233C105.772 18.7741 105.542 18.5538 105.542 18.1131V4.23044C105.542 3.81291 105.639 3.40699 105.833 3.01266C106.051 2.61834 106.317 2.2704 106.632 1.96886C106.972 1.64412 107.335 1.38897 107.723 1.2034C108.135 0.994639 108.546 0.890259 108.958 0.890259H125.603C126.064 0.890259 126.294 1.11062 126.294 1.55133V6.00491C126.294 6.44562 126.064 6.66598 125.603 6.66598H111.866V7.15309H125.567C126.027 7.15309 126.257 7.37345 126.257 7.81417V11.8502C126.257 12.2909 126.027 12.5113 125.567 12.5113H111.866V18.1131C111.866 18.5538 111.636 18.7741 111.175 18.7741Z" fill="#72F34B" />
    <path d="M134.468 18.1131V1.93406H129.562V18.1131H134.468ZM135.123 1.93406V18.1131C135.123 18.5538 134.905 18.7741 134.468 18.7741H129.562C129.126 18.7741 128.908 18.5538 128.908 18.1131V1.93406C128.908 1.49335 129.126 1.27299 129.562 1.27299H134.468C134.905 1.27299 135.123 1.49335 135.123 1.93406Z" fill="#72F34B" />
  </svg>
}

export const RelatingIcon = () => {
  return <svg width="27" height="35" viewBox="0 0 27 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.07468 16.7109L0.961288 22.7566V24.6412H2.84589L8.95929 18.5955L24.6606 34.2968L26.5452 32.4122L10.8544 16.7214L24.905 2.8265L23.0204 0.941895L8.96979 14.8368L2.88534 8.75238L1.00074 8.75239L1.00073 10.637L7.07468 16.7109Z" fill="#EDEDED" />
    <mask id="mask0_1_32" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="8" y="0" width="19" height="35">
      <rect x="8.95699" y="0.941895" width="17.8366" height="33.4179" fill="#C4C4C4" />
    </mask>
    <g mask="url(#mask0_1_32)">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.07468 16.7109L0.961287 22.7566L0.961287 24.6412H2.84589L8.95929 18.5955L24.6606 34.2968L26.5452 32.4122L10.8544 16.7214L24.905 2.82649L23.0204 0.941883L8.96979 14.8368L2.88534 8.75237L1.00074 8.75238L1.00073 10.637L7.07468 16.7109Z" fill="#72F34B" />
    </g>
  </svg>
}

export const SoldOutIcon = () => {
  return <svg className="sm:w-44 sm:h-36 w-32 h-24" viewBox="0 0 184 145" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_4_80)">
      <path fillRule="evenodd" clipRule="evenodd" d="M24.9864 126.555L42.9966 95.36L50.6903 99.802L40.3738 117.671L138.294 117.671L127.977 99.802L135.671 95.36L153.681 126.555L24.9864 126.555ZM89.2704 32.4741L69.9047 63.4894L62.3691 58.7842L89.3969 15.4977L115.57 58.8406L107.965 63.433L89.2704 32.4741Z" fill="#CC4D4D" />
    </g>
    <path d="M27.6549 80.92H15.2709C14.9722 80.92 14.7055 80.8453 14.4709 80.696C14.2362 80.5467 14.0549 80.3547 13.9269 80.12C13.7989 79.864 13.7242 79.5867 13.7029 79.288C13.7029 78.968 13.7775 78.648 13.9269 78.328L16.1989 73.496C16.3482 73.176 16.5722 72.8667 16.8709 72.568C17.1695 72.248 17.4895 71.9707 17.8309 71.736C18.1935 71.48 18.5669 71.2773 18.9509 71.128C19.3349 70.9787 19.6762 70.904 19.9749 70.904H36.9669L34.9509 75.224H20.0069L19.1749 76.984H31.5589C31.8575 76.984 32.1242 77.0587 32.3589 77.208C32.5935 77.3573 32.7749 77.56 32.9029 77.816C33.0309 78.0507 33.0949 78.328 33.0949 78.648C33.1162 78.9467 33.0522 79.256 32.9029 79.576L30.6629 84.408C30.5135 84.728 30.2895 85.048 29.9909 85.368C29.6922 85.6667 29.3615 85.944 28.9989 86.2C28.6575 86.4347 28.2949 86.6267 27.9109 86.776C27.5269 86.9253 27.1855 87 26.8869 87H8.07088L10.0869 82.68H26.8549L27.6549 80.92ZM56.4044 70.904C56.703 70.904 56.9697 70.9787 57.2044 71.128C57.439 71.2773 57.6204 71.48 57.7484 71.736C57.8764 71.9707 57.9404 72.248 57.9404 72.568C57.9617 72.8667 57.8977 73.176 57.7484 73.496L52.6604 84.408C52.511 84.728 52.287 85.048 51.9884 85.368C51.6897 85.6667 51.359 85.944 50.9964 86.2C50.655 86.4347 50.2924 86.6267 49.9084 86.776C49.5244 86.9253 49.183 87 48.8844 87H34.0684C33.7697 87 33.503 86.9253 33.2684 86.776C33.0337 86.6267 32.8524 86.4347 32.7244 86.2C32.5964 85.944 32.5217 85.6667 32.5004 85.368C32.5004 85.048 32.575 84.728 32.7244 84.408L37.8124 73.496C37.9617 73.176 38.1857 72.8667 38.4844 72.568C38.783 72.248 39.103 71.9707 39.4444 71.736C39.807 71.48 40.1804 71.2773 40.5644 71.128C40.9484 70.9787 41.2897 70.904 41.5884 70.904H56.4044ZM52.3404 75.224H41.6204L38.1324 82.68H48.8524L52.3404 75.224ZM65.6051 70.904H60.9971L54.6931 84.408C54.5438 84.728 54.4691 85.048 54.4691 85.368C54.4905 85.6667 54.5651 85.944 54.6931 86.2C54.8211 86.4347 55.0025 86.6267 55.2371 86.776C55.4718 86.9253 55.7385 87 56.0371 87H71.3971L73.4131 82.68H60.1011L65.6051 70.904ZM73.4459 87L78.1179 76.984H82.7259L80.0699 82.68H90.7259L94.2139 75.224H78.9499L80.9659 70.904H98.2779C98.5765 70.904 98.8432 70.9787 99.0779 71.128C99.3125 71.2773 99.4939 71.48 99.6219 71.736C99.7499 71.9707 99.8139 72.248 99.8139 72.568C99.8352 72.8667 99.7712 73.176 99.6219 73.496L94.5339 84.408C94.3845 84.728 94.1605 85.048 93.8619 85.368C93.5632 85.6667 93.2325 85.944 92.8699 86.2C92.5285 86.4347 92.1659 86.6267 91.7819 86.776C91.3979 86.9253 91.0565 87 90.7579 87H73.4459ZM131.811 70.904C132.109 70.904 132.376 70.9787 132.611 71.128C132.845 71.2773 133.027 71.48 133.155 71.736C133.283 71.9707 133.347 72.248 133.347 72.568C133.368 72.8667 133.304 73.176 133.155 73.496L128.067 84.408C127.917 84.728 127.693 85.048 127.395 85.368C127.096 85.6667 126.765 85.944 126.403 86.2C126.061 86.4347 125.699 86.6267 125.315 86.776C124.931 86.9253 124.589 87 124.291 87H109.475C109.176 87 108.909 86.9253 108.675 86.776C108.44 86.6267 108.259 86.4347 108.131 86.2C108.003 85.944 107.928 85.6667 107.907 85.368C107.907 85.048 107.981 84.728 108.131 84.408L113.219 73.496C113.368 73.176 113.592 72.8667 113.891 72.568C114.189 72.248 114.509 71.9707 114.851 71.736C115.213 71.48 115.587 71.2773 115.971 71.128C116.355 70.9787 116.696 70.904 116.995 70.904H131.811ZM127.747 75.224H117.027L113.539 82.68H124.259L127.747 75.224ZM135.507 82.68H146.163L151.667 70.904H156.275L149.971 84.408C149.822 84.728 149.598 85.048 149.299 85.368C149.001 85.6667 148.67 85.944 148.307 86.2C147.966 86.4347 147.603 86.6267 147.219 86.776C146.835 86.9253 146.494 87 146.195 87H131.443C131.145 87 130.878 86.9253 130.643 86.776C130.409 86.6267 130.227 86.4347 130.099 86.2C129.971 85.944 129.897 85.6667 129.875 85.368C129.875 85.048 129.95 84.728 130.099 84.408L136.403 70.904H141.011L135.507 82.68ZM156.294 75.224L158.31 70.904H177.446L175.43 75.224H168.166L162.662 87H158.054L163.558 75.224H156.294Z" fill="white" />
    <defs>
      <clipPath id="clip0_4_80">
        <rect width="184" height="145" fill="white" />
      </clipPath>
    </defs>
  </svg>
}

export const MetamaskIcon = () => {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.4857 2.00565L9.86426 6.18079L10.9038 3.71751L15.4857 2.00565Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5083 2.00565L8.08457 6.22034L7.09587 3.71751L2.5083 2.00565Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.463 11.6836L11.9658 13.9774L15.1692 14.8588L16.0901 11.7345L13.463 11.6836Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.91504 11.7345L2.83029 14.8588L6.03368 13.9774L4.53651 11.6836L1.91504 11.7345Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.8531 7.8079L4.96045 9.15818L8.14124 9.29943L8.02825 5.88135L5.8531 7.8079Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.1411 7.8079L9.9377 5.8418L9.86426 9.29942L13.0394 9.15818L12.1411 7.8079Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.03369 13.9774L7.9433 13.0452L6.29358 11.7571L6.03369 13.9774Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.0508 13.0452L11.966 13.9774L11.7005 11.7571L10.0508 13.0452Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.966 13.9774L10.0508 13.0452L10.2033 14.2938L10.1864 14.8192L11.966 13.9774Z" fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.03369 13.9774L7.81335 14.8192L7.80205 14.2938L7.9433 13.0452L6.03369 13.9774Z" fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.84176 10.9322L6.24854 10.4633L7.37283 9.94916L7.84176 10.9322Z" fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.1523 10.9322L10.6213 9.94916L11.7512 10.4633L10.1523 10.9322Z" fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.0338 13.9774L6.30499 11.6836L4.53662 11.7345L6.0338 13.9774Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.6948 11.6836L11.966 13.9774L13.4632 11.7345L11.6948 11.6836Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.0394 9.15819L9.86426 9.29943L10.158 10.9322L10.627 9.94915L11.7569 10.4633L13.0394 9.15819Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.24858 10.4633L7.37853 9.94915L7.84181 10.9322L8.14124 9.29943L4.96045 9.15819L6.24858 10.4633Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.96045 9.15819L6.29378 11.7571L6.24858 10.4633L4.96045 9.15819Z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.7572 10.4633L11.7007 11.7571L13.0397 9.15819L11.7572 10.4633Z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.14123 9.29944L7.8418 10.9322L8.21468 12.8588L8.29942 10.322L8.14123 9.29944Z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.86446 9.29944L9.71191 10.3164L9.77971 12.8588L10.1582 10.9322L9.86446 9.29944Z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.1583 10.9322L9.77979 12.8588L10.051 13.0452L11.7007 11.7571L11.7572 10.4633L10.1583 10.9322Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.24854 10.4633L6.29373 11.7571L7.94345 13.0452L8.21464 12.8588L7.84176 10.9322L6.24854 10.4633Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.1862 14.8192L10.2032 14.2938L10.0619 14.1695H7.932L7.80205 14.2938L7.81335 14.8192L6.03369 13.9774L6.65516 14.4859L7.91505 15.3616H10.0789L11.3444 14.4859L11.9659 13.9774L10.1862 14.8192Z" fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.0508 13.0452L9.77965 12.8587H8.21467L7.94349 13.0452L7.80225 14.2938L7.93219 14.1695H10.0621L10.2034 14.2938L10.0508 13.0452Z" fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.7231 6.45197L16.2033 4.14689L15.4858 2.00565L10.0508 6.03955L12.1412 7.80791L15.096 8.67231L15.7513 7.9096L15.4689 7.70621L15.9208 7.29378L15.5706 7.0226L16.0225 6.67796L15.7231 6.45197Z" fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.79639 4.14689L2.27661 6.45197L1.97153 6.67796L2.42351 7.0226L2.07887 7.29378L2.53085 7.70621L2.24836 7.9096L2.89808 8.67231L5.85289 7.80791L7.94328 6.03955L2.50825 2.00565L1.79639 4.14689Z" fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.0962 8.67231L12.1414 7.80791L13.0397 9.15819L11.7007 11.7571L13.4634 11.7345H16.0905L15.0962 8.67231Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.85289 7.80791L2.89809 8.67231L1.91504 11.7345H4.53651L6.29357 11.7571L4.96024 9.15819L5.85289 7.80791Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.86455 9.29943L10.051 6.03955L10.9097 3.71751H7.09619L7.94365 6.03955L8.14139 9.29943L8.20919 10.3277L8.21483 12.8588H9.77981L9.7911 10.3277L9.86455 9.29943Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

export const GreenTickIcon = () => {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#6CDB00" />
    <g clipPath="url(#clip0_157_3117)">
      <path d="M16.725 7.725L9.75 14.7L7.275 12.225C6.975 11.925 6.525 11.925 6.225 12.225C5.925 12.525 5.925 12.975 6.225 13.275L9.225 16.275C9.375 16.425 9.525 16.5 9.75 16.5C9.975 16.5 10.125 16.425 10.275 16.275L17.775 8.775C18.075 8.475 18.075 8.025 17.775 7.725C17.475 7.425 17.025 7.425 16.725 7.725Z" fill="#21232A" />
    </g>
    <defs>
      <clipPath id="clip0_157_3117">
        <rect width="12" height="12" fill="white" transform="translate(6 6)" />
      </clipPath>
    </defs>
  </svg>
}

export const BackIcon = () => {
  return (
    <svg className="w-6 h-6 mr-2" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.5 8.5H1.5" stroke="currentColor" strokeMiterlimit="10" />
      <path d="M8.5 15.5L1.5 8.5L8.5 1.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="square" />
    </svg>
  )
}
