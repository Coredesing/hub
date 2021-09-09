import React, {useEffect} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import { Radio } from 'antd';
import {withRouter} from "react-router";

function PoolType(props: any) {
  const classes = useStyles();
  const {
    setValue, control,
    poolDetail, isEdit
  } = props;
  
  const options = [
    { label: 'Allocation', value: 'alloc' },
    { label: 'Linear Rate', value: 'linear' },
  ];

  useEffect(() => {
    if (!poolDetail?.staking_type && options?.length) {
      setValue('staking_type', options[0]?.value );
      return;
    }

    setValue('staking_type', poolDetail?.staking_type );
  }, [poolDetail]);

  const changeDisplay = async (value: any) => {
    if (!value) {
      return value;
    }
    setValue('staking_type', value);
    return value;
  };

  return (
    <>
      <FormControl className={classes.formControl} component="fieldset">
        <label className={classes.formControlLabel}>Staking Type</label>
        <Controller
          control={control}
          name="staking_type"
          render={(field) => {
            const { value } = field;
            return (
              <Radio.Group
                options={options}
                onChange={ async (event) => {
                  await changeDisplay(event?.target?.value);
                }}
                value={value}
                disabled={isEdit}
                optionType="button"
                buttonStyle="solid"
              />
            )
          }}
        />
      </FormControl>
    </>
  );
}

export default withRouter(PoolType);
