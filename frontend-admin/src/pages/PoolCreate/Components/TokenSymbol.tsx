import React, { useEffect, useState } from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function TokenSymbol(props: any) {
  const classes = useStyles();
  const {
    register, errors, poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
      <>
        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Token Symbol (display)</label>
          <input
              type="text"
              name='token_symbol'
              defaultValue={poolDetail?.symbol}
              ref={register({ required: true })}
              className={classes.formControlInput}
          />

          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'token_symbol')
            }
          </p>
        </div>
      </>
  );
}

export default TokenSymbol;
