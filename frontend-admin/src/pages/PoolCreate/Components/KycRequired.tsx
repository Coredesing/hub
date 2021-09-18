import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";
import {Switch} from 'antd';
import {POOL_TYPE} from "../../../constants";

function KycRequired(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,watch,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.kyc_bypass) {
      setValue('kyc_bypass', poolDetail.kyc_bypass);
    }
  }, [poolDetail]);

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>KYC Bypass</label>

          <Controller
          control={control}
          name="kyc_bypass"
          render={(field) => {
            const { value, onChange } = field;
            return (
              <Switch
                onChange={ async (switchValue) => {
                  await onChange(switchValue);
                }}
                checked={value}
                checkedChildren="Bypass"
                unCheckedChildren="Required"
              />
            )
          }}
        />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'kyc_bypass')
            }
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default KycRequired;
