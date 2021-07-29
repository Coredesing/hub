import React, {useEffect} from 'react';
import {TableCell, TableRow, Tooltip} from '@material-ui/core';
import useComponentVisible from '../../../hooks/useComponentVisible';
import {Link} from 'react-router-dom';

import useStyles from './style';
import {adminRoute} from "../../../utils";

const KycUserRow: React.FC<any> = (props: any) => {
  const { admin, currentOpen, setCurrentOpen, countries } = props;
  const classes = useStyles();
  const { ref, isVisible, setIsVisible } = useComponentVisible();

  useEffect(() => {
    currentOpen && setCurrentOpen("");
  }, [admin]);

  useEffect(() => {
    setIsVisible(admin.id === currentOpen);
  }, [currentOpen]);

  const getActiveStatus = (admin: any) => {
    switch (admin.is_kyc) {
      case 0:
        return 'Unapproved';
      case 1:
        return 'Approved';
    }

    return '';
  };

  return (
    <TableRow
      ref={ref} className={classes.tableRow} key={admin.id} component={Link}
      to={
        adminRoute(`/kyc-user-detail/${admin.id}`)
      }
    >
      <TableCell className={classes.tableCell} align="left">
        {admin.id}
      </TableCell>

      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        <Tooltip title={<p style={{ fontSize: 15 }}>{admin.email}</p>}>
              <span className={classes.wordBreak}>
                {admin.email}
              </span>
        </Tooltip>
      </TableCell>

      <TableCell className={classes.tableCell} align="left">
        <Tooltip title={<p style={{ fontSize: 15 }}>{admin.wallet_address}</p>}>
              <span className={classes.wordBreak}>
                {admin.wallet_address}
              </span>
        </Tooltip>
      </TableCell>

      {/* COUNTRY */}
      <TableCell className={classes.tableCellTitle} component="td" scope="row">
        <Tooltip title={<p style={{ fontSize: 15 }}>{admin?.national_id_issuing_country}</p>}>
              <span className={classes.wordBreak} style={{ width: 200 }}>
                {
                  countries[admin?.national_id_issuing_country || ''] || ''
                }
                <br/>
                {
                  admin?.national_id_issuing_country &&
                  <span>({admin?.national_id_issuing_country})</span>
                }
              </span>
        </Tooltip>
      </TableCell>



      <TableCell className={classes.tableCell} align="left">
        <div className={classes.tableCellFlex}>

          <div className="left">
            <Tooltip title={<p style={{ fontSize: 15 }}>{getActiveStatus(admin)}</p>}>
              <span className={`admin-status admin-${getActiveStatus(admin).toLowerCase()}`}>
              </span>
            </Tooltip>
            {getActiveStatus(admin)}
          </div>

        </div>
      </TableCell>

    </TableRow>
  )

};

export default KycUserRow;
