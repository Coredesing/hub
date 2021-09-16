import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function LinearCap(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Total Pool Amount</label>
        <input
          type="number"
          name="cap"
          defaultValue={poolDetail?.cap || 0}
          min={0}
          ref={register({ required: false })}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'cap')
          }
        </p>
      </div>
    </>
  );
}

export default LinearCap;
