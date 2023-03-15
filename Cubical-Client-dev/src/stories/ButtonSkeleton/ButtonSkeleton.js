import classNames from "clsx";
import { useMemo } from "react";
import { number, bool, oneOf } from "prop-types";

// Style
import style from "./buttonSkeleton.module.scss";

export const ButtonSkeleton = ({ lengthLabel, fullWidth, size = "medium", ...props }) => {

  const getTextWidth = useMemo(() => {
    const text = document.createElement("button");
    document.body.appendChild(text);

    text.className = classNames(
      style["button-base"],
      style[`button-base--${size}`],
      fullWidth && style["button-base--full-width"]
    );
    text.innerHTML = "A".repeat(lengthLabel);
    const width = Math.ceil(text.clientWidth);
    const height = Math.ceil(text.clientHeight);
    document.body.removeChild(text);
    return { width, height };
  }, [lengthLabel]);

  return (
    <button
      id="button"
      type="button"
      style={getTextWidth}
      className={classNames(
        style["button-base"],
        style["button-base--skeleton"],
        fullWidth && style["button-base--full-width"]
      )}
      {...props}
    >
      <span></span>
    </button>
  );
};

ButtonSkeleton.propTypes = {
  fullWidth: bool,
  lengthLabel: number.isRequired,
  size: oneOf(["large", "medium", "small", "x-small", "xx-small"])
};
