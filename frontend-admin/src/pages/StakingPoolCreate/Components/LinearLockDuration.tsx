import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function LinearLockDuration(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail, isEdit
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Lock Duration (days, 0 day = flexible pool)</label>
        <input
          type="number"
          name="lock_duration"
          defaultValue={poolDetail?.lock_duration || 0}
          ref={register({ required: false })}
          min={0}
          disabled={isEdit}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'lock_duration')
          }
        </p>
      </div>
    </>
  );
}

export default LinearLockDuration;
