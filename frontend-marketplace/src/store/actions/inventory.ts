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

export const setListOffersCollection = (connectedAccount: string) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().listOffersAccount?.data || {};
        dispatch({ type: listOffersAccountActions.LOADING, payload: { ...oldData } });
        try {
            if (oldData[connectedAccount]) {
                dispatch({ type: listOffersAccountActions.SUCCESS, payload: oldData });
                return;
            }
            const connectorName = getState().connector.data;

            axios.get(`/marketplace/offers/${connectedAccount}`).then(async (res) => {
                const arr = res.data.data || [];
                const collections: ObjectType<any>[] = [];
                if (arr.length) {
                    for (let i = 0, leng = arr.length; i < leng; i++) {
                        const item = arr[i];
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

export const setListingsCollection = (newData: ObjectType<any>) => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().listingsAccount.data || {};
        dispatch({ type: listingsAccountActions.LOADING, payload: { ...oldData } });
        try {
            dispatch({ type: listingsAccountActions.SUCCESS, payload: { ...oldData, ...newData } });
        } catch (error: any) {
            dispatch({
                type: listingsAccountActions.FAILURE,
                payload: error
            });
        }
    }
};