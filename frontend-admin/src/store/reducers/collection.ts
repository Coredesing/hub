import { collectionAction }from '../constants/collections'
import { AnyAction } from 'redux'

const initialState = {
    collection_info: [],
    loading: false,
    failure: '',
}

export const collectionInfoReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case collectionAction.GET_COLLECTION_REQUEST: {
            return {
                ...state,
                loading: true,
                failure: ""
            }
        }

        case collectionAction.GET_COLLECTION_SUCCESS: {
            return {
                ...state,
                collection_info: action.payload,
                loading: false
            }
        }

        case collectionAction.GET_COLLECTION_FAIL: {
            return {
                collection_info: [],
                failure: action.payload,
                loading: false
            }
        }

        default: {
            return state;
        }
    }
}

export const collectionCreateReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case collectionAction.CREATE_COLLECTION_REQUEST: {
            return {
                ...state,
                loading: true,
                failure: ""
            }
        }

        case collectionAction.CREATE_COLLECTION_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }

        case collectionAction.CREATE_COLLECTION_FAIL: {
            return {
                data: [],
                failure: action.payload,
                loading: false
            }
        }

        default: {
            return state;
        }
    }
}

export const collectionRemoveReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case collectionAction.DELETE_COLLECTION_REQUEST: {
            return {
                ...state,
                loading: true,
                failure: ""
            }
        }

        case collectionAction.DELETE_COLLECTION_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }

        case collectionAction.DELETE_COLLECTION_FAIL: {
            return {
                data: [],
                failure: action.payload,
                loading: false
            }
        }

        default: {
            return state;
        }
    }
}
