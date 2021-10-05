import React from 'react';
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import useStyles from "../../style";
import {useForm} from "react-hook-form";
import CurrencyInputWithValidate from "../CurrencyInputWithValidate";
import TextFieldWithValidate from "../TextFieldWithValidate";
import {renderErrorCreatePool} from "../../../../utils/validate";

function CreateEditBoxTypesForm(props: any) {
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
      limit: data.limit,
      icon: data.icon,
      banner: data.banner,
      image: data.image,
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
          <label className={classes.formControlLabel}>Limit</label>
          <div>
            <CurrencyInputWithValidate
                register={register}
                errors={errors}
                initValue={editData.limit}
                controlName={'limit'}
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
              <label className={classes.formControlLabel}>Banner</label>
              <div>
                  <TextFieldWithValidate
                      register={register}
                      errors={errors}
                      initValue={editData.banner}
                      controlName={'banner'}
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
              <label className={classes.formControlLabel}>Loading Image</label>
              <div>
                  <TextFieldWithValidate
                      register={register}
                      errors={errors}
                      initValue={editData.image}
                      controlName={'image'}
                      validateRule={{}}
                  />
              </div>
          </div>
      </ConfirmDialog>

    </>
  );
}

export default CreateEditBoxTypesForm;
