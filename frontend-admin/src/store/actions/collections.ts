import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { collectionAction } from '../constants/collections';
import { BaseRequest } from '../../request/Request';
import {alertActions} from "../constants/alert";

export const getCollections = (id:any, page?: number, search?: any) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: collectionAction.GET_COLLECTION_REQUEST });
        let url = `/admin/collections`;
        if (id) {
            url = `/admin/collections/${id}`
        }
        if (page) {
            url = `/admin/collections?page=${page}` + (search ? `&search=${search}` : '');
        }

        try {
            const response = await baseRequest.get(url) as any;
            const resObject = await response.json();
            if (!resObject || !resObject.data || resObject.status !== 200) {
                return
            }

            const data = resObject.data;
            console.log('res', resObject.data)
            dispatch({
                type: collectionAction.GET_COLLECTION_SUCCESS,
                payload: {
                    data
                }
            })
        } catch (err: any) {
            dispatch({
                type: collectionAction.GET_COLLECTION_FAIL,
                payload: err?.message
            })
        }

    }
}

export const addCollection = (collectionData: any) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: collectionAction.CREATE_COLLECTION_REQUEST });

        let url = `/admin/collections/create`;
        console.log('create', collectionData)

        try {
            const response = await baseRequest.post(url, collectionData) as any;
            const resObject = await response.json();

            dispatch({
                type: collectionAction.CREATE_COLLECTION_SUCCESS,
            })

            dispatch({
                type: alertActions.SUCCESS_MESSAGE,
                payload: 'Add collection Successful!'
            });
            window.location.replace('/#/dashboard/collections')
        } catch (err: any) {
            dispatch({
                type: collectionAction.CREATE_COLLECTION_FAIL,
                payload: err?.message
            })
            dispatch({
                type: alertActions.ERROR_MESSAGE,
                payload: err?.message
            });
        }
    }
}

export const updateCollection = (id: any, collectionData: any) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();
        dispatch({ type: collectionAction.CREATE_COLLECTION_REQUEST });

        try {
            let url = `/admin/collections/${id}`;
            const response = await baseRequest.post(url, collectionData) as any;
            const resObject = await response.json();
            dispatch({
                type: collectionAction.CREATE_COLLECTION_SUCCESS,
            })

            dispatch({
                type: alertActions.SUCCESS_MESSAGE,
                payload: 'update collection Successful!'
            });
        } catch (err: any) {
            dispatch({
                type: collectionAction.CREATE_COLLECTION_FAIL,
                payload: err?.message
            })
            dispatch({
                type: alertActions.ERROR_MESSAGE,
                payload: err?.message
            });
        }
    }
}


export const deleteCollection = (id: number) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: collectionAction.DELETE_COLLECTION_REQUEST });

        let url = `/admin/collections/${id}`;

        try {
            const response = await baseRequest.delete(url, {}) as any;
            const resObject = await response.json();

            if (resObject.status === 200) {
                const { data } = resObject;
                dispatch({
                    type: collectionAction.DELETE_COLLECTION_SUCCESS,
                })

                dispatch({
                    type: alertActions.SUCCESS_MESSAGE,
                    payload: 'Remove collection Successful!'
                });
            } else {
                const { message } = resObject;
                dispatch({
                    type: alertActions.ERROR_MESSAGE,
                    payload: message
                });
            }
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (err: any) {
            dispatch({
                type: collectionAction.DELETE_COLLECTION_FAIL,
                payload: err?.message
            })
            dispatch({
                type: alertActions.ERROR_MESSAGE,
                payload: err?.message
            });
        }
    }
}

export const setShowCollection = (id: number, status: boolean) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: collectionAction.DELETE_COLLECTION_REQUEST });

        let url = `/admin/collections/change-display/${id}`;

        try {
            const response = await baseRequest.post(url, {status : status}) as any;
            const resObject = await response.json();

            if (resObject.status === 200) {
                const { data } = resObject;
                dispatch({
                    type: collectionAction.DELETE_COLLECTION_SUCCESS,
                })

                dispatch({
                    type: alertActions.SUCCESS_MESSAGE,
                    payload: 'Set display status Successful!'
                });
            } else {
                const { message } = resObject;
                dispatch({
                    type: alertActions.ERROR_MESSAGE,
                    payload: message
                });
            }
        } catch (err: any) {
            dispatch({
                type: collectionAction.DELETE_COLLECTION_FAIL,
                payload: err?.message
            })
            dispatch({
                type: alertActions.ERROR_MESSAGE,
                payload: err?.message
            });
        }
    }
}

