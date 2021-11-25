import { itemsProjectCollectionActions, projectInforActions, activitiesProjectCollectionActions } from '../constants/project-collection';
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


export const projectInforsReducer = (state: StateType = initialState, action: AnyAction) => {
    switch (action.type) {

        case projectInforActions.PROJECT_INFOR_LOADING: {
            return {
                ...state,
                loading: true
            }
        }

        case projectInforActions.PROJECT_INFOR_SUCCESS: {
            return {
                ...state,
                data: action.payload,
                loading: false
            }
        }

        case projectInforActions.PROJECT_INFOR_FAILURE: {
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


export const itemsProjectCollectionsReducer = (state: StateType = initialState, action: AnyAction) => {
    switch (action.type) {

        case itemsProjectCollectionActions.ITEMS_PROJECT_COLLECTION_LOADING: {
            return {
                ...state,
                loading: true
            }
        }

        case itemsProjectCollectionActions.ITEMS_PROJECT_COLLECTION_SUCCESS: {
            return {
                ...state,
                data: action.payload,
                loading: false
            }
        }

        case itemsProjectCollectionActions.ITEMS_PROJECT_COLLECTION_FAILURE: {
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

export const activitiesProjectCollectionsReducer = (state: StateType = initialState, action: AnyAction) => {
    switch (action.type) {

        case activitiesProjectCollectionActions.ACTIVITIES_PROJECT_COLLECTION_LOADING: {
            return {
                ...state,
                loading: true
            }
        }

        case activitiesProjectCollectionActions.ACTIVITIES_PROJECT_COLLECTION_SUCCESS: {
            return {
                ...state,
                data: action.payload,
                loading: false
            }
        }

        case activitiesProjectCollectionActions.ACTIVITIES_PROJECT_COLLECTION_FAILURE: {
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
