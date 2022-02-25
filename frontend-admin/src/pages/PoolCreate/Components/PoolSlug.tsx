import React from 'react';
import useStyles from "../style";

function PoolSlug(props: any) {
  const classes = useStyles();
    const {
        register, poolDetail,
    } = props;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Pool Slug</label>
        <input
          type="text"
          name='slug'
          defaultValue={poolDetail?.slug}
          ref={register({ required: false })}
          className={classes.formControlInput}
        />
      </div>
    </>
  );
}

export default PoolSlug;
