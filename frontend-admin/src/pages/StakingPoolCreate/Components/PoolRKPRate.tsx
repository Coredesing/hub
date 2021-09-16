import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {Checkbox} from "@material-ui/core";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolRKPRate(props: any) {
  const classes = useStyles();
  const {
    register, errors, setValue, watch,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Red Kite Point Calculation</label>
        <Checkbox 
          checked={Number(watch('rkp_rate')) > 0} 
          onChange={(event) => {
            setValue('rkp_rate', event.target.checked ? 1 : 0)
          }}
        />
        <div>
          <em>
            Only applicable if the staking token of the pool is PKF or LP-PKF
          </em>
        </div>
        <input
          type="number"
          name="rkp_rate"
          defaultValue={poolDetail?.rkp_rate}
          min={0}
          ref={register({ required: true })}
          style={{display: 'none'}}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'rkp_rate')
          }
        </p>
      </div>
    </>
  );
}

export default PoolRKPRate;
