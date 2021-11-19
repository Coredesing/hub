import { campaignActions }from '../constants/campaign'
import { AnyAction } from 'redux'

const initialState = {
  data: [],
  loading: false,
  failure: '',
}

export const campaignsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case campaignActions.CAMPAIGNS_REQUEST: {
      return {
        ...state,
        loading: true,
        failure: ""
      }
    }

    case campaignActions.CAMPAIGNS_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false
      }
    }

    case campaignActions.CAMPAIGNS_FAIL: {
      return {
        data: [],
        failure: action.payload,
        loading: false
      }
    }

    default: {
      return state;
    }
  }
}
