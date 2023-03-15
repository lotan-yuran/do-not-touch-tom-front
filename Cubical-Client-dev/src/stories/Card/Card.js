import classNames from "clsx";
import { element, string, bool, number, elementType, oneOfType } from "prop-types";

// Style
import style from "./card.module.scss";

export const Card = ({
  children,
  outline,
  widthPercent = 95,
  minHeight = 70,
  backgroundColor,
  center,
  centerContent,
  padding,
  margin,
  ...props
}) => {
  return (
    <div
      style={{ backgroundColor, minHeight, padding, margin }}
      className={classNames(
        style["card-base"],
        style[`card-base--width-${widthPercent}`],
        outline && style["card-base--outline"],
        center && style["card-base--center"],
        centerContent && style["card-base--centerContent"]
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  outline: bool,
  widthPercent: number,
  minHeight: number,
  backgroundColor: string,
  center: bool,
  centerContent: bool,
  padding: string,
  margin: string,
  children: oneOfType([element, elementType, number, string]).isRequired
};
