import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolRKPRate(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail, isAllocPool
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControlFlex}>
        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>{isAllocPool && 'Accepted'} Token Price</label>
          <input
            type="number"
            name="accepted_token_price"
            defaultValue={poolDetail?.accepted_token_price}
            min={0}
            ref={register({ required: true })}
            className={classes.formControlInput}
          />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'accepted_token_price')
            }
          </p>
        </div>

        {
          isAllocPool &&
          <div className={classes.formControlFlexBlock}>
            <label className={classes.formControlLabel}>Reward Token Price</label>
            <input
              type="number"
              name="reward_token_price"
              defaultValue={poolDetail?.reward_token_price}
              min={0}
              ref={register({ required: true })}
              className={classes.formControlInput}
            />
            <p className={classes.formErrorMessage}>
              {
                renderError(errors, 'reward_token_price')
              }
            </p>
          </div>
        }
        
      </div>
      <em>
        The price is for estimated APR calculation (display only). 
        New values will be updated to corresponding fields in every pools which has the same pool contract.
      </em>
    </>
  );
}

export default PoolRKPRate;
