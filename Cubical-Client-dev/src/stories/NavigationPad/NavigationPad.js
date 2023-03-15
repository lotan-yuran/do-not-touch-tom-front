import moment from "moment";
import classNames from "clsx";
import { useState } from "react";
import { string, func, bool, oneOf } from "prop-types";

// Design component
import { Button } from "../Button/Button";

// Style
import style from "./navigationPad.module.scss";

// Constants
import { dateFormat } from "../../constants/date";
import { sizeButton } from "../../constants/newAppointment";

// Icons
import { ArrowLeft } from "../../icons/ArrowLeft/ArrowLeft";
import { ArrowRight } from "../../icons/ArrowRight/ArrowRight";

export const NavigationPad = ({
  date,
  minDate,
  maxDate,
  onClick,
  size = "large",
  backgroundColor,
  labelButtonToday,
  labelBetweenIcons,
  isDisplayButtonToDay,
  ...props
}) => {
  const [clicked, setClicked] = useState(null);

  const handleClick = type => {
    setClicked(type);
    onClick(type);
    const timeoutID = setTimeout(() => setClicked(false), 10);

    return () => {
      clearTimeout(timeoutID);
    };
  };

  const isAfterMinDate = () =>
    moment(minDate).format(dateFormat.MONTHS_YEAR) === moment(date).format(dateFormat.MONTHS_YEAR);

  const isBeforeMaxDate = () =>
    moment(maxDate).format(dateFormat.MONTHS_YEAR) === moment(date).format(dateFormat.MONTHS_YEAR);

  return (
    <div
      {...props}
      className={classNames(style["navigation-pad"], style[`grid-${size}`])}
      style={backgroundColor && { backgroundColor }}
    >
      {isDisplayButtonToDay && (
        <div className={style["button"]}>
          <Button
            outline={true}
            backgroundColor={null}
            size={sizeButton[size]}
            onClick={() => handleClick("button")}
          >
            {labelButtonToday || ""}
          </Button>
        </div>
      )}
      <div className={style["navigation"]}>
        <button
          type="button"
          id="button-icon-right"
          onClick={() => handleClick("right")}
          className={style["button-icons-arrow"]}
          disabled={minDate ? isAfterMinDate() : false}
        >
          <span className={style["icons-arrow"]}>
            <ArrowRight />
          </span>
        </button>
        <div className={style["between-icons"]}>
          <p
            className={
              clicked
                ? classNames(style["text-between-icons"], style[`transition-${clicked}`])
                : style["text-between-icons"]
            }
          >
            {labelBetweenIcons}
          </p>
        </div>
        <button
          type="button"
          id="button-icon-left"
          onClick={() => handleClick("left")}
          className={style["button-icons-arrow"]}
          disabled={maxDate ? isBeforeMaxDate() : false}
        >
          <span className={style["icons-arrow"]}>
            <ArrowLeft />
          </span>
        </button>
      </div>
    </div>
  );
};

NavigationPad.propTypes = {
  onClick: func,
  backgroundColor: string,
  isDisplayButtonToDay: bool,
  labelBetweenIcons: string.isRequired,
  size: oneOf(["small", "medium", "large"])
};
