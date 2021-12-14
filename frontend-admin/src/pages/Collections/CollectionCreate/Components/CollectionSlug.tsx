import React from 'react';
import useStyles from "../style";
import {renderErrorCreateCollections} from "../../../../utils/validate";

function CollectionSlug(props: any) {
  const classes = useStyles();
  const {
    errors,
    register,
    collectionDetail,
    isEdit
  } = props;
  const renderError = renderErrorCreateCollections;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Slug (unique)</label>
        <input
          type="text"
          name='slug'
          ref={register({ required: false })}
          defaultValue={collectionDetail?.slug}
          disabled={isEdit}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'slug')
          }
        </p>
      </div>
    </>
  );
}

export default CollectionSlug;
