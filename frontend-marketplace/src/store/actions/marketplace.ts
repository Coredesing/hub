import { listCollectionActions, listOfferActions, activitiesCollectionActions, itemsCollectionActions } from '../constants/marketplace';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import axios from '@services/axios';
import erc721ABI from '@abi/Erc721.json';
import { getContractInstance } from '@services/web3';
import { setProjectInfor } from './project-collection';
import { setCurrencyTokenAddress } from './currency';
import { getSymbolCurrency } from '@utils/getAccountBalance';
import { ObjectType } from '@app-types';
import { setTokenInfor } from './tokenInfor';

export type InputFilter = {
    page?: number;
    perPage?: number;
    [k: string]: any
}

const getInfoListData = async (listData: any[], dispatch: Function, getState: () => any) => {
    try {
        const state = getState();
        const appNetwork = state.appNetwork?.data;
        const connectorName = state.connector?.data;
        const listItems: ObjectType<any>[] = [];
        for (let i = 0, length = listData.length; i < length; i++) {
            const item = listData[i];
            const projectAddress = item.token_address;
            let projectInfor = (getState().projectInfors?.data || {})?.[projectAddress];
            const erc721Contract = getContractInstance(erc721ABI, projectAddress, connectorName, appNetwork?.appChainID);
            if (!projectInfor) {
                const response = await axios.get(`/marketplace/collection/${projectAddress}`);
                projectInfor = response.data.data;
                if (projectInfor) {
                    dispatch(setProjectInfor(projectAddress, projectInfor));
                }
            }
            item.currencySymbol = (getState().currencies?.data || {})?.[item.currency];
            if (!item.currencySymbol) {
                item.currencySymbol = await getSymbolCurrency(item.currency, { appChainId: appNetwork?.appChainID, connectorName });
                setCurrencyTokenAddress(item.currency, item.currencySymbol);
            }
            item.project = projectInfor || {};
            item.value = !isNaN(+item.value) ? +item.value : '';
            const useExternalUri = !!+projectInfor?.use_external_uri;
            let tokenInfor = (getState().tokenInfors?.data || {})?.[item.token_id];
            if (!tokenInfor) {
                tokenInfor = {};
                try {
                    if (useExternalUri) {
                        const result = await axios.post(`/marketplace/collection/${projectAddress}/${item.token_id}`);
                        tokenInfor = result.data.data || {};

                    } else {
                        if (erc721Contract) {
                            const tokenURI = await erc721Contract.methods.tokenURI(item.token_id).call();
                            tokenInfor = (await axios.get(tokenURI)).data || {};
                        }
                    }
                } catch (error) {
                    console.log('err', error)
                }
                dispatch && dispatch(setTokenInfor(item.token_id, tokenInfor))
            }
            Object.assign(item, tokenInfor);
            listItems.push(item)
        }
        return listItems;
    } catch (error) {
        console.log('er', error)
        return [];
    }
}

export const setListCollection = (filter: InputFilter) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().listCollection?.data || {};
        dispatch({ type: listCollectionActions.LOADING, payload: oldData });
        try {
            const perPage = filter?.perPage || 10;
            const pageFilter = filter?.page || 1;

            if (oldData?.data?.[pageFilter]?.length) {
                oldData.currentPage = pageFilter;
                oldData.currentList = oldData?.data?.[pageFilter];
                dispatch({ type: listCollectionActions.SUCCESS, payload: oldData });
                return;
            }
            const response = await axios.get(`/marketplace/collections?limit=${perPage}&page=${pageFilter}`);
            const result = response.data?.data;
            if (!result) {
                dispatch({ type: listCollectionActions.SUCCESS, payload: oldData });
                return;
            }
            const listData = result.data || [];
            const totalRecords = +result.total || 0;
            const currentPage = +result.page || 1;
            const setData = {
                total: totalRecords,
                currentPage,
                totalPage: Math.ceil(totalRecords / perPage),
                currentList: listData,
                data: {
                    ...(oldData?.data || {}),
                    [currentPage]: listData
                }
            }
            dispatch({ type: listCollectionActions.SUCCESS, payload: { ...oldData, ...setData } });
        } catch (error: any) {
            dispatch({
                type: listCollectionActions.FAILURE,
                payload: error
            });
        }
    }
};


