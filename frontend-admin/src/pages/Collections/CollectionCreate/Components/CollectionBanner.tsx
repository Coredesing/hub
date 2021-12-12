import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function CollectionBanner(props: any) {
  const classes = useStyles();
  const {
    register,
    errors,
    collectionDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Collection Banner</label>
        <input
          type="text"
          name='banner'
          ref={register({ required: false })}
          defaultValue={collectionDetail?.banner}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'banner')
          }
        </p>
      </div>
    </>
  );
}

export default CollectionBanner;
