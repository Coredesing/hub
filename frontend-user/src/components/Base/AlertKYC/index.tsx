import React from 'react';
import { trimMiddlePartAddress } from '../../../utils/accountAddress';
import { WrapperAlert } from '../WrapperAlert';

export const AlertKYC = ({ connectedAccount,...props }: { [k in string]: any }) => {
    return (
        <WrapperAlert type="error">
            <span>
                The connected wallet address (
                {trimMiddlePartAddress(connectedAccount || '')}) is unverified.&nbsp;
                <a
                    href="https://verify-with.blockpass.org/?clientId=red_kite_kyc_7a0e6&serviceName=Red%20Kite%20KYC&env=prod"
                    target="_blank"
                    rel="noreferrer"
                    className="kyc-link"
                >
                    Please submit KYC now
                </a>
                &nbsp;or switch to a verified address.
            </span>
        </WrapperAlert>
    )
}
