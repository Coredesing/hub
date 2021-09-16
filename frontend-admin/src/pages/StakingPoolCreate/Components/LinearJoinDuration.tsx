import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {useCommonStyle} from "../../../styles";
import {Controller} from "react-hook-form";
import {DatePicker} from "antd";
import moment from "moment";
import {BUY_TYPE, DATETIME_FORMAT, POOL_TYPE} from "../../../constants";
import {renderErrorCreatePool} from "../../../utils/validate";
import {campaignClaimConfigFormat} from "../../../utils/campaign";

function LinearJoinDuration(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    register, setValue, getValues, errors, control, watch,
    poolDetail, needValidate, isEdit
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail) {
      if (poolDetail.start_time) {
        setValue('start_time', moment(poolDetail.start_time, DATETIME_FORMAT));
      }
      if (poolDetail.finish_time) {
        setValue('finish_time', moment(poolDetail.finish_time, DATETIME_FORMAT));
      }
      if (poolDetail.release_time) {
        setValue('release_time', moment(poolDetail.release_time, DATETIME_FORMAT));
      }
      if (poolDetail.start_join_pool_time) {
        setValue('start_join_pool_time', moment(poolDetail.start_join_pool_time, DATETIME_FORMAT));
      }
      if (poolDetail.end_join_pool_time) {
        setValue('end_join_pool_time', moment(poolDetail.end_join_pool_time, DATETIME_FORMAT));
      }
    }
  }, [poolDetail]);
  const isDeployed = !!poolDetail?.is_deploy;
  const watchBuyType = watch('buyType');
  const isBuyTypeFCFS = watchBuyType === BUY_TYPE.FCFS;

  // Convert and format campaignClaimConfig table
  const campaignClaimConfigJSON = watch('campaignClaimConfig');
  useEffect(() => {
    if (campaignClaimConfigJSON) {
      try {
        let campaignClaimConfig = campaignClaimConfigFormat(campaignClaimConfigJSON);
        // console.log('Change campaignClaimConfig: ', campaignClaimConfig);
        if (campaignClaimConfig && campaignClaimConfig.length > 0) {
          if (campaignClaimConfig[0]?.startTime) {
            let claimTimeValue = Number(campaignClaimConfig[0]?.startTime); // Format: Timestamp
            // Convert claimTimeValue from "1625072400" to Moment Object
            const claimTimeObject = moment(claimTimeValue * 1000);
            setValue('release_time', claimTimeObject);
          }
        } else {
          setValue('release_time', null);
        }
      } catch (e) {
        console.log('ERROR: ', e);
      }
    }
  }, [campaignClaimConfigJSON]);

  return (
    <>

      <div className={classes.formControlFlex}>

        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>Start Join Pool Time</label>
          <div style={{marginBottom: 25}}>
            <Controller
              control={control}
              rules={{
                required: (needValidate && !isBuyTypeFCFS),
                validate: {
                  // greaterOrEqualToday: (value) => {
                  //   if (isDeployed || isBuyTypeFCFS) return true;
                  //   console.log(value);
                  //   return new Date(value) >= new Date();
                  // },
                }
              }}
              name="start_join_pool_time"
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
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    disabled={isEdit}
                  />
                )
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {
              renderError(errors, 'start_join_pool_time')
            }
          </div>
        </div>


        <div className={classes.formControlFlexBlock}>
          <label className={classes.formControlLabel}>End Join Pool Time</label>
          <div style={{marginBottom: 25}}>
            <Controller
              control={control}
              rules={{
                required: (needValidate && !isBuyTypeFCFS),
                validate: {
                  greateOrEqualStartJoinPoolTime: value => {
                    if (!needValidate) return true;
                    if (isDeployed || isBuyTypeFCFS) return true;
                    const startTime = getValues('start_join_pool_time');
                    const valueUnix = moment(value).unix();
                    const startTimeUnix = moment(startTime).unix();
                    console.log('Validate End Join Time', valueUnix, startTimeUnix);

                    return startTime ? valueUnix > startTimeUnix : valueUnix > moment().unix();
                  }
                }
              }}
              name="end_join_pool_time"
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
                    className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                    disabled={isDeployed || isBuyTypeFCFS}
                  />
                )
              }}
            />
          </div>
          <div className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
            {
              renderError(errors, 'end_join_pool_time')
            }
          </div>
        </div>
      </div>

    </>
  );
}

export default LinearJoinDuration;
