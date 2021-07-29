import React from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function MediumLink(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues, needValidate,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Medium Link</label>
        <input
          type="text"
          name="medium_link"
          defaultValue={poolDetail?.socialNetworkSetting?.medium_link}
          ref={register({
            // required: true
          })}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'medium_link')
          }
        </p>
      </div>
    </>
  );
}

export default MediumLink;
