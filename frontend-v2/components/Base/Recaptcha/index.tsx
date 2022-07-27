import React from 'react'
import { RECAPTCHA_SITE_KEY, RECAPTCHA_SITE_KEY_HUB } from '@/utils/constants'
import HCaptcha from '@hcaptcha/react-hcaptcha'

type Props = {
    className?: string;
    source?: string;
    onChange?: ((token: string | null) => void) | undefined;
    [k: string]: any;
}
const Recaptcha = ({ className, onChange, source, ...props }: Props, ref) => {
  return (
    RECAPTCHA_SITE_KEY
      ? <div className={className}>
        <HCaptcha
          {...props}
          sitekey={source === 'hub' ? RECAPTCHA_SITE_KEY_HUB : RECAPTCHA_SITE_KEY}
          // sitekey={RECAPTCHA_SITE_KEY}
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
