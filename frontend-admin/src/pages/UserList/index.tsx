import React, {useEffect, useState} from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Pagination from '@material-ui/lab/Pagination';
import useStyles from './style';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import UserRow from './UserRow'
import SearchForm from "./SearchForm";
import ExportButton from "./ExportButton";
import {getUserList} from "../../request/user";
import {MenuItem, Select} from "@material-ui/core";
import {TIERS} from "../../constants";

const tableHeaders = ["WALLET", "STAKED", "KSM BONUS", "LOYALTY", "TOTAL", "TIER", "EMAIL", "TELEGRAM"];

const UserList: React.FC<any> = (props: any) => {
  const classes = useStyles();
  const perPage = 10;
  const [users, setUsers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(-1)
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [rawUsers, setRawUsers] = useState([]);
  const [lastPage, setLastPage] = useState(1);

  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState(false);

  const getUserListInfo = async (query: any) => {
    const queryParams = {
      searchQuery: query,
    };

    try {
      setLoading(true);
      const resObject = await getUserList(queryParams);
      if (resObject.status === 200) {
        setRawUsers(resObject.data);
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
    setSelectedTier(Number(event.target.value));
  }

  const handleSearch = (event: any) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    if (query) {
      setSelectedTier(-1)
      const filtered = rawUsers.filter((u: any) => {
        return u?.wallet_address?.toLowerCase().indexOf(query.toLowerCase()) > -1 || 
              u?.email?.toLowerCase().indexOf(query.toLowerCase()) > -1 || 
              u?.user_telegram?.toLowerCase().indexOf(query.toLowerCase()) > -1
      });
      setFilteredUsers(filtered)
      setLastPage(Math.ceil(filtered.length/perPage));
      setCurrentPage(1);
      return;
    }

    if (selectedTier < 0) {
      setFilteredUsers(rawUsers);
      setLastPage(Math.ceil(rawUsers.length/perPage));
      setCurrentPage(1);
      return
    }

    const filtered = rawUsers.filter((u: any) => u?.tier === selectedTier);
    setFilteredUsers(filtered)
    setLastPage(Math.ceil(filtered.length/perPage));
    setCurrentPage(1);
    
  }, [rawUsers, query, selectedTier]);

  useEffect(() => {
    getUserListInfo('');
  }, []);

  useEffect(() => {
    setUsers(filteredUsers.slice((currentPage-1)*perPage, (currentPage-1)*perPage+perPage));
  }, [filteredUsers, currentPage]);
  
  return (
    <DefaultLayout>
      <div className={classes.header}>
        <div className="header-left">
          <ExportButton users={filteredUsers}/>
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
          ))):  (
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
                users && users.length > 0 && users.map((user: any, index: number) =>  (
                    <UserRow key={user.id} user={user} />
                  ))
              }
              </TableBody>
            </Table>
        )}
        {
          failure ? <p className={classes.errorMessage}>{failure}</p> : ((!users || users.length === 0) && !loading)  ? <p className={classes.noDataMessage}>There is no data</p> : (
            <>
              {users && lastPage > 1 && <Pagination page={currentPage} className={classes.pagination} count={lastPage} onChange={handlePaginationChange} />}
            </>
          )
        }
      </TableContainer>
    </DefaultLayout>
  )
};

export default UserList;
