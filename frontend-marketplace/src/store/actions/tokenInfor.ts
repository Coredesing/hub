import { tokenInforsActions } from '../constants/tokenInfors';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

export const setTokenInfor = (tokenId: string, tokenInfor?: any) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().tokenInfors?.data || {};
        dispatch({ type: tokenInforsActions.LOADING, payload: oldData });
        try {
            dispatch({ type: tokenInforsActions.SUCCESS, payload: { ...oldData, [tokenId]: tokenInfor } });
        } catch (error) {
            console.log('er', error);
            dispatch({
                type: tokenInforsActions.FAILURE,
                payload: error
            });
        }
    }
}
