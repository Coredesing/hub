import { activitiesProjectCollectionActions, itemsProjectCollectionActions, projectInforActions } from '../constants/project-collection';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import axios from '@services/axios';
import erc721ABI from '@abi/Erc721.json';
import { getContractInstance } from '@services/web3';
import { getSymbolCurrency } from '@utils/getAccountBalance';
import { ObjectType } from '@app-types';
import { setCurrencyTokenAddress } from './currency';
import { setTokenInfor } from './tokenInfor';
import { getNetworkInfo } from '@utils/network';

type InputItemProjectCollection = {
    projectAddress: string;
    filter?: {
        page?: number,
        search?: string,
        perPage?: number,
    }
}

export const setProjectInfor = (projectAddress: string, projectInfor?: any) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().projectInfors?.data || {};
        dispatch({ type: projectInforActions.LOADING, payload: oldData });
        try {
            if (projectInfor) {
                dispatch({ type: projectInforActions.SUCCESS, payload: { ...oldData, [projectAddress]: projectInfor } });
                return;
            }
            const response = await axios.get(`/marketplace/collection/${projectAddress}`);
            const result = response.data.data || {};
            dispatch({ type: projectInforActions.SUCCESS, payload: { ...oldData, [projectAddress]: result } });
        } catch (error) {
            dispatch({
                type: projectInforActions.FAILURE,
                payload: error
            });
        }
    }
}

const getInfoListData = async (listData: any[], projectAddress: string, useExternalUri: boolean, getState: () => any, projectInfor?: any, dispatch?: Function) => {
    try {
        const state = getState();
        const connectorName = state.connector?.data;
        const listItems: ObjectType<any>[] = [];
        for (let i = 0, length = listData.length; i < length; i++) {
            const item = listData[i];
            const networkInfo = getNetworkInfo(item.network);
            const erc721Contract = getContractInstance(erc721ABI, projectAddress, connectorName, networkInfo.id);
            item.project = projectInfor;
            item.currencySymbol = (getState().currencies?.data || {})?.[item.currency];
            if (!item.currencySymbol) {
                item.currencySymbol = await getSymbolCurrency(item.currency, { appChainId: networkInfo.id, connectorName });
                setCurrencyTokenAddress(item.currency, item.currencySymbol);
            }
            item.value = !isNaN(+item.value) ? +item.value : '';
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
                    item.image = '';
                    console.log('err', error)
                }
                dispatch && dispatch(setTokenInfor(item.token_id, tokenInfor))
            }
            Object.assign(item, tokenInfor);
            listItems.push(item);
        }
        // const listItems = await Promise.all(listData.map((item: any) => new Promise(async (res) => {
        //     item.project = projectInfor;
        //     item.currencySymbol = (getState().currencies?.data || {})?.[item.currency];
        //     if (!item.currencySymbol) {
        //         item.currencySymbol = await getSymbolCurrency(item.currency, { appChainId: appNetwork?.appChainID, connectorName });
        //         setCurrencyTokenAddress(item.currency, item.currencySymbol);
        //     }
        //     item.value = !isNaN(+item.value) ? +item.value : '';
        //     try {
        //         if (useExternalUri) {
        //             const result = await axios.post(`/marketplace/collection/${projectAddress}/${item.token_id}`);
        //             const info = result.data.data || {};
        //             Object.assign(item, info);
        //             res(item);
        //         } else {
        //             if (erc721Contract) {
        //                 const tokenURI = await erc721Contract.methods.tokenURI(item.token_id).call();
        //                 const infoBoxType = (await axios.get(tokenURI)).data || {};
        //                 Object.assign(item, infoBoxType);
        //             }
        //             res(item);
        //         }
        //     } catch (error) {
        //         item.image = '';
        //         console.log('err', error)
        //         res(item)
        //     }
        // })));
        return listItems;
    } catch (error) {
        console.log('er', error)
        return [];
    }
}

export const setItemsProjectCollection = (input: InputItemProjectCollection) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().itemsProjectCollection?.data || {};
        dispatch({ type: itemsProjectCollectionActions.LOADING, payload: oldData });
        try {
            const perPage = input.filter?.perPage || 10;
            const oldDataByProject = oldData[input.projectAddress];
            const pageFilter = input.filter?.page || 1;
            if (oldDataByProject?.data?.[pageFilter]?.length) {
                oldDataByProject.currentPage = pageFilter;
                oldDataByProject.currentList = oldDataByProject?.data?.[pageFilter];
                dispatch({ type: itemsProjectCollectionActions.SUCCESS, payload: { ...oldData, ...oldDataByProject } });
                return;
            }
            const response = await axios.get(`/marketplace/collection/${input.projectAddress}/items?page=${input.filter?.page || 1}&limit=${perPage}`);
            const result = response.data.data || null;
            if (!result) {
                dispatch({ type: itemsProjectCollectionActions.SUCCESS, payload: oldData });
                return;
            }

            const listData = result.data || [];
            const projectInfor = (getState().projectInfors?.data || {})?.[input.projectAddress] || {};
            const useExternalUri = !!+projectInfor.use_external_uri;
            const listItems = await getInfoListData(listData, input.projectAddress, useExternalUri, getState, projectInfor, dispatch);
            const totalRecords = +result.total || 0;
            const currentPage = +result.page || 1;
            const setData = {
                [input.projectAddress]: {
                    total: totalRecords,
                    currentPage,
                    totalPage: Math.ceil(totalRecords / perPage),
                    currentList: listItems,
                    data: {
                        ...(oldDataByProject?.data || {}),
                        [currentPage]: listItems
                    }
                }
            }
            dispatch({ type: itemsProjectCollectionActions.SUCCESS, payload: { ...oldData, ...setData } });
        } catch (error: any) {
            dispatch({
                type: itemsProjectCollectionActions.FAILURE,
                payload: error
            });
        }
    }
};

