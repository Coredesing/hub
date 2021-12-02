import React, { useEffect, useState } from 'react'
import { AppBar, TabPanel } from '@base-components/Tabs';
import CardMarketplace from '@base-components/CardMarketplace';
import axios from '@services/axios';
import { ObjectType } from '@app-types';
import useStyles from './style';
import erc721ABI from '@abi/Erc721.json';
import { getContractInstance } from '@services/web3';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '@hooks/useAuth';
import BoxCard, { getElmStr, useStyles as useCardStyles } from '../components/BoxCard';
import { Link } from 'react-router-dom';
import { setAssetsCollection } from '@store/actions/inventory';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom'
import { Backdrop, Box, Button } from '@material-ui/core';
import CircularProgress from '@base-components/CircularProgress';
import clsx from 'clsx';
import { useTabStyles } from '../style';
import { SearchBox } from '@base-components/SearchBox';
import { getNetworkInfo } from '@utils/network';
import { useTypedSelector } from '@hooks/useTypedSelector';
const Assets = () => {
    const styles = useStyles();
    const tabStyles = useTabStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const tabNames: { [k: number]: any } = {
        0: {
            name: 'Items',
            value: 0,
            type: 'nft',
        },
        1: {
            name: 'Mystery Box',
            value: 1,
            type: 'box'
        },
        2: {
            name: 'Equipment',
            value: 2,
            type: 'equipment'
        }
    }
    const [currentTab, setCurrentTab] = useState<number>(0);
    const onChangeTab = (val: number) => {
        setCurrentTab(val);
    }

    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const { connectedAccount, wrongChain /*isAuth*/ } = useAuth();
    const assetsAccount = useSelector((state: any) => state.assetsAccount).data || {};
    const [assets, setAssets] = useState<ObjectType<any>>({});

    const onRedirectDetail = (item: any) => {
        history.push(`/collection/${item.project.token_address}/${item.id}`)
    }

    const renderBoxItem = (item: any, key: any) => {
        return (
            // <Link key={key} to={`/collection/${item.project.token_address}/${item.id}`}>
            <BoxCard key={key} item={item} onClick={() => onRedirectDetail(item)} />
            //  </Link>
        )
    }
    const cardStyle = useCardStyles();
    const [loadingAsset, setLoadingAsset] = useState(false);
    const connectorName = useTypedSelector(state => state.connector).data;

    useEffect(() => {
        if (!connectedAccount) return;
        const type = tabNames[currentTab].type || tabNames[0].type;
        const wrapBoxElem = document.querySelector(`#${type}-cards`);
        if (!assetsAccount[connectedAccount]?.[type]?.length) {
            setLoadingAsset(true);
            axios.get(`/marketplace/collections/support?type=${type}`).then(async (res) => {
                const arr = res.data.data || [];
                if (arr.length) {
                    if (!wrapBoxElem) return;
                    const collections: ObjectType<any>[] = [];
                    await Promise.all(arr.map((p: any) => new Promise(async (res) => {
                        try {
                            const projectAddress = p?.token_address;
                            const networkInfo = getNetworkInfo(p?.network);
                            const erc721Contract = getContractInstance(erc721ABI, projectAddress, connectorName, networkInfo.id);
                            if (!erc721Contract) return res('');
                            let myBoxes = await erc721Contract.methods.balanceOf(connectedAccount).call();
                            myBoxes = +myBoxes;
                            if (!myBoxes) {
                                res('');
                                return;
                            }
                            const useExternalUri = !!+p?.use_external_uri;

                            for (let id = 0; id < myBoxes; id++) {
                                const idCollection = await erc721Contract.methods.tokenOfOwnerByIndex(connectedAccount, id).call();
                                const collection: ObjectType<any> = {
                                    id: idCollection,
                                    creator: p.name,
                                    project: p,
                                    token_id: idCollection,
                                };
                                try {
                                    if (useExternalUri) {
                                        const result = await axios.post(`/marketplace/collection/${projectAddress}/${idCollection}`);
                                        const infor = result.data?.data || {};
                                        Object.assign(collection, infor);
                                    } else {
                                        if (erc721Contract) {
                                            const tokenURI = await erc721Contract.methods.tokenURI(collection.token_id).call();
                                            const infor = (await axios.get(tokenURI)).data || {};
                                            Object.assign(collection, infor);
                                        }
                                    }
                                } catch (error: any) {
                                    collection.icon = 'default.img';
                                }
                                collection.value = collection.value || collection.price;
                                collections.push(collection);
                                ReactDOM.render(<>
                                    {collections.map((c: any) => renderBoxItem(c, Math.floor(Math.random() + 10000) + (+c.id || 1)))}
                                </>, wrapBoxElem)
                                setLoadingAsset(false);
                            }
                            res('');
                        } catch (error) {
                            res('');
                        }
                    })));
                    if (!collections.length) {
                        setLoadingAsset(false);
                        if (wrapBoxElem) {
                            ReactDOM.render(<div className="wrapper-not-found">
                                <img src="/images/icons/item-not-found.svg" alt="" />
                                <h4>No item found</h4>
                            </div>, wrapBoxElem)
                        }
                    }
                    dispatch(setAssetsCollection({
                        [connectedAccount]: {
                            ...(assetsAccount[connectedAccount] || {}),
                            [type]: collections
                        }
                    }))
                } else {
                    setLoadingAsset(false);
                    if (wrapBoxElem) {
                        ReactDOM.render(<div className="wrapper-not-found">
                            <img src="/images/icons/item-not-found.svg" alt="" />
                            <h4>No item found</h4>
                        </div>, wrapBoxElem)
                    }
                }
            })
        } else {
            const collections = assetsAccount[connectedAccount][type];
            ReactDOM.render(<>
                {collections.map((c: any) => renderBoxItem(c, Math.floor(Math.random() + 10000) + (+c.id || 1)))}
            </>, wrapBoxElem)
        }
    }, [currentTab, connectedAccount]);

    return (
        <div>
            {/* <AppBar
                currentTab={currentTab}
                tabNames={[tabNames[0].name, tabNames[1].name, tabNames[2].name]}
                onChange={onChangeTab}
            /> */}
            <h3 className={styles.heading}>Assets</h3>
            <Box display="flex" flexWrap="wrap" gridGap="20px" justifyContent="space-between">
                <Box display="flex" gridGap="8px" alignItems="center">
                    <Button
                        onClick={() => {
                            if (currentTab !== 0) {
                                onChangeTab(0)
                            }
                        }}
                        className={clsx(tabStyles.btnTab, {
                            active: currentTab === 0,
                        })}>
                        {tabNames[0].name} {!!assetsAccount[connectedAccount as string]?.[tabNames[0].type]?.length && `(${assetsAccount[connectedAccount as string]?.[tabNames[0].type]?.length})`}
                    </Button>
                    <Button
                        onClick={() => {
                            if (currentTab !== 1) {
                                onChangeTab(1)
                            }
                        }}
                        className={clsx(tabStyles.btnTab, {
                            active: currentTab === 1,
                        })}>
                        {tabNames[1].name} {!!assetsAccount[connectedAccount as string]?.[tabNames[1].type]?.length && `(${assetsAccount[connectedAccount as string]?.[tabNames[1].type]?.length})`}
                    </Button>
                    <Button
                        onClick={() => {
                            if (currentTab !== 2) {
                                onChangeTab(2)
                            }
                        }}
                        className={clsx(tabStyles.btnTab, {
                            active: currentTab === 2,
                        })}>
                        {tabNames[2].name} {!!assetsAccount[connectedAccount as string]?.[tabNames[2].type]?.length && `(${assetsAccount[connectedAccount as string]?.[tabNames[2].type]?.length})`}
                    </Button>
                </Box>
                <Box>
                    <SearchBox placeholder="Search" />
                </Box>
            </Box>

            <div className="divider"></div>
            {
                loadingAsset && <Backdrop open={loadingAsset} style={{ color: '#fff', zIndex: 1000, }}>
                    <CircularProgress />
                </Backdrop>
            }
            <TabPanel value={currentTab} index={tabNames[0].value}>
                <div className={styles.cards} id="nft-cards">
                    {/* {(assetsAccount['nft']?.array || []).map((item: ObjectType<any>, key: number) => <Link key={key} to={`/collection/${item.project.token_address}/${item.id}`}>
                        <BoxCard key={key} item={item} />
                    </Link>)} */}
                </div>
            </TabPanel>
            <TabPanel value={currentTab} index={tabNames[1].value}>
                <div className={styles.cards} id="box-cards">
                    {/* {(assetsAccount['box']?.array || []).map((item: ObjectType<any>, key: number) => <Link key={key} to={`/collection/${item.project.token_address}/${item.id}`}>
                        <BoxCard key={key} item={item} />
                    </Link>)} */}
                </div>
            </TabPanel>
            <TabPanel value={currentTab} index={tabNames[2].value}>
                <div className={styles.cards} id="equipment-cards">
                </div>
            </TabPanel>
        </div>
    )
}

export default Assets
