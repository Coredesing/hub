import React from 'react'
import { trimMiddlePartAddress } from '../../../utils/accountAddress';
import useStyles from './style';
const iconWarning = "/images/warning-red.svg";

export const AlertKYC = ({connectedAccount}: {[k in string]: any}) => {
    const classes = useStyles();
    return (
        <div className={classes.displayContent}>
            <div className={classes.alert}>
                <img src={iconWarning} style={{ marginRight: "12px" }} alt="" />
                <span>
                    The connected wallet address (
                    {trimMiddlePartAddress(connectedAccount || '')}) is unverified.&nbsp;
                    <a
                        href="https://verify-with.blockpass.org/?clientId=red_kite_kyc_7a0e6&serviceName=Red%20Kite%20KYC&env=prod"
                        target="_blank"
                        rel="noreferrer"
                        className="kyc-link"
                    >
                        Please sumbit KYC now
                    </a>
                    &nbsp;or switch to a verified address. Click{" "}
                    <a
                        href="https://medium.com/polkafoundry/what-to-do-before-joining-idos-on-red-kite-de9b0d778dbe"
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                    >
                        here
                    </a>{" "}
                    for more process details.
                </span>
            </div>
        </div>
    )
}
