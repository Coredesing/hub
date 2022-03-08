import { initReducer } from '../utils'
import { marketActivitiesActions, discoverMarketActions } from './constant'

const tiersReducer = (state, action) => {
  return initReducer(
    state,
    action,
    {
      loading: marketActivitiesActions.LOADING,
      success: marketActivitiesActions.SUCCESS,
      failure: marketActivitiesActions.FAILURE
    })
}

export default tiersReducer

export const discoverMarketReducer = (state, action) => {
  return initReducer(
    state,
    action,
    {
      loading: discoverMarketActions.LOADING,
      success: discoverMarketActions.SUCCESS,
      failure: discoverMarketActions.FAILURE
    })
}