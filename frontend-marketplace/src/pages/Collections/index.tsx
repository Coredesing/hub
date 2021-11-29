import clsx from 'clsx';
import CollectionCard from '@base-components/CollectionCard';
import { Link } from 'react-router-dom';
import useStyles from './style';
import { ObjectType } from '@app-types';
import DefaultLayout from '@layout-components/DefaultLayout';
import WrapperContent from '@base-components/WrapperContent';
import { Pagination } from '@base-components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setListCollection } from '@store/actions/marketplace';
import CircularProgress from '@base-components/CircularProgress';
import { Backdrop } from '@material-ui/core';
const Collections = (props: any) => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const perPage = 10;
    const [filterItem, setFilterItem] = useState({ page: 1, perPage, })
    const listCollection = useSelector((state: any) => state.listCollection);

    useEffect(() => {
        dispatch(setListCollection(filterItem));
    }, [filterItem]);

    const onSetPage = (page: number) => {
        setFilterItem(t => ({ ...t, page }));
    }
    return (
        <DefaultLayout>
            <WrapperContent>
                <div className={classes.page}>
                    <div className="content-page">
                        <div className={classes.header}>
                            <div className="title">
                                <h3>List Collections</h3>
                            </div>
                        </div>
                        <div className={classes.content}>
                            {
                                listCollection.loading && <Backdrop open={listCollection.loading} style={{ color: '#fff', zIndex: 1000, }}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>}
                            <div className={clsx(classes.collections, "custom-scroll")}>
                                {
                                    (listCollection?.data?.currentList || []).map((p: ObjectType<any>, id: number) =>
                                        <Link to={`/collection/${p.token_address}`}>
                                            <CollectionCard item={p} />
                                        </Link>
                                    )
                                }
                            </div>
                            {listCollection?.data?.totalPage &&
                                <Pagination
                                    count={listCollection?.data?.totalPage}
                                    page={listCollection?.data?.currentPage}
                                    onChange={(e: any, page: any) => {
                                        onSetPage(page)
                                    }}
                                />
                            }
                        </div>
                    </div>
                </div>
            </WrapperContent>
        </DefaultLayout>
    )
}

export default Collections;
