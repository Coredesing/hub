import { useState, useEffect } from 'react'
import { USER_STATUS, API_BASE_URL } from '@/utils/constants'
import { fetcher } from '@/utils'
const isRequiredKyc = process.env.REACT_APP_APP_KYC_REQUIRED === 'true'

type ReturnType = {
    emailVerified: number,
    email: string | null | undefined;
    isKYC: boolean,
    checkingKyc: boolean
}
/**
 *
 * @param connectedAccount
 * @param isCheckKyc if passed will priority check for this param
 * @returns
 */
const useKyc = (connectedAccount: string | null | undefined, isCheckKyc?: boolean): ReturnType => {
  const [info, setInfo] = useState<ReturnType>({
    emailVerified: USER_STATUS.UNVERIFIED,
    email: null,
    isKYC: false,
    checkingKyc: true
  })
  useEffect(() => {
    const run = async () => {
      const response = await fetcher(`${API_BASE_URL}/user/profile?wallet_address=${connectedAccount}`)
      const result = response.data
      setInfo({
        emailVerified: result?.user?.status,
        email: result?.user?.email,
        isKYC: +result?.user?.is_kyc === 1,
        checkingKyc: false
      })
    }
    if (isCheckKyc !== undefined) {
      if (isCheckKyc) {
        connectedAccount && run()
      } else {
        setInfo(info => ({ ...info, checkingKyc: false, isKYC: true }))
      }
    } else if (isRequiredKyc) {
      connectedAccount && run()
    } else {
      setInfo(info => ({ ...info, checkingKyc: false, isKYC: true }))
    }
  }, [connectedAccount, isCheckKyc])
  return info
}

export default useKyc
