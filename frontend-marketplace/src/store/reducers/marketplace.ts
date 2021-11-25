import { hotCollectionsActions, bigOfferActions } from '../constants/marketplace';
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


export const hotCollectionReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {

    case hotCollectionsActions.HOT_COLLECTION_LOADING: {
      return {
        ...state,
        loading: true
      }
    } 

    case hotCollectionsActions.HOT_COLLECTION_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false
      }
    }

    case hotCollectionsActions.HOT_COLLECTION_FAILURE: {
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


export const bigOfferReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {

    case bigOfferActions.BIG_OFFER_LOADING: {
      return {
        ...state,
        loading: true
      }
    } 

    case bigOfferActions.BIG_OFFER_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false
      }
    }

    case bigOfferActions.BIG_OFFER_FAILURE: {
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
