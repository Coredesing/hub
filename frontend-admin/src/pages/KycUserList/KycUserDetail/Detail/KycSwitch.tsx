import React, {useEffect} from 'react';
import useStyles from "../styles";
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import {Switch} from 'antd';
import {withRouter} from "react-router";
import {useDispatch} from "react-redux";
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";
import {renderErrorCreatePool} from "../../../../utils/validate";
import {changeIsKycStatus} from "../../../../request/kyc-user";

function KycSwitch(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    user,
  } = props;
  const renderError = renderErrorCreatePool;
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && (user.is_kyc != undefined)) {
      setValue('is_kyc', !!user.is_kyc);
    }
  }, [user]);

  const changeDisplay = async (value: any) => {
    const res = await changeIsKycStatus({
      userId: user.id,
      isKyc: value,
    });
    console.log('Change Kyc: Response: ', res);
    if (res.status === 200) {
      dispatch(alertSuccess('Change KYC setting successful!'));
      return true;
    } else {
      dispatch(alertFailure('Change KYC setting fail'));
      return false;
    }
  };

  const isEdit = !!user.id;

  return (
    <>
      <div><label className={classes.formControlLabel}>KYC</label></div>
      {/*<div style={{color: 'red'}}>Users will not see Campaigns while the campaign is in the hidden state</div>*/}
      <FormControl component="fieldset">
        <Controller
          control={control}
          name="is_kyc"
          render={(field) => {
            const { value, onChange } = field;
            return (
              <Switch
                onChange={ async (switchValue) => {
                  // eslint-disable-next-line no-restricted-globals
                  if (isEdit && !confirm('Do you want change Kyc ?')) {
                    return false;
                  }
                  if (isEdit) {
                    await changeDisplay(switchValue).then((result) => {
                      if (result) {
                        onChange(switchValue);
                      }
                    });
                  }
                }}
                checked={value}
                checkedChildren="Approved"
                unCheckedChildren="Unapproved"
              />
            )
          }}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'is_kyc')
          }
        </p>
      </FormControl>
      <br/>
    </>
  );
}

export default withRouter(KycSwitch);