export const setActivitiesProjectCollection = (input: InputItemProjectCollection) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().activitiesProjectCollection?.data || {};
        dispatch({ type: activitiesProjectCollectionActions.LOADING, payload: oldData });
        try {
            const perPage = input.filter?.perPage || 10;
            const oldDataByProject = oldData[input.projectAddress];
            const pageFilter = input.filter?.page || 1;
            if (oldDataByProject?.data?.[pageFilter]?.length) {
                oldDataByProject.currentPage = pageFilter;
                oldDataByProject.currentList = oldDataByProject?.data?.[pageFilter];
                dispatch({ type: activitiesProjectCollectionActions.SUCCESS, payload: { ...oldData, ...oldDataByProject } });
                return;
            }
            const response = await axios.get(`/marketplace/collection/${input.projectAddress}/activities?page=${input.filter?.page || 1}&limit=${perPage}`);
            const result = response.data.data || null;
            if (!result) {
                dispatch({ type: activitiesProjectCollectionActions.SUCCESS, payload: oldData });
                return;
            }

            const listData = result.data || [];
            const projectInfor = (getState().projectInfors?.data || {})?.[input.projectAddress] || {};
            const useExternalUri = !!+projectInfor.use_external_uri;
            const listItems = await getInfoListData(listData, input.projectAddress, useExternalUri, getState, projectInfor, dispatch);
            const totalRecords = +result.total || 0;
            const currentPage = +result.page || 1;
            const setData = {
                [input.projectAddress]: {
                    total: totalRecords,
                    currentPage,
                    totalPage: Math.ceil(totalRecords / perPage),
                    currentList: listItems,
                    data: {
                        ...(oldDataByProject?.data || {}),
                        [currentPage]: listItems
                    }
                }
            }
            dispatch({ type: activitiesProjectCollectionActions.SUCCESS, payload: { ...oldData, ...setData } });
        } catch (error: any) {
            dispatch({
                type: activitiesProjectCollectionActions.FAILURE,
                payload: error
            });
        }
    }
};

// export const setBigOffer = () => {
//     return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
//         const oldData = getState().assetsAccount.data || {};
//         dispatch({ type: bigOfferActions.BIG_OFFER_LOADING, payload: oldData });
//         try {
//             const result = await axios.get('/marketplace/hot-offers');
//             const data = result.data?.data?.data || [];
//             const appNetwork = getState().appNetwork?.data;
//             const connectorName = getState().connector?.data;
//             const offers: object[] = []
//             await Promise.all(data.map((item: any) => new Promise(async (res) => {
//                 const result = await axios.get(`/marketplace/collection/${item.token_address}`);
//                 const projectInfo = result.data.data;
//                 if (!projectInfo) return;
//                 const useExternalUri = !!+projectInfo.use_external_uri;
//                 const erc721Contract = getContractInstance(erc721ABI, projectInfo.token_address, connectorName, appNetwork.appChainID);
//                 if (!erc721Contract) return;
//                 item.project = projectInfo;
//                 try {
//                     if (useExternalUri) {
//                         const result = await axios.post(`/marketplace/collection/${projectInfo.token_address}/${item.token_id}`);
//                         const info = result.data.data || {};
//                         Object.assign(item, info);
//                         res('');
//                     } else {
//                         const tokenURI = await erc721Contract.methods.tokenURI(item.token_id).call();
//                         const infoBoxType = (await axios.get(tokenURI)).data || {};
//                         Object.assign(item, infoBoxType);
//                         res('');
//                     }
//                     offers.push(item);
//                 } catch (error) {
//                     item.image = '';
//                     console.log('err', error)
//                     offers.push(item);
//                     res('')
//                 }
//             })));
//             dispatch({ type: bigOfferActions.BIG_OFFER_SUCCESS, payload: offers });
//         } catch (error: any) {
//             dispatch({
//                 type: bigOfferActions.BIG_OFFER_FAILURE,
//                 payload: error
//             });
//         }
//     }
// };

