import React, { useCallback, useEffect, useState } from "react";

import PropTypes from "prop-types";
// import SwipeableViews from 'react-swipeable-views';
import { withStyles, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import {
    TableCell,
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRowBody,
    TableRowHead
} from '../../components/Base/Table';
import { useAboutStyles } from "./style";
import clsx from 'clsx';
import ButtonBase from '@base-components/Buttons/ButtonBase'
import { AppBar, TabPanel } from "@base-components/Tabs";
import { useFetchV1 } from "@hooks/useFetch";
import { ObjectType } from "@app-types";
import { useWeb3React } from "@web3-react/core";
import axios from '@services/axios'
import { getTimeStringPassed } from '@utils/index'
type Props = {
    info: { [k: string]: any },
    [k: string]: any
}

export const AboutMarketplaceNFT = ({
    info = {},
    token,
    defaultTab,
    id,
    projectAddress,
    isOwnerNFTOnSale,
    reloadOfferList,
    getSymbolCurrency,
    addressCurrencyToBuy,
    ...props }: Props) => {
    const classes = useAboutStyles();
    const [currentTab, setCurrentTab] = useState<number>(defaultTab || 0);
    const onChangeTab = (e: any, val: number) => {
        setCurrentTab(val);
    }

    const [timenow] = useState(Date.now());


    const [offerList, setOfferList] = useState<ObjectType<any>[]>([]);
    useEffect(() => {
        console.log('addressCurrencyToBuy', addressCurrencyToBuy)
        // update pagination
        if (reloadOfferList) {
            const cachedCurrency: ObjectType<string> = {};
            axios.get(`/marketplace/offers/${projectAddress}/${id}?event_type=TokenOffered`).then(async (res) => {
                let offers = res.data?.data || [];
                const offerList: ObjectType<any>[] = [];
                await Promise.all(offers.map((item: any) => new Promise(async (res) => {
                    if (item.currency === addressCurrencyToBuy) {
                        if (!cachedCurrency[item.currency]) {
                            const symbol = await getSymbolCurrency(item.currency);
                            cachedCurrency[item.currency] = symbol;
                            item.currencySymbol = symbol;
                        } else {
                            item.currencySymbol = cachedCurrency[item.currency];
                        }
                        offerList.push(item);
                    }
                    res('');
                })));
                setOfferList(offerList);
            })
        }
    }, [reloadOfferList])
    const { account: connectedAccount } = useWeb3React();

    const formatTraitType = (item: any) => {
        let traitType = item.trait_type || item.traitType || '';
        traitType = typeof traitType === 'string' ? traitType : '';
        let formatted = '';

        formatted = traitType.split('_').map((w: string) => (w[0].toUpperCase() + w.slice(1))).join(' ');
        return formatted;
    }

    const formatValue = (item: any) => {
        if (typeof item?.value !== 'object') {
            return item.value;
        }
        return '';
    }

    return (
        <div className={classes.root}>
            <AppBar
                currentTab={currentTab}
                tabNames={["Attributes", "Offers"]}
                onChange={onChangeTab}
            />
            {/* <TabPanel value={currentTab} index={0}>
                <div className={classes.informationTab}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque iaculis et magna ut feugiat.
                        Pellentesque varius sagittis velit eget blandit. Sed vehicula lorem a lectus pulvinar pharetra.
                        Nunc justo mi, lacinia ac dolor id.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Pellentesque iaculis et magna ut feugiat. Pellentesque varius sagittis velit eget blandit.
                        Sed vehicula lorem a lectus pulvinar pharetra. Nunc justo mi, lacinia
                    </p>
                    <div className="item">
                        <label htmlFor="">
                            CONTRACT ADDRESS
                        </label>
                        <div className="network">
                            <img src="/images/icons/eth.png" alt="" className="icon" />
                            <span className="name">
                                Ethereum:
                            </span>
                            <span className="address">0x7083609...873402</span>
                            <a href="" rel="noreferrer" target="_blank">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.8424 3.67302L10.3071 0.155337C10.1543 0.00325498 9.92514 -0.041861 9.72652 0.0409337C9.52755 0.123537 9.39803 0.317727 9.39803 0.533053V2.12986C7.64542 2.24568 6.77025 2.97233 6.61213 3.11711C4.41287 4.94753 4.65609 7.44348 4.73 7.94006C4.73106 7.94717 4.73213 7.95444 4.73336 7.96155L4.80442 8.37017C4.84262 8.58976 5.013 8.76227 5.23188 8.80295C5.26455 8.809 5.29725 8.812 5.3296 8.812C5.51455 8.812 5.68919 8.7157 5.78653 8.55315L5.99953 8.19818C7.16391 6.26169 8.60278 5.9499 9.398 5.94722V7.60391C9.398 7.81975 9.52823 8.01413 9.72792 8.09655C9.9276 8.17879 10.157 8.13261 10.309 7.97982L13.8444 4.42665C14.0519 4.21807 14.051 3.88052 13.8424 3.67302ZM10.4642 6.3125V5.45422C10.4642 5.19252 10.2745 4.96957 10.0161 4.92801C9.40106 4.82905 7.46526 4.70984 5.79348 6.6609C5.90132 5.86462 6.25806 4.79441 7.30412 3.92829C7.31692 3.91763 7.32135 3.91407 7.33308 3.90234C7.3409 3.89507 8.13576 3.18016 9.8777 3.18016H9.931C10.2254 3.18016 10.464 2.94156 10.464 2.64719V1.81522L12.7128 4.05251L10.4642 6.3125Z" fill="#AEAEAE" />
                                    <path d="M11.9032 10.3399C11.6089 10.3399 11.3703 10.5785 11.3703 10.8729V12.383H1.06597V4.56594H4.26385C4.55822 4.56594 4.79682 4.32735 4.79682 4.03297C4.79682 3.7386 4.55822 3.5 4.26385 3.5H0.53297C0.238595 3.49997 0 3.73857 0 4.03294V12.916C0 13.2103 0.238595 13.4489 0.53297 13.4489H11.9032C12.1976 13.4489 12.4362 13.2103 12.4362 12.916V10.8729C12.4362 10.5785 12.1976 10.3399 11.9032 10.3399Z" fill="#AEAEAE" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="item">
                        <label htmlFor="">
                            TOKEN ID
                        </label>
                        <div>
                            100300036196
                        </div>
                    </div>
                </div>
            </TabPanel> */}
            <TabPanel value={currentTab} index={0}>
                <TableContainer style={{ background: '#171717', marginTop: '7px' }}>
                    <Table>
                        <TableBody>
                            {(info.attributes || []).map((row: any, idx: number) => (
                                <TableRowBody key={idx}>
                                    <TableCell width="80px" style={{ paddingLeft: '28px' }}>
                                        <div>
                                            {formatTraitType(row)}: <span>{formatValue(row)}</span>
                                        </div>
                                        {/* <div className={classes.tableCellOffer}>
                                            <h4>
                                                <span>Listed by @</span>{row.origin}
                                            </h4>
                                            <h5>{new Date(row.time).toDateString()}</h5>
                                        </div> */}
                                    </TableCell>
                                </TableRowBody>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <TableContainer style={{ background: '#171717', marginTop: '7px' }}>
                    <Table>
                        <TableBody>
                            {offerList.map((row: any, idx: number) => (
                                <TableRowBody key={idx}>
                                    <TableCell width="200px" scope="row" style={{ paddingLeft: '28px' }}>
                                        <div className={classes.tableCellOffer}>
                                            <h4>
                                                {row.buyer} <span>make an offer</span>
                                            </h4>
                                            <h5 className="text-left">{getTimeStringPassed(row.dispatch_at * 1000 || 0, timenow)}</h5 >
                                        </div>
                                    </TableCell>
                                    <TableCell width="150px" align="left" style={{ padding: '7px' }} className="text-uppercase">
                                        <div className={classes.tableCellOffer}>
                                            <h4 className="text-right flex">
                                                {row.currencySymbol && <img src={`/images/icons/${(row.currencySymbol).toLowerCase()}.png`} alt="" />}
                                                {+row.value || ''} {row.currencySymbol}
                                            </h4>
                                            {/* <h5 className="text-right">{row.usdPrice}</h5> */}
                                        </div>
                                    </TableCell>
                                    <TableCell align="right" style={{ padding: '7px', paddingRight: '20px' }}>
                                        {
                                            row.event_type === 'TokenOffered' && addressCurrencyToBuy === row.currency && (isOwnerNFTOnSale ?
                                                <ButtonBase color="green"
                                                    className={clsx("text-transform-unset ", classes.btn)}
                                                    onClick={() => {
                                                        props.onAcceptOffer(row)
                                                    }}>
                                                    Accept
                                                </ButtonBase> :
                                                row.buyer === connectedAccount &&
                                                <ButtonBase color="green"
                                                    className={clsx("text-transform-unset", classes.btn)}
                                                    onClick={props.onRejectOffer}>
                                                    Cancel
                                                </ButtonBase>)
                                        }
                                    </TableCell>
                                </TableRowBody>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

        </div>
    );
}