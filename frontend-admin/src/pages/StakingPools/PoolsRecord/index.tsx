import React from 'react';
import { TableRow, TableCell, Tooltip, Popper } from '@material-ui/core';
import useComponentVisible from '../../../hooks/useComponentVisible';
import { Link } from 'react-router-dom';

import useStyles from './style';
import {adminRoute} from "../../../utils";


type StakingPoolProps = {
  id: string;
  title: string;
  staking_type: string;
  rkp_rate: number;
  is_display: number;
}

type StakingPoolRecordProps = {
  stakingPool: StakingPoolProps;
}

const CampaignsRecord: React.FC<StakingPoolRecordProps> = (props: StakingPoolRecordProps) => {
  const { stakingPool } = props;
  const classes = useStyles();

  const { ref, isVisible, setIsVisible } =  useComponentVisible();

  const getCampaignStatus = (stakingPool: StakingPoolProps) => {
    switch (stakingPool.is_display) {
      case 0:
        return 'Hidden';
      case 1:
        return 'Showing';
    }
    return '';
  };


  return (
      <TableRow ref={ref} className={classes.tableRow} key={stakingPool.id} component={Link}
        to={
          adminRoute(`/staking/${stakingPool.id}`)
        }>
          <TableCell className={classes.tableCellTitle} component="td" scope="row">
            <span className={classes.wordBreak}>
              {stakingPool.title}
            </span>
          </TableCell>


          <TableCell className={classes.tableCellTitle} component="td" scope="row">
            <span className={classes.wordBreak}>
              {stakingPool.staking_type}
            </span>
          </TableCell>


          <TableCell className={classes.tableCellTitle} component="td" scope="row">
            <span className={classes.wordBreak}>
              {Number(stakingPool.rkp_rate) > 0 ? 'Yes' : 'No'}
            </span>
          </TableCell>

          <TableCell className={classes.tableCell} align="left">
            <div className={classes.tableCellFlex}>
              <div className="left">
                {getCampaignStatus(stakingPool)}
              </div>
            </div>
          </TableCell>


      </TableRow>
  )

};

export default CampaignsRecord;
