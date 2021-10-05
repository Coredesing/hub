import React, { useContext, useEffect, useState } from "react";
import { debounce } from 'lodash';
import BigNumber from "bignumber.js";
import { useWeb3React } from '@web3-react/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, withRouter } from "react-router-dom";
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  Hidden,
  Paper,
  Select,
  withWidth,
} from "@material-ui/core";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from '../../../services/axios';
import useAuth from '../../../hooks/useAuth';
// import useFetch from '../../../hooks/useFetch';
import { getAccessPoolText } from "../../../utils/campaign";
import { NULL_AMOUNT, POOL_STATUS_JOINED, POOL_STATUS_TEXT } from "../../../constants";
import useWalletSignature from '../../../hooks/useWalletSignature';
import { alertFailure, alertSuccess } from '../../../store/actions/alert';
import ModalWhitelistCancel from "./ModalWhitelistCancel";
import useStyles from './style';
import { unixTimeNow } from "../../../utils/convertDate";
// import { fillClaimInfo } from "../../../utils/claim";
// import { getAppNetWork } from "../../../utils/network";
import { getIconCurrencyUsdt } from "../../../utils/usdt";
import ClaimStatusTextCell from "./ClaimStatusTextCell";
import ClaimButtonCell from "./ClaimButtonCell";
import { useTabStyles } from "../style";
import { SearchBox } from "../components/SearchBox";
import { SelectBox } from "../components/SelectBox";
import {
  TableCell,
  TableContainer,
  Table as TableMui,
  TableBody,
  TableHead,
  TableRowBody,
  TableRowHead
} from '../components/Table';
import { listStatuses, listTypes } from "../constants";
import { formatCampaignStatus, getSeedRound, isErc20, isErc721 } from "../../../utils";
import clsx from 'clsx';
import { getRoute } from "../../TicketSale/utils";
import { numberWithCommas } from "../../../utils/formatNumber";
import { IdoPoolContext, ObjType } from "../context/IdoPoolContext";
import Pagination from "@base-components/Pagination";

