import { FormControlLabel, MenuItem, Radio, RadioGroup, Select } from "@material-ui/core";
import { DatePicker } from "antd";
import moment from "moment";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import CLAIM_TYPES from "../../../../store/constants/claim_type";
import { convertMomentObjectToDateTimeString } from "../../../../utils/convertDate";
import {
  fieldMustBeGreaterThanZero,
  renderErrorCreatePool
} from "../../../../utils/validate";
import useStyles from "../../style";
import CurrencyInputWithValidate from "../CurrencyInputWithValidate";

function RepeatClaimConfigForm(props: any) {
  const classes = useStyles();
  const { isOpenRepeatPopup, setIsOpenRepeatPopup, handleCreateRepeatData } =
    props;
  const renderError = renderErrorCreatePool;
  const {
    register,
    setValue,
    getValues,
    clearErrors,
    errors,
    handleSubmit,
    control,
    watch,
    formState: { touched, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const submitData = (data: any) => {
    const responseData = {
      // Convert startTime from Moment Object to String "2021-05-28 08:45:59"
      fromDate: convertMomentObjectToDateTimeString(data.fromDate),
      toDate: convertMomentObjectToDateTimeString(data.toDate),
      repeatEvery: +data.repeatEvery,
      initialValue: +data.initialValue,
      repeatValue: +data.repeatValue,
      repeatType: data.repeatType,
      claimType: data.claimType,
      claimUrl: data.claimUrl,
    };
    handleCreateRepeatData && handleCreateRepeatData(responseData);
  };

  const handleSubmitPopup = () => {
    return handleSubmit(submitData)().then((res) => {
      console.log("Res: ", isValid, errors);
      if (isValid) {
        clearErrors();
      }
    });
  };
  const watchRepeatType = watch("repeatType");

  return (
    <>
      <ConfirmDialog
        title={"Repeat"}
        open={isOpenRepeatPopup}
        confirmLoading={false}
        onConfirm={handleSubmitPopup}
        onCancel={() => {
          setIsOpenRepeatPopup(false);
          clearErrors();
        }}
        // btnLoading={true}
      >
        <div className={classes.flexRow}>
          <div className={classes.formControl}>
            <label className={classes.formControlLabel}>From Date</label>
            <div>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                name="fromDate"
                render={(field) => {
                  return (
                    <DatePicker
                      {...field}
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime={{
                        defaultValue: moment("00:00:00", "HH:mm:ss"),
                        format: "HH:mm",
                      }}
                      onSelect={(datetimeSelected: any) => {
                        setValue(field.name, datetimeSelected, {
                          shouldValidate: true,
                        });
                      }}
                      minuteStep={15}
                    />
                  );
                }}
              />
            </div>
            <p className={classes.formErrorMessage}>
              {renderError(errors, "fromDate")}
            </p>
          </div>
          <div className={classes.formControl} style={{ marginLeft: "auto" }}>
            <label className={classes.formControlLabel}>To Date</label>
            <div>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                name="toDate"
                render={(field) => {
                  return (
                    <DatePicker
                      {...field}
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime={{
                        defaultValue: moment("00:00:00", "HH:mm:ss"),
                        format: "HH:mm",
                      }}
                      onSelect={(datetimeSelected: any) => {
                        setValue(field.name, datetimeSelected, {
                          shouldValidate: true,
                        });
                      }}
                      minuteStep={15}
                    />
                  );
                }}
              />
            </div>
            <p className={classes.formErrorMessage}>
              {renderError(errors, "toDate")}
            </p>
          </div>
        </div>

        <div className={classes.formControl}>
          <Controller
            rules={{ required: true }}
            control={control}
            defaultValue="month"
            name="repeatType"
            as={
              <RadioGroup row>
                <FormControlLabel value="day" control={<Radio />} label="Day" />
                <FormControlLabel
                  value="week"
                  control={<Radio />}
                  label="Week"
                />
                <FormControlLabel
                  value="month"
                  control={<Radio />}
                  label="Month"
                />
              </RadioGroup>
            }
          />
          <p className={classes.formErrorMessage}>
            {renderError(errors, "repeatType")}
          </p>
        </div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>
            {`Repeat every (${watchRepeatType}s)`}
          </label>
          <div>
            <CurrencyInputWithValidate
              register={register}
              errors={errors}
              // initValue={editData.maxBuy}
              controlName={"repeatEvery"}
              validateRule={{
                required: true,
                validate: {
                  greaterThanZero: fieldMustBeGreaterThanZero,
                },
              }}
            />
          </div>
          <p className={classes.formErrorMessage}>
            {renderError(errors, "greaterThanZero")}
          </p>
        </div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>
            Initial Max Claim (%)
          </label>
          <div>
            <CurrencyInputWithValidate
              register={register}
              errors={errors}
              // initValue={editData.maxBuy}
              controlName={"initialValue"}
              validateRule={{
                required: true,
                validate: {
                  greaterThanZero: fieldMustBeGreaterThanZero,
                },
              }}
            />
          </div>
          <p className={classes.formErrorMessage}>
            {renderError(errors, "greaterThanZero")}
          </p>
        </div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Repeat Value (%)</label>
          <div>
            <CurrencyInputWithValidate
              register={register}
              errors={errors}
              // initValue={editData.maxBuy}
              controlName={"repeatValue"}
              validateRule={{
                required: true,
                validate: {
                  greaterThanZero: fieldMustBeGreaterThanZero,
                },
              }}
            />
          </div>
          <p className={classes.formErrorMessage}>
            {renderError(errors, "greaterThanZero")}
          </p>
        </div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Claim Type</label>
          <div style={{ marginBottom: 25 }}>
            <Controller
              control={control}
              defaultValue={0}
              name="claimType"
              render={(field) => {
                return (
                  <Select
                    {...field}
                    onChange={(event) =>
                      setValue(field.name, event.target.value)
                    }
                  >
                    {CLAIM_TYPES.map((value, index) => {
                      return (
                        <MenuItem key={index} value={index}>
                          {value}
                        </MenuItem>
                      );
                    })}
                  </Select>
                );
              }}
            />
            <p className={classes.formErrorMessage}>
              {renderError(errors, "claimType")}
            </p>
          </div>
        </div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Claim URL</label>
          <Controller
            control={control}
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
              );
            }}
          />
        </div>
      </ConfirmDialog>
    </>
  );
}

export default RepeatClaimConfigForm;
