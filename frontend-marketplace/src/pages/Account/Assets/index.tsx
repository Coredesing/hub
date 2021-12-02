import React, { useEffect, useState, useCallback } from 'react'
import { AppBar, TabPanel } from '@base-components/Tabs';
import CardMarketplace from '@base-components/CardMarketplace';
import axios from '@services/axios';
import { ObjectType } from '@app-types';
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
import { debounce, escapeRegExp } from '@utils/index'
const Assets = () => {
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
        history.push(`/collection/${item.project.slug}/${item.id}`)
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

    const renderNotFoundCollection = useCallback((elem: any) => {
        if (!elem) return;
        ReactDOM.render(<div className="wrapper-not-found">
            <img src="/images/icons/item-not-found.svg" alt="" />
            <h4>No item found</h4>
        </div>, elem)
    }, [])

    const renderCollectionItem = (elem: any, collections: any[]) => {
        if (!elem) return;
        ReactDOM.render(<>
            {collections.map((c: any) => renderBoxItem(c, c.key))}
        </>, elem)
    };

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
                                collection.key = Math.floor(Math.random() + 10000) + (+collection.id || 1);
                                collection.value = collection.value || collection.price;
                                collections.push(collection);
                                renderCollectionItem(wrapBoxElem, collections);
                                setLoadingAsset(false);
                            }
                            res('');
                        } catch (error) {
                            res('');
                        }
                    })));
                    if (!collections.length) {
                        setLoadingAsset(false);
                        renderNotFoundCollection(wrapBoxElem)
                    }
                    dispatch(setAssetsCollection({
                        [connectedAccount]: {
                            ...(assetsAccount[connectedAccount] || {}),
                            [type]: collections
                        }
                    }))
                } else {
                    setLoadingAsset(false);
                    renderNotFoundCollection(wrapBoxElem)
                }
            })
        } else {
            const collections = assetsAccount[connectedAccount][type];
            renderCollectionItem(wrapBoxElem, collections);
        }
    }, [currentTab, connectedAccount]);

    const [search, setSearch] = useState<ObjectType<string>>({});
    useEffect(() => {
        setSearch({});
    }, [currentTab])
    const type = tabNames[currentTab].type || tabNames[0].type;
    const handleSearchCollection = (event: any) => {
        const value = event.target?.value;
        const type = tabNames[currentTab].type || tabNames[0].type;
        const collections = assetsAccount?.[connectedAccount as string]?.[type] || [];
        const regex = new RegExp(escapeRegExp(value), 'i');
        const wrapBoxElem = document.querySelector(`#${type}-cards`);
        const listFilterd = collections.filter((item: any) => {
            return regex.test(item.name || '') || regex.test(item.token_id) || regex.test(item.project?.name);
        });
        if (wrapBoxElem) {
            if (listFilterd.length) {
                renderCollectionItem(wrapBoxElem, listFilterd);
            } else {
                renderNotFoundCollection(wrapBoxElem)
            }

        }
        setSearch(t => ({ ...t, [type]: value }));
    }

    const onSearchCollection = debounce(handleSearchCollection, 1000);

    return (
        <div>
            {/* <AppBar
                currentTab={currentTab}
                tabNames={[tabNames[0].name, tabNames[1].name, tabNames[2].name]}
                onChange={onChangeTab}
            /> */}
            <h3 className={tabStyles.heading}>Assets</h3>
            <p className="text-grey font-12px firs-neue-font mb-20px">Only NFTs selected by GameFi will be shown.</p>
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
                    <SearchBox placeholder="Search" key={'search' + type} defaultValue={search?.[type]} onChange={onSearchCollection} />
                </Box>
            </Box>

            <div className="divider"></div>
            {
                loadingAsset && <Backdrop open={loadingAsset} style={{ color: '#fff', zIndex: 1000, }}>
                    <CircularProgress />
                </Backdrop>
            }
            <TabPanel value={currentTab} index={tabNames[0].value}>
                <div className={tabStyles.cards} id="nft-cards">
                    {/* {(assetsAccount['nft']?.array || []).map((item: ObjectType<any>, key: number) => <Link key={key} to={`/collection/${item.project.token_address}/${item.id}`}>
                        <BoxCard key={key} item={item} />
                    </Link>)} */}
                </div>
            </TabPanel>
            <TabPanel value={currentTab} index={tabNames[1].value}>
                <div className={tabStyles.cards} id="box-cards">
                    {/* {(assetsAccount['box']?.array || []).map((item: ObjectType<any>, key: number) => <Link key={key} to={`/collection/${item.project.token_address}/${item.id}`}>
                        <BoxCard key={key} item={item} />
                    </Link>)} */}
                </div>
            </TabPanel>
            <TabPanel value={currentTab} index={tabNames[2].value}>
                <div className={tabStyles.cards} id="equipment-cards">
                </div>
            </TabPanel>
        </div>
    )
}

export default Assets
