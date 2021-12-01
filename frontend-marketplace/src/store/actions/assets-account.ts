import { ConnectorNames } from '../../constants/connectors';
import { assetsAccountActions } from '../constants/asset-account';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ObjectType } from '@app-types';

export enum NetworkUpdateType {
    Wallet = "Wallet",
    App = "App",
    Connector = "Connector"
}

export const setAssetsCollection = (newData: ObjectType<any>) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().assetsAccount.data || {};
        dispatch({ type: assetsAccountActions.ASSETS_ACCOUNT_LOADING, payload: { ...oldData } });
        try {
            dispatch({ type: assetsAccountActions.ASSETS_ACCOUNT_SUCCESS, payload: { ...oldData, ...newData } });
        } catch (error: any) {
            dispatch({
                type: assetsAccountActions.ASSETS_ACCOUNT_FAILURE,
                payload: error
            });
        }
    }
};

