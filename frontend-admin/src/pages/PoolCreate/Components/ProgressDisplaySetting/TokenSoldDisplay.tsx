import React, {useEffect} from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";
import FormControl from "@material-ui/core/FormControl";

function TokenSoldDisplay(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Token Sold Display (Add More)</label>
        <br/>
        <span style={{ color: 'blue' }}>This field (if set), value will plus to Token Sold (get from Smart Contract)</span>
        <input
          type="number"
          name="token_sold_display"
          defaultValue={poolDetail?.token_sold_display}
          ref={register({
            // required: true
          })}
          maxLength={255}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'token_sold_display')
          }
        </p>
      </div>
    </>
  );
}

export default TokenSoldDisplay;
