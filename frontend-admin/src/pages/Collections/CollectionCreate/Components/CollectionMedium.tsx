import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function CollectionMedium(props: any) {
  const classes = useStyles();
  const {
    errors,
    register,
    collectionDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Collection Medium</label>
        <input
          type="text"
          name='medium'
          ref={register({ required: false })}
          defaultValue={collectionDetail?.medium}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'medium')
          }
        </p>
      </div>
    </>
  );
}

export default CollectionMedium;
