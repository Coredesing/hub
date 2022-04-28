import { useReducer } from 'react'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'

const poolActionTypes = {
  UPDATE_IGO_POOL_COUNT: 'UPDATE_IGO_POOL_COUNT'
}

const poolReducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
  case poolActionTypes.UPDATE_IGO_POOL_COUNT:
    return {
      ...state,
      igo: {
        ...state.igoPool,
        count: payload
      }
    }

  default:
    return state
  }
}

const usePoolContext = () => {
  const initState = {
    igo: {
      count: 0
    }
  }
  const [state, dispatch] = useReducer(poolReducer, initState)

  const getIgoPoolCount = async () => {
    try {
      const response = await fetcher(`${API_BASE_URL}/pools/count-pools?token_type=erc20&is_display=1`)
      const data = response?.data
      dispatch({
        type: poolActionTypes.UPDATE_IGO_POOL_COUNT,
        payload: data?.count || 0
      })
    } catch (error) {
      console.debug('error', error)
      dispatch({
        type: poolActionTypes.UPDATE_IGO_POOL_COUNT,
        payload: 0
      })
    }
  }

  return {
    state,
    actions: {
      getIgoPoolCount
    }
  }
}

export default usePoolContext
