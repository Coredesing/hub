import React, {useEffect, useState} from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {Button, Switch} from "@material-ui/core";
import {useCommonStyle} from "../../../../styles";
import {
  addParticipantUserToWinner, deleteParticipantUser, getParticipantUser,
  updateParticipantWhitelistSubmission, verifyParticipantWhitelistSubmission,
  verifyBatchParticipantWhitelistSubmission, approveBatchParticipantWhitelistSubmission, approveAllParticipantWhitelistSubmission} from "../../../../request/participants";
import {useDispatch} from "react-redux";
import {withRouter} from "react-router";
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";
import useGetList from "../hooks/useGetList";
import useDeleteItem from "../hooks/useDeleteItem";
import UserPickerToWinner from "./UserPickerToWinner";
import UserWhitelistSubmissionPopup from "./UserWhitelistSubmissionPopup";
import {getContractInstance} from "../../../../services/web3";
import tierABI from "../../../../abi/Tier.json";
import {Checkbox} from 'antd';
import {cloneDeep, filter, includes} from 'lodash';
import Pagination from "@material-ui/lab/Pagination";
import useStylesTable from './style_table';
import {BUY_TYPE} from "../../../../constants";
import {etherscanRoute} from "../../../../utils";
import Link from '@material-ui/core/Link';

const REACT_APP_SOTATIER = process.env.REACT_APP_SOTATIER || '';

