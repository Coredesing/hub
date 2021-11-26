import { hotCollectionsActions, listOfferActions, itemsCollectionActions, activitiesCollectionActions } from '../constants/marketplace';
import { AnyAction } from 'redux';
import { initReducer, StateType } from './utils';


export const hotCollectionReducer = (state: StateType, action: AnyAction) => {
  return initReducer(
    state,
    action,
    {
      loading: hotCollectionsActions.LOADING,
      success: hotCollectionsActions.SUCCESS,
      failure: hotCollectionsActions.FAILURE,
    })
};

export const listOfferReducer = (state: StateType, action: AnyAction) => {
  return initReducer(
    state,
    action,
    {
      loading: listOfferActions.LOADING,
      success: listOfferActions.SUCCESS,
      failure: listOfferActions.FAILURE,
    })
};

export const itemsCollectionReducer = (state: StateType, action: AnyAction) => {
  return initReducer(
    state,
    action,
    {
      loading: itemsCollectionActions.LOADING,
      success: itemsCollectionActions.SUCCESS,
      failure: itemsCollectionActions.FAILURE,
    })
};

export const activitiesCollectionReducer = (state: StateType, action: AnyAction) => {
  return initReducer(
    state,
    action,
    {
      loading: activitiesCollectionActions.LOADING,
      success: activitiesCollectionActions.SUCCESS,
      failure: activitiesCollectionActions.FAILURE,
    })
};
