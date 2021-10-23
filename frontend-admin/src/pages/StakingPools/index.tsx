import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableContainer, Paper, TableBody, TableCell, TableHead, TableRow, Checkbox, FormControlLabel } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Skeleton from '@material-ui/lab/Skeleton';
import Pagination from '@material-ui/lab/Pagination';
import CachedIcon from '@material-ui/icons/Cached';
//@ts-ignore
import DatePicker from 'react-date-picker';
import { debounce } from 'lodash';
import { BaseRequest } from '../../request/Request';
import {apiRoute} from "../../utils";

import { convertDateTimeToUnix } from '../../utils/convertDate';
import useStyles from './style';
import { getCampaigns } from '../../store/actions/campaign';
import { useCommonStyle } from '../../styles';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import Button from '../../components/Base/ButtonLink';
import CampaignsRecord from './PoolsRecord'
import {adminRoute} from "../../utils";

const tableHeaders = ["POOL NAME", "POOL TYPE", "RED KITE POINT", "STATUS"];

const fetchListPool = async ()=> {
  let url = apiRoute(`/staking-pool`);

  try {
    const baseRequest = new BaseRequest();
    const response = await baseRequest.get(url) as any;
    const resObject = await response.json();

    if (resObject.status === 200) {
      const data = resObject.data;
      return data
    }
  } catch (err: any) {
    console.log(err)
  }
}

const Pools: React.FC<any> = (props: any) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [stakingPools, setStakingPools] = useState([]);

  useEffect(()=>{
    fetchListPool()
      .then(data=>{
        setStakingPools(data)
      })
  }, [])
  

  return (
    <DefaultLayout>
      <div className={classes.header}>
        <div className="header-left">
          <Button to={adminRoute('/staking/add')} text={'Create New Pool'} icon={'icon_plus.svg'} />
        </div>
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
                  stakingPools && stakingPools.length > 0 && stakingPools.map((pool: any, index: number) =>  (
                    <CampaignsRecord key={pool.id} stakingPool={pool} />
                  ))
              }
              </TableBody>
            </Table>
        )}
        {/* {
          failure ? <p className={classes.errorMessage}>{failure}</p> : ((!campaigns || campaigns.length === 0) && !loading)  ? <p className={classes.noDataMessage}>There is no data</p> : (
            <>
              {campaigns && lastPage > 1 && <Pagination page={currentPage} className={classes.pagination} count={lastPage} onChange={handlePaginationChange} />}
            </>
          )
        } */}
      </TableContainer>
    </DefaultLayout>
  )
}

export default Pools;
