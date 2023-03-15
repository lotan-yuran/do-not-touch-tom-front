import { useEffect, useRef } from "react";
import { number, string, arrayOf, shape, oneOfType, func, bool, oneOf } from "prop-types";

// Style
import style from "./scrollPad.module.scss";

// Constants
import { accentedButton } from "../../constants/newAppointment";

// Design component
import { ButtonDatePicker } from "../ButtonDatePicker/ButtonDatePicker";

export const ScrollPad = ({
  onClick,
  data = [],
  indexClicked,
  colorTextButton,
  size = "medium",
  backgroundColor,
  backgroundColorButton,
  ...props
}) => {
  const buttonsDatePickerRef = useRef(null);

  useEffect(() => {
    scrollTo(indexClicked);
  }, [data, indexClicked, buttonsDatePickerRef]);

  const scrollTo = index => {
    if (index !== null && buttonsDatePickerRef?.current.children.length > 0) {
      let element = buttonsDatePickerRef.current.children[index];
      element?.scrollIntoView?.({ behavior: "smooth", block: "end", inline: "start" });
    }
  };

  return (
    <div
      {...props}
      ref={buttonsDatePickerRef}
      className={style["scroll-pad"]}
      style={backgroundColor && { backgroundColor }}
    >
      {data.map((item, i) => (
        <ButtonDatePicker
          key={i}
          sizeButton={size}
          sizeLabelOne="large"
          sizeLabelTwo="medium"
          color={colorTextButton}
          disabled={item.disabled}
          labelOne={item.labelOne}
          labelTwo={item.labelTwo}
          name="button-date-picker"
          onClick={() => onClick(i)}
          backgroundColor={backgroundColorButton}
          {...(indexClicked === i ? accentedButton.clicked : accentedButton.notClicked)}
        />
      ))}
    </div>
  );
};

ScrollPad.propTypes = {
  onClick: func,
  indexClicked: number,
  backgroundColor: string,
  colorTextButton: string,
  backgroundColorButton: string,
  size: oneOf(["small", "medium", "large"]),
  data: arrayOf(
    shape({
      disabled: bool,
      labelTwo: oneOfType([number, string]),
      labelOne: oneOfType([number, string]).isRequired
    })
  )
};
