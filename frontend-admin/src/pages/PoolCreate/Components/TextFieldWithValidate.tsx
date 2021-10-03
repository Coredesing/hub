import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function TextFieldWithValidate(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    initValue, controlName,
    validateRule,
  } = props;
  const renderError = renderErrorCreatePool;
  const [value, setValue] = useState(initValue);

  return (
    <>
      <TextField
        placeholder="Please enter name of legend"
        value={value}
        onChange={(e: any) => {
          setValue(e.target.value);
        }}
        className={`${classes.formInputBox}`}
      />
      <input
        type='hidden'
        name={controlName}
        value={value}
        ref={register(validateRule)}
      />

      <p className={classes.formErrorMessage}>
        {
          renderError(errors, controlName)
        }
      </p>
    </>
  );
}

export default TextFieldWithValidate;
