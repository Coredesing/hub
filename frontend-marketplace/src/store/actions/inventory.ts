import { assetsAccountActions, listOffersAccountActions, listingsAccountActions } from '../constants/inventory';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ObjectType } from '@app-types';
import axios from '@services/axios';
import { getNetworkInfo } from '@utils/network';
import { getSymbolCurrency } from '@utils/getAccountBalance';
import { setCurrencyTokenAddress } from './currency';
import { setProjectInfor } from './project-collection';
import { getContractInstance } from '@services/web3';
import erc721ABI from '@abi/Erc721.json';
import { setTokenInfor } from './tokenInfor';

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

const handleListData = async (array: any[], getState: () => any, dispatch: Function) => {
    const collections: ObjectType<any>[] = [];
    const connectorName = getState().connector.data;
    if (array.length) {
        for (let i = 0, leng = array.length; i < leng; i++) {
            const item = array[i];
            const networkInfo = getNetworkInfo(item.network);
            item.currencySymbol = getState().currencies?.data?.[item.currency];
            if (!item.currencySymbol) {
                item.currencySymbol = await getSymbolCurrency(item.currency, { appChainId: networkInfo?.id, connectorName });
                dispatch(setCurrencyTokenAddress(item.currency, item.currencySymbol));
            }
            let project = getState().projectInfors?.data?.[item.slug];

            const projectAddress = item.token_address;
            if (!project) {
                try {
                    const response = await axios.get(`/marketplace/collection/${item.slug}`);
                    project = response.data.data || {};
                    dispatch(setProjectInfor(item.slug, project));
                } catch (error) {

                }
            }
            item.project = project;
            const useExternalUri = !!+project?.use_external_uri;
            let tokenInfor = getState().tokenInfors?.data?.[item.token_id];
            if (!tokenInfor) {
                tokenInfor = {};
                try {
                    if (useExternalUri) {
                        const result = await axios.post(`/marketplace/collection/${projectAddress}/${item.token_id}`);
                        tokenInfor = result.data.data || {};
                    } else {
                        const erc721Contract = getContractInstance(erc721ABI, projectAddress, connectorName, networkInfo.id);
                        if (erc721Contract) {
                            const tokenURI = await erc721Contract.methods.tokenURI(item.token_id).call();
                            tokenInfor = (await axios.get(tokenURI)).data || {};
                        }
                    }
                } catch (error) {
                    item.image = '';
                    console.log('err', error)
                }
                dispatch(setTokenInfor(item.token_id, tokenInfor))
            }
            item.value = +item.value || item.value;
            item.key = Math.floor(Math.random() + 10000) + (+item.id + i || 1);
            Object.assign(item, tokenInfor);
            collections.push(item);
        }
    } else {

    }
    return collections;
}

// export const setAssetsCollection = (connectedAccount: string, type: string) => {
//     return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
//         const oldData = getState().assetsAccount.data || {};
//         dispatch({ type: assetsAccountActions.LOADING, payload: { ...oldData } });
//         try {
//             const assetsAccount = oldData?.[connectedAccount] || {};
//             console.log('assetsAccount', assetsAccount)
//             if (assetsAccount?.[type]) {
//                 dispatch({ type: assetsAccountActions.SUCCESS, payload: oldData });
//                 return;
//             }

//             const result = await axios.get(`/marketplace/collections/support?type=${type}`);
//             const projects = result.data.data || [];
//             if (projects.length) {
//                 const collections: ObjectType<any>[] = [];
//                 const connectorName = getState().connector.data;
//                 for (let i = 0; i < projects.length; i++) {
//                     const p = projects[i];
//                     try {
//                         const projectAddress = p?.token_address;
//                         const networkInfo = getNetworkInfo(p?.network);
//                         const erc721Contract = getContractInstance(erc721ABI, projectAddress, connectorName, networkInfo.id);
//                         if (!erc721Contract) continue;
//                         let myBoxes = await erc721Contract.methods.balanceOf(connectedAccount).call();
//                         myBoxes = +myBoxes;
//                         if (!myBoxes) {
//                             continue;
//                         }
//                         const useExternalUri = !!+p?.use_external_uri;

//                         for (let id = 0; id < myBoxes; id++) {
//                             const idCollection = await erc721Contract.methods.tokenOfOwnerByIndex(connectedAccount, id).call();
//                             const collection: ObjectType<any> = {
//                                 id: idCollection,
//                                 creator: p.name,
//                                 project: p,
//                                 token_id: idCollection,
//                             };
//                             try {
//                                 if (useExternalUri) {
//                                     const result = await axios.post(`/marketplace/collection/${projectAddress}/${idCollection}`);
//                                     const infor = result.data?.data || {};
//                                     Object.assign(collection, infor);
//                                 } else {
//                                     if (erc721Contract) {
//                                         const tokenURI = await erc721Contract.methods.tokenURI(collection.token_id).call();
//                                         const infor = (await axios.get(tokenURI)).data || {};
//                                         Object.assign(collection, infor);
//                                     }
//                                 }
//                             } catch (error: any) {
//                                 collection.icon = 'default.img';
//                             }
//                             collection.key = Math.floor(Math.random() + 10000) + (+collection.id || 1);
//                             collection.value = collection.value || collection.price;
//                             collections.push(collection);
//                         }
//                     } catch (error) {
//                     }
//                 }
//                 assetsAccount[type] = collections;
//             }

