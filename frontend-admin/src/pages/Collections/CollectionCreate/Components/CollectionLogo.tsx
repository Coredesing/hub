import React from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function CollectionLogo(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    collectionDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Collection Logo</label>
        <input
          type="text"
          name='logo'
          defaultValue={collectionDetail?.logo}
          ref={register({ required: false })}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'logo')
          }
        </p>
      </div>
    </>
  );
}

export default CollectionLogo;
