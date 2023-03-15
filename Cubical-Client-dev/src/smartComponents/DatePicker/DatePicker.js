import "moment/locale/he";
import moment from "moment";
import { useEffect, useState } from "react";

// Style
import styles from "./datePicker.module.scss";

// Utilities
import { getStartAndEndDaily } from "../../utilities/date";

// Design component
import { ScrollPad } from "../../stories/ScrollPad/ScrollPad";
import { NavigationPad } from "../../stories/NavigationPad/NavigationPad";

// Constants
import { weekdaysShort, months } from "../../constants/date";
import { COMPONENT_IDS } from "../../constants/componentIds";
import { propsDesignScrollPad, propsDesignNavigationPad } from "../../constants/newAppointment";

export const DatePicker = ({ minDate, maxDate, objWeekdaysActive, onChange }) => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(null);
  const [indexClicked, setIndexClicked] = useState(null);
  const [isDisplayButtonToDay, setIsDisplayButtonToDay] = useState(true);
  const [labelButtonToday, setLabelButtonToday] = useState("לעבור להיום");

  useEffect(() => {
    if (minDate && moment(minDate).isAfter(moment())) {
      setDate(moment(minDate));
      setIsDisplayButtonToDay(false);
    } else {
      setDate(moment());
    }
  }, []);

  useEffect(() => {
    if (date && objWeekdaysActive) {
      const { start, end } = getStartAndEndDaily(date);
      setData(
        [...Array(end.date()).keys()].map(dayIndex => {
          return {
            labelOne: dayIndex + 1, /// represent day number
            labelTwo: weekdaysShort[(start.day() + dayIndex) % weekdaysShort.length], /// represent day letter
            disabled:
              !objWeekdaysActive.hasOwnProperty((start.day() + dayIndex) % weekdaysShort.length) ||
              (minDate &&
                moment(minDate).isBetween(start, end) &&
                moment(minDate).date() > start.date() + dayIndex) ||
              (maxDate &&
                moment(maxDate).isBetween(start, end) &&
                moment(maxDate).date() < start.date() + dayIndex)
          };
        })
      );
    }
  }, [date, objWeekdaysActive]);

  useEffect(() => {
    if (data && moment().isSame(date, "year") && moment().isSame(date, "month")) {
      let index = date.date() - 1;
      while (data[index]?.disabled) {
        setLabelButtonToday("תאריך הקרוב");
        index++;
      }
      if (index < data.length) {
        setIndexClicked(index);
      }
    }
  }, [data]);

  useEffect(() => {
    if (indexClicked !== null) {
      onChange(date.clone().set("date", data[indexClicked]?.labelOne, indexClicked));
    }
  }, [indexClicked]);

  const handleClickNavigationPad = type => {
    setIndexClicked(null);
    switch (type) {
      case "button":
        setDate(moment());
        break;
      case "right":
        setDate(date => date.clone().subtract(1, "month"));
        break;
      case "left":
        setDate(date => date.clone().add(1, "month"));
        break;
      default:
        break;
    }
  };

  return (
    <div id={COMPONENT_IDS.CUSTOMER.INPUTS.ORDER_DATE}>
      <div className={styles["date-picker-query"]}>
        <p>
          <span>למתי לקבוע?</span>
        </p>
      </div>
      {data.length > 0 && objWeekdaysActive ? (
        <>
          <NavigationPad
            date={moment(date)}
            {...propsDesignNavigationPad}
            onClick={handleClickNavigationPad}
            labelButtonToday={labelButtonToday}
            isDisplayButtonToDay={isDisplayButtonToDay}
            {...(minDate ? { minDate: moment(minDate) } : {})}
            {...(maxDate ? { maxDate: moment(maxDate) } : {})}
            labelBetweenIcons={date ? `${months[date.month()]} ${date.year()}` : ""}
          />
          <ScrollPad
            data={data}
            {...propsDesignScrollPad}
            onClick={setIndexClicked}
            indexClicked={indexClicked}
          />
        </>
      ) : (
        <div className={styles["skeleton"]}></div>
      )}
    </div>
  );
};