function UserParticipant(props: any) {
  const commonStyle = useCommonStyle();
  const classesTable = useStylesTable();
  const { poolDetail } = props;
  const dispatch = useDispatch();
  const [whitelistPendingOnly, setWhitelistPendingOnly] = useState(false);

  const getParticipantUserWithTier = async (poolId: any, searchParams: any) => {
    try {
      let participantsUsers = await getParticipantUser(poolId, {...searchParams, whitelist_pending: whitelistPendingOnly});

      if (poolDetail.buy_type === BUY_TYPE.FCFS) {
        return participantsUsers;
      }

      // return participantsUsers;

      // Call Multi get Tiers
      let users = participantsUsers?.data?.data || [];

      // TODO: Disabled Tier Column. Please fix it
      // const campaignContract = getContractInstance(tierABI, REACT_APP_SOTATIER);
      // const userAddressesPromises = users.map((item: any) => {
      //   console.log('item.wallet_address', item.wallet_address)
      //   return campaignContract?.methods.getUserTier(item.wallet_address).call();
      // });
      //
      // const response = await Promise.all(userAddressesPromises);
      // for (let i = 0; i < users.length; i++) {
      //   users[i].tier = response[i] || 0;
      // }

      // calculate submission status
      for (let i = 0; i < users.length; i++) {
        const listStatuses = [
          users[i]?.whitelistSubmission?.partner_twitter_status,
          users[i]?.whitelistSubmission?.partner_channel_status,
          users[i]?.whitelistSubmission?.partner_group_status,
          users[i]?.whitelistSubmission?.partner_retweet_post_status,
          users[i]?.whitelistSubmission?.self_twitter_status,
          users[i]?.whitelistSubmission?.self_channel_status,
          users[i]?.whitelistSubmission?.self_group_status,
          users[i]?.whitelistSubmission?.self_retweet_post_status,
        ];

        if (!(listStatuses.includes(0) || listStatuses.includes(2) || listStatuses.includes(3))) {
          users[i].whitelistStatus = 'Completed';
          continue;
        }

        users[i].whitelistStatus = 'Pending';
      }

      participantsUsers.data.data = users;
      return participantsUsers;
    } catch (e) {
      // dispatch(alertFailure('ERROR: Fail fill Tiers in Participants List. \nSome address is invalid !!!'));
      console.log('ERROR: Fail fill Tiers!!!');
      console.log(e);
    }
  };

  const {
    rows,
    search, searchDelay,
    failure, loading,
    lastPage, currentPage, totalRecords, setCurrentPage,
    handlePaginationChange,
  } = useGetList({
    poolDetail,
    handleSearchFunction: getParticipantUserWithTier
  });

  const {
    deleteItem
  } = useDeleteItem({
    poolDetail,
    handleDeleteFunction: deleteParticipantUser,
    handleSearchFunction: search
  });


  const [addedUsers, setAddedUsers] = useState([]);
  const handleCreateUpdateData = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want add to winner')) {
      return false;
    }
    // Call API Add to Winner
    addParticipantUserToWinner(poolDetail?.id, {winners: addedUsers})
      .then((res: any) => {
        console.log('[addParticipantUserToWinner] - res', res);
        if (res.status === 200) {
          dispatch(alertSuccess('Add Participant User to Winner Success'));
          search(); // Re-search list
          setAddedUsers([]);  // Reset list checked user
          onChange([]); // Reset check-all checkbox
        } else {
          dispatch(alertFailure('Add Participant User to Winner Fail'));
        }
      })
  };

  const [isOpenWhitelistPopup, setIsOpenWhitelistPopup] = useState(false);
  const [selectedWhitelistSubmission, setSelectedWhitelistSubmission] = useState({});
  const openWhitelistPopup = (e: any, row: any, index: number) => {
    setSelectedWhitelistSubmission(row?.whitelistSubmission);
    setIsOpenWhitelistPopup(true);
  };

  const handleUpdateWhitelistSubmission = async (data: any) => {
    const payload = {
      self_twitter_status: Number(data.self_twitter_status),
      self_group_status: Number(data.self_group_status),
      self_channel_status: Number(data.self_channel_status),
      self_retweet_post_status: Number(data.self_retweet_post_status),
      partner_twitter_status: Number(data.partner_twitter_status),
      partner_group_status: Number(data.partner_group_status),
      partner_channel_status: Number(data.partner_channel_status),
      partner_retweet_post_status: Number(data.partner_retweet_post_status),
    }

    updateParticipantWhitelistSubmission(data.campaign_id, data.wallet_address, payload)
      .then((res: any) => {
        console.log('[updateParticipantWhitelistSubmission] - res', res);
        if (res.status === 200) {
          dispatch(alertSuccess('Update Participant Whitelist Submission Success'));
          search(); // Re-search list
          setSelectedWhitelistSubmission({});
          setIsOpenWhitelistPopup(false);
          // setAddedUsers([]);  // Reset list checked user
          // onChange([]); // Reset check-all checkbox
        } else {
          dispatch(alertFailure('Update Participant Whitelist Submission Fail'));
        }
      })
  }

  const handleVerifyWhitelistSubmission = async (data: any) => {
    return verifyParticipantWhitelistSubmission(data.campaign_id, data.wallet_address)
        .then((res: any) => {
          console.log('[verifyParticipantWhitelistSubmission] - res', res);
          if (res.status === 200) {
            dispatch(alertSuccess('Verify Participant Whitelist Submission Success'));
            search(); // Re-search list
            setSelectedWhitelistSubmission({});
            setIsOpenWhitelistPopup(false);
            // setAddedUsers([]);  // Reset list checked user
            // onChange([]); // Reset check-all checkbox
          } else {
            dispatch(alertFailure('Verify Participant Whitelist Submission Fail'));
          }
        })
  }

  const handleVerifyBatchWhitelistSubmission = async (data: any) => {
    return verifyBatchParticipantWhitelistSubmission(poolDetail?.id, {wallet_addresses: addedUsers})
        .then((res: any) => {
          console.log('[verifyBatchParticipantWhitelistSubmission] - res', res);
          if (res.status === 200) {
            dispatch(alertSuccess('Verify Batch Participant Whitelist Submission Success'));
            search(); // Re-search list
            setSelectedWhitelistSubmission({});
            setIsOpenWhitelistPopup(false);
            setAddedUsers([]);  // Reset list checked user
            onChange([]); // Reset check-all checkbox
          } else {
            dispatch(alertFailure('Verify Batch Participant Whitelist Submission Fail'));
          }
        })
  }

  const handleApproveBatchWhitelistSubmission = async (data: any) => {
    return approveBatchParticipantWhitelistSubmission(poolDetail?.id, {wallet_addresses: addedUsers})
        .then((res: any) => {
          console.log('[approveBatchParticipantWhitelistSubmission] - res', res);
          if (res.status === 200) {
            dispatch(alertSuccess('Approve Batch Participant Whitelist Submission Success'));
            search(); // Re-search list
            setSelectedWhitelistSubmission({});
            setIsOpenWhitelistPopup(false);
            setAddedUsers([]);  // Reset list checked user
            onChange([]); // Reset check-all checkbox
          } else {
            dispatch(alertFailure('Approve Batch Participant Whitelist Submission Fail'));
          }
        })
  }

  const handleApproveAllWhitelistSubmission = async () => {
    return approveAllParticipantWhitelistSubmission(poolDetail?.id)
        .then((res: any) => {
          if (res.status !== 200) {
            dispatch(alertFailure('Approve All Participant Whitelist Submission Fail'));
            return
          }

          dispatch(alertSuccess('Approve All Participant Whitelist Submission Success'));
          search();
          setSelectedWhitelistSubmission({});
          setIsOpenWhitelistPopup(false);
          setAddedUsers([]);
          onChange([]);
        })
  }


  const onCheckToAdd = (e: any, row: any, index: number) => {
    console.log('[onCheckToAdd]: ', e.target.value, row, index);
    const isChecked = e.target.checked;
    let newArr = cloneDeep(addedUsers);
    if (isChecked) {
      // @ts-ignore
      newArr.push(row.wallet_address);
    } else {
      newArr = filter(newArr, (it) => row.wallet_address != it);
    }
    onChange(newArr);
  };

  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);
  const onChange = (list: any) => {
    setAddedUsers(list);
    setIndeterminate(!!list.length && list.length < rows.length);
    setCheckAll(list.length === rows.length);
  };

  const onCheckAllChange = (e: any) => {
    setAddedUsers(e.target.checked ? addedUsers : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);

    if (e.target.checked) {
      // @ts-ignore
      setAddedUsers(rows.map(it => it.wallet_address));
    } else {
      setAddedUsers([]);
    }
  };

  useEffect(()=>{
    if (currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    search();
  }, [whitelistPendingOnly])

  return (
    <>
      <div className={commonStyle.boxSearch}>
        <input className={commonStyle.inputSearch} onChange={searchDelay} placeholder="Search users to add winner" />
        <img src="/images/icon-search.svg" alt="" style={{ marginLeft: -30 }} />

        <UserPickerToWinner
          poolDetail={poolDetail}
        />

        <div style={{float: 'right'}}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateUpdateData}
          >Add To Winner</Button>

          {/*<Button*/}
          {/*  variant="contained"*/}
          {/*  color="primary"*/}
          {/*  onClick={openPopupCreate}*/}
          {/*>Add To Winner</Button>*/}

          {/*{isOpenEditPopup &&*/}
          {/*<UserParticipantCreatePopup*/}
          {/*  isOpenEditPopup={isOpenEditPopup}*/}
          {/*  setIsOpenEditPopup={setIsOpenEditPopup}*/}
          {/*  editData={editData}*/}
          {/*  isEdit={isEdit}*/}
          {/*  handleCreateUpdateData={handleCreateUpdateData}*/}
          {/*/>*/}
          {/*}*/}

        </div>

      </div>

      <div className={commonStyle.boxSearch}>
        <div style={{marginTop: '15px'}}>
          <div style={{display: 'inline', marginRight: '10px'}}>
            <Switch
                color="primary"
                value={whitelistPendingOnly}
                onChange={(e) => {
                  setWhitelistPendingOnly(e.target.checked);
                }}
            />
            Pending Only
          </div>

          <Button
              variant="contained"
              color="primary"
              onClick={handleVerifyBatchWhitelistSubmission}
          >Verify Selected</Button>

          <Button
              variant="contained"
              color="primary"
              style={{marginLeft: '10px'}}
              onClick={handleApproveBatchWhitelistSubmission}
          >Approve Selected</Button>

          <Button
              variant="contained"
              color="primary"
              style={{marginLeft: '10px'}}
              onClick={handleApproveAllWhitelistSubmission}
          >Approve All</Button>
        </div>
      </div>

      {isOpenWhitelistPopup &&
        <UserWhitelistSubmissionPopup
          isOpenEditPopup={isOpenWhitelistPopup}
          setIsOpenEditPopup={setIsOpenWhitelistPopup}
          editData={selectedWhitelistSubmission}
          requirements={poolDetail.socialRequirement}
          handleUpdateData={handleUpdateWhitelistSubmission}
          handleVerifyData={handleVerifyWhitelistSubmission}
        />
      }

      <TableContainer component={Paper} className={`${commonStyle.tableScroll} ${classesTable.tableUserJoin}`}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell size={'small'}>
                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                  Check all
                </Checkbox>
              </TableCell>
              <TableCell size={'small'}>Email</TableCell>
              <TableCell align="center" size={'medium'}>Wallet Address</TableCell>
              <TableCell align="center">Tier</TableCell>
              <TableCell align="right">Whitelist Submission</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow key={row.id}>
                <TableCell size={'small'}>
                  <Checkbox
                    onChange={(e) => onCheckToAdd(e, row, index)}
                    checked={includes(addedUsers, row.wallet_address)}
                  ></Checkbox>
                </TableCell>

                <TableCell component="th" scope="row" size={'small'}>{row.email}</TableCell>
                <TableCell align="center" size={'medium'}>
                  <Link href={etherscanRoute(row.wallet_address, poolDetail)} target={'_blank'}>
                    {row.wallet_address}
                  </Link>
                </TableCell>
                <TableCell component="th" scope="row" size={'small'} align="center">
                  {row.tier}
                </TableCell>
                <TableCell component="th" scope="row" size={'small'} align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => openWhitelistPopup(e, row, index)}
                    style={{marginLeft: 10, marginTop: 10, backgroundColor: row.whitelistStatus === 'Completed' ? '#4caf50' : '#3f51b5'}}
                  >{row.whitelistStatus}</Button>

                </TableCell>

                {/*<TableCell align="right">*/}
                {/*  <Button*/}
                {/*    variant="contained"*/}
                {/*    color="secondary"*/}
                {/*    onClick={(e) => deleteItem(e, row, index)}*/}
                {/*    style={{marginLeft: 10, marginTop: 10}}*/}
                {/*  >Delete</Button>*/}
                {/*</TableCell>*/}

              </TableRow>
            ))}
          </TableBody>
        </Table>

        {failure && <p className={classesTable.errorMessage}>{failure}</p>}
        {!failure &&
          ((!rows || rows.length === 0) && !loading)  ? <p className={classesTable.noDataMessage}>There is no data</p> : (
            <>
              {rows && lastPage > 1 && <Pagination page={currentPage} className={classesTable.pagination} count={lastPage} onChange={handlePaginationChange} />}
            </>
          )
        }
      </TableContainer>
    </>
  );
}

export default withRouter(UserParticipant);

