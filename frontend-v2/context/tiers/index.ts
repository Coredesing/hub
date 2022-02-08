import { useReducer } from 'react'
import { tiersActions } from './constant'
import tiersReducer from './reducer'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'

const tiersContext = () => {
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

  const setData = (data: any) => {
    dispatch({ type: tiersActions.SUCCESS, payload: data })
  }

  return {
    state,
    actions: {
      getUserTier
    }
  }
}

export default tiersContext
