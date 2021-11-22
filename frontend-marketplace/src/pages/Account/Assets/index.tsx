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
import { setAssetsCollection } from '@store/actions/assets-account';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom'
import { Backdrop } from '@material-ui/core';
import CircularProgress from '@base-components/CircularProgress';
const Assets = () => {
    const styles = useStyles();
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
    const onChangeTab = (e: any, val: number) => {
        setCurrentTab(val);
    }

    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const { connectedAccount, wrongChain /*isAuth*/ } = useAuth();
    const assetsAccount = useSelector((state: any) => state.assetsAccount).data || {};
    const [assets, setAssets] = useState<ObjectType<any>>({});

    const onRedirectDetail = (item: any) => {
        console.log('ui', item)
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
    useEffect(() => {
        if (!appChainID || !connectedAccount) return;
        const type = tabNames[currentTab].type || tabNames[0].type;
        const wrapBoxElem = document.querySelector(`#${type}-cards`);
        if (!assetsAccount[type]?.length) {
            setLoadingAsset(true);
            axios.get(`/marketplace/collections/support?type=${type}`).then(async (res) => {
                const arr = res.data.data || [];
                if (arr.length) {
                    if (!wrapBoxElem) return;
                    const collections: ObjectType<any>[] = [];
                    await Promise.all(arr.map((p: any) => new Promise(async (res) => {
                        try {
                            const contract = getContractInstance(erc721ABI, p.token_address, undefined, appChainID);
                            if (!contract) return res('');
                            let myBoxes = await contract.methods.balanceOf(connectedAccount).call();
                            myBoxes = +myBoxes;
                            for (let id = 0; id < myBoxes; id++) {
                                const idCollection = await contract.methods.tokenOfOwnerByIndex(connectedAccount, id).call();
                                const tokenURI = await contract.methods.tokenURI(idCollection).call();
                                const collection: ObjectType<any> = {
                                    id: idCollection,
                                    creator: p.name,
                                    project: p,
                                };
                                try {
                                    const infoBoxType = (await axios.get(tokenURI)).data;
                                    Object.assign(collection, infoBoxType);
                                    collection.icon = infoBoxType.image;
                                    collection.price = infoBoxType.price;
                                } catch (error: any) {
                                    collection.icon = 'default.img';
                                }
                                collections.push(collection);
                                wrapBoxElem.append(getElmStr({
                                    item: collection, styles: cardStyle, onClick: () => {
                                        onRedirectDetail(collection)
                                    }
                                }))
                                setLoadingAsset(false);
                                // ReactDOM.render(<>
                                //     {renderBoxItem(collection, idCollection)}
                                // </>, wrapBoxElem)

                            }
                            res('');
                        } catch (error) {
                            res('');
                        }
                    })));
                    dispatch(setAssetsCollection({ [type]: collections }))
                } else {
                    setLoadingAsset(false);
                }
            })
        } else {
            const collections = assetsAccount[type];
            console.log('collections', collections)
            ReactDOM.render(<>
                {collections.map((c: any) => renderBoxItem(c, Math.floor(Math.random() + 10000) + (+c.id || 1)))}
            </>, wrapBoxElem)
        }
    }, [currentTab, appChainID, connectedAccount]);

    return (
        <div>
            <AppBar
                currentTab={currentTab}
                tabNames={[tabNames[0].name, tabNames[1].name, tabNames[2].name]}
                onChange={onChangeTab}
            />
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
                <div>
                </div>
            </TabPanel>
        </div>
    )
}

export default Assets
