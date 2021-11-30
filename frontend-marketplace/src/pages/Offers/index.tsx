import React, { useEffect, useState } from 'react'
import DefaultLayout from '@layout-components/DefaultLayout'
import WrapperContent from '@base-components/WrapperContent'
import useStyles from './style';
import { Box, Backdrop } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Pagination from '@base-components/Pagination'
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@base-components/CircularProgress';
import CardMarketplace from '@base-components/CardMarketplace';
import { setListOffer } from '@store/actions/marketplace';

const Offers = () => {
    const styles = useStyles();
    const dispatch = useDispatch()
    const perPage = 10;
    const [filterItem, setFilterItem] = useState({ page: 1, perPage, })
    const listOffer = useSelector((state: any) => state.listOffer);

    useEffect(() => {
        dispatch(setListOffer(filterItem));
    }, [filterItem]);

    const onSetPage = (page: number) => {
        setFilterItem(t => ({ ...t, page }));
    }

    return (
        <DefaultLayout>
            <WrapperContent>
                <div className={styles.page}>
                    <div className="content-page">
                        <div className={styles.header}>
                            <div className="title">
                                <h3>List Offers</h3>
                            </div>
                        </div>
                        <div className={styles.content}>
                            {
                                listOffer.loading && <Backdrop open={listOffer.loading} style={{ color: '#fff', zIndex: 1000, }}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>}
                            {
                                listOffer.data !== null && (!listOffer.loading && !listOffer?.data?.totalPage ?
                                    <Box width="100%" textAlign="center">
                                        <img src="/images/icons/item-not-found.svg" alt="" />
                                        <h4 className="firs-neue-font font-16px bold text-white text-center">No item found</h4>
                                    </Box> :
                                    listOffer?.data?.totalPage && <>
                                        <div className={styles.cards}>
                                            {
                                                (listOffer?.data?.currentList || []).map((item: any, id: number) =>
                                                    <Link key={id} to={`/collection/${item.token_address}/${item.token_id}`}>
                                                        <CardMarketplace item={item} key={id} />
                                                    </Link>
                                                )}
                                        </div>
                                        {listOffer?.data?.totalPage &&
                                            <Pagination
                                                count={listOffer?.data?.totalPage}
                                                page={listOffer?.data?.currentPage}
                                                onChange={(e: any, page: any) => {
                                                    onSetPage(page)
                                                }}
                                            />
                                        }
                                    </>)
                            }
                        </div>
                    </div>
                </div>
            </WrapperContent>
        </DefaultLayout>
    )
}

export default Offers
