import React from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function WhitelistSocialRequirement(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, control,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel} style={{textTransform: 'capitalize'}}>Gleam Link</label>
        <input
          type="text"
          name={'gleam_link'}
          defaultValue={poolDetail?.socialRequirement?.gleam_link}
          ref={register({
            // required: true
          })}
          maxLength={255}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'gleam_link')
          }
        </p>
      </div>
    </>
  );
}

export default WhitelistSocialRequirement;
