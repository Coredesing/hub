import React from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function TelegramLink(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues, needValidate,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Telegram Link</label>
        <input
          type="text"
          name="telegram_link"
          defaultValue={poolDetail?.socialNetworkSetting?.telegram_link}
          ref={register({
            // required: true
          })}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'telegram_link')
          }
        </p>
      </div>
    </>
  );
}

export default TelegramLink;
