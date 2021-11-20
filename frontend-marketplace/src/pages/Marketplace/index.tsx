import React, { useMemo, useState } from 'react'
import DefaultLayout from '@layout-components/DefaultLayout'
import WrapperContent from '@base-components/WrapperContent'
import useStyles from './style';
import clsx from 'clsx';
import { Button, Switch, FormGroup, FormControlLabel } from '@material-ui/core';
import { SearchBox } from '@base-components/SearchBox';
import SelectBox from '@base-components/SelectBox';
import { Link } from 'react-router-dom';
import { ButtonBase } from '@base-components/Buttons';
import { getVectorIcon } from '@base-components/Icon';
const Marketplace = () => {
    const styles = useStyles();
    const cards = [
        { name: 'Legion', image: '/images/marketplace/character1.png', network: 'eth', iconNetwork: '/images/icons/bsc.png', price: '0.11 ETH', usdPrice: '40.42', tags: ['Character', 'Fixed Price'], iconToken: '/images/icons/mech-master.png', tokenName: 'MECH MASTER', interactions: { views: 3100, hearts: 300 } },
        { name: 'Legion', image: '/images/marketplace/character1.png', network: 'eth', iconNetwork: '/images/icons/bsc.png', price: '0.11 ETH', usdPrice: '40.42', tags: ['Character', 'Fixed Price'], iconToken: '/images/icons/mech-master.png', tokenName: 'MECH MASTER', interactions: { views: 3100, hearts: 300 } },
        { name: 'Legion', image: '/images/marketplace/character1.png', network: 'eth', iconNetwork: '/images/icons/bsc.png', price: '0.11 ETH', usdPrice: '40.42', tags: ['Character', 'Fixed Price'], iconToken: '/images/icons/mech-master.png', tokenName: 'MECH MASTER', interactions: { views: 3100, hearts: 300 } },
        { name: 'Legion', image: '/images/marketplace/character1.png', network: 'eth', iconNetwork: '/images/icons/bsc.png', price: '0.11 ETH', usdPrice: '40.42', tags: ['Character', 'Fixed Price'], iconToken: '/images/icons/mech-master.png', tokenName: 'MECH MASTER', interactions: { views: 3100, hearts: 300 } },
        { name: 'Legion', image: '/images/marketplace/character1.png', network: 'eth', iconNetwork: '/images/icons/bsc.png', price: '0.11 ETH', usdPrice: '40.42', tags: ['Character', 'Fixed Price'], iconToken: '/images/icons/mech-master.png', tokenName: 'MECH MASTER', interactions: { views: 3100, hearts: 300 } },
        { name: 'Legion', image: '/images/marketplace/character1.png', network: 'eth', iconNetwork: '/images/icons/bsc.png', price: '0.11 ETH', usdPrice: '40.42', tags: ['Character', 'Fixed Price'], iconToken: '/images/icons/mech-master.png', tokenName: 'MECH MASTER', interactions: { views: 3100, hearts: 300 } },
        // { name: 'Legion', image: '/images/marketplace/character1.png', network: 'eth', iconNetwork: '/images/icons/bsc.png', price: '0.11 ETH', usdPrice: '40.42', tags: ['Character', 'Fixed Price'], iconToken: '/images/icons/mech-master.png', tokenName: 'MECH MASTER', interactions: { views: 3100, hearts: 300 } },
        // { name: 'Legion', image: '/images/marketplace/character1.png', network: 'eth', iconNetwork: '/images/icons/bsc.png', price: '0.11 ETH', usdPrice: '40.42', tags: ['Character', 'Fixed Price'], iconToken: '/images/icons/mech-master.png', tokenName: 'MECH MASTER', interactions: { views: 3100, hearts: 300 } },
        // { name: 'Legion', image: '/images/marketplace/character1.png', network: 'eth', iconNetwork: '/images/icons/bsc.png', price: '0.11 ETH', usdPrice: '40.42', tags: ['Character', 'Fixed Price'], iconToken: '/images/icons/mech-master.png', tokenName: 'MECH MASTER', interactions: { views: 3100, hearts: 300 } },
        // { name: 'Legion', image: '/images/marketplace/character1.png', network: 'eth', iconNetwork: '/images/icons/bsc.png', price: '0.11 ETH', usdPrice: '40.42', tags: ['Character', 'Fixed Price'], iconToken: '/images/icons/mech-master.png', tokenName: 'MECH MASTER', interactions: { views: 3100, hearts: 300 } },
    ]

    const [filterType, setFilterType] = useState<boolean>(true);
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
        { name: 'My Auctions', value: 'myauctions' },
    ]), [])

    const projects = [
        { name: 'Mech Master BOX', icon: '/images/icons/bsc.png', desc: 'Mech Master is a strategic turn-based RPG game where players are open to build ...', image: '/images/marketplace/character1.png' },
        { name: 'Mech Master BOX', icon: '/images/icons/bsc.png', desc: 'Mech Master is a strategic turn-based RPG game where players are open to build ...', image: '/images/marketplace/character1.png' },
        { name: 'Mech Master BOX', icon: '/images/icons/bsc.png', desc: 'Mech Master is a strategic turn-based RPG game where players are open to build ...', image: '/images/marketplace/character1.png' },
        { name: 'Mech Master BOX', icon: '/images/icons/bsc.png', desc: 'Mech Master is a strategic turn-based RPG game where players are open to build ...', image: '/images/marketplace/character1.png' },
        { name: 'Mech Master BOX', icon: '/images/icons/bsc.png', desc: 'Mech Master is a strategic turn-based RPG game where players are open to build ...', image: '/images/marketplace/character1.png' },
    ]
    return (
        <DefaultLayout>
            <WrapperContent useShowBanner={false}>
                <div className={styles.page}>
                    <div className={styles.banner}>
                        <button className="btn btn-arrow btn-prev">
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.70083 13.3731C7.30787 13.7642 6.67076 13.7642 6.27781 13.3731L0.585733 7.70798C0.192777 7.31689 0.192777 6.6828 0.585733 6.29171C0.595523 6.28196 0.605465 6.27246 0.615551 6.2632L6.27927 0.626327C6.67222 0.235234 7.30933 0.235234 7.70229 0.626327C8.09524 1.01742 8.09524 1.65151 7.70229 2.0426L2.72085 7.00043L7.70083 11.9568C8.09378 12.3479 8.09378 12.982 7.70083 13.3731Z" fill="black" />
                            </svg>
                        </button>
                        <div className="desc">
                            <div className="img-banner">
                                <img src="/images/marketplace/banner.png" alt="" />
                            </div>
                            <div className="infor">
                                <h3>Mech Master BOX</h3>
                                <p>Mech Master is a strategic turn-based RPG game where players are open to build their own territory with future technologies and protect their homeland.</p>
                            </div>
                        </div>
                        <button className="btn btn-arrow btn-next">
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.299175 13.3731C0.69213 13.7642 1.32924 13.7642 1.72219 13.3731L7.41427 7.70798C7.80722 7.31689 7.80722 6.6828 7.41427 6.29171C7.40448 6.28196 7.39454 6.27246 7.38445 6.2632L1.72073 0.626327C1.32778 0.235234 0.690669 0.235234 0.297714 0.626327C-0.0952421 1.01742 -0.0952435 1.65151 0.297712 2.0426L5.27915 7.00043L0.299175 11.9568C-0.093781 12.3479 -0.0937806 12.982 0.299175 13.3731Z" fill="black" />
                            </svg>
                        </button>
                    </div>
                    <div className="content-page">
                        <div className={styles.header}>
                            <div className="title">
                                <h3>Marketplace</h3>
                            </div>
                            <div className="filter">
                                <div className="item">
                                    <Button className={styles.btnFilter}>
                                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.55755 5.72237C4.68463 5.86067 4.7544 6.04132 4.7544 6.2282V11.735C4.7544 12.0665 5.15433 12.2347 5.39105 12.0017L6.92723 10.2412C7.1328 9.99453 7.24618 9.87242 7.24618 9.62824V6.22945C7.24618 6.04257 7.31719 5.86191 7.44303 5.72361L11.851 0.940647C12.1811 0.581831 11.927 0 11.4386 0H0.561964C0.0735754 0 -0.181832 0.580585 0.149575 0.940647L4.55755 5.72237Z" fill="white" />
                                        </svg>
                                        Filter
                                    </Button>
                                    <FormGroup>
                                        <SelectBox
                                            onChange={(e) => setSelectType(e.target.value as string)}
                                            items={listTypes}
                                            itemNameValue="value"
                                            itemNameShowValue="name"
                                            defaultValue={selectType}
                                            value={selectType} />
                                        {/* <FormControlLabel
                                            classes={{ label: styles.labelSwitch }}
                                            control={<Switch checked={filterType} onChange={(e) => setFilterType(e.target.checked)} classes={{
                                                track: clsx(styles.bgSwitch, { checked: filterType }),
                                                checked: styles.colorSwitch,
                                            }} />} className="switch" label="My Listing" /> */}
                                    </FormGroup>
                                    {/* <FormGroup>
                                        <FormControlLabel
                                            classes={{ label: styles.labelSwitch }}
                                            control={<Switch checked={filterType} onChange={(e) => setFilterType(e.target.checked)} classes={{
                                                track: clsx(styles.bgSwitch, { checked: filterType }),
                                                checked: styles.colorSwitch,
                                            }} />} className="switch" label="My Auctions" />
                                     </FormGroup> */}
                                </div>
                                <div className="item">
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
                                </div>
                            </div>
                        </div>
                        <div className={styles.content}>
                            <div className={styles.section}>
                                <div className="header">
                                    <h3>Hot Collections</h3>
                                    <div className="slide-actions">
                                        <button className="btn-prev">
                                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.77611 9.78015C5.48139 10.0735 5.00356 10.0735 4.70884 9.78014L0.439788 5.53133C0.145071 5.23801 0.145071 4.76244 0.439788 4.46912C0.448266 4.46068 0.456896 4.45249 0.465668 4.44453L4.71033 0.21999C5.00505 -0.0733301 5.48288 -0.0733303 5.77759 0.21999C6.07231 0.513309 6.07231 0.988875 5.77759 1.2822L2.04127 5.00081L5.77611 8.71794C6.07082 9.01126 6.07082 9.48682 5.77611 9.78015Z" fill="white" />
                                            </svg>
                                        </button>
                                        <button className="btn-next">
                                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.223893 9.78015C0.51861 10.0735 0.99644 10.0735 1.29116 9.78014L5.56021 5.53133C5.85493 5.23801 5.85493 4.76244 5.56021 4.46912C5.55173 4.46068 5.5431 4.45249 5.53433 4.44453L1.28967 0.21999C0.994953 -0.0733301 0.517123 -0.0733303 0.222406 0.21999C-0.0723105 0.513309 -0.07231 0.988875 0.222407 1.2822L3.95873 5.00081L0.223893 8.71794C-0.0708241 9.01126 -0.0708241 9.48682 0.223893 9.78015Z" fill="white" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className={clsx(styles.hostCollections, "custom-scroll")}>
                                    {
                                        projects.map((p, id) => <div className="collection" key={id}>
                                            <div className="img">
                                                <img src={p.image} alt="" />
                                                <img src={p.icon} className="icon" alt="" />
                                            </div>
                                            <div className="infor">
                                                <h3>{p.name}</h3>
                                                <p>{p.desc}</p>
                                            </div>
                                        </div>)
                                    }
                                </div>
                            </div>
                            <div className={styles.section}>
                                <div className="header">
                                    <h3>Hot Auction</h3>
                                    <div></div>
                                </div>
                                <div className={styles.cards}>
                                    {
                                        cards.map((card, id) => <Link key={id} to={`/marketplace/${id}`}>
                                            <div key={id} className={clsx(styles.card, { active: id === 0 })} >
                                                <ButtonBase className="btn-buy" color="green">Buy Now</ButtonBase>
                                                <div className={styles.cardImg}>
                                                    <img src={card.image} alt="" />
                                                </div>
                                                <div className={styles.cardBody}>
                                                    <h3>
                                                        {card.name}
                                                    </h3>
                                                    <div className="network">
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
                                                    </div>
                                                    <div className="tags">
                                                        {card.tags.map((t) => <span key={t}>{t}</span>)}
                                                    </div>
                                                </div>
                                                <div className={styles.cardFooter}>
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
                                                </div>
                                            </div>
                                        </Link>
                                        )}
                                </div>
                            </div>

                            <div className={styles.section}>
                                <div className="header">
                                    <h3>Big Offers</h3>
                                    <div className="filter">
                                        <div className="item">
                                            <FormGroup>
                                                <SelectBox
                                                    onChange={(e) => setSelectType(e.target.value as string)}
                                                    items={listTypes}
                                                    itemNameValue="value"
                                                    itemNameShowValue="name"
                                                    defaultValue={selectType}
                                                    value={selectType} />
                                            </FormGroup>
                                        </div>
                                        <div className="item">
                                            <FormGroup>
                                                <SelectBox
                                                    onChange={(e) => setSelectType(e.target.value as string)}
                                                    items={listTypes}
                                                    itemNameValue="value"
                                                    itemNameShowValue="name"
                                                    defaultValue={selectType}
                                                    value={selectType} />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.cards}>
                                    {
                                        cards.map((card, id) => <Link key={id} to={`/marketplace/${id}`}>
                                            <div key={id} className={clsx(styles.card, { active: id === 0 })} >
                                                <ButtonBase className="btn-buy" color="green">Buy Now</ButtonBase>
                                                <div className={styles.cardImg}>
                                                    <img src={card.image} alt="" />
                                                </div>
                                                <div className={styles.cardBody}>
                                                    <h3>
                                                        {card.name}
                                                    </h3>
                                                    <div className="network">
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
                                                    </div>
                                                    <div className="tags">
                                                        {card.tags.map((t) => <span key={t}>{t}</span>)}
                                                    </div>
                                                </div>
                                                <div className={styles.cardFooter}>
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
                                                </div>
                                            </div>
                                        </Link>
                                        )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </WrapperContent>
        </DefaultLayout>
    )
}

export default Marketplace
