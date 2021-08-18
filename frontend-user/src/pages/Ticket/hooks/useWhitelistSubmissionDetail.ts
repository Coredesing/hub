import { useEffect, useMemo, useState } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import useFetch from '../../../hooks/useFetch';

export type WhitelistSubmission = {
  id: number;
  campaign_id: number;
  partner_channel_status: number;
  partner_group_status: number;
  partner_retweet_post_status: number;
  partner_twitter_status: number;
  self_channel_status: number;
  self_group_status: number;
  self_retweet_post_status: number;
  self_twitter_status: number;
  user_telegram: string;
  user_twitter: string;
  wallet_address: string;
}

export type Pools = []

export type Pagination = {
  page: any,
  lastPage: any,
  perPage: any,
  total: any
}

export type WhitelistSubmissionReturnType ={
  submission: WhitelistSubmission | any,
  completed: boolean,
  rejected: boolean,
  pending: boolean,
  loading: boolean
}

const useWhitelistSubmissionDetail = (poolId: number | undefined, connectedAccount: string | null | undefined, alreadyJoinPool: boolean | undefined, joinPoolSuccess: boolean | undefined): WhitelistSubmissionReturnType => {
  const [submissionDone, setSubmissionDone] = useState<boolean>(false);
  // const [complete, setComplete] = useState<boolean>(false);
  const [url, setUrl] = useState<string | undefined>(undefined)

  useEffect(()=> {
    if (poolId && connectedAccount && (alreadyJoinPool || joinPoolSuccess)) {
      setUrl(`/user/whitelist-apply/${poolId}?wallet_address=${connectedAccount}`)
    }
  }, [poolId, connectedAccount, alreadyJoinPool, joinPoolSuccess])

  const {loading, error, data: submission} = useFetch<any>(url)
  const { data: connectedAccountTier } = useTypedSelector(state => state.userTier);


  const {completed, rejected, pending} = useMemo(() => {
    if (loading || error || !submissionDone) {
      return {
        completed: false,
        rejected: false,
        pending: false,
      }
    }

    if (connectedAccountTier >= 3) {
      return {
        completed: true,
        rejected: false,
        pending: false,
      }
    }

    const listStatuses = [
      submission?.partner_twitter_status,
      submission?.partner_channel_status,
      submission?.partner_group_status,
      submission?.partner_retweet_post_status,
      submission?.self_twitter_status,
      submission?.self_channel_status,
      submission?.self_group_status,
      submission?.self_retweet_post_status,
    ]

    return {
      completed: !(listStatuses.includes(0) || listStatuses.includes(2) || listStatuses.includes(3)),
      rejected: listStatuses.includes(3),
      pending: listStatuses.includes(0) || listStatuses.includes(2),
    }
  }, [submission, loading, error, submissionDone, connectedAccountTier]);

  useEffect(() => {
    submission && setSubmissionDone(true)
  }, [submission])

  return  {
    submission,
    completed,
    rejected,
    pending,
    loading: !submissionDone
  }
}

export default useWhitelistSubmissionDetail;
