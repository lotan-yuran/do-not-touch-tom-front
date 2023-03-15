import moment from "moment";

import { useState, useEffect } from "react";

// Style
import { admin } from "../../styles/colors";
import style from "./dateTimePickerAdmin.module.scss";

// Constants
import { COMPONENT_IDS } from "../../constants/componentIds";
import { backgroundColorAdmin } from "../../constants/schedule";

// Hooks
import { useAsyncThrowError } from "../../hooks/useAsyncThrowError";

// Services
import { getScheduleAdmin } from "../../services/appointmentManagementService";

// Utilities
import {
  isToday,
  buildingArrayTimes,
  getDateActiveIncrement,
  getLastAppointmentTime,
  isTimeComparedSmallCurrentTime
} from "../../utilities/date";

// Design component
import { Input } from "../../stories/Input/Input";
import { DropList } from "../../stories/DropList/DropList";
import { DateNavigatorOverlay } from "../../stories/DateNavigatorOverlay/DateNavigatorOverlay";

export const TimePickerAdmin = ({
  complexId,
  date,
  loadingTime,
  onChangeTime,
  onChangeDate,
  setTimesInterval,
  assignInterval,
  unavailableHours: { unavailableHours, isMaxExceeded, maxPossibleAppointments }
}) => {
  const [loading, setLoading] = useState(false);
  const [indexTime, setIndexTime] = useState(null);
  const [arrayTimes, setArrayTimes] = useState(null);
  const [arrayTimesNoFilter, setArrayTimesNoFilter] = useState(null);
  const [arrayEndTimesFilter, setArrayEndTimesFilter] = useState(null);
  const [massageError, setMassageError] = useState(null);
  const [endAppointment, setEndAppointment] = useState("");
  const [weekdaysActivityTime, setWeekdaysActivityTime] = useState(null);
  const [maxMonthsFromNow, setMaxMonthsFromNow] = useState(12);

  const { throwError } = useAsyncThrowError("dialog");

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { weekdaysActivityTime, maxMonthsFromNow }
        } = await getScheduleAdmin(complexId);
        onChangeDate(date || getDateActiveIncrement(Object.keys(weekdaysActivityTime), new Date()));
        setWeekdaysActivityTime(weekdaysActivityTime);
        setMaxMonthsFromNow(maxMonthsFromNow);
      } catch (e) {
        throwError(e);
        throw e;
      }
    })();
  }, []);

  useEffect(() => setEndAppointment(""), [loadingTime]);

  useEffect(() => {
    if (
      weekdaysActivityTime?.[date?.getDay()] &&
      assignInterval &&
      isToday(date) &&
      isTimeComparedSmallCurrentTime(
        getLastAppointmentTime(weekdaysActivityTime[date?.getDay()]?.endHour, assignInterval)
      )
    ) {
      setMassageError("עבר זמן פעילות");
    }
  }, [date, assignInterval, weekdaysActivityTime]);

  useEffect(() => {
    if (
      weekdaysActivityTime?.[date?.getDay()] &&
      assignInterval &&
      unavailableHours &&
      (!isToday(date) ||
        !isTimeComparedSmallCurrentTime(
          getLastAppointmentTime(weekdaysActivityTime[date?.getDay()]?.endHour, assignInterval)
        ))
    ) {
      setEndAppointment("");
      setLoading(true);
      setIndexTime(null);
      onChangeTime(null);
      const { startHour, endHour } = weekdaysActivityTime[date.getDay()];
      const busyHoursSet = new Set(
        isToday(date)
          ? [
              ...unavailableHours,
              ...buildingArrayTimes(
                startHour,
                new Date().toLocaleTimeString("he", { hour: "2-digit", minute: "2-digit" }),
                assignInterval
              )
            ]
          : unavailableHours
      );
      const arrayTimesTemp = buildingArrayTimes(startHour, endHour, assignInterval);
      const emptyTime = arrayTimesTemp
        .map((time, i) => ({ id: i, name: time, disabled: busyHoursSet.has(time) }))
        .filter(item => !item.disabled);
      if (emptyTime.length > 0) {
        setMassageError("");

        setArrayTimes(emptyTime);
        setArrayTimesNoFilter(
          arrayTimesTemp.map((time, i) => ({ id: i, name: time, disabled: busyHoursSet.has(time) }))
        );
      } else {
        setArrayTimes(null);
        setMassageError("לא ניתן לקבוע יותר הזמנות לעמדה זו");
      }
      setLoading(false);
    } else {
      setArrayTimes(null);
    }
  }, [date, assignInterval, unavailableHours]);

  const handleChangeEndTime = index => {
    const timesArray = arrayTimesNoFilter.filter(item => item.id < index && item.id >= indexTime);

    setTimesInterval(timesArray);
  };
  const handleChangeTime = index => {
    setIndexTime(index);

    const arrayTimeBigThanStart = [
      ...arrayTimesNoFilter.filter(item => item.id > index),
      {
        id: arrayTimesNoFilter[arrayTimesNoFilter.length - 1].id + 1,
        name: weekdaysActivityTime[date.getDay()].endHour
      }
    ];
    let indexTemp = arrayTimeBigThanStart[0].id;
    let endIndex = indexTemp;
    let isPrevDisable = false;
    arrayTimeBigThanStart.forEach(element => {
      if (element.id === indexTemp && !isPrevDisable) {
        endIndex = element.id;
        isPrevDisable = element.disabled;
        indexTemp++;
      } else {
        return;
      }
    });

    const arrayTimesFiltered = arrayTimeBigThanStart.filter(item => item.id <= endIndex);

    setEndAppointment(arrayTimesFiltered[0].name);

    setArrayEndTimesFilter(arrayTimesFiltered);
    onChangeTime(arrayTimesNoFilter[index].name);
  };

  const handleChangeDate = newDate => {
    setMassageError(null);
    onChangeDate(newDate);
  };

  return (
    <>
      <div>
        <DateNavigatorOverlay
          date={date}
          onChange={handleChangeDate}
          typeComponentDisplay={"Input"}
          PropsCalendar={{ minDate: new Date(), maxDate: moment().add(maxMonthsFromNow, "month") }}
          weekdaysActivityTime={weekdaysActivityTime}
          PropsComponent={{
            id: COMPONENT_IDS.ADMIN.DROPDOWNS.ORDER_DATE,
            shape: "square",
            placeholder: "בחירת תאריך",
            backgroundColor: backgroundColorAdmin.normal
          }}
        />
        <p className={style["text-error"]}>
          {isMaxExceeded
            ? `עד ${maxPossibleAppointments} הזמנות ביום`
            : massageError
            ? massageError
            : massageError}
        </p>
      </div>
      <div className={style["time-picker"]}>
        <p className={style["text"]}>{"משעה"}</p>
        <DropList
          id={COMPONENT_IDS.ADMIN.DROPDOWNS.ORDER_START_TIME}
          shape={"square"}
          value={indexTime}
          options={arrayTimes}
          disabled={!arrayTimes}
          onChange={handleChangeTime}
          loading={loading || loadingTime}
          backgroundColor={arrayTimes ? admin.brightGray : admin.brightGrayDisabled}
        />
        <p className={style["text"]}>{"עד שעה"}</p>
        <DropList
          id={COMPONENT_IDS.ADMIN.DROPDOWNS.ORDER_END_TIME}
          shape={"square"}
          value={endAppointment}
          options={arrayEndTimesFilter}
          disabled={!arrayEndTimesFilter}
          onChange={handleChangeEndTime}
          loading={loading || loadingTime}
          backgroundColor={arrayTimes ? admin.brightGray : admin.brightGrayDisabled}
        />
        {/* <Input
          id={COMPONENT_IDS.ADMIN.DROPDOWNS.ORDER_END_TIME}
          width={85}
          disabled={true}
          shape={"square"}
          value={endAppointment}
          backgroundColor={admin.brightGrayDisabled}
        /> */}
      </div>
    </>
  );
};
