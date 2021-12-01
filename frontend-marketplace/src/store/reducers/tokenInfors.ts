import { tokenInforsActions } from '../constants/tokenInfors';
import { AnyAction } from 'redux';
import { initReducer, StateType } from './utils';

export const tokenInforsReducer = (state: StateType, action: AnyAction) => {
  return initReducer(
    state,
    action,
    {
      loading: tokenInforsActions.LOADING,
      success: tokenInforsActions.SUCCESS,
      failure: tokenInforsActions.FAILURE,
    })
};
