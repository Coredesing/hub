import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function LinearAmountLimit(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Min Stake Amount / Person</label>
        <input
          type="number"
          name="min_investment"
          defaultValue={poolDetail?.min_investment || 0}
          min={0}
          ref={register({ required: false })}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'min_investment')
          }
        </p>
      </div>

      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Max Stake Amount / Person</label>
        <input
          type="number"
          name="max_investment"
          defaultValue={poolDetail?.max_investment || 0}
          min={0}
          ref={register({ required: false })}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'max_investment')
          }
        </p>
      </div>
    </>
  );
}

export default LinearAmountLimit;
