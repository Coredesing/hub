import React from 'react';
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import useStyles from "../../style";
import {Controller, useForm} from "react-hook-form";
import {DatePicker} from 'antd';
import moment from "moment";
import CurrencyInputWithValidate from "../CurrencyInputWithValidate";
import {DATETIME_FORMAT} from "../../../../constants";
import {fieldMustBeGreaterThanZero, renderErrorCreatePool} from "../../../../utils/validate";
import {convertDateTimeStringToMomentObject, convertMomentObjectToDateTimeString} from "../../../../utils/convertDate";
import { MenuItem, Select } from "@material-ui/core";
import CLAIM_TYPES from "../../../../store/constants/claim_type"

function CreateEditClaimConfigForm(props: any) {
  const classes = useStyles();
  const {
    isOpenEditPopup, setIsOpenEditPopup, editData, isEdit,
    handleCreateUpdateData,
  } = props;
  const renderError = renderErrorCreatePool;
  const {
    register, setValue, getValues, clearErrors, errors, handleSubmit, control,
    formState: { touched, isValid }
  } = useForm({
    mode: "onChange",
    reValidateMode: 'onChange',
    defaultValues: {
      ...editData,
      // Convert startTime from "2021-05-28 08:45:59" to Moment Object
      startTime: isEdit ? convertDateTimeStringToMomentObject(editData.startTime) : null,
    },
  });

  const submitData = (data: any) => {
    const responseData = {
      // Convert startTime from Moment Object to String "2021-05-28 08:45:59"
      // startTime: data.startTime.format(DATETIME_FORMAT),
      startTime: convertMomentObjectToDateTimeString(data.startTime),
      maxBuy: data.maxBuy,
      claimType: data.claimType,
      claimUrl: data.claimUrl
    };
    handleCreateUpdateData && handleCreateUpdateData(responseData);
  };

  const handleSubmitPopup = () => {
    return handleSubmit(submitData)()
      .then((res) => {
        console.log('Res: ', isValid, errors);
        if (isValid) {
          clearErrors();
        }
      });
  };

  return (
    <>
      <ConfirmDialog
        title={isEdit ? 'Edit' : 'Create'}
        open={isOpenEditPopup}
        confirmLoading={false}
        onConfirm={handleSubmitPopup}
        onCancel={() => { setIsOpenEditPopup(false); clearErrors() }}
        // btnLoading={true}
      >

        {/*{isEdit &&*/}
        {/*  <div className={classes.formControl}>*/}
        {/*    <label className={classes.formControlLabel}>Record No.</label>*/}
        {/*    <input*/}
        {/*      type="text"*/}
        {/*      value={editData.id}*/}
        {/*      className={classes.formControlInput}*/}
        {/*      disabled={true}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*}*/}


        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Start Time</label>
          <div >
            <Controller
              control={control}
              rules={{
                required: false,
              }}
              name="startTime"
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
                      setValue(field.name, datetimeSelected, {shouldValidate: false});
                    }}
                    minuteStep={15}
                  />
                )
              }}
            />
          </div>
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'startTime')
            }
          </p>
        </div>


        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Max Claim (%)</label>
          <div>
            <CurrencyInputWithValidate
              register={register}
              errors={errors}
              initValue={editData.maxBuy}
              controlName={'maxBuy'}
              validateRule={{
                required: true,
                validate: {
                  maxBuyGreaterThanZero: fieldMustBeGreaterThanZero
                },
              }}
            />
          </div>
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'maxBuyGreaterThanZero')
            }
          </p>
        </div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Claim Type</label>
          <div style={{ marginBottom: 25 }}>
            <Controller
              control={control}
              defaultValue={editData?.claimType || 0}
              name="claimType"
              render={(field) => {
                return (
                  <Select
                    {...field}
                    onChange={(event) => setValue(field.name, event.target.value)}
                  >
                    {
                      CLAIM_TYPES.map((value, index) => {
                        return (
                          <MenuItem
                            key={index}
                            value={index}
                          >
                            {value}
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                )
              }}
            />
            <p className={classes.formErrorMessage}>
              {
                renderError(errors, 'claimType')
              }
            </p>
          </div>
        </div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Claim URL</label>
          <Controller
              control={control}
              defaultValue={editData?.claimUrl}
              name="claimUrl"
              render={(field) => {
                return (
                  <input
                    {...field}
                    type="text"
                    name={field.name}
                    className={classes.formControlInput}
                    onChange={(event) => setValue(field.name, event.target.value)}
                  />
                )
              }}
            />
        </div>

      </ConfirmDialog>

    </>
  );
}

export default CreateEditClaimConfigForm;
