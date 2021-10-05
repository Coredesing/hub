import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function PoolMiniBanner(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Mini Banner</label>
        <input
          type="text"
          name='mini_banner'
          defaultValue={poolDetail?.mini_banner}
          ref={register({})}
          className={classes.formControlInput}
        />
      </div>
    </>
  );
}

export default PoolMiniBanner;
