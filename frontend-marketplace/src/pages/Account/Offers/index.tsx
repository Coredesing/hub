import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '@hooks/useAuth';
import BoxCard, { getElmStr, useStyles as useCardStyles } from '../components/BoxCard';
import { setListOffersCollection } from '@store/actions/inventory';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom'
import { Backdrop, Box, Button } from '@material-ui/core';
import CircularProgress from '@base-components/CircularProgress';
import { useTabStyles } from '../style';
import NotfoundItem from '../components/NotfoundItem';

const Offers = () => {
    const styles = useTabStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { connectedAccount, wrongChain /*isAuth*/ } = useAuth();

    const onRedirectDetail = (item: any) => {
        history.push(`/collection/${item.slug}/${item.token_id}`)
    }

    const renderBoxItem = (item: any, key: any) => {
        return (
            <BoxCard key={key} item={item} onClick={() => onRedirectDetail(item)} />
        )
    }
    const listOffersAccount = useSelector((state: any) => state.listOffersAccount);
    useEffect(() => {
        if (listOffersAccount.loading) return;
        const collections = listOffersAccount?.data?.[connectedAccount as string];
        const wrapBoxElem = document.querySelector(`#offers-list`);
        if (!wrapBoxElem) return;
        if (collections?.length) {
            ReactDOM.render(<>
                {collections.map((c: any) => renderBoxItem(c, c.key))}
            </>, wrapBoxElem)
        } else {
            ReactDOM.render(<NotfoundItem />, wrapBoxElem)
        }
    }, [listOffersAccount, connectedAccount])

    useEffect(() => {
        if (connectedAccount) {
            dispatch(setListOffersCollection(connectedAccount));
        }
    }, [connectedAccount])

    return (
        <div>
            <h3 className={styles.heading}>Offers</h3>
            {/* <Box display="flex" flexWrap="wrap" gridGap="20px" justifyContent="space-between">
                <Box>
                    <SearchBox placeholder="Search" />
                </Box>
            </Box> */}

            <div className="divider"></div>
            {
                listOffersAccount?.loading && <Backdrop open={listOffersAccount.loading} style={{ color: '#fff', zIndex: 1000, }}>
                    <CircularProgress />
                </Backdrop>
            }
            <Box className={styles.cards} id="offers-list">
            </Box>
        </div>
    )
}

export default Offers
