import classNames from "clsx";
import { useRef, useImperativeHandle, forwardRef, useState, useEffect } from "react";
import { element, string, func, bool, oneOf, number, oneOfType, elementType, object } from "prop-types";

// Style
import styles from "./input.module.scss";

// Hooks
import { useColor } from "../../hooks/useColor";

// Material
import { TextField, InputAdornment } from "@material-ui/core";

export const Input = forwardRef(
  (
    {
      type,
      label,
      value,
      width,
      onChange,
      outlined,
      maxLength,
      style = {},
      helperText,
      placeholder,
      marginInput,
      endAdornment,
      error = false,
      backgroundColor,
      shape = "circle",
      disabled = false,
      required = false,
      readOnly = false,
      fullWidth = false,
      color = "rgb(0,0,0)",
      disableUnderline = true,
      ...props
    },
    ref
  ) => {
    const [bgColor, setBgColor] = useState(null);

    const inputRef = useRef();
    const { dark, normal } = useColor(backgroundColor);

    useEffect(() => {
      setBgColor(normal);
    }, [backgroundColor, normal]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current.focus();
      }
    }));

    const onInputChange = e => {
      if (!maxLength || e.target.value.toString().replace(maxLength.replace, "").length <= maxLength.length) {
        onChange(e);
      }
    };

    return (
      <>
        <TextField
          type={type}
          value={value}
          label={label}
          error={error}
          inputRef={inputRef}
          disabled={disabled}
          required={required}
          helperText={helperText}
          onChange={onInputChange}
          placeholder={placeholder}
          style={{ backgroundColor: bgColor, ...style }}
          InputLabelProps={{ style: { color: color } }}
          InputProps={{
            readOnly: readOnly,
            className: styles["input"],
            disableUnderline: disableUnderline,
            style: {
              color: color,
              ...(fullWidth ? {} : { width }),
              margin: marginInput ? marginInput : shape === "circle" ? "4px 25px" : "4px 15px"
            },
            endAdornment: endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>
          }}
          className={classNames(
            styles["input-base"],
            styles[`input--${shape}`],
            outlined && styles["input-base--outline"],
            fullWidth && styles["input-base--full-width"]
          )}
          {...(!disabled
            ? { onMouseEnter: () => setBgColor(dark), onMouseLeave: () => setBgColor(normal) }
            : {})}
          {...props}
        />
      </>
    );
  }
);

Input.propTypes = {
  error: bool,
  type: string,
  label: string,
  color: string,
  outlined: bool,
  disabled: bool,
  required: bool,
  readOnly: bool,
  onChange: func,
  fullWidth: bool,
  maxLength: object,
  placeholder: string,
  marginInput: string,
  disableUnderline: bool,
  backgroundColor: string,
  value: oneOfType([number, string]),
  shape: oneOf(["circle", "square"]),
  endAdornment: oneOfType([element, elementType, number, string])
};
