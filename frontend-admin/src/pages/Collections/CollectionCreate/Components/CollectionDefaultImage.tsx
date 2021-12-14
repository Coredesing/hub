import React from 'react';
import useStyles from "../style";
import {renderErrorCreateCollections} from "../../../../utils/validate";

function CollectionDefaultImage(props: any) {
  const classes = useStyles();
  const {
    register,
    errors,
    collectionDetail,
  } = props;
  const renderError = renderErrorCreateCollections;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Collection Default Image</label>
        <input
          type="text"
          name='default_image'
          ref={register({ required: false })}
          defaultValue={collectionDetail?.default_image}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'default_image')
          }
        </p>
      </div>
    </>
  );
}

export default CollectionDefaultImage;
