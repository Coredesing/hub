import React, { useEffect, useMemo, useState } from 'react'
import DefaultLayout from '@layout-components/DefaultLayout'
import WrapperContent from '@base-components/WrapperContent'
import useStyles from './style';
import clsx from 'clsx';
import { Button, Switch, FormGroup, FormControlLabel, Link as MuiLink, Box, TableBody, Backdrop } from '@material-ui/core';
import { SearchBox } from '@base-components/SearchBox';
import SelectBox from '@base-components/SelectBox';
import { Link } from 'react-router-dom';
import { ButtonBase } from '@base-components/Buttons';
import axios from '@services/axios';
import { ObjectType } from '@app-types';
import { useParams } from 'react-router-dom';
import Pagination from '@base-components/Pagination'
import { getContract } from "@utils/contract";
import erc721ABI from '@abi/Erc721.json';
import { useWeb3React } from '@web3-react/core';
import { getContractInstance } from '@services/web3';
import { useDispatch, useSelector } from 'react-redux';
import { useTypedSelector } from '@hooks/useTypedSelector';
import { cvtAddressToStar, formatNumber, getCurrencyByNetwork, formatHumanReadableTime } from '@utils/index';
import {

    TableContainer,
    Table,
    TableHead,
    TableCell,
    TableRowBody,
    TableRowHead,
} from '@base-components/Table';
import { ActionSaleNFT } from './constants';
import { setItemsProjectCollection, setProjectInfor, setActivitiesProjectCollection } from '@store/actions/project-collection';
import CircularProgress from '@base-components/CircularProgress';

