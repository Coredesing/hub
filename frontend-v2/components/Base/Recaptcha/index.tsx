import React from 'react'
import { RECAPTCHA_SITE_KEY } from '@/utils/constants'
import HCaptcha from '@hcaptcha/react-hcaptcha'

type Props = {
    className?: string;
    onChange?: ((token: string | null) => void) | undefined;
    [k: string]: any;
}
const Recaptcha = ({ className, onChange, ...props }: Props, ref) => {
  return (
    RECAPTCHA_SITE_KEY
      ? <div className={className}>
        <HCaptcha
          {...props}
          sitekey={RECAPTCHA_SITE_KEY}
          onVerify={onChange}
          ref={ref}
          theme='dark'
        > </HCaptcha>
      </div>
      : null
  )
}
export const _Recaptcha = React.forwardRef(Recaptcha)

export default React.memo(_Recaptcha)
