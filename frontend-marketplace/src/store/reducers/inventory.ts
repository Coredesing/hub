import { assetsAccountActions } from '../constants/inventory';
import { AnyAction } from 'redux';

type StateType = {
  data: null | object;
  loading: boolean;
  error: string;
};

const initialState = {
  data: null,
  loading: false,
  error: ''
};

export const assetsAccountReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {

    case assetsAccountActions.LOADING: {
      return {
        ...state,
        loading: true
      }
    } 

    case assetsAccountActions.SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false
      }
    }

    case assetsAccountActions.FAILURE: {
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    }

    default: {
      return state;
    }
  }
};
