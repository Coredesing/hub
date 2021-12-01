import { itemsProjectCollectionActions, projectInforActions, activitiesProjectCollectionActions } from '../constants/project-collection';
import { AnyAction } from 'redux';
import { initReducer, StateType } from './utils';

export const projectInforsReducer = (state: StateType, action: AnyAction) => {
    return initReducer(
        state,
        action,
        {
            loading: projectInforActions.LOADING,
            success: projectInforActions.SUCCESS,
            failure: projectInforActions.FAILURE,
        })
};


export const itemsProjectCollectionsReducer = (state: StateType, action: AnyAction) => {
    return initReducer(
        state,
        action,
        {
            loading: itemsProjectCollectionActions.LOADING,
            success: itemsProjectCollectionActions.SUCCESS,
            failure: itemsProjectCollectionActions.FAILURE,
        })
};


export const activitiesProjectCollectionsReducer = (state: StateType, action: AnyAction) => {
    return initReducer(
        state,
        action,
        {
            loading: activitiesProjectCollectionActions.LOADING,
            success: activitiesProjectCollectionActions.SUCCESS,
            failure: activitiesProjectCollectionActions.FAILURE,
        })
};
