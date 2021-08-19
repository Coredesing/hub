import { useState, useEffect } from 'react';
import { USER_STATUS } from '../constants';
import axios from '../services/axios';

type ReturnType = {
    emailVerified: number,
    email: string | null | undefined;
    isKYC: boolean,
    checkingKyc: boolean
}
const useKyc = (connectedAccount: string | null | undefined): ReturnType => {
    
    const [info, setInfo] = useState<ReturnType>({
        emailVerified: USER_STATUS.UNVERIFIED,
        email: null,
        isKYC: false,
        checkingKyc: true
    });
    useEffect(() => {
        const run = async () => {
            const response = await axios.get(`/user/profile?wallet_address=${connectedAccount}`) as any;
            const result = response.data.data;
            setInfo({
                emailVerified: result?.user?.status,
                email: result?.user?.email,
                isKYC: +result?.user?.is_kyc === 1,
                checkingKyc: false,
            })
        }
        connectedAccount && run();
    }, [connectedAccount])
    return info;
}

export default useKyc;
