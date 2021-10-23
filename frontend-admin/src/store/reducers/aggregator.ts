import { aggregatorAction }from '../constants/aggregator'
import { AnyAction } from 'redux'

const initialState = {
    game_info: [],
    tokenomic: [],
    project_info: [],
    loading: false,
    failure: '',
}

export const gameInfoReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case aggregatorAction.GET_AGGREGATOR_REQUEST: {
            return {
                ...state,
                loading: true,
                failure: ""
            }
        }

        case aggregatorAction.GET_AGGREGATOR_SUCCESS: {
            return {
                ...state,
                game_info: action.payload,
                loading: false
            }
        }

        case aggregatorAction.GET_AGGREGATOR_FAIL: {
            return {
                game_info: [],
                failure: action.payload,
                loading: false
            }
        }

        default: {
            return state;
        }
    }
}

export const tokenomicReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case aggregatorAction.GET_TOKENOMIC_REQUEST: {
            return {
                ...state,
                loading: true,
                failure: ""
            }
        }

        case aggregatorAction.GET_TOKENOMIC_SUCCESS: {
            return {
                ...state,
                tokenomic: action.payload,
                loading: false
            }
        }

        case aggregatorAction.GET_TOKENOMIC_FAIL: {
            return {
                game_info: [],
                failure: action.payload,
                loading: false
            }
        }

        default: {
            return state;
        }
    }
}

export const projectInfoReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case aggregatorAction.GET_PROJECT_REQUEST: {
            return {
                ...state,
                loading: true,
                failure: ""
            }
        }

        case aggregatorAction.GET_PROJECT_SUCCESS: {
            return {
                ...state,
                project_info: action.payload,
                loading: false
            }
        }

        case aggregatorAction.GET_PROJECT_FAIL: {
            return {
                project_info: [],
                failure: action.payload,
                loading: false
            }
        }

        default: {
            return state;
        }
    }
}

export const aggregatorCreateReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case aggregatorAction.CREATE_AGGREGATOR_REQUEST: {
            return {
                ...state,
                loading: true,
                failure: ""
            }
        }

        case aggregatorAction.GET_AGGREGATOR_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }

        case aggregatorAction.CREATE_AGGREGATOR_FAIL: {
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

export const aggregatorRemoveReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case aggregatorAction.DELETE_AGGREGATOR_REQUEST: {
            return {
                ...state,
                loading: true,
                failure: ""
            }
        }

        case aggregatorAction.DELETE_AGGREGATOR_SUCCESS: {
            return {
                ...state,
                loading: false
            }
        }

        case aggregatorAction.DELETE_AGGREGATOR_FAIL: {
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
