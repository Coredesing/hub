import { sotaTiersActions } from '../constants/sota-tiers';
import { AnyAction } from 'redux';

type StateType = {
  data: object;
  loading: boolean;
  error: string;
};

const initialState = {
  data: {},
  loading: false,
  error: ''
};

export const getDelayTiersReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {
    case sotaTiersActions.DELAY_TIERS_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false
      }
    }
    default: {
      return state;
    }
  }
};

export const getTiersReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {

    case sotaTiersActions.TIERS_LOADING: {
      return {
        ...state,
        loading: true
      }
    } 

    case sotaTiersActions.TIERS_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false
      }
    }

    case sotaTiersActions.TIERS_FAILURE: {
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

export const getUserTierReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {

    case sotaTiersActions.USER_TIER_LOADING: {
      return {
        ...state,
        loading: true
      }
    } 

    case sotaTiersActions.USER_TIER_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false
      }
    }

    case sotaTiersActions.USER_TIER_FAILURE: {
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    }

    case sotaTiersActions.USER_TIER_RESET: {
      return {
        data: {},
        loading: false,
        error: ''
      }
    }

    default: {
      return state;
    }
  }
};

export const getUserInfoReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {

    case sotaTiersActions.USER_INFO_LOADING: {
      return {
        ...state,
        loading: true
      }
    } 

    case sotaTiersActions.USER_INFO_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false
      }
    }

    case sotaTiersActions.USER_INFO_FAILURE: {
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

export const ratesReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {

    case sotaTiersActions.RATES_LOADING: {
      return {
        ...state,
        loading: true
      }
    } 

    case sotaTiersActions.RATES_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false
      }
    }

    case sotaTiersActions.RATES_FAILURE: {
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


