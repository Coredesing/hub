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
import BoxCard from '../components/BoxCard';
import { Link } from 'react-router-dom';
import { setAssetsCollection } from '@store/actions/assets-account';
const Assets = () => {
    const styles = useStyles();
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

    useEffect(() => {
        if (!appChainID || !connectedAccount) return;
        const type = tabNames[currentTab].type || tabNames[0].type;
        if (!assetsAccount[type]?.array?.length) {
            axios.get(`/marketplace/collections/support?type=${type}`).then(async (res) => {
                const arr = res.data.data || [];
                if (arr.length) {
                    const collections: ObjectType<any>[] = [];
                    const objectData: ObjectType<any> = {};
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
                                objectData[idCollection] = collection;
                                collections.push(collection);
                            }
                            res('');
                        } catch (error) {
                            res('');
                        }
                    })));
                    dispatch(setAssetsCollection({ [type]: {
                        objects: objectData,
                        array: collections,
                    } }))
                }

                // setAssets(assets => ({ ...assets, [type]: res.data.data || [] }));
                console.log('res', res.data)
            })
        }
    }, [currentTab, assetsAccount, appChainID, connectedAccount]);

    return (
        <div>
            <AppBar
                currentTab={currentTab}
                tabNames={[tabNames[0].name, tabNames[1].name, tabNames[2].name]}
                onChange={onChangeTab}
            />
            <TabPanel value={currentTab} index={tabNames[0].value}>
                <div className={styles.cards}>
                    {(assetsAccount['nft']?.array || []).map((item: ObjectType<any>, key: number) => <Link key={key} to={`/collection/${item.project.token_address}/${item.id}`}>
                        <BoxCard key={key} item={item} />
                    </Link>)}
                </div>
            </TabPanel>
            <TabPanel value={currentTab} index={tabNames[1].value}>
                <div className={styles.cards}>
                    {(assetsAccount['box']?.array || []).map((item: ObjectType<any>, key: number) => <Link key={key} to={`/collection/${item.project.token_address}/${item.id}`}>
                        <BoxCard key={key} item={item} />
                    </Link>)}
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
