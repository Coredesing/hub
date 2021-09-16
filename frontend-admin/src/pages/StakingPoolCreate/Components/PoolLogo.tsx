import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolLogo(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Pool Logo</label>
        <input
          type="text"
          name='logo'
          defaultValue={poolDetail?.logo}
          ref={register({ required: true })}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'logo')
          }
        </p>
      </div>
    </>
  );
}

export default PoolLogo;
