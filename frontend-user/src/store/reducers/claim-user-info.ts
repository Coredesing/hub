import { AnyAction } from 'redux'
import {claimUserInfoActions} from "../constants/claim-user-info";

const initialState = {
  data: {},
};

export const claimUserInfoReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case claimUserInfoActions.UPDATE_CLAIM_USER_INFO: {
      return {
        ...state,
        data: action.payload
      }
    }

    default: {
      return state;
    }
  }
}
