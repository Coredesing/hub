import React from 'react';
import useStyles from "../style";
import {renderErrorCreateCollections} from "../../../../utils/validate";

function CollectionTelegram(props: any) {
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
        <label className={classes.formControlLabel}>Collection Telegram</label>
        <input
          type="text"
          name='telegram'
          ref={register({ required: false })}
          defaultValue={collectionDetail?.telegram}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'telegram')
          }
        </p>
      </div>
    </>
  );
}

export default CollectionTelegram;
