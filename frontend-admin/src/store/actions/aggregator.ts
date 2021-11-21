import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux'
import { aggregatorAction } from '../constants/aggregator';
import { BaseRequest } from '../../request/Request';
import {alertActions} from "../constants/alert";

export const getAggregator = (id:any, page?: number) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: aggregatorAction.GET_AGGREGATOR_REQUEST });
        let url = `/admin/aggregator`;
        if (id) {
            url = `/admin/aggregator/${id}`
        }
        if (page) {
            url = `/admin/aggregator?page=${page}`
        }

        try {
            const response = await baseRequest.get(url) as any;
            const resObject = await response.json();
            if (!resObject || !resObject.data || resObject.status !== 200) {
                return
            }

            const data = resObject.data;
            dispatch({
                type: aggregatorAction.GET_AGGREGATOR_SUCCESS,
                payload: {
                    data
                }
            })
        } catch (err: any) {
            dispatch({
                type: aggregatorAction.GET_AGGREGATOR_FAIL,
                payload: err?.message
            })
        }

    }
}

export const searchAggregator = (page?: number, search?: string) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: aggregatorAction.GET_AGGREGATOR_REQUEST });
        let url = `/admin/aggregator?page=${page}`;

        url += search ? `&search=${search}` : '';

        try {
            const response = await baseRequest.get(url) as any;
            const resObject = await response.json();
            if (!resObject || !resObject.data || resObject.status !== 200) {
                return
            }

            const data = resObject.data;
            dispatch({
                type: aggregatorAction.GET_AGGREGATOR_SUCCESS,
                payload: {
                    data
                }
            })
        } catch (err: any) {
            dispatch({
                type: aggregatorAction.GET_AGGREGATOR_FAIL,
                payload: err?.message
            })
        }

    }
}

export const getTokenomic = (id:number) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: aggregatorAction.GET_TOKENOMIC_REQUEST });

        let url = `/admin/tokenomics/${id}`;

        try {
            const response = await baseRequest.get(url) as any;
            const resObject = await response.json();
            if (!resObject || !resObject.data || resObject.status !== 200) {
                return
            }

            const data = resObject.data;
            dispatch({
                type: aggregatorAction.GET_TOKENOMIC_SUCCESS,
                payload: {
                    data
                }
            })
        } catch (err: any) {
            dispatch({
                type: aggregatorAction.GET_TOKENOMIC_FAIL,
                payload: err?.message
            })
        }

    }
}

export const getProjectInfo = (id:number) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: aggregatorAction.GET_PROJECT_REQUEST });

        let url = `/admin/project-info/${id}`;

        try {
            const response = await baseRequest.get(url) as any;
            const resObject = await response.json();
            if (!resObject || !resObject.data || resObject.status !== 200) {
                return
            }

            const data = resObject.data;
            dispatch({
                type: aggregatorAction.GET_PROJECT_SUCCESS,
                payload: {
                    data
                }
            })
        } catch (err: any) {
            dispatch({
                type: aggregatorAction.GET_PROJECT_FAIL,
                payload: err?.message
            })
        }

    }
}

export const addAggregator = (gameData: any, tokenomicData: any, projectData: any,) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: aggregatorAction.CREATE_AGGREGATOR_REQUEST });

        let url = `/admin/aggregator/create`;

        try {
            const response = await baseRequest.post(url, gameData) as any;
            const resObject = await response.json();

            const { id } = resObject;
            let tokenomicUrl = `/admin/aggregator/tokenomic/${id}`
            let projectUrl = `/admin/aggregator/project/${id}`
            const tkresponse = await baseRequest.post(tokenomicUrl, tokenomicData) as any;
            const pjresponse = await baseRequest.post(projectUrl, projectData) as any;
            const tkresObject = await tkresponse.json();
            const pjresObject = await pjresponse.json();
            dispatch({
                type: aggregatorAction.CREATE_AGGREGATOR_SUCCESS,
            })

            dispatch({
                type: alertActions.SUCCESS_MESSAGE,
                payload: 'Add aggregator Successful!'
            });
            window.location.replace('/#/dashboard/aggregator')
        } catch (err: any) {
            dispatch({
                type: aggregatorAction.CREATE_AGGREGATOR_FAIL,
                payload: err?.message
            })
            dispatch({
                type: alertActions.ERROR_MESSAGE,
                payload: err?.message
            });
        }
    }
}

export const updateAggregator = (id:number, gameData: any, tokenomicData: any, projectData: any,) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();
        dispatch({ type: aggregatorAction.CREATE_AGGREGATOR_REQUEST });

        try {
            let url = `/admin/aggregator/${id}`;
            let tokenomicUrl = `/admin/aggregator/tokenomic/update/${id}`
            let projectUrl = `/admin/aggregator/project/update/${id}`
            const response = await baseRequest.post(url, gameData) as any;
            const resObject = await response.json();
            const tkresponse = await baseRequest.post(tokenomicUrl, tokenomicData) as any;
            const tkresObject = await tkresponse.json();
            const pjresponse = await baseRequest.post(projectUrl, projectData) as any;
            const pjresObject = await pjresponse.json();
            dispatch({
                type: aggregatorAction.CREATE_AGGREGATOR_SUCCESS,
            })

            dispatch({
                type: alertActions.SUCCESS_MESSAGE,
                payload: 'update aggregator Successful!'
            });
        } catch (err: any) {
            dispatch({
                type: aggregatorAction.CREATE_AGGREGATOR_FAIL,
                payload: err?.message
            })
            dispatch({
                type: alertActions.ERROR_MESSAGE,
                payload: err?.message
            });
        }
    }
}


export const deleteAggregator = (id: number) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: aggregatorAction.DELETE_AGGREGATOR_REQUEST });

        let url = `/admin/aggregator/${id}`;

        try {
            const response = await baseRequest.delete(url, {}) as any;
            const resObject = await response.json();

            if (resObject.status === 200) {
                const { data } = resObject;
                dispatch({
                    type: aggregatorAction.DELETE_AGGREGATOR_SUCCESS,
                })

                dispatch({
                    type: alertActions.SUCCESS_MESSAGE,
                    payload: 'Remove aggregator Successful!'
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
                type: aggregatorAction.DELETE_AGGREGATOR_FAIL,
                payload: err?.message
            })
            dispatch({
                type: alertActions.ERROR_MESSAGE,
                payload: err?.message
            });
        }
    }
}

export const setShowAggregator = (id: number, status: boolean) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const baseRequest = new BaseRequest();

        dispatch({ type: aggregatorAction.DELETE_AGGREGATOR_REQUEST });

        let url = `/admin/aggregator/set-show/${id}`;

        try {
            const response = await baseRequest.post(url, {status : status}) as any;
            const resObject = await response.json();

            if (resObject.status === 200) {
                const { data } = resObject;
                dispatch({
                    type: aggregatorAction.DELETE_AGGREGATOR_SUCCESS,
                })

                dispatch({
                    type: alertActions.SUCCESS_MESSAGE,
                    payload: 'Set Show status Successful!'
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
                type: aggregatorAction.DELETE_AGGREGATOR_FAIL,
                payload: err?.message
            })
            dispatch({
                type: alertActions.ERROR_MESSAGE,
                payload: err?.message
            });
        }
    }
}