const Marketplace = () => {
    const styles = useStyles();
    const { projectAddress } = useParams<ObjectType<any>>()
    const dispatch = useDispatch()

    const filterTypes = useMemo(() => ({
        items: 'items',
        activities: 'activities',
    }), [])
    const [filterType, setFilterType] = useState<string>(filterTypes.items);
    const [selectPrice, setSelectPrice] = useState('newest');
    const pricesFilter = useMemo(() => ([
        { name: 'Newest', value: 'newest' },
        { name: 'Price high - low', value: 'Price high - low' },
        { name: 'Price low - high', value: 'Price low - high' }
    ]), []);
    const [selectType, setSelectType] = useState('all');
    const listTypes = useMemo(() => ([
        { name: 'All', value: 'all' },
        { name: 'My Listing', value: 'mylisting' },
        // { name: 'My Auctions', value: 'myauctions' },
    ]), [])
    const perPage = 10;
    const projectInforsState = useSelector((state: any) => state.projectInfors);
    const itemsProjectCollectionState = useSelector((state: any) => state.itemsProjectCollection);
    const activitiesProjectCollectionState = useSelector((state: any) => state.activitiesProjectCollection);
    const projectInfors = projectInforsState?.data;
    const itemsProjectCollection = itemsProjectCollectionState?.data;
    const activitiesProjectCollection = activitiesProjectCollectionState?.data;
    const itemsProject = itemsProjectCollection?.[projectAddress] || {};
    const activitiesProject = activitiesProjectCollection?.[projectAddress] || {};
    const projectInfor = projectInfors?.[projectAddress] || {};
    const [filterItem, setFilterItem] = useState({ page: 1, perPage, })
    const [filterActivity, setFilterActivity] = useState({ page: 1, perPage, })

    useEffect(() => {
        if (!projectInfor?.token_address) {
            dispatch(setProjectInfor(projectAddress));
        }
    }, [projectInfor?.token_address])

    useEffect(() => {
        if (projectInfor?.token_address) {
            dispatch(setItemsProjectCollection({ projectAddress, filter: filterItem }));
        }
    }, [projectInfor?.token_address, filterItem])
    useEffect(() => {
        if (projectInfor?.token_address) {
            dispatch(setActivitiesProjectCollection({ projectAddress, filter: filterActivity }));
        }
    }, [projectInfor?.token_address, filterActivity])

    const onSetPage = (page: number) => {
        if (filterType === filterTypes.items) {
            setFilterItem(t => ({ ...t, page }));
        }
        if (filterType === filterTypes.activities) {
            setFilterActivity(t => ({ ...t, page }));
        }
    }

    return (
        <DefaultLayout>
            <WrapperContent useShowBanner={false}>
                <div className={styles.page}>
                    <div className={styles.banner}>
                        {projectInforsState.loading && <Backdrop open={projectInforsState.loading} style={{ color: '#fff', zIndex: 1000, }}>
                            <CircularProgress color="inherit" />
                        </Backdrop>}
                        <div className="wrapper-banner">
                            <div className="img-banner">
                                <img src={projectInfor.image} className="" alt="" />
                            </div>
                            <div className="icon">
                                <img src={projectInfor.logo} alt="" />
                            </div>
                        </div>
                        <div className="infor">
                            <h3 className="text-white">{projectInfor.name}</h3>
                            <p className="desc">
                                {projectInfor.description}
                            </p>
                            <div className="socials">
                                {
                                    projectInfor.website && <MuiLink href={projectInfor.website} target="_blank">
                                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 24.6694C18.6274 24.6694 24 19.1469 24 12.3347C24 5.52243 18.6274 0 12 0C5.37258 0 0 5.52243 0 12.3347C0 19.1469 5.37258 24.6694 12 24.6694Z" fill="#AEAEAE" fillOpacity="0.3" />
                                            <path d="M12.0028 5.39649C13.3383 5.39703 14.6436 5.80474 15.7535 6.56802C16.8635 7.33131 17.7283 8.41588 18.2384 9.6845C18.7485 10.9531 18.8811 12.3488 18.6194 13.6949C18.3576 15.0409 17.7133 16.277 16.768 17.2466C15.8226 18.2162 14.6187 18.8757 13.3086 19.1418C11.9985 19.4079 10.641 19.2686 9.40796 18.7414C8.17489 18.2143 7.12166 17.323 6.38153 16.1804C5.64139 15.0378 5.24761 13.6952 5.25001 12.3225C5.25091 11.4119 5.4263 10.5105 5.76616 9.6696C6.10602 8.82873 6.6037 8.06491 7.23076 7.42176C7.85783 6.7786 8.60201 6.26872 9.4208 5.92122C10.2396 5.57372 11.117 5.39542 12.0028 5.39649ZM7.12461 15.8582L8.69717 15.2166C8.59613 14.397 8.49492 13.5749 8.39353 12.7502H6.05688C6.12545 13.8679 6.49514 14.9441 7.12461 15.8582ZM8.39195 11.923C8.49756 11.0833 8.59736 10.2631 8.69717 9.45438L7.12461 8.81063C6.49384 9.72568 6.12422 10.8036 6.05741 11.923H8.39195ZM15.2973 15.2139L16.8704 15.8593C17.4998 14.9445 17.8693 13.8679 17.9376 12.7497H15.6026C15.4998 13.5819 15.3982 14.4034 15.2979 15.2139H15.2973ZM17.9376 11.923C17.8695 10.8039 17.4992 9.72645 16.8683 8.81172L15.2989 9.45384C15.3998 10.2751 15.5007 11.0952 15.6026 11.923H17.9376ZM14.491 9.66335L12.402 9.9049V11.9192H14.7703C14.7503 11.1596 14.6568 10.4039 14.491 9.66335ZM11.5914 11.9214V9.90544L9.50509 9.66227C9.33789 10.4036 9.24464 11.1606 9.22681 11.9214H11.5914ZM9.50457 15.0071L11.5941 14.7639V12.7502H9.22628C9.2452 13.5102 9.33843 14.2663 9.50457 15.0071ZM14.491 15.0071C14.6577 14.2662 14.7507 13.5099 14.7688 12.7497H12.4004V14.7634L14.491 15.0071ZM12.3994 9.06086C13.0264 9.04274 13.6509 8.97011 14.2661 8.84374C14.1019 8.31079 13.8689 7.80291 13.5732 7.3337C13.353 6.99337 13.098 6.68507 12.7585 6.46524C12.6497 6.39414 12.5303 6.3404 12.3994 6.26984V9.06086ZM11.5957 6.26495C10.52 6.7996 10.1124 7.8043 9.72001 8.84483C10.3381 8.97104 10.9657 9.04241 11.5957 9.05814V6.26495ZM12.4004 15.5852V18.3746C12.6507 18.3203 12.9924 18.075 13.2796 17.7325C13.7464 17.175 14.0363 16.522 14.2761 15.7974L12.4004 15.5852ZM9.73849 15.7942C9.83249 16.2572 10.2486 17.1153 10.5834 17.5615C10.7999 17.8492 11.046 18.1043 11.3602 18.279C11.4341 18.3198 11.5133 18.3502 11.5973 18.3876V15.5814L9.73849 15.7942ZM16.3598 16.5079L15.0497 15.9934C14.8004 16.756 14.491 17.4464 14.0496 18.0739C14.9309 17.7515 15.6839 17.2363 16.3572 16.5079H16.3598ZM15.0592 8.64942C15.4973 8.52551 15.922 8.35582 16.3265 8.143C15.8513 7.54593 14.5417 6.6639 14.068 6.60365C14.2476 6.92281 14.4493 7.24523 14.6151 7.58664C14.7809 7.92806 14.9103 8.28847 15.0592 8.64942ZM9.94972 6.59551C9.06469 6.9163 8.31274 7.43412 7.64052 8.16037L8.94641 8.67602C9.19512 7.9172 9.5014 7.22243 9.94972 6.59551ZM9.94972 18.0739C9.50034 17.4464 9.19618 16.7522 8.95486 16.014C8.50716 16.1404 8.07329 16.3137 7.66006 16.5313C8.29199 17.2266 9.07726 17.7557 9.94972 18.0739Z" fill="white" />
                                        </svg>
                                    </MuiLink>
                                }
                                {
                                    projectInfor.telegram && <MuiLink href={projectInfor.telegram} target="_blank">
                                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 24.6694C18.6274 24.6694 24 19.1469 24 12.3347C24 5.52243 18.6274 0 12 0C5.37258 0 0 5.52243 0 12.3347C0 19.1469 5.37258 24.6694 12 24.6694Z" fill="#AEAEAE" fillOpacity="0.3" />
                                            <path d="M10.8347 14.1318L16.2578 18.3405L18.9952 6.3291L5.00488 11.9857L9.26199 13.4351L17.0313 8.07833L10.8347 14.1318Z" fill="white" />
                                            <path d="M9.26172 13.4349L10.4277 17.7475L10.8344 14.1316L17.031 8.07812L9.26172 13.4349Z" fill="#D2D2D7" />
                                            <path d="M12.597 15.4997L10.4277 17.7477L10.8345 14.1318L12.597 15.4997Z" fill="#B9B9BE" />
                                        </svg>
                                    </MuiLink>}
                                {projectInfor.twitter &&
                                    <MuiLink href={projectInfor.twitter} target="_blank">
                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M24.2852 12C24.2852 18.6275 18.9127 24 12.2852 24C5.65765 24 0.285156 18.6275 0.285156 12C0.285156 5.3725 5.65765 0 12.2852 0C18.9127 0 24.2852 5.3725 24.2852 12Z" fill="#4F4F4F" />
                                            <path d="M24.2852 12C24.2852 18.6275 18.9127 24 12.2852 24C5.65765 24 0.285156 18.6275 0.285156 12C0.285156 5.3725 5.65765 0 12.2852 0C18.9127 0 24.2852 5.3725 24.2852 12Z" fill="#AEAEAE" fillOpacity="0.3" />
                                            <path d="M9.28766 18.5646C15.3843 18.5646 18.7183 13.5137 18.7183 9.13397C18.7183 8.99042 18.7154 8.84778 18.7088 8.70569C19.3559 8.23767 19.9184 7.65393 20.3622 6.98944C19.7682 7.2533 19.1292 7.43109 18.4587 7.51111C19.1431 7.10095 19.6685 6.45166 19.9164 5.67767C19.2757 6.05743 18.5667 6.33337 17.8118 6.48224C17.2068 5.83807 16.3455 5.43506 15.3924 5.43506C13.5617 5.43506 12.0773 6.91949 12.0773 8.74927C12.0773 9.00946 12.1064 9.26233 12.1631 9.50513C9.40869 9.36652 6.96588 8.04742 5.3313 6.04205C5.04639 6.53186 4.88251 7.10095 4.88251 7.70795C4.88251 8.85785 5.46771 9.87317 6.35742 10.467C5.81378 10.4503 5.30292 10.3007 4.85632 10.0522C4.85559 10.0662 4.85559 10.0801 4.85559 10.0945C4.85559 11.7 5.99817 13.0402 7.51465 13.3439C7.23633 13.4197 6.94336 13.4606 6.64087 13.4606C6.42737 13.4606 6.21973 13.4393 6.01776 13.4009C6.43982 14.7176 7.66333 15.676 9.11426 15.7031C7.97955 16.592 6.5506 17.1218 4.99768 17.1218C4.73035 17.1218 4.46649 17.1066 4.20703 17.0758C5.67389 18.0159 7.41559 18.5646 9.28766 18.5646Z" fill="white" />
                                        </svg>
                                    </MuiLink>
                                }
                                {projectInfor.medium &&
                                    <MuiLink href={projectInfor.medium} target="_blank">
                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.5713 24.6694C19.1987 24.6694 24.5713 19.1469 24.5713 12.3347C24.5713 5.52243 19.1987 0 12.5713 0C5.94387 0 0.571289 5.52243 0.571289 12.3347C0.571289 19.1469 5.94387 24.6694 12.5713 24.6694Z" fill="#AEAEAE" fillOpacity="0.3" />
                                            <path d="M17.9497 8.62554L18.9711 7.6212V7.40137H15.4329L12.9113 13.8528L10.0424 7.40137H6.3325V7.6212L7.52558 9.09755C7.64185 9.20665 7.70265 9.36618 7.68719 9.52681V15.3286C7.72399 15.5375 7.65785 15.7524 7.51492 15.9042L6.1709 17.5785V17.7956H9.98162V17.5757L8.6376 15.9042C8.492 15.7518 8.4232 15.5408 8.45253 15.3286V10.3102L11.7976 17.7983H12.1864L15.0628 10.3102V16.2754C15.0628 16.4327 15.0627 16.4651 14.9625 16.5681L13.9278 17.5971V17.8175H18.9476V17.5977L17.9503 16.5939C17.8628 16.5259 17.8175 16.4119 17.8361 16.3011V8.91829C17.8175 8.807 17.8623 8.69297 17.9497 8.62554Z" fill="white" />
                                        </svg>
                                    </MuiLink>
                                }
                            </div>
                            {/* <div className="token-infor">
                                <div className="item">
                                    <label>Floor (BNB)</label>
                                    <span>0</span>
                                </div>
                                <div className="item">
                                    <label>top sold (BNB)</label>
                                    <span>0</span>
                                </div>
                                <div className="item">
                                    <label>Vol.7D (BNB)</label>
                                    <span>0</span>
                                </div>
                                <div className="item">
                                    <label>items sold 7D</label>
                                    <span>0</span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className="content-page">
                        <div className={styles.header}>
                            <div className="title">
                                <h3>Marketplace</h3>
                            </div>
                            <div className="filter">
                                <div className="item">
                                    <Button
                                        onClick={() => {
                                            if (filterType !== filterTypes.items) {
                                                setFilterType(filterTypes.items)
                                            }
                                        }}
                                        className={clsx(styles.btnFilter, {
                                            active: filterTypes.items === filterType,
                                        })}>
                                        Items
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (filterType !== filterTypes.activities) {
                                                setFilterType(filterTypes.activities)
                                            }
                                        }}
                                        className={clsx(styles.btnFilter, {
                                            active: filterTypes.activities === filterType,
                                        })}>
                                        Activities
                                    </Button>
                                    {/* <FormGroup> */}
                                    {/* <SelectBox
                                            onChange={(e) => setSelectType(e.target.value as string)}
                                            items={listTypes}
                                            itemNameValue="value"
                                            itemNameShowValue="name"
                                            defaultValue={selectType}
                                            value={selectType} /> */}
                                    {/* <FormControlLabel
                                            classes={{ label: styles.labelSwitch }}
                                            control={<Switch checked={filterType} onChange={(e) => setFilterType(e.target.checked)} classes={{
                                                track: clsx(styles.bgSwitch, { checked: filterType }),
                                                checked: styles.colorSwitch,
                                            }} />} className="switch" label="My Listing" /> */}
                                    {/* </FormGroup> */}
                                    {/* <FormGroup>
                                        <FormControlLabel
                                            classes={{ label: styles.labelSwitch }}
                                            control={<Switch checked={filterType} onChange={(e) => setFilterType(e.target.checked)} classes={{
                                                track: clsx(styles.bgSwitch, { checked: filterType }),
                                                checked: styles.colorSwitch,
                                            }} />} className="switch" label="My Auctions" />
                                     </FormGroup> */}
                                </div>
                                {/* <div className="item">
                                    <div className="input-search">
                                        <SearchBox placeholder="Search NFT name - Creator" />
                                    </div>
                                    <SelectBox
                                        onChange={(e) => setSelectPrice(e.target.value as string)}
                                        items={pricesFilter}
                                        itemNameValue="value"
                                        itemNameShowValue="name"
                                        defaultValue={selectPrice}
                                        value={selectPrice} />
                                </div> */}
                            </div>
                        </div>
                        <div className={styles.content}>
                            {
                                filterType === filterTypes.items && <>
                                    {itemsProjectCollectionState.loading && <Backdrop open={itemsProjectCollectionState.loading} style={{ color: '#fff', zIndex: 1000, }}>
                                        <CircularProgress color="inherit" />
                                    </Backdrop>}
                                    {
                                        itemsProjectCollectionState.data !== null && !itemsProjectCollectionState.loading && !itemsProject?.totalPage ?
                                            <Box width="100%" textAlign="center">
                                                <img src="/images/icons/item-not-found.svg" alt="" />
                                                <h4 className="firs-neue-font font-16px bold text-white text-center">No item found</h4>
                                            </Box> :
                                            itemsProject?.totalPage && <>
                                                <div className={styles.cards}>
                                                    {
                                                        (itemsProject?.currentList || []).map((coll: any, id: number) => <Link key={id} to={`/collection/${projectAddress}/${coll.token_id}`}>
                                                            <div key={id} className={clsx(styles.card, { active: id === 0 })} >
                                                                <ButtonBase className="btn-buy" color="green">Detail</ButtonBase>
                                                                <div className={styles.cardImg}>
                                                                    {coll.image && <img src={coll.image} alt="" />}
                                                                </div>
                                                                <div className={styles.cardBody}>
                                                                    <Box className="creator" display="grid" gridTemplateColumns="16px auto" gridGap={"6px"} alignItems="center" marginBottom={'6px'}>
                                                                        <img src={projectInfor.logo} style={{ width: '16px', height: '16px', borderRadius: '50%' }} alt="" />
                                                                        <span className="text-uppercase" style={{ color: '#AEAEAE', fontSize: '12px', fontFamily: 'Helvetica' }}>MECH MASTER</span>
                                                                    </Box>
                                                                    <Box marginBottom="12px">
                                                                        <h3>
                                                                            #{formatNumber(coll.token_id, 3)}
                                                                        </h3>
                                                                    </Box>
                                                                    <Box className="bid" display="grid" gridTemplateColumns="1fr 1fr" gridGap="4px" justifyContent="space-between">
                                                                        <Box className="item" display="grid" gridGap="4px">
                                                                            <label className="helvetica-font font-12px text-grey" htmlFor="">Price floor</label>
                                                                            <span className="bold font-16px helvetica-font text-white">
                                                                                <img src="" alt="" />
                                                                                {coll.value} {coll.currencySymbol}
                                                                            </span>
                                                                        </Box>
                                                                        <Box className="item" display="grid" gridGap="4px" textAlign="right">
                                                                            <label className="helvetica-font font-12px text-grey" htmlFor="">Highest offer</label>
                                                                            <span className="bold font-16px helvetica-font text-white">
                                                                                <img src="" alt="" />
                                                                                -/- {coll.currencySymbol}
                                                                            </span>
                                                                        </Box>
                                                                    </Box>
                                                                    {/* <div className="network">
                                                   <div className="exchange-rate">
                                                       <span className="current">
                                                           {card.price}
                                                       </span>
                                                       <span className="seperate">~</span>
                                                       <span className="usd">
                                                           $ {card.usdPrice}
                                                       </span>
                                                   </div>
                                                   <div className="icon">
                                                       <img src={`/images/icons/${card.network}.png`} alt="" />
                                                   </div>
                                               </div> */}
                                                                    {/* <div className="tags">
                                                   {card.tags.map((t) => <span key={t}>{t}</span>)}
                                               </div> */}
                                                                </div>
                                                                {/* <div className={styles.cardFooter}>
                                               <div className="logo">
                                                   <img src={card.iconToken} alt="" />
                                                   <span className="text-uppercase">{card.tokenName}</span>
                                               </div>
                                               <div className="interactions">
                                                   <div className="item">
                                                       <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                           <path d="M4.7782 8.74697C4.83696 8.8076 4.91696 8.84128 5.00072 8.84128C5.08447 8.84128 5.16447 8.8076 5.22323 8.74697L9.22096 4.6543C10.8881 2.94794 9.70349 0 7.33252 0C5.90868 0 5.25531 1.05716 5.00072 1.25462C4.74487 1.05632 4.09566 0 2.66891 0C0.30544 0 -0.893797 2.94036 0.780885 4.6543L4.7782 8.74697Z" fill="#7D7D7D" />
                                                       </svg>
                                                       <span>{card.interactions.hearts}</span>
                                                   </div>
                                                   <div className="item">
                                                       <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                           <path d="M7 0.827148C4.32515 0.827148 1.89946 2.29058 0.109543 4.66759C-0.0365143 4.86233 -0.0365143 5.1344 0.109543 5.32914C1.89946 7.70901 4.32515 9.17245 7 9.17245C9.67485 9.17245 12.1005 7.70901 13.8905 5.332C14.0365 5.13726 14.0365 4.8652 13.8905 4.67045C12.1005 2.29058 9.67485 0.827148 7 0.827148ZM7.19188 7.93812C5.41628 8.04981 3.94998 6.58638 4.06168 4.80792C4.15332 3.34162 5.34182 2.15312 6.80812 2.06147C8.58372 1.94978 10.05 3.41322 9.93832 5.19168C9.84382 6.65511 8.65531 7.84361 7.19188 7.93812ZM7.1031 6.58065C6.14657 6.64079 5.35614 5.85323 5.41915 4.8967C5.46783 4.10627 6.10934 3.46763 6.89977 3.41608C7.8563 3.35594 8.64672 4.1435 8.58372 5.10003C8.53217 5.89332 7.89066 6.53196 7.1031 6.58065Z" fill="#7D7D7D" />
                                                       </svg>
                                                       <span>{card.interactions.views}</span>
                                                   </div>
                                               </div>
                                           </div> */}
                                                            </div>
                                                        </Link>
                                                        )}
                                                </div>
                                                {itemsProject.totalPage &&
                                                    <Pagination
                                                        count={itemsProject.totalPage}
                                                        page={itemsProject.currentPage}
                                                        onChange={(e: any, page: any) => {
                                                            onSetPage(page)
                                                        }}
                                                    />
                                                }
                                            </>
                                    }

                                </>
                            }
                            {
                                filterType === filterTypes.activities && (
                                    <>
                                        {activitiesProjectCollectionState.loading && <Backdrop open={activitiesProjectCollectionState.loading} style={{ color: '#fff', zIndex: 1000, }}>
                                            <CircularProgress color="inherit" />
                                        </Backdrop>}

                                        {
                                            activitiesProjectCollectionState.data !== null && !activitiesProjectCollectionState.loading && !activitiesProject?.totalPage ?
                                                <Box width="100%" textAlign="center">
                                                    <img src="/images/icons/item-not-found.svg" alt="" />
                                                    <h4 className="firs-neue-font font-16px bold text-white text-center">No item found</h4>
                                                </Box> :
                                                activitiesProject?.totalPage && <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRowHead>
                                                                <TableCell>ITEM</TableCell>
                                                                <TableCell>PRICE</TableCell>
                                                                <TableCell>TYPE</TableCell>
                                                                <TableCell>FROM</TableCell>
                                                                <TableCell>TO</TableCell>
                                                                <TableCell>DATE</TableCell>
                                                            </TableRowHead>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                (activitiesProject?.currentList || []).map((col: any, idx: number) => <TableRowBody key={idx}>
                                                                    <TableCell>
                                                                        <Box display="grid" gridTemplateColumns="56px auto" gridGap="8px" alignItems="center">
                                                                            <Box width="56px" height="56px" style={{ backgroundColor: "#000", borderRadius: '4px' }}>
                                                                                {col.image && <img src={col.image} alt="" width="56px" height="56px" />}
                                                                            </Box>
                                                                            <Box>
                                                                                <h4 className="firs-neue-font font-16px text-white">#{col.token_id}</h4>
                                                                                <span className="text-grey helvetica-font font-14px">{projectInfor.name}</span>
                                                                            </Box>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Box>
                                                                            <span>{col.value} {col.currencySymbol}</span>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {ActionSaleNFT[col.event_type as keyof typeof ActionSaleNFT]}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            ActionSaleNFT[col.event_type as keyof typeof ActionSaleNFT] === ActionSaleNFT.TokenListed ||
                                                                                ActionSaleNFT[col.event_type as keyof typeof ActionSaleNFT] === ActionSaleNFT.TokenDelisted ?
                                                                                cvtAddressToStar(col.seller || '', '.', 5) :
                                                                                cvtAddressToStar(col.buyer || '', '.', 5)
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            ActionSaleNFT[col.event_type as keyof typeof ActionSaleNFT] === ActionSaleNFT.TokenListed ||
                                                                                ActionSaleNFT[col.event_type as keyof typeof ActionSaleNFT] === ActionSaleNFT.TokenDelisted ?
                                                                                cvtAddressToStar(col.buyer || '', '.', 5) :
                                                                                cvtAddressToStar(col.seller || '', '.', 5)
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {col.dispatch_at && formatHumanReadableTime(+col.dispatch_at * 1000, Date.now())}
                                                                    </TableCell>
                                                                </TableRowBody>)
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                    <Pagination
                                                        count={activitiesProject?.totalPage}
                                                        page={activitiesProject.currentPage}
                                                        onChange={(e: any, page: any) => {
                                                            onSetPage(page)
                                                        }}
                                                    />
                                                </TableContainer>}
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            </WrapperContent>
        </DefaultLayout>
    )
}

export default Marketplace
