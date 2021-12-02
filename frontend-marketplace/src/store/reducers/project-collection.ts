import { itemsProjectCollectionActions, projectInforActions, activitiesProjectCollectionActions, activitiesDetailCollectionActions } from '../constants/project-collection';
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

export const activitiesDetailCollectionsReducer = (state: StateType, action: AnyAction) => {
    return initReducer(
        state,
        action,
        {
            loading: activitiesDetailCollectionActions.LOADING,
            success: activitiesDetailCollectionActions.SUCCESS,
            failure: activitiesDetailCollectionActions.FAILURE,
        })
};
