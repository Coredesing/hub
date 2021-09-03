import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux'
import { whitelistAction } from '../constants/whitelist';
import { BaseRequest } from '../../request/Request';
import {alertActions} from "../constants/alert";

export const getWhitelist = () => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: whitelistAction.WHITELIST_REQUEST });

        let url = `/whitelist`;

        try {
            const response = await baseRequest.get(url) as any;
            const resObject = await response.json();

            if (resObject.status === 200) {
                const { data } = resObject;
                dispatch({
                    type: whitelistAction.WHITELIST_SUCCESS,
                    payload: {
                        data
                    }
                })
            }
        } catch (err) {
            dispatch({
                type: whitelistAction.WHITELIST_FAIL,
                payload: err.message
            })
        }

    }
}

export const setWhitelist = (address: string) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: whitelistAction.CREATE_WHITELIST_REQUEST });

        let url = `/whitelist`;

        try {
            const response = await baseRequest.post(url, {address: address}) as any;
            const resObject = await response.json();

            if (resObject.status === 200) {
                const { data } = resObject;
                dispatch({
                    type: whitelistAction.CREATE_WHITELIST_SUCCESS,
                })

                dispatch(getWhitelist())

                dispatch({
                    type: alertActions.SUCCESS_MESSAGE,
                    payload: 'Add whitelist Successful!'
                });
            } else {
                const { message } = resObject;
                dispatch({
                    type: alertActions.ERROR_MESSAGE,
                    payload: message
                });
            }
        } catch (err) {
            dispatch({
                type: whitelistAction.CREATE_WHITELIST_FAIL,
                payload: err.message
            })
            dispatch({
                type: alertActions.ERROR_MESSAGE,
                payload: err.message
            });
        }
    }
}

export const deleteWhitelist = (address: string) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: whitelistAction.DELETE_WHITELIST_REQUEST });

        let url = `/whitelist`;

        try {
            const response = await baseRequest.delete(url, {address: address}) as any;
            const resObject = await response.json();

            if (resObject.status === 200) {
                const { data } = resObject;
                dispatch({
                    type: whitelistAction.DELETE_WHITELIST_SUCCESS,
                })
                dispatch(getWhitelist())

                dispatch({
                    type: alertActions.SUCCESS_MESSAGE,
                    payload: 'Remove whitelist Successful!'
                });
            } else {
                const { message } = resObject;
                dispatch({
                    type: alertActions.ERROR_MESSAGE,
                    payload: message
                });
            }
        } catch (err) {
            dispatch({
                type: whitelistAction.DELETE_WHITELIST_FAIL,
                payload: err.message
            })
            dispatch({
                type: alertActions.ERROR_MESSAGE,
                payload: err.message
            });
        }
    }
}