import classNames from "clsx";
import { useEffect, useState, useRef } from "react";
import { number, string, arrayOf, shape, oneOfType, func, bool, oneOf } from "prop-types";

// Hooks
import { useColor } from "../../hooks/useColor";

// Style
import styles from "./dropList.module.scss";

// Material
import { Select, MenuItem, FormControl, InputLabel, InputBase, CircularProgress } from "@material-ui/core";

export const DropList = ({
  value,
  label,
  color,
  loading,
  outline,
  disabled,
  onChange,
  fullWidth,
  width = 0,
  options = [],
  size = "small",
  backgroundColor,
  shape = "circle",
  ...props
}) => {
  const { dark, normal } = useColor(backgroundColor);

  const [bgColor, setBgColor] = useState(null);
  const [valueState, setValueState] = useState(value);

  const selectRef = useRef(null);

  useEffect(() => setBgColor(normal), [backgroundColor, normal]);

  useEffect(() => {
    setValueState(value);
  }, [value]);

  useEffect(() => {
    if (selectRef) {
      selectRef.current.children[0].style.backgroundColor = bgColor;
    }
  }, [bgColor]);

  useEffect(() => {
    if (selectRef) {
      selectRef.current.children[0].style.color = color;
    }
  }, [color]);

  const handleChange = e => {
    setValueState(e.target.value);
    onChange(e.target.value);
  };

  return (
    <>
      <FormControl fullWidth={fullWidth}>
        {label && !backgroundColor && !color && (
          <InputLabel
            classes={{ shrink: styles["shrink"], formControl: styles["formControl"] }}
            shrink={true}
          >
            {label}
          </InputLabel>
        )}
        <Select
          {...props}
          label={label}
          ref={selectRef}
          classes={{ icon: styles["icon"] }}
          onChange={handleChange}
          value={!loading ? valueState : null}
          disabled={loading ? true : disabled}
          style={{ ...(fullWidth ? {} : { width: width < 100 ? 100 : width }) }}
          {...(!disabled
            ? { onMouseEnter: () => setBgColor(dark), onMouseLeave: () => setBgColor(normal) }
            : {})}
          {...(loading
            ? {
                IconComponent: () => (
                  <CircularProgress size={20} classes={{ root: styles["circular-progress"] }} />
                )
              }
            : {})}
          input={
            <InputBase
              classes={{
                input: classNames(
                  styles["input"],
                  styles[`drop-list--${size}`],
                  styles[`drop-list--${shape}`],
                  outline && styles[`drop-list--outline`]
                )
              }}
            />
          }
        >
          {options?.length > 0 &&
            options.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
};

DropList.propTypes = {
  width: number,
  label: string,
  color: string,
  outline: bool,
  onChange: func,
  fullWidth: bool,
  backgroundColor: string,
  shape: oneOf(["circle", "square"]),
  value: oneOfType([number, string]),
  options: arrayOf(
    shape({
      id: oneOfType([number, string]),
      name: oneOfType([number, string])
    })
  ),
  size: oneOf(["large", "medium", "small", "x-small", "xx-small"])
};
