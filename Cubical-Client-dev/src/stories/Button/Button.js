import classNames from "clsx";
import { useState, useEffect } from "react";
import { element, string, func, bool, oneOf, oneOfType, number, elementType } from "prop-types";

// Style
import styleCss from "./button.module.scss";

// Hooks
import { useColor } from "../../hooks/useColor";

export const Button = ({
  color,
  outline,
  onClick,
  disabled,
  children,
  fullWidth,
  style = {},
  backgroundColor,
  size = "medium",
  shape = "circle",
  ...props
}) => {
  const { dark, normal } = useColor(backgroundColor);

  const [bgColor, setBgColor] = useState(null);

  useEffect(() => setBgColor(normal), [backgroundColor, normal]);

  return (
    <button
      id="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setBgColor(dark)}
      onMouseLeave={() => setBgColor(normal)}
      style={{
        ...style,
        ...(disabled ? {} : { color }),
        ...(bgColor ? { backgroundColor: bgColor } : {})
      }}
      className={classNames(
        styleCss["button-base"],
        styleCss[`button-base--${size}`],
        styleCss[`button-base--${shape}`],
        outline && styleCss["button-base--outline"],
        fullWidth && styleCss["button-base--full-width"]
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: func,
  color: string,
  outline: bool,
  disabled: bool,
  fullWidth: bool,
  fontWeight: number,
  colorOutline: string,
  backgroundColor: string,
  shape: oneOf(["circle", "square", "full-square"]),
  children: oneOfType([element, elementType, number, string]),
  size: oneOf(["large", "medium", "small", "x-small", "xx-small"])
};
