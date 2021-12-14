import React from 'react';
import useStyles from "../style";
import {renderErrorCreateCollections} from "../../../../utils/validate";

function CollectionTwitter(props: any) {
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
        <label className={classes.formControlLabel}>Collection Twitter</label>
        <input
          type="text"
          name='twitter'
          ref={register({ required: false })}
          defaultValue={collectionDetail?.twitter}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'twitter')
          }
        </p>
      </div>
    </>
  );
}

export default CollectionTwitter;
