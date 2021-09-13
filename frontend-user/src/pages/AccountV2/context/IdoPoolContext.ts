import {PaginationResult} from './../../../types/Pagination';
import { createContext, Dispatch, SetStateAction } from 'react';

export type ObjType = {[k: string]: any};
export type DataType = ObjType[];
export type IdoPoolContextType = {
    filter: ObjType,
    data?: DataType,
    loadingPools: boolean,
    setLoadingPools?: Dispatch<SetStateAction<boolean>>,
    setFilter?(obj: ObjType): void,
    setData?(data: DataType): void,
    pagination: Pick<PaginationResult, 'total' | 'perPage' | 'page' | 'lastPage'>,
}

export const IdoPoolContext = createContext<IdoPoolContextType>({
    filter: {},
    loadingPools: false,
    pagination: {
        total: 0,
        perPage: 10,
        page: 1,
        lastPage: 1,
    },
})
