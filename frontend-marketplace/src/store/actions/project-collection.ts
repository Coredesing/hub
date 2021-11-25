import { activitiesProjectCollectionActions, itemsProjectCollectionActions, projectInforActions } from '../constants/project-collection';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import axios from '@services/axios';
import erc721ABI from '@abi/Erc721.json';
import { getContractInstance } from '@services/web3';
import { getSymbolCurrency } from '@utils/getAccountBalance';
import { ObjectType } from '@app-types';

type InputItemProjectCollection = {
    projectAddress: string;
    filter?: {
        page?: number,
        search?: string,
        perPage?: number,
    }
}

export const setProjectInfor = (projectAddress: string) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().projectInfors?.data || {};
        dispatch({ type: projectInforActions.PROJECT_INFOR_LOADING, payload: oldData });
        try {
            const response = await axios.get(`/marketplace/collection/${projectAddress}`);
            const result = response.data.data || {};
            console.log('result', result)
            dispatch({ type: projectInforActions.PROJECT_INFOR_SUCCESS, payload: { ...oldData, [projectAddress]: result } });
        } catch (error) {
            console.log('er', error);
            dispatch({
                type: projectInforActions.PROJECT_INFOR_FAILURE,
                payload: error
            });
        }
    }
}

const getInfoListData = async (listData: any[], projectAddress: string, useExternalUri: boolean, state: any) => {
    try {
        const appNetwork = state.appNetwork?.data;
        const connectorName = state.connector?.data;
        const erc721Contract = getContractInstance(erc721ABI, projectAddress, connectorName, appNetwork?.appChainID);
        const currencySymbolCached: ObjectType<any> = {};
        const listItems = await Promise.all(listData.map((col: any) => new Promise(async (res) => {
            // update get symbol currency
            if(!currencySymbolCached[col.currency]) {
                currencySymbolCached[col.currency] = await getSymbolCurrency(col.currency, { appChainId: appNetwork?.appChainID, connectorName });
            }
            col.currencySymbol = currencySymbolCached[col.currency];
            try {
                if (useExternalUri) {
                    const result = await axios.post(`/marketplace/collection/${projectAddress}/${col.token_id}`);
                    const info = result.data.data || {};
                    Object.assign(col, info);
                    res(col);
                } else {
                    if (erc721Contract) {
                        const tokenURI = await erc721Contract.methods.tokenURI(col.token_id).call();
                        const infoBoxType = (await axios.get(tokenURI)).data || {};
                        Object.assign(col, infoBoxType);
                    }
                    res(col);
                }
            } catch (error) {
                col.image = '';
                console.log('err', error)
                res(col)
            }
        })));
        return listItems;
    } catch (error) {
        console.log('er', error)
        return [];
    }
}

export const setItemsProjectCollection = (input: InputItemProjectCollection) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().itemsProjectCollection?.data || {};
        dispatch({ type: itemsProjectCollectionActions.ITEMS_PROJECT_COLLECTION_LOADING, payload: oldData });
        try {
            const perPage = input.filter?.perPage || 10;
            const oldDataByProject = oldData[input.projectAddress];
            const pageFilter = input.filter?.page || 1;
            if (oldDataByProject?.data?.[pageFilter]?.length) {
                oldDataByProject.currentPage = pageFilter;
                oldDataByProject.currentList = oldDataByProject?.data?.[pageFilter];
                dispatch({ type: itemsProjectCollectionActions.ITEMS_PROJECT_COLLECTION_SUCCESS, payload: { ...oldData, ...oldDataByProject } });
                return;
            }
            const response = await axios.get(`/marketplace/collection/${input.projectAddress}/items?page=${input.filter?.page || 1}&limit=${perPage}`);
            const result = response.data.data || null;
            if (!result) {
                dispatch({ type: itemsProjectCollectionActions.ITEMS_PROJECT_COLLECTION_SUCCESS, payload: oldData });
                return;
            }

            const listData = result.data || [];
            const projectInfor = getState().projectInfor?.data || {};
            const useExternalUri = !!+projectInfor.use_external_uri;
            const listItems = await getInfoListData(listData, input.projectAddress, useExternalUri, getState());
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
            dispatch({ type: itemsProjectCollectionActions.ITEMS_PROJECT_COLLECTION_SUCCESS, payload: { ...oldData, ...setData } });
        } catch (error: any) {
            dispatch({
                type: itemsProjectCollectionActions.ITEMS_PROJECT_COLLECTION_FAILURE,
                payload: error
            });
        }
    }
};

export const setActivitiesProjectCollection = (input: InputItemProjectCollection) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().activitiesProjectCollection?.data || {};
        dispatch({ type: activitiesProjectCollectionActions.ACTIVITIES_PROJECT_COLLECTION_LOADING, payload: oldData });
        try {
            const perPage = input.filter?.perPage || 10;
            const oldDataByProject = oldData[input.projectAddress];
            const pageFilter = input.filter?.page || 1;
            if (oldDataByProject?.data?.[pageFilter]?.length) {
                oldDataByProject.currentPage = pageFilter;
                oldDataByProject.currentList = oldDataByProject?.data?.[pageFilter];
                dispatch({ type: activitiesProjectCollectionActions.ACTIVITIES_PROJECT_COLLECTION_SUCCESS, payload: { ...oldData, ...oldDataByProject } });
                return;
            }
            const response = await axios.get(`/marketplace/collection/${input.projectAddress}/activities?page=${input.filter?.page || 1}&limit=${perPage}`);
            console.log('response', response)
            const result = response.data.data || null;
            if (!result) {
                dispatch({ type: activitiesProjectCollectionActions.ACTIVITIES_PROJECT_COLLECTION_SUCCESS, payload: oldData });
                return;
            }

            const listData = result.data || [];
            const projectInfor = getState().projectInfor?.data || {};
            const useExternalUri = !!+projectInfor.use_external_uri;
            const listItems = await getInfoListData(listData, input.projectAddress, useExternalUri, getState());
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
            dispatch({ type: activitiesProjectCollectionActions.ACTIVITIES_PROJECT_COLLECTION_SUCCESS, payload: { ...oldData, ...setData } });
        } catch (error: any) {
            dispatch({
                type: activitiesProjectCollectionActions.ACTIVITIES_PROJECT_COLLECTION_FAILURE,
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

