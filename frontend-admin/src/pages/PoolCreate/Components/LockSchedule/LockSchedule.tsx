import React from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function LockSchedule(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues, needValidate,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.exchangeRate}>
        <div><label className={classes.exchangeRateTitle}>Lock Schedule Setting</label></div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Lock Schedule</label>
          <input
            type="text"
            name="lock_schedule"
            defaultValue={poolDetail?.lock_schedule}
            ref={register({
              // required: true
            })}
            // maxLength={255}
            className={classes.formControlInput}
          />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'lock_schedule')
            }
          </p>
        </div>
      </div>
    </>
  );
}

export default LockSchedule;
