import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useAuth from '../../../hooks/useAuth';
import ModalVerifyEmail from '../../Account/ModalVerifyEmail';
import { isWidthDown, isWidthUp, withWidth } from '@material-ui/core';
import { trimMiddlePartAddress } from '../../../utils/accountAddress';
import { USER_STATUS } from '../../../constants';
import { TIERS } from '../../../constants';
//@ts-ignore
import AnimatedNumber from "animated-number-react";
import { numberWithCommas } from '../../../utils/formatNumber';
import { SearchBox } from './SearchBox';
import { SelectBox } from './SelectBox';
import { Table } from './Table';

const NftTicket = (props: any) => {
  const styles = useStyles();
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

  return (
    <div className={`${classNamePrefix}__component ${styles.tabContent}`} style={{ marginBottom: '65px' }}>
      <h2 className={styles.tabTitle}>NFT Tickets</h2>
      <div className={styles.tabHeader}>
        <div className="filter">
          <SelectBox />
          <SelectBox />
        </div>
        <div className="search">
          <SearchBox />
        </div>
      </div>
      <div className={styles.tabBody}>
        <Table />
      </div>
    </div>
  );
};

export default withWidth()(NftTicket);
