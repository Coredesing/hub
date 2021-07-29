import React, {useEffect} from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";
import FormControl from "@material-ui/core/FormControl";

function MaxBonus(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;
  const acceptCurrency = watch('acceptCurrency');

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Max Bonus ({(acceptCurrency + '').toUpperCase()})</label>
        <br/>
        <div style={{ color: 'blue' }}>
          This field (if set), the value will be plus to the Maximum Buy Amount when the START FREE BUY TIME is reached
        </div>
        <input
          type="number"
          name="max_bonus_free_buy"
          defaultValue={poolDetail?.freeBuyTimeSetting?.max_bonus}
          ref={register({
            // required: true
          })}
          maxLength={255}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'max_bonus_free_buy')
          }
        </p>
      </div>
    </>
  );
}

export default MaxBonus;
