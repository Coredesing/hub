import React from 'react';
import useStyles from "../style";

function AggregatorSlug(props: any) {
  const classes = useStyles();
  const {
    register, poolDetail,
  } = props;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Aggregator Slug</label>
        <input
          type="text"
          name='aggregator_slug'
          defaultValue={poolDetail?.aggregator_slug}
          ref={register({ required: false })}
          className={classes.formControlInput}
        />
      </div>
    </>
  );
}

export default AggregatorSlug;
