import React, {useEffect} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";
import {Switch} from 'antd';

function IsFeatured(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,watch,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.is_featured) {
      setValue('is_featured', poolDetail.is_featured);
    }
  }, [poolDetail]);

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Is Featured</label>

          <Controller
          control={control}
          name="is_featured"
          render={(field) => {
            const { value, onChange } = field;
            return (
              <Switch
                onChange={ async (switchValue) => {
                  await onChange(switchValue);
                }}
                checked={value}
                checkedChildren="Featured"
                unCheckedChildren="Normal"
              />
            )
          }}
        />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'is_featured')
            }
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default IsFeatured;
