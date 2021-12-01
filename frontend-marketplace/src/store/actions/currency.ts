import { currencyActions } from '../constants/currency';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { getSymbolCurrency } from '@utils/getAccountBalance';

export const setCurrencyTokenAddress = (tokenAddress: string, symbolCurrency?: string) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().currencies?.data || {};
        dispatch({ type: currencyActions.LOADING, payload: oldData });
        try {
            const appNetwork = getState().appNetwork?.data;
            const connectorName = getState().connector?.data;
            const currency = symbolCurrency || await getSymbolCurrency(tokenAddress, { appChainId: appNetwork?.appChainID, connectorName });
            dispatch({ type: currencyActions.SUCCESS, payload: { ...oldData, [tokenAddress]: currency } });
        } catch (error) {
            console.log('er', error);
            dispatch({
                type: currencyActions.FAILURE,
                payload: error
            });
        }
    }
}

export const getCurrencyTokenAddress = async (tokenAddress: string) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        try {
            const oldData = getState().currencies?.data || {};
            if (oldData[tokenAddress]) {
                return oldData[tokenAddress]
            }
            dispatch(setCurrencyTokenAddress(tokenAddress));
        } catch (error) {
            return '';
        }
    }
}
