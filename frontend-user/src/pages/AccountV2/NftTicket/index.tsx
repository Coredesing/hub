import { useState, useEffect } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useAuth from '../../../hooks/useAuth';
import { isWidthDown, isWidthUp, withWidth } from '@material-ui/core';
import { POOL_IS_PRIVATE, POOL_STATUS_JOINED, USER_STATUS } from '../../../constants';
import { TIERS } from '../../../constants';
//@ts-ignore
import AnimatedNumber from "animated-number-react";
import { numberWithCommas } from '../../../utils/formatNumber';
import { SearchBox } from '../components/SearchBox';
import { SelectBox } from '../components/SelectBox';
import { Table } from './Table';
import { useTabStyles } from '../style';

const listStatuses = [
  { value: 'all', babel: 'All Statuses', color: '' },
  { value: POOL_STATUS_JOINED.APPLIED_WHITELIST, babel: 'Applied Whitelist', color: '#9E63FF' },
  { value: POOL_STATUS_JOINED.WIN_WHITELIST, babel: 'Win Whitelist', color: '#FF9330' },
  { value: POOL_STATUS_JOINED.NOT_WIN_WHITELIST, babel: 'Not Win Whitelist', color: '#7E7E7E' },
  { value: POOL_STATUS_JOINED.SWAPPING, babel: 'Swapping', color: '#6398FF' },
  { value: POOL_STATUS_JOINED.CLAIMABLE, babel: 'Claimable', color: '#FFD058' },
  { value: POOL_STATUS_JOINED.COMPLETED, babel: 'Completed', color: '#7E7E7E' },
  { value: POOL_STATUS_JOINED.CANCELED_WHITELIST, babel: 'Canceled Whitelist', color: '#D01F36' },
];

const listTypes = [
  { value: 1000, babel: 'All types' },
  { value: POOL_IS_PRIVATE.PUBLIC, babel: 'Public' },
  { value: POOL_IS_PRIVATE.PRIVATE, babel: 'Private' },
  { value: POOL_IS_PRIVATE.SEED, babel: 'Seed' },
];

const NftTicket = (props: any) => {
  const styles = {...useStyles(), ...useTabStyles()};
  const { classNamePrefix = '', balance = {}, userInfo = {} } = props;
  const [openModalVerifyEmail, setOpenModalVerifyEmail] = useState(false);
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  const { data: userTier = '0' } = useSelector((state: any) => state.userTier);
  const { data: tiers = {} } = useSelector((state: any) => state.tiers);

  const handleKYC = () => {
    console.log('hande KYC')
  }

  const {
    tokenDetails,
    email,
    setEmail,
    emailVerified
  } = props;

  const formatValue = (value: string) => parseFloat(value).toFixed(2);
  const [filterStatus, setFilterStatus] = useState<{ status: string | number; babel: string }>({
    status: '',
    babel: '',
  });

  const [filterType, setFilterType] = useState<{ type: string | number; babel: string }>({
    type: 1000,
    babel: '',
  });

  const handleChangeStatus = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof filterStatus;
    const value = event.target.value as keyof typeof filterStatus;
    setFilterStatus({
      ...filterStatus,
      [name]: value,
    });
  };

  const handleChangeType = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof filterType;
    const value = event.target.value as keyof typeof filterType;
    setFilterType({
      ...filterType,
      [name]: value,
    });
  };

  return (
    <div className={`${classNamePrefix}__component ${styles.tabContent}`} style={{ marginBottom: '65px' }}>
      <h2 className={styles.tabTitle}>NFT Tickets</h2>
      <div className={styles.tabHeader}>
        <div className="filter">
        <SelectBox
            IconComponent={ExpandMoreIcon}
            value={filterStatus.status}
            onChange={handleChangeStatus}
            inputProps={{
              name: 'status',
            }}
            items={listStatuses}
            itemNameValue={'value'}
            itemNameShowValue={'babel'}
          />
          <SelectBox 
            IconComponent={ExpandMoreIcon}
              value={filterType.type}
              onChange={handleChangeType}
            inputProps={{
              name: 'type',
                id: 'list-types',
            }}
            items={listTypes}
            itemNameValue={'value'}
            itemNameShowValue={'babel'}/>
        </div>
        <div className="search">
          <SearchBox placeholder="Search pool name" />
        </div>
      </div>
      <div className={styles.tabBody}>
        <Table />
      </div>
    </div>
  );
};

export default withWidth()(NftTicket);
