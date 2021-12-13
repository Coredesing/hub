import React from 'react';
import useStyles from "../style";
import {renderErrorCreateCollections} from "../../../../utils/validate";

function CollectionPriority(props: any) {
  const classes = useStyles();
  const {
    errors,
    register,
    collectionDetail,
  } = props;
  const renderError = renderErrorCreateCollections;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Priority</label>
        <input
          type="number"
          name='priority'
          ref={register({ required: false })}
          defaultValue={collectionDetail?.priority || 1}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'priority')
          }
        </p>
      </div>
    </>
  );
}

export default CollectionPriority;
