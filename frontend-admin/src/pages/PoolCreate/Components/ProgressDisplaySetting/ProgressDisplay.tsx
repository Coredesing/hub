import React, {useEffect, useState} from 'react';
import FormControl from '@material-ui/core/FormControl';
// @ts-ignore
import CurrencyInput from 'react-currency-input-field';
import {fieldMustBeGreaterThanZero, renderErrorCreatePool} from "../../../../utils/validate";
import useStyles from "../../style";

function ProgressDisplay(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors,
    poolDetail
  } = props;
  const [progressDisplay, setProgressDisplay] = useState('');
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.progress_display) {
      setProgressDisplay(poolDetail.progress_display);
    }
  }, [poolDetail]);

  const handleChange = (value: any, name: any) => {
    setProgressDisplay(value);
    setValue('progress_display', value, { shouldValidate: true })
  };

  return (
    <>
      <br/>
      <FormControl component="fieldset">

        <label className={classes.formControlLabel}>Progress Display (%)</label>
        <span style={{ color: 'blue' }}>This field (if set), value will plus Progress in Progress Bar</span>
        <CurrencyInput
          id="progress_display"
          placeholder="Please enter a number"
          value={progressDisplay}
          onValueChange={handleChange}
          className={`${classes.formInputBox}`}
          min={0}
        />
        <input
          type='hidden'
          name="progress_display"
          value={progressDisplay || ''}
          ref={register({
            // required: true,
            validate: {
              // totalSoldCoinGreaterThanZero: fieldMustBeGreaterThanZero
            }
          })}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'progress_display')
          }
        </p>
        {/*<p className={classes.formErrorMessage}>*/}
        {/*  {*/}
        {/*    renderError(errors, 'totalSoldCoinGreaterThanZero')*/}
        {/*  }*/}
        {/*</p>*/}

      </FormControl>
    </>
  );
}

export default ProgressDisplay;