//             dispatch({ type: assetsAccountActions.SUCCESS, payload: { ...oldData, [connectedAccount]: assetsAccount } });
//         } catch (error: any) {
//             dispatch({
//                 type: assetsAccountActions.FAILURE,
//                 payload: error
//             });
//         }
//     }
// };

export const setListOffersCollection = (connectedAccount: string) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().listOffersAccount?.data || {};
        dispatch({ type: listOffersAccountActions.LOADING, payload: { ...oldData } });
        try {
            if (oldData[connectedAccount]) {
                dispatch({ type: listOffersAccountActions.SUCCESS, payload: oldData });
                return;
            }
            axios.get(`/marketplace/offers/${connectedAccount}`).then(async (res) => {
                const arr = res.data.data || [];
                const collections = await handleListData(arr, getState, dispatch);
                dispatch({ type: listOffersAccountActions.SUCCESS, payload: { ...oldData, [connectedAccount]: collections } });
            })

        } catch (error: any) {
            dispatch({
                type: listOffersAccountActions.FAILURE,
                payload: error
            });
        }
    }
};

// export const setListingsCollection = (newData: ObjectType<any>) => {
//     return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
//         const oldData = getState().listingsAccount.data || {};
//         dispatch({ type: listingsAccountActions.LOADING, payload: { ...oldData } });
//         try {
//             dispatch({ type: listingsAccountActions.SUCCESS, payload: { ...oldData, ...newData } });
//         } catch (error: any) {
//             dispatch({
//                 type: listingsAccountActions.FAILURE,
//                 payload: error
//             });
//         }
//     }
// };

export const setListingsCollection = (connectedAccount: string) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().listingsAccount?.data || {};
        dispatch({ type: listingsAccountActions.LOADING, payload: { ...oldData } });
        try {
            if (oldData[connectedAccount]) {
                dispatch({ type: listingsAccountActions.SUCCESS, payload: oldData });
                return;
            }
            axios.get(`/marketplace/listings/${connectedAccount}`).then(async (res) => {
                const arr = res.data.data || [];
                const collections = await handleListData(arr, getState, dispatch);
                // const collections: ObjectType<any>[] = [];
                // if (arr.length) {
                //     for (let i = 0, leng = arr.length; i < leng; i++) {
                //         const item = arr[i];
                //         const networkInfo = getNetworkInfo(item.network);
                //         item.currencySymbol = getState().currencies?.data?.[item.currency];
                //         if (!item.currencySymbol) {
                //             item.currencySymbol = await getSymbolCurrency(item.currency, { appChainId: networkInfo?.id, connectorName });
                //             dispatch(setCurrencyTokenAddress(item.currency, item.currencySymbol));
                //         }
                //         let project = getState().projectInfors?.data?.[item.slug];

                //         const projectAddress = item.token_address;
                //         if (!project) {
                //             try {
                //                 const response = await axios.get(`/marketplace/collection/${item.slug}`);
                //                 project = response.data.data || {};
                //                 dispatch(setProjectInfor(item.slug, project));
                //             } catch (error) {

                //             }
                //         }
                //         item.project = project;
                //         const useExternalUri = !!+project?.use_external_uri;
                //         let tokenInfor = getState().tokenInfors?.data?.[item.token_id];
                //         if (!tokenInfor) {
                //             tokenInfor = {};
                //             try {
                //                 if (useExternalUri) {
                //                     const result = await axios.post(`/marketplace/collection/${projectAddress}/${item.token_id}`);
                //                     tokenInfor = result.data.data || {};
                //                 } else {
                //                     const erc721Contract = getContractInstance(erc721ABI, projectAddress, connectorName, networkInfo.id);
                //                     if (erc721Contract) {
                //                         const tokenURI = await erc721Contract.methods.tokenURI(item.token_id).call();
                //                         tokenInfor = (await axios.get(tokenURI)).data || {};
                //                     }
                //                 }
                //             } catch (error) {
                //                 item.image = '';
                //                 console.log('err', error)
                //             }
                //             dispatch(setTokenInfor(item.token_id, tokenInfor))
                //         }
                //         item.value = +item.value || item.value;
                //         item.key = Math.floor(Math.random() + 10000) + (+item.id + i || 1);
                //         Object.assign(item, tokenInfor);
                //         collections.push(item);
                //     }
                // } else {

                // }
                dispatch({ type: listingsAccountActions.SUCCESS, payload: { ...oldData, [connectedAccount]: collections } });
            })

        } catch (error: any) {
            dispatch({
                type: listingsAccountActions.FAILURE,
                payload: error
            });
        }
    }
};