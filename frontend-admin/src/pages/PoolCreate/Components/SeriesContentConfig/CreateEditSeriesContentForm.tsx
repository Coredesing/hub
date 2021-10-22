import React from 'react';
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import useStyles from "../../style";
import {useForm} from "react-hook-form";
import CurrencyInputWithValidate from "../CurrencyInputWithValidate";
import TextFieldWithValidate from "../TextFieldWithValidate";
import {renderErrorCreatePool} from "../../../../utils/validate";

function CreateEditSeriesContentForm(props: any) {
  const classes = useStyles();
  const {
    isOpenEditPopup, setIsOpenEditPopup, editData, isEdit,
    handleCreateUpdateData,
  } = props;
  const renderError = renderErrorCreatePool;
  const {
    register, clearErrors, errors, handleSubmit,
    formState: { isValid }
  } = useForm({
    mode: "onChange",
    reValidateMode: 'onChange',
    defaultValues: {
      ...editData
    },
  });

  const submitData = (data: any) => {
    const responseData = {
      // Convert startTime from Moment Object to String "2021-05-28 08:45:59"
      // startTime: data.startTime.format(DATETIME_FORMAT),
      amount: data.amount,
      name: data.name,
      rate: data.rate,
      icon: data.icon,
      banner: data.banner,
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
        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Name</label>
          <div>
            <TextFieldWithValidate
              register={register}
              errors={errors}
              initValue={editData.name}
              controlName={'name'}
              validateRule={{
                required: true,
                validate: {},
              }}
            />
          </div>
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'required')
            }
          </p>
        </div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Amount</label>
          <div>
            <CurrencyInputWithValidate
                register={register}
                errors={errors}
                initValue={editData.amount}
                controlName={'amount'}
                validateRule={{
                  required: true,
                  validate: {
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
          <label className={classes.formControlLabel}>Rate</label>
          <div>
            <CurrencyInputWithValidate
                register={register}
                errors={errors}
                initValue={editData.rate}
                controlName={'rate'}
                validateRule={{
                  required: true,
                  validate: {
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
          <label className={classes.formControlLabel}>Icon</label>
          <div>
              <TextFieldWithValidate
                  register={register}
                  errors={errors}
                  initValue={editData.icon}
                  controlName={'icon'}
                  validateRule={{}}
              />
          </div>
        </div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Banner</label>
          <div>
              <TextFieldWithValidate
                  register={register}
                  errors={errors}
                  initValue={editData.banner}
                  controlName={'banner'}
                  validateRule={{}}
              />
          </div>
        </div>
      </ConfirmDialog>

    </>
  );
}

export default CreateEditSeriesContentForm;
