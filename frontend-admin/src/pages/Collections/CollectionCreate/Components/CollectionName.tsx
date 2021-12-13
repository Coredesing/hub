import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function CollectionName(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    collectionDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Collection Name</label>
        <input
          type="text"
          name="name"
          defaultValue={collectionDetail?.name}
          ref={register({ required: true })}
          maxLength={255}
          className={classes.formControlInput}
          // disabled={isDeployed}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'name')
          }
        </p>
      </div>
    </>
  );
}

export default CollectionName;
