import { hotCollectionsActions, bigOfferActions } from '../constants/marketplace';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import axios from '@services/axios';
import erc721ABI from '@abi/Erc721.json';
import { getContractInstance } from '@services/web3';

export const setHotCollections = () => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().assetsAccount.data || {};
        dispatch({ type: hotCollectionsActions.HOT_COLLECTION_LOADING, payload: oldData });
        try {
            const result = await axios.get('/marketplace/collections');
            const data = result.data?.data?.data || [];
            dispatch({ type: hotCollectionsActions.HOT_COLLECTION_SUCCESS, payload: data });
        } catch (error: any) {
            dispatch({
                type: hotCollectionsActions.HOT_COLLECTION_FAILURE,
                payload: error
            });
        }
    }
};

export const setBigOffer = () => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
        const oldData = getState().assetsAccount.data || {};
        dispatch({ type: bigOfferActions.BIG_OFFER_LOADING, payload: oldData });
        try {
            const result = await axios.get('/marketplace/hot-offers');
            const data = result.data?.data?.data || [];
            const appNetwork = getState().appNetwork?.data;
            const connectorName = getState().connector?.data;
            const offers: object[] = []
            await Promise.all(data.map((item: any) => new Promise(async (res) => {
                const result = await axios.get(`/marketplace/collection/${item.token_address}`);
                const projectInfo = result.data.data;
                if (!projectInfo) return;
                const useExternalUri = !!+projectInfo.use_external_uri;
                const erc721Contract = getContractInstance(erc721ABI, projectInfo.token_address, connectorName, appNetwork.appChainID);
                if (!erc721Contract) return;
                item.project = projectInfo;
                try {
                    if (useExternalUri) {
                        const result = await axios.post(`/marketplace/collection/${projectInfo.token_address}/${item.token_id}`);
                        const info = result.data.data || {};
                        Object.assign(item, info);
                        res('');
                    } else {
                        const tokenURI = await erc721Contract.methods.tokenURI(item.token_id).call();
                        const infoBoxType = (await axios.get(tokenURI)).data || {};
                        Object.assign(item, infoBoxType);
                        res('');
                    }
                    offers.push(item);
                } catch (error) {
                    item.image = '';
                    console.log('err', error)
                    offers.push(item);
                    res('')
                }
            })));
            dispatch({ type: bigOfferActions.BIG_OFFER_SUCCESS, payload: offers });
        } catch (error: any) {
            dispatch({
                type: bigOfferActions.BIG_OFFER_FAILURE,
                payload: error
            });
        }
    }
};

