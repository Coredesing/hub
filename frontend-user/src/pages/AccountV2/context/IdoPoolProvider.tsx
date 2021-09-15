import React, { useEffect, useMemo, useState } from 'react'
import { PaginationResult } from '../../../types/Pagination';
import { IdoPoolContext, ObjType, IdoPoolContextType, DataType } from './IdoPoolContext';
import axios from '../../../services/axios';
import useAuth from '../../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { fillClaimInfo } from '../../../utils/claim';
import { getAppNetWork } from '../../../utils/network';

const IdoPoolProvider = (props: any) => {
    const [filter, setFilter] = useState<ObjType>({ currentTimeGetPool: Date.now() });
    const [data, setData] = useState<DataType>([]);
    const defaultPagination = {
        total: 0,
        perPage: 10,
        page: 1,
        lastPage: 1,
        totalPage: 0,
    }
    const [pagination, setPagination] = useState<Pick<PaginationResult, 'total' | 'perPage' | 'page' | 'lastPage'> & {totalPage?: number}>(defaultPagination);
    const [loadingPools, setLoadingPools] = useState(false);
    const { connectedAccount, wrongChain } = useAuth();
    const { data: connector } = useSelector((state: any) => state.connector);
    const { data: appChain } = useSelector((state: any) => state.appNetwork);
    const appChainID = appChain.appChainID;
    const appNetwork = getAppNetWork(appChainID);

    useEffect(() => {
        if (!connectedAccount) {
            setData([]);
            setPagination(defaultPagination)
        }
    }, [connectedAccount]);
    useEffect(() => {
        loadingPools && connectedAccount && axios.get(
            `/pools/user/${connectedAccount}/joined-pools?page=${filter.page || 1}&limit=${pagination.perPage}&title=${filter.search || ''}&type=${filter.type ?? ''}&status=${filter.status || ''}&current_time=${filter.currentTimeGetPool || ''}`
        ).then(async (res) => {
            const result = res.data;
            const pools = result.data?.data || [];
            const listData = await fillClaimInfo({
                listData: pools,
                connectedAccount,
                connector,
                appChainID,
                appNetwork,
                wrongChain
            });
            setData(listData);
            setPagination({
                page: result.data?.page,
                lastPage: result.data?.lastPage,
                perPage: result.data?.perPage,
                total: +result.data?.total,
                totalPage: Math.ceil((+result.data?.total || 0) / pagination.perPage)
            })
            setLoadingPools(false);
        }).catch(() => {
            setLoadingPools(false);
        })
    }, [loadingPools, connectedAccount, filter, connector, wrongChain, appNetwork, appChainID]);
    const valueCtx = useMemo<IdoPoolContextType>(() => ({
        filter,
        data,
        setFilter,
        setData,
        setLoadingPools,
        loadingPools,
        pagination,
    }), [filter, data, loadingPools, pagination]);
    return (
        <IdoPoolContext.Provider value={valueCtx}>
            {props.children}
        </IdoPoolContext.Provider>
    )
}

export default IdoPoolProvider
