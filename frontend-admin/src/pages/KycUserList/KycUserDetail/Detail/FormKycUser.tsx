import React from 'react';
import {useForm} from 'react-hook-form';
import {withRouter} from 'react-router-dom';
import {Button} from '@material-ui/core';

import useStyles from '../styles';
import {useCommonStyle} from '../../../../styles';
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";
import {useDispatch} from "react-redux";
import {adminRoute} from "../../../../utils";
import {createKycUser, updateKycUser} from "../../../../request/kyc-user";
import KycSwitch from "./KycSwitch";
import Country from "./Country";

const FormKycUser = (props: any) => {
  const styles = useStyles();
  const commonStyle = useCommonStyle();
  const dispatch = useDispatch();

  const { history, isCreate } = props;
  let { id, username, email, wallet_address, is_kyc } = props.user;
  const { register, errors, handleSubmit, setValue, control } = useForm({
    mode: 'onChange',
    defaultValues: props?.user || {},
  });

  const onSubmit = (values: any) => {
    if (isCreate) {
      createKycUser(values)
        .then((res) => {
          if (res.status == 200) {
            dispatch(alertSuccess('Create success'));
            history.push(adminRoute('/kyc-users'));
          } else {
            dispatch(alertFailure(res.message || 'Something went wrong'));
          }
        });
    } else {
      updateKycUser(id, values)
        .then((res) => {
          if (res.status == 200) {
            dispatch(alertSuccess('Update success'));
          } else {
            dispatch(alertFailure(res.message || 'Something went wrong'));
          }
        });
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>

        <KycSwitch
          user={props.user}
          register={register}
          setValue={setValue}
          errors={errors}
          control={control}
        />

        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>
            Email
            <span className={commonStyle.required}>*</span>
          </label>
          <input
            className={styles.inputG}
            name="email"
            placeholder="Email"
            ref={register({
              // required: true,
              maxLength: 255
            })}
          />
          {errors.email && <span className={commonStyle.error}>This field is required</span>}
        </div>
        <div className="clearfix"></div>


        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>
            Wallet address
            <span className={commonStyle.required}>*</span>
          </label>
          <input
            className={styles.inputG}
            name="wallet_address"
            placeholder=""
            ref={register({ required: true, maxLength: 255 })}
          />
          {errors.wallet_address && <span className={commonStyle.error}>This field is required</span>}
        </div>
        <div className="clearfix"></div>


        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>
            Country
            <span className={commonStyle.required}>*</span>
          </label>
          <Country
            user={props.user}
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
          />
          {/*{errors.national_id_issuing_country && <span className={commonStyle.error}>This field is required</span>}*/}
        </div>

        <div className={styles.listBtn}>
          <Button
            type="submit"
            className={styles.btnSubmit}>
              Submit
          </Button>
        </div>

      </form>
    </>
  );
};

export default withRouter(FormKycUser);
