import React from 'react';
import useStyles from "../style";
import {renderErrorCreateCollections} from "../../../../utils/validate";

function CollectionWebsite(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    collectionDetail,
  } = props;
  const renderError = renderErrorCreateCollections;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Collection Website</label>
        <input
          type="text"
          name='website'
          defaultValue={collectionDetail?.website}
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

export default CollectionWebsite;
