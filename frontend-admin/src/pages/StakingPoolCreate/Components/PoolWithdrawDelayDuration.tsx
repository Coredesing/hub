import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function WithdrawDelayDuration(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail, disabled
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Withdraw Delay Duration (days)</label>
        <input
          type="number"
          name="delay_duration"
          defaultValue={poolDetail?.delay_duration || 0}
          min={0}
          disabled={disabled}
          ref={register({ required: false })}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'delay_duration')
          }
        </p>
      </div>
    </>
  );
}

export default WithdrawDelayDuration;
