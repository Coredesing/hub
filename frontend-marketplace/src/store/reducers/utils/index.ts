import { AnyAction } from 'redux';

export type StateType = {
    data: null | object;
    loading: boolean;
    error: string;
};

const initialState = {
    data: null,
    loading: false,
    error: ''
};

type ActionReducer = {
    loading: string;
    success: string;
    failure: string;
}

export const initReducer = (state: StateType = initialState, action: AnyAction, actionReducer: ActionReducer) => {
    switch (action.type) {
        case actionReducer.loading: {
            return {
                ...state,
                loading: true
            }
        }

        case actionReducer.success: {
            return {
                ...state,
                data: action.payload,
                loading: false
            }
        }

        case actionReducer.failure: {
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
}