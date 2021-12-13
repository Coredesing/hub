import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import {Switch} from 'antd';
import {alertSuccess} from "../../../../store/actions/alert";
import {withRouter} from "react-router";
import {useDispatch} from "react-redux";
import { setShowCollection } from '../../../../store/actions/collections';

function DisplayCollectionSwitch(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    collectionDetail, register, id
  } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    if (collectionDetail && (collectionDetail.is_show != undefined)) {
      setValue('is_show', !!collectionDetail.is_show);
    }
  }, [collectionDetail]);

  const onChangeShowHide = (value:boolean, id:any) => {
    dispatch(setShowCollection(id,value))
  }

  return (
    <>
      <div><label className={classes.formControlLabel}>Display</label></div>
      <div style={{color: 'red'}}>Users will not see the staking pool while the pool is in the hidden state</div>
      <FormControl component="fieldset">
        <Controller
          control={control}
          name="is_show"
          render={(field) => {
            const { value, onChange } = field;
            return (
              <Switch
                onChange={ async (switchValue) => {
                  // eslint-disable-next-line no-restricted-globals
                  if (!confirm('Do you want change display ?')) {
                    return false;
                  }
                  await onChange(switchValue);
                  await onChangeShowHide(switchValue, id);
                }}
                checked={value}
                ref={register({ required: false })}
                checkedChildren="Display"
                unCheckedChildren="Hidden"
              />
            )
          }}
        />
      </FormControl>
      <br/>
    </>
  );
}

export default withRouter(DisplayCollectionSwitch);
