import { assetsAccountActions, listOffersAccountActions } from '../constants/inventory';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ObjectType } from '@app-types';

export const setAssetsCollection = (newData: ObjectType<any>) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().assetsAccount.data || {};
        dispatch({ type: assetsAccountActions.LOADING, payload: { ...oldData } });
        try {
            dispatch({ type: assetsAccountActions.SUCCESS, payload: { ...oldData, ...newData } });
        } catch (error: any) {
            dispatch({
                type: assetsAccountActions.FAILURE,
                payload: error
            });
        }
    }
};

export const setListOffersCollection = (newData: ObjectType<any>) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().assetsAccount.data || {};
        dispatch({ type: listOffersAccountActions.LOADING, payload: { ...oldData } });
        try {
            dispatch({ type: listOffersAccountActions.SUCCESS, payload: { ...oldData, ...newData } });
        } catch (error: any) {
            dispatch({
                type: listOffersAccountActions.FAILURE,
                payload: error
            });
        }
    }
};
