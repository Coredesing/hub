import { currencyActions } from '../constants/currency';
import { AnyAction } from 'redux';
import { initReducer, StateType } from './utils';

export const currenciesReducer = (state: StateType, action: AnyAction) => {
  return initReducer(
    state,
    action,
    {
      loading: currencyActions.LOADING,
      success: currencyActions.SUCCESS,
      failure: currencyActions.FAILURE,
    })
};
