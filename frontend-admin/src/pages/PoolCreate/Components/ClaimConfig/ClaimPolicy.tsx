import React from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function ClaimPolicy(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues, needValidate,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Claim Policy</label>
        <input
          type="text"
          name="claim_policy"
          defaultValue={poolDetail?.claim_policy}
          ref={register({
          })}
          className={classes.formControlInput}
          maxLength={255}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'claim_policy')
          }
        </p>
      </div>
    </>
  );
}

export default ClaimPolicy;
