import { useEffect, useState } from "react";
import { ObjectType } from '@/common/types';
import axios from '@/utils/axios';

type Props = {
    id: string | number;
}
const useGetPoolDetail = ({ id }: Props) => {
    const [loading, setLoading] = useState(true);
    const [poolInfo, setPoolInfo] = useState<null | ObjectType>(null);
    useEffect(() => {
        if(!id) return;
        axios.get(`/pool/${id}`).then((res) => {
            const pool = res.data.data;
            setPoolInfo(pool);
        }).catch(err => {
            console.error('Error when get Pool info', err);
        }).finally(() => {
            setLoading(false);
        })
    }, [id])
    return {
        loading,
        poolInfo,
    }
}

export default useGetPoolDetail;