const IdoPools = (props: any) => {
  const styles = { ...useStyles(), ...useTabStyles() };
  const {
    data: dataPools,
    filter,
    setFilter,
    loadingPools,
    setLoadingPools,
    pagination,
  } = useContext(IdoPoolContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { signature, signMessage } = useWalletSignature();

  // For Detech Claim
  const { connectedAccount } = useAuth();

  const { data: userTier = 0 } = useSelector((state: any) => state.userTier);
  const [poolCancel, setPoolCancel] = useState({});
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const now = unixTimeNow();

  const onChangePage = (e: any, page: number) => {
    if(pagination.page === page) return;
    if (!loadingPools) {
      setFilter && setFilter((f: ObjType) => ({ ...f, page }));
      setLoadingPools && setLoadingPools(true);
    }
  }
  const handleChangeStatus = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as string;
    const value = event.target.value;
    setFilter && setFilter((f: ObjType) => ({ ...f, [name]: value }));
    setLoadingPools && setLoadingPools(true);
  };

  const handleChangeType = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as string;
    const value = event.target.value;
    setFilter && setFilter((f: ObjType) => ({ ...f, [name]: value }));
    setLoadingPools && setLoadingPools(true);
  };

  // when mounted page
  useEffect(() => {
    if (!connectedAccount) return;
    if (!dataPools?.length) {
      setLoadingPools && setLoadingPools(true);
    }
  }, [dataPools, setLoadingPools, connectedAccount]);

  const handleInputChange = debounce((e: any) => {
    setFilter && setFilter((filter: ObjType) => ({
      ...filter,
      search: e.target.value,
      page: 1,
    }));
    setLoadingPools && setLoadingPools(true);
  }, 1000);


  const poolStatus = (pool: any) => {
    switch (pool.joined_status) {
      case POOL_STATUS_JOINED.CANCELED_WHITELIST:
        return <div className="status_pool canceled-whitelist"><span>Canceled Whitelist</span></div>
      case POOL_STATUS_JOINED.APPLIED_WHITELIST:
        return <div className="status_pool applied-whitelist"><span>Applied Whitelist</span></div>
      case POOL_STATUS_JOINED.WIN_WHITELIST:
        return <div className="status_pool win-whitelist"><span>Win Whitelist</span></div>
      case POOL_STATUS_JOINED.NOT_WIN_WHITELIST:
        return <div className="status_pool not-win-whitelist"><span>Not Win Whitelist</span></div>
      case POOL_STATUS_JOINED.SWAPPING:
        return <div className="status_pool swapping"><span>Swapping</span></div>
      case POOL_STATUS_JOINED.CLAIMABLE:
        return <ClaimStatusTextCell
          poolDetails={pool}
        />
      // // if (pool?.campaign_status == POOL_STATUS_TEXT[POOL_STATUS.FILLED]) {
      // if (pool?.userClaimInfo?.is_filled_claim) {
      //   return <div className="status_pool filled"><span>Filled</span></div>
      // }
      // if (pool?.userClaimInfo?.is_claimed_all_token) {
      //   return <div className="status_pool claimable"><span>Completed</span></div>
      // }
      // return <div className="status_pool claimable"><span>Claimable</span></div>
      case POOL_STATUS_JOINED.COMPLETED:
        return <div className="status_pool completed"><span>Completed</span></div>
      default:
        return <div className="status_pool none"><span>-</span></div>
    }
  };

  const allocationAmount = (pool: any) => {
    if (!pool) return null;

    // Get Currency Info
    const { currencyIcon, currencyName } = getIconCurrencyUsdt({
      purchasableCurrency: pool?.purchasableCurrency || pool?.accept_currency,
      networkAvailable: pool?.networkAvailable || pool?.network_available,
    });
    let amount = '';
    if (isErc721(pool.token_type)) {
      const isClaim = pool.process === 'only-claim';
      if (isClaim) {
        amount = pool.userClaimInfo?.user_claimed || 0;
      } else {
        amount = pool.userClaimInfo?.user_purchased || 0;
      }
      return `${numberWithCommas(amount, 0)} ${pool.symbol?.toUpperCase()}`
    }
    if (isErc20(pool.token_type)) {
      amount = pool.userClaimInfo?.user_purchased || 0;
      const ethRate = pool.accept_currency === 'eth' ? pool.ether_conversion_rate : pool.token_conversion_rate;
      return `${numberWithCommas((+amount * +ethRate) || 0, 0)} ${currencyName?.toUpperCase()}`
    }

    if (pool.allowcation_amount === NULL_AMOUNT) return '-';
    let allowcationAmount = pool.allowcation_amount;
    if (new BigNumber(allowcationAmount).lte(0)) return '-';

    const allowcationAmountText = `${new BigNumber(allowcationAmount || 0).toFixed()} ${currencyName?.toUpperCase()}`;

    return allowcationAmountText;
  };

  const preOrderAmount = (pool: any) => {
    if (!pool) return '-';
    if (pool.allowcation_pre_order_amount === NULL_AMOUNT) return '-';

    // Get Currency Info
    const { currencyIcon, currencyName } = getIconCurrencyUsdt({
      purchasableCurrency: pool?.purchasableCurrency || pool?.accept_currency,
      networkAvailable: pool?.networkAvailable || pool?.network_available,
    });

    let allowcationAmount = pool.allowcation_pre_order_amount;
    if (new BigNumber(allowcationAmount).lte(0)) return '-';

    const allowcationAmountText = `${new BigNumber(allowcationAmount || 0).toFixed()} ${currencyName?.toUpperCase()}`;

    return allowcationAmountText;
  };

  const onShowModalCancel = async (pool: any) => {
    setPoolCancel(pool);
    if (!signature) {
      await signMessage();
    } else {
      setOpenModalCancel(true);
    }
  };
  useEffect(() => {
    if (signature && connectedAccount) {
      setOpenModalCancel(true);
    }
  }, [signature, connectedAccount]);

  const onCloseModalCancel = () => {
    setPoolCancel({});
    setOpenModalCancel(false);
  };

  const onCancelPool = async (pool: any) => {
    if (signature) {
      const config = {
        headers: {
          msgSignature: process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE
        }
      }
      const response = await axios.post(`/user/unjoin-campaign`, {
        signature,
        campaign_id: pool?.id,
        wallet_address: account,
      }, config as any) as any;

      if (response.data) {
        if (response.data.status === 200) {
          setPoolCancel({});
          setOpenModalCancel(false);
          dispatch(alertSuccess("You have successfully cancelled your whitelist application."));
        }

        if (response.data.status !== 200) {
          dispatch(alertFailure(response.data.message));
        }
      }
    }
  };

  const actionButton = (pool: any) => {
    if (pool.joined_status === POOL_STATUS_JOINED.NOT_WIN_WHITELIST
      || pool.joined_status === POOL_STATUS_JOINED.CANCELED_WHITELIST
      || pool.joined_status === POOL_STATUS_JOINED.SWAPPING
      || pool.joined_status === POOL_STATUS_JOINED.COMPLETED
    ) return null;

    /*if (pool.joined_status === POOL_STATUS_JOINED.APPLIED_WHITELIST) {
      return (
        <Button
          // disabled={notEth}
          className={`${styles.btnAction} btnCancelWhitelist`}
          onClick={() => onShowModalCancel(pool)}
        >
          Cancel Whitelist
        </Button>
      );
    }*/

    if (pool.joined_status === POOL_STATUS_JOINED.WIN_WHITELIST) {
      if (
        userTier < pool.pre_order_min_tier  // Not enough tier to PreOrder
        || !pool.campaign_hash              // Not deploy yet
        || !pool.start_pre_order_time       // Not set PreOrder Time in Admin
        || now < parseInt(pool.start_pre_order_time)  // Not reached to PreOrder Time yet
      ) return null;

      if (pool.preOrderUsers && pool.preOrderUsers.length > 0) {
        const amountPreOrdered = pool.preOrderUsers[0]?.pivot?.amount || 0;
        if (pool.allowcation_amount !== NULL_AMOUNT && new BigNumber(amountPreOrdered).gte(new BigNumber(pool.allowcation_amount))) {
          return null;
        }
      }
      return (
        <Button
          // disabled={notEth}
          className={`${styles.btnAction} btnPreOrder`}
          onClick={() => history.push(`/buy-token/${pool.id}`)}
        >
          Pre-Order
        </Button>
      );
    }

    if (pool.joined_status === POOL_STATUS_JOINED.CLAIMABLE) {

      return <ClaimButtonCell
        poolDetails={pool}
      // notEth={notEth}
      />

      // const userClaimInfo = pool?.userClaimInfo || {};
      // if (!userClaimInfo?.show_claim_button) {
      //   return null;
      // }
      //
      // return (
      //   <Button
      //     disabled={notEth}
      //     onClick={() => history.push(`/buy-token/${pool.id}`)}
      //     className={`${styles.btnAction} btnClaimToken`}>
      //     Claim Token
      //     {pool?.show_claim_button}
      //   </Button>
      // );
    }

    return <></>;
  };

  return (
    <div className={styles.pageMyPools}>
      <h2 className={styles.tabTitle}>IDO Pools</h2>
      <div className={styles.tabHeader}>
        <div className="filter">
          {/* <SelectBox
            IconComponent={ExpandMoreIcon}
            value={filter.status}
            onChange={handleChangeStatus}
            inputProps={{
              name: 'status',
            }}
            items={listStatuses}
            itemNameValue={'value'}
            itemNameShowValue={'babel'}
          /> */}
          <SelectBox
            IconComponent={ExpandMoreIcon}
            value={filter.type}
            onChange={handleChangeType}
            inputProps={{
              name: 'type',
              id: 'list-types',
            }}
            items={listTypes}
            itemNameValue={'value'}
            itemNameShowValue={'babel'} />
        </div>
        <div className="search">
          <SearchBox onChange={handleInputChange} placeholder="Search pool name" defaultValue={filter.search} />
        </div>
      </div>

      <Hidden smDown>
        <TableContainer>
          <TableMui>
            <TableHead>
              <TableRowHead>
                <TableCell>Pool Name</TableCell>
                <TableCell align="left">Type</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Allocation</TableCell>
                <TableCell align="left" style={{ width: '140px' }}>Action</TableCell>
              </TableRowHead>
            </TableHead>
            <TableBody>
              {(dataPools || []).map((row: any, index: number) => (
                <TableRowBody key={row.name + index}>
                  <TableCell component="th" scope="row">
                    <div>
                      <img src={row.banner} width="40" height="40" alt="" style={{objectFit: 'cover'}}/>
                      {row.title}
                    </div>
                  </TableCell>
                  <TableCell align="left">{getSeedRound(row.is_private)}</TableCell>
                  <TableCell align="left">
                    {formatCampaignStatus(row.campaign_status)}
                    {/* {poolStatus(row)} */}
                  </TableCell>
                  <TableCell align="left">{allocationAmount(row)}</TableCell>
                  <TableCell align="left">
                    <Link to={`${getRoute(row.token_type)}/${row.id}`} className={clsx(styles.btnDetail, styles.btnAct)}>
                      Pool Detail
                    </Link>
                    {/* {actionButton(row)} */}
                  </TableCell>
                </TableRowBody>
              ))}
            </TableBody>
          </TableMui>
        </TableContainer>
        {/* <TableContainer component={Paper} className={styles.tableContainer}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableCellHead}>Pool Name</TableCell>
                <TableCell className={styles.tableCellHead}>Type</TableCell>
                <TableCell className={styles.tableCellHead}>Status</TableCell>
                <TableCell className={styles.tableCellHead}>Allocation</TableCell>
                <TableCell className={styles.tableCellHead}>Pre-order</TableCell>
                <TableCell className={styles.tableCellHead} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pools.map((row: any, index: number) => (
                <TableRow key={index} className={styles.tableRow}>
                  <TableCell className={styles.tableCellBody} component="th" scope="row">
                    <Link to={`/buy-token/${row?.id}`} className={styles.toDetailPool}>
                      <img className={styles.iconToken} src={row.token_images} alt="" />
                      <span className={styles.nameToken}>{row.title}</span>
                    </Link>
                  </TableCell>
                  <TableCell className={styles.tableCellBody}>
                    {getAccessPoolText(row)}
                  </TableCell>
                  <TableCell className={styles.tableCellBody}>
                    {poolStatus(row)}
                  </TableCell>
                  <TableCell className={styles.tableCellBody}>
                    {allocationAmount(row)}
                  </TableCell>
                  <TableCell className={styles.tableCellBody}>
                    {preOrderAmount(row)}
                  </TableCell>
                  <TableCell className={styles.tableCellBody} align="center">{actionButton(row)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
      </Hidden>

      <Hidden mdUp>
        <div className={styles.datasMobile}>
          {(dataPools || []).map((row: any, index: number) => (
            <div key={index} className={styles.boxDataMobile}>
              <div className={styles.titleBoxMobile}>
                <Link to={`/buy-token/${row?.id}`} className={styles.toDetailPool}>
                  <img className={styles.iconTokenMobile} src={row.token_images} alt="" style={{objectFit: 'cover'}}/>
                  <span className={styles.nameTokenMobile}>{row.title}</span>
                </Link>
              </div>
              <ul className={styles.infoMobile}>
                <li>
                  <div className={styles.nameMobile}>Type</div>
                  <div>
                    {getAccessPoolText(row)}
                  </div>
                </li>
                <li>
                  <div className={styles.nameMobile}>Status</div>
                  <div className={styles.valueMobile}>
                    {poolStatus(row)}
                  </div>
                </li>
                <li>
                  <div className={styles.nameMobile}>Allocation</div>
                  <div>{allocationAmount(row)}</div>
                </li>
                <li>
                  <div className={styles.nameMobile}>Pre-order</div>
                  <div className={styles.valueMobile}>{preOrderAmount(row)}</div>
                </li>
                {
                  actionButton(row) !== null &&
                  <li>
                    <div className={styles.nameMobile}>Action</div>
                    <div className={styles.valueMobile}>{actionButton(row)}</div>
                  </li>
                }
              </ul>
            </div>
          ))}
        </div>
      </Hidden>

      <div className={styles.pagination}>
        <Pagination
          count={pagination?.totalPage || 0}
          onChange={onChangePage}
          page={pagination.page}
        />
        {/* {
          pagination.total > 1 && <Pagination
            count={pagination.total || 0}
            color="primary"
            style={{ marginTop: 30 }} className={styles.pagination}
            onChange={onChangePage}
            page={pagination.page}
          />
        } */}
      </div>

      <ModalWhitelistCancel
        poolCancel={poolCancel}
        openModalCancel={openModalCancel}
        onCloseModalCancel={() => onCloseModalCancel()}
        onCancelPool={(pool: any) => onCancelPool(pool)}
      />

      <Backdrop open={loadingPools} className={styles.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default withWidth()(IdoPools);
