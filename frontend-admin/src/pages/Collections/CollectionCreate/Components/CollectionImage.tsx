import React from 'react';
import useStyles from "../style";
import {renderErrorCreateCollections} from "../../../../utils/validate";

function CollectionImage(props: any) {
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
        <label className={classes.formControlLabel}>Collection Image</label>
        <input
          type="text"
          name='image'
          ref={register({ required: false })}
          defaultValue={collectionDetail?.image}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'image')
          }
        </p>
      </div>
    </>
  );
}

export default CollectionImage;
