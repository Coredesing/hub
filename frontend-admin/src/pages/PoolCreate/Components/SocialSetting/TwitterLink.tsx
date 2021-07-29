import React from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function TwitterLink(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues, needValidate,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Twitter Link</label>
        <input
          type="text"
          name="twitter_link"
          defaultValue={poolDetail?.socialNetworkSetting?.twitter_link}
          ref={register({
            // required: true
          })}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'twitter_link')
          }
        </p>
      </div>
    </>
  );
}

export default TwitterLink;
