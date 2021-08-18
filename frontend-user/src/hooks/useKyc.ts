import { useState, useEffect } from 'react';
import useFetch from './useFetch';
import { USER_STATUS } from '../constants';

type ReturnType = {
    emailVerified: number,
    email: string | null | undefined;
    isKYC: boolean,
}
const useKyc = (connectedAccount: string | null | undefined): ReturnType => {
    
    const {
        data = {},
        loading,
    } = useFetch<any>(`/user/profile?wallet_address=${connectedAccount}`);
    const [emailVerified, setEmailVeryfied] = useState(0);
    const [email, setEmail] = useState<string>("");
    const [isKYC, setIsKYC] = useState(false);


    useEffect(() => {
        setEmail("");
        setEmailVeryfied(USER_STATUS.UNVERIFIED);
        setIsKYC(false);
    }, [connectedAccount]);
    useEffect(() => {
        if (data && data.user && data.user) {
            setEmail(data.user.email);
            setEmailVeryfied(data.user.status);
            setIsKYC(data.user.is_kyc == 1 ? true : false);
        } else {
            setEmail("");
            setEmailVeryfied(USER_STATUS.UNVERIFIED);
            setIsKYC(false);
        }
    }, [data]);

    return { emailVerified, email, isKYC };
}

export default useKyc;
