import { initReducer } from '../utils'
import { marketActivitiesActions, discoverMarketActions, collectionMarketActions } from './constant'

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

export const collectionMarketReducer = (state, action) => {
  return initReducer(
    state,
    action,
    {
      loading: collectionMarketActions.LOADING,
      success: collectionMarketActions.SUCCESS,
      failure: collectionMarketActions.FAILURE
    })
}
