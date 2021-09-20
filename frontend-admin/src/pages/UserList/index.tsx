import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Pagination from '@material-ui/lab/Pagination';
import useStyles from './style';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import UserRow from './UserRow'
import SearchForm from "./SearchForm";
import ExportButton from "./ExportButton";
import FileExport from "./FileExport"
import { getUserList, exportUserList } from "../../request/user";
import { MenuItem, Select } from "@material-ui/core";
import { TIERS } from "../../constants";

const tableHeaders = ["WALLET", "STAKED", "KSM BONUS", "LOYALTY", "TOTAL", "TIER", "EMAIL", "TELEGRAM"];

const UserList: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const perPage = 10;
  const [users, setUsers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(-1)
  const [lastPage, setLastPage] = useState(1);

  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState(false);

  const getUserListInfo = async (query: any) => {
    const queryParams: any = {
      searchQuery: query,
      page: currentPage
    };
    if (selectedTier >= 0) {
      queryParams.tier = selectedTier
    }

    try {
      setLoading(true);
      const resObject = await getUserList(queryParams);
      if (resObject.status === 200) {
        setUsers(resObject.data.data);
        setLastPage(resObject.data.lastPage);
        setFailure(false);
      } else {
        setFailure(true);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setFailure(true);
    }
  };

  const handlePaginationChange = (event: any, page: number) => {
    setCurrentPage(page);
  };

  const handleSelectedTierChange = (event: any) => {
    setQuery('');
    setCurrentPage(1)
    setSelectedTier(Number(event.target.value));
  }

  const handleSearch = (event: any) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    getUserListInfo('');
  }, [query, currentPage]);

  return (
    <DefaultLayout>
      <div className={classes.header}>
        <div className="header-left">
          <button className={classes.exportBtn} onClick={exportUserList}>Export to CSV</button>
        </div>
        <Select
          name="minTier"
          value={selectedTier}
          onChange={handleSelectedTierChange}
        >
          <MenuItem value={-1}>
            All Tiers
          </MenuItem>
          {
            TIERS.map((value, index) => {
              return (
                <MenuItem
                  key={index}
                  value={index}
                >
                  {value}
                </MenuItem>
              )
            })
          }
        </Select>
        <SearchForm
          seachValue={query}
          handleSearch={handleSearch}
        />
      </div>

      <TableContainer component={Paper} className={classes.tableContainer}>
        {
          loading ? (
            [...Array(10)].map((num, index) => (
              <div key={index}>
                <Skeleton className={classes.skeleton} width={'100%'} />
              </div>
            ))) : (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  {
                    tableHeaders.map((tableHeader: string, index: number) => (
                      <TableCell key={index} className={classes.tableHeader}>{tableHeader}</TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {
                  users && users.length > 0 && users.map((user: any, index: number) => (
                    <UserRow key={user.id} user={user} />
                  ))
                }
              </TableBody>
            </Table>
          )}
        {
          failure ? <p className={classes.errorMessage}>{failure}</p> : ((!users || users.length === 0) && !loading) ? <p className={classes.noDataMessage}>There is no data</p> : (
            <>
              {users && lastPage > 1 && <Pagination page={currentPage} className={classes.pagination} count={lastPage} onChange={handlePaginationChange} />}
            </>
          )
        }
      </TableContainer>

      <FileExport/>
    </DefaultLayout>
  )
};

export default UserList;
