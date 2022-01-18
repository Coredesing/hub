import React from 'react'
import { RECAPTCHA_SITE_KEY } from '@/constants';
import HCaptcha from '@hcaptcha/react-hcaptcha';

type Props = {
    className?: string,
    onChange?: ((token: string | null) => void) | undefined,
    [k: string]: any
}
export const Recaptcha = React.forwardRef(({ className, onChange, ...props }: Props, ref) => {
    return (
        RECAPTCHA_SITE_KEY ? <div className={className}>
            <HCaptcha
                {...props}
                sitekey={RECAPTCHA_SITE_KEY}
                onVerify={onChange}
                ref={ref as any}
            > </HCaptcha>
        </div> : null
    )
})

export default React.memo(Recaptcha);