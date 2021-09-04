import React from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from '../../../constants';
// import { makeStyles } from '@material-ui/core';

// const useStyles = makeStyles((theme: any) => {

// })
type Props = {
    className?: string,
    onChange?: ((token: string | null) => void) | undefined,
    [k: string]: any
}
export const Recapcha = ({className, onChange}: Props) => {
    return (
        <div className={className}>
        <ReCAPTCHA
            // ref={recaptchaRef}
            theme={"dark"}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={onChange}
        />
        </div>
    )
}
