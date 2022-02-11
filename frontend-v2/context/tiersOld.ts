import { useReducer } from 'react'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import { initReducer } from './utils'

const tiersActions = {
  LOADING: 'TIERS_LOADING',
  SUCCESS: 'TIERS_SUCCESS',
  FAILURE: 'TIERS_FAILURE'
}

const tiersReducer = (state, action) => {
  return initReducer(
    state,
    action,
    {
      loading: tiersActions.LOADING,
      success: tiersActions.SUCCESS,
      failure: tiersActions.FAILURE
    })
}

const useTiersContext = () => {
  const initState = {
    data: null,
    loading: false,
    error: ''
  }
  const [state, dispatch] = useReducer(tiersReducer, initState)

  const getUserTier = async (walletAddress: string) => {
    dispatch({ type: tiersActions.LOADING, payload: state })
    try {
      const response = await fetcher(`${API_BASE_URL}/user/tier-info?wallet_address=${walletAddress}`)
      const data = response.data
      dispatch({
        type: tiersActions.SUCCESS,
        payload: {
          tier: data?.tier,
          ...(data?.stakedInfo || {})
        }
      })
    } catch (error) {
      console.log('error', error)
      dispatch({ type: tiersActions.FAILURE, payload: error })
    }
  }

  return {
    state,
    actions: {
      getUserTier
    }
  }
}

export default useTiersContext
