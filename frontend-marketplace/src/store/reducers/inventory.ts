import { assetsAccountActions, listOffersAccountActions, listingsAccountActions } from '../constants/inventory';
import { AnyAction } from 'redux';
import { initReducer, StateType } from './utils';

export const assetsAccountReducer = (state: StateType, action: AnyAction) => {
  return initReducer(
    state,
    action,
    {
      loading: assetsAccountActions.LOADING,
      success: assetsAccountActions.SUCCESS,
      failure: assetsAccountActions.FAILURE,
    })
};

export const listOffersAccountReducer = (state: StateType, action: AnyAction) => {
  return initReducer(
    state,
    action,
    {
      loading: listOffersAccountActions.LOADING,
      success: listOffersAccountActions.SUCCESS,
      failure: listOffersAccountActions.FAILURE,
    })
};


export const listingsAccountReducer = (state: StateType, action: AnyAction) => {
  return initReducer(
    state,
    action,
    {
      loading: listingsAccountActions.LOADING,
      success: listingsAccountActions.SUCCESS,
      failure: listingsAccountActions.FAILURE,
    })
};
