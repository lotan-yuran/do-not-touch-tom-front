import classNames from "clsx";
import { number, string, oneOfType, func, bool, oneOf } from "prop-types";

// Style
import style from "./buttonDatePicker.module.scss";

export const ButtonDatePicker = ({
  color,
  onClick,
  accented,
  labelOne,
  labelTwo,
  disabled,
  backgroundColor,
  sizeButton = "medium",
  sizeLabelTwo = "small",
  sizeLabelOne = "medium",
  ...props
}) => {
  const accentedStyleName = accented ? "button-date-picker--accented" : "button-date-picker--not-accented";
  return (
    <button
      id="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        style[accentedStyleName],
        style["button-date-picker"],
        style[`button-date-picker--${sizeButton}`]
      )}
      style={{ backgroundColor, ...(disabled ? {} : { color }) }}
      {...props}
    >
      <p id="one-label" className={style[`one-label-${sizeLabelOne}`]}>{labelOne}</p>
      <p id="two-label" className={style[`two-label-${sizeLabelTwo}`]}>{labelTwo}</p>
    </button>
  );
};

ButtonDatePicker.propTypes = {
  onClick: func,
  color: string,
  accented: bool,
  disabled: bool,
  labelTwo: string,
  backgroundColor: string,
  sizeButton: oneOf(["small", "medium", "large"]),
  labelOne: oneOfType([string, number]).isRequired,
  sizeLabelOne: oneOf(["small", "medium", "large"]),
  sizeLabelTwo: oneOf(["small", "medium", "large"]),
};
