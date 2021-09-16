import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function LinearAnnualRate(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Annual Percentage Rate (365 days)</label>
        <input
          type="number"
          name="APR"
          defaultValue={poolDetail?.APR || 0}
          min={0}
          ref={register({ required: false })}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'APR')
          }
        </p>
      </div>
    </>
  );
}

export default LinearAnnualRate;
