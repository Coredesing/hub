import React from "react";
import { makeStyles } from "@material-ui/core";
// import PropTypes from "prop-types";
// import { COLORS } from "../utils/constants";
// import { isNumber } from "../utils";
import clsx from "clsx";
import { isNumber } from "lodash";

const useStyles = makeStyles({
  input: {
    width: "100%",
    fontSize: "14px",
    lineHeight: "24px",
    fontWeight: 400,
    // color: COLORS.CHARCOAL_PURPLE,
    background: "#F7F7FF",
    borderRadius: "4px",
    padding: "8px 12px",
    outline: "none",
    // border: "none",
    boxSizing: "border-box",
    border: "1px solid #E7E6FF",
  },
  hideArrowNumber: {
    "&::-webkit-outer-spin-button": {
      margin: 0,
      WebkitAppearance: "none",
    },
    "&::-webkit-inner-spin-button": {
      margin: 0,
      WebkitAppearance: "none",
    },
  },
});

interface IProps {
  value: any,
  onChange: Function,
  isInteger?: boolean,
  isPositive?: boolean,
  allowZero?: boolean,
  min?: number,
  max?: number,
  [k: string]: any
}
export const FormInputNumber = (props: IProps) => {
  const classes = useStyles();
  const { value, onChange, allowZero, isPositive, isInteger, ...otherProps } =
    props;
  const [val, setVal] = React.useState("");

  React.useEffect(() => {
    setVal(value);
  }, [value]);

  const _onChange = (event: any) => {
    let { value: valInput } = event.target;
    if (valInput === "") {
      setVal(valInput);
      onChange(event);
      return;
    }
    if ( !isNaN(+valInput) && isNumber(+valInput)) {
      if (!allowZero && valInput.charAt(0) === "0") {
        valInput = valInput.replace(/0/i, "");
      }
      if (typeof props.min === "number") {
        if (+valInput < props.min) {
          setVal(value);
          return;
        }
      }
      if (typeof props.max === "number") {
        if (+valInput > props.max) {
          setVal(value);
          return;
        }
      }
      event.target.value = valInput;
      if (isInteger && isPositive) {
        if (!valInput.includes(".") && !valInput.includes("-")) {
          setVal(valInput);
          onChange(event);
        }
        return;
      }
      if (isInteger) {
        if (!valInput.includes(".")) {
          setVal(valInput);
          onChange(event);
        }
        return;
      }
      if (isPositive) {
        if (!valInput.includes("-")) {
          setVal(valInput);
          onChange(event);
        }
        return;
      }
      setVal(valInput);
      onChange(event);
    } else {
      const v = valInput.slice(0, -1);
      setVal(v);
    }
  };

  return (
    <input
      className={clsx(
        classes.input,
        props.type === "number" && classes.hideArrowNumber
      )}
      value={val}
      onChange={_onChange}
      {...otherProps}
    />
  );
};

// FormInputNumber.propTypes = {
//   value: PropTypes.any,
//   onChange: PropTypes.func,
//   isInteger: PropTypes.bool,
//   isPositive: PropTypes.bool,
//   allowZero: PropTypes.bool,
//   min: PropTypes.number,
//   max: PropTypes.number,
// };
