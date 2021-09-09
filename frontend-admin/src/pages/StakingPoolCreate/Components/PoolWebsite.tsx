import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolWebsite(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Pool Website</label>
        <input
          type="text"
          name='website'
          defaultValue={poolDetail?.website}
          ref={register({ required: false })}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'website')
          }
        </p>
      </div>
    </>
  );
}

export default PoolWebsite;
