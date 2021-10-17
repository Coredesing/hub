import React from 'react';
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import useStyles from "../../style";
import {useForm} from "react-hook-form";
import CurrencyInputWithValidate from "../CurrencyInputWithValidate";
import TextFieldWithValidate from "../TextFieldWithValidate";
import {renderErrorCreatePool} from "../../../../utils/validate";

function CreateEditAcceptedTokensForm(props: any) {
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
      name: data.name,
      address: data.address,
      icon: data.icon,
      price: data.price
    };
    handleCreateUpdateData && handleCreateUpdateData(responseData);
  };

  const handleSubmitPopup = () => {
    return handleSubmit(submitData)()
      .then((res) => {
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
          <label className={classes.formControlLabel}>Address</label>
          <div>
            <TextFieldWithValidate
              register={register}
              errors={errors}
              initValue={editData.address}
              controlName={'address'}
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
          <label className={classes.formControlLabel}>Icon</label>
          <div>
            <TextFieldWithValidate
              register={register}
              errors={errors}
              initValue={editData.icon}
              controlName={'icon'}
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
          <label className={classes.formControlLabel}>Price</label>
          <div>
            <CurrencyInputWithValidate
                register={register}
                errors={errors}
                initValue={editData.price}
                controlName={'price'}
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
      </ConfirmDialog>

    </>
  );
}

export default CreateEditAcceptedTokensForm;
