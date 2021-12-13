import React, {useEffect, useState} from 'react';
import {getTokenInfo} from "../../../../utils/token";
import {CircularProgress, Tooltip} from "@material-ui/core";
import useStyles from "../style";
import {debounce} from "lodash";
import {renderErrorCreatePool} from "../../../../utils/validate";
import {CHAIN_ID_NAME_MAPPING} from "../../../../constants";


function TokenAddress(props: any) {
  const classes = useStyles();
  const { register, collectionDetail } = props;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Token Address</label>
        <div className={classes.formControlInputLoading}>
          <input
            type="text"
            name='token_address'
            maxLength={255}
            ref={register({ required: true })}
            defaultValue={collectionDetail?.token_address}
            className={classes.formControlInput}
          />
        </div>
      </div>
    </>
  );
}

export default TokenAddress;