export const setListOffer = (filter: InputFilter) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().listOffer?.data || {};
        dispatch({ type: listOfferActions.LOADING, payload: oldData });
        try {
            const perPage = filter?.perPage || 10;
            const pageFilter = filter?.page || 1;

            if (oldData?.data?.[pageFilter]?.length) {
                oldData.currentPage = pageFilter;
                oldData.currentList = oldData?.data?.[pageFilter];
                dispatch({ type: listOfferActions.SUCCESS, payload: oldData });
                return;
            }
            const response = await axios.get(`/marketplace/hot-offers?limit=${perPage}&page=${pageFilter}`);
            const result = response.data?.data;
            if (!result) {
                dispatch({ type: listOfferActions.SUCCESS, payload: oldData });
                return;
            }
            const listData = result.data || [];
            const listItems = await getInfoListData(listData, dispatch, getState);
            const totalRecords = +result.total || 0;
            const currentPage = +result.page || 1;
            const setData = {
                total: totalRecords,
                currentPage,
                totalPage: Math.ceil(totalRecords / perPage),
                currentList: listItems,
                data: {
                    ...(oldData?.data || {}),
                    [currentPage]: listItems
                }
            }
            dispatch({ type: listOfferActions.SUCCESS, payload: { ...oldData, ...setData } });
        } catch (error: any) {
            dispatch({
                type: listOfferActions.FAILURE,
                payload: error
            });
        }
    }
};

export const setItemsCollection = (filter: InputFilter) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().itemsCollection?.data || {};
        dispatch({ type: itemsCollectionActions.LOADING, payload: oldData });
        try {
            const perPage = filter?.perPage || 10;
            const pageFilter = filter?.page || 1;
            if (oldData?.data?.[pageFilter]?.length) {
                oldData.currentPage = pageFilter;
                oldData.currentList = oldData?.data?.[pageFilter];
                dispatch({ type: itemsCollectionActions.SUCCESS, payload: oldData });
                return;
            }
            const response = await axios.get(`/marketplace/collection/${"0x7D7A2adbb19d7A85742ce8A44cd7104076ab7E08"}/items?page=${filter?.page || 1}&limit=${perPage}`);
            const result = response.data.data || null;
            if (!result) {
                dispatch({ type: itemsCollectionActions.SUCCESS, payload: oldData });
                return;
            }

            const listData = result.data || [];
            const listItems = await getInfoListData(listData, dispatch, getState);
            const totalRecords = +result.total || 0;
            const currentPage = +result.page || 1;
            const setData = {
                total: totalRecords,
                currentPage,
                totalPage: Math.ceil(totalRecords / perPage),
                currentList: listItems,
                data: {
                    ...(oldData?.data || {}),
                    [currentPage]: listItems
                }
            }
            dispatch({ type: itemsCollectionActions.SUCCESS, payload: { ...oldData, ...setData } });
        } catch (error: any) {
            dispatch({
                type: itemsCollectionActions.FAILURE,
                payload: error
            });
        }
    }
};

export const setActivitiesCollection = (filter: InputFilter) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().activitiesCollection?.data || {};
        dispatch({ type: activitiesCollectionActions.LOADING, payload: oldData });
        try {
            const perPage = filter?.perPage || 10;
            const pageFilter = filter?.page || 1;
            if (oldData?.data?.[pageFilter]?.length) {
                oldData.currentPage = pageFilter;
                oldData.currentList = oldData?.data?.[pageFilter];
                dispatch({ type: activitiesCollectionActions.SUCCESS, payload: oldData });
                return;
            }
            // update here
            const response = await axios.get(`/marketplace/collection/${"0x7D7A2adbb19d7A85742ce8A44cd7104076ab7E08"}/activities?page=${filter?.page || 1}&limit=${perPage}`);
            const result = response.data.data || null;
            if (!result) {
                dispatch({ type: activitiesCollectionActions.SUCCESS, payload: oldData });
                return;
            }

            const listData = result.data || [];
            const listItems = await getInfoListData(listData, dispatch, getState);
            const totalRecords = +result.total || 0;
            const currentPage = +result.page || 1;
            const setData = {
                total: totalRecords,
                currentPage,
                totalPage: Math.ceil(totalRecords / perPage),
                currentList: listItems,
                data: {
                    ...(oldData?.data || {}),
                    [currentPage]: listItems
                }
            }
            dispatch({ type: activitiesCollectionActions.SUCCESS, payload: { ...oldData, ...setData } });
        } catch (error: any) {
            dispatch({
                type: activitiesCollectionActions.FAILURE,
                payload: error
            });
        }
    }
};
