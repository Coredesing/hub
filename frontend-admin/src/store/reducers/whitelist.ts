import { whitelistAction }from '../constants/whitelist'
import { AnyAction } from 'redux'

const initialState = {
    data: [],
    loading: false,
    failure: '',
}

export const whitelistReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case whitelistAction.WHITELIST_REQUEST: {
            return {
                ...state,
                loading: true,
                failure: ""
            }
        }

        case whitelistAction.WHITELIST_SUCCESS: {
            return {
                ...state,
                data: action.payload,
                loading: false
            }
        }

        case whitelistAction.WHITELIST_FAIL: {
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

export const whitelistCreateReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case whitelistAction.CREATE_WHITELIST_REQUEST: {
            return {
                ...state,
                loading: true,
                failure: ""
            }
        }

        case whitelistAction.CREATE_WHITELIST_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }

        case whitelistAction.CREATE_WHITELIST_FAIL: {
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

export const whitelistRemoveReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case whitelistAction.DELETE_WHITELIST_REQUEST: {
            return {
                ...state,
                loading: true,
                failure: ""
            }
        }

        case whitelistAction.DELETE_WHITELIST_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }

        case whitelistAction.DELETE_WHITELIST_FAIL: {
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