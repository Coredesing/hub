import React, {useEffect} from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";
import {Controller} from "react-hook-form";
import {DatePicker} from "antd";
import moment from "moment";
import BigNumber from 'bignumber.js';

function StartTimeFreeBuy(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues, control,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.freeBuyTimeSetting) {
      const fieldValue = poolDetail?.freeBuyTimeSetting?.start_buy_time;
      const isEmptyValue = !fieldValue || new BigNumber(fieldValue).isZero();
      setValue(
        'start_time_free_buy',
        isEmptyValue ? null : moment.unix(fieldValue)
      );
    }
  }, [poolDetail]);

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Start Free Buy Time</label>
        <div >
          <Controller
            control={control}
            rules={{
            }}
            name="start_time_free_buy"
            render={(field) => {
              return (
                <DatePicker
                  {...field}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{
                    defaultValue: moment("00:00:00", "HH:mm:ss"),
                    format: "HH:mm"
                  }}
                  onSelect={(datetimeSelected: any) => {
                    setValue(field.name, datetimeSelected, {shouldValidate: true});
                  }}
                  minuteStep={15}
                />
              )
            }}
          />
        </div>
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'start_time_free_buy')
          }
        </p>
      </div>
    </>
  );
}

export default StartTimeFreeBuy;
