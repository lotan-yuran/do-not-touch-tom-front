import moment from "moment";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

// Context
import { useMsal } from "../../../context/msalContext";

// Style
import style from "./newAppointmentSchedule.module.scss";

// Utilities
import { buildingArrayTimes } from "../../../utilities/date";

// Hooks
import { useAsyncThrowError } from "../../../hooks/useAsyncThrowError";

// SmartComponents
import { TimePicker } from "../../../smartComponents/TimePicker/TimePicker";
import { DatePicker } from "../../../smartComponents/DatePicker/DatePicker";

// Services
import { getFullCapacityHoursByStation } from "../../../services/newAppointmentService";

import { COMPONENT_IDS } from "../../../constants/componentIds";

const isTimeSelected = timesMap => {
  return timesMap?.size && Array.from(timesMap?.values()).filter(val => val === true).length > 0;
};

export default forwardRef(function NewAppointmentSchedule(
  {
    setPropsButtonNext,
    weekdaysActivityTime,
    stationId,
    complexId,
    reason,
    userInfo,
    assignInterval,
    orderForIndex,
    maxMonthsFromNow
  },
  ref
) {
  const [date, setDate] = useState(null);
  const [timeSelectionMap, setTimeSelectionMap] = useState(null);
  const [loadingTime, setLoadingTime] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [arrayBusyHoursState, setArrayBusyHoursState] = useState(null);
  const [maxExceededAppointment, setMaxExceededAppointment] = useState({
    isMaxExceeded: false,
    maxNum: null
  });

  const { user } = useMsal();
  const { throwError, onAfterCloseDialog } = useAsyncThrowError("dialog");

  useEffect(() => {
    let day = moment();
    const weekdaysActivity = Object.keys(weekdaysActivityTime);
    if (weekdaysActivity.includes(String(day.day()))) {
      setDate(moment());
    } else {
      while (!weekdaysActivity.includes(String(day.day()))) {
        day = moment(day).add(1, "d");
      }
      setDate(day);
    }
  }, []);

  useEffect(() => {
    setPropsButtonNext({
      id: COMPONENT_IDS.CUSTOMER.BUTTONS.PLACE_ORDER,
      isDisabled: !isTimeSelected(timeSelectionMap),
      loading: loadingNext,
      textLabelLoading: "שומרים לך עמדה...",
      textLabel: isTimeSelected(timeSelectionMap) ? "קבענו?" : "יש לבחור שעה"
    });
  }, [timeSelectionMap, loadingNext]);

  useEffect(() => {
    (async () => {
      if (user.id && userInfo && stationId && complexId && date) {
        getFullCapacityHours(date);
      }
    })();
  }, [user, date]);

  const pickedTimeToggle = time => {
    setTimeSelectionMap(new Map(timeSelectionMap).set(time, !timeSelectionMap.get(time)));
  };

  const buildingArrayBusyHoursState = (busyHours, newDate) => {
    if (weekdaysActivityTime) {
      const { startHour, endHour } = weekdaysActivityTime?.[newDate?.day()];
      if (newDate.diff(moment().startOf("day"), "days") === 0) {
        setArrayBusyHoursState(
          new Set([
            ...(busyHours?.unavailableHours || []),
            ...(buildingArrayTimes(startHour, moment().format("HH:mm"), assignInterval) || [])
          ])
        );
      } else {
        setArrayBusyHoursState(new Set(busyHours?.unavailableHours));
      }
      const times = buildingArrayTimes(startHour, endHour, assignInterval);
      const tmpMapTimes = new Map();
      for (const t of times) {
        tmpMapTimes.set(t, false);
      }
      setTimeSelectionMap(tmpMapTimes);
    }
  };

  const getFullCapacityHours = async newDate => {
    setLoadingTime(true);
    try {
      const { data } = await getFullCapacityHoursByStation(userInfo.id, newDate, stationId, complexId);
      setMaxExceededAppointment({ isMaxExceeded: data.isMaxExceeded, maxNum: data.maxPossibleAppointments });
      buildingArrayBusyHoursState(data, newDate);
      setLoadingTime(false);
    } catch (e) {
      setLoadingTime(false);
      throwError(e);
    }
  };

  useImperativeHandle(ref, () => ({
    async onClickNext() {
      try {
        setLoadingNext(true);
        const datetimeList = [];
        for (const [time, isTimeSelected] of timeSelectionMap) {
          if (isTimeSelected) {
            const [hour, minute] = time.split(":");
            datetimeList.push(date.clone().set({ hour, minute }));
          }
        }

        setLoadingNext(false);
        return { datetimeList, stationId, complexId, userInfo, orderForIndex, reason };
      } catch (e) {
        setLoadingNext(false);
        onAfterCloseDialog(() => getFullCapacityHours(date));
        throwError(e);
        throw e;
      }
    }
  }));

  return (
    date && (
      <div className={style["new-invitation"]}>
        <DatePicker
          minDate={new Date()}
          onChange={setDate}
          maxDate={moment().add(maxMonthsFromNow, "month")}
          objWeekdaysActive={weekdaysActivityTime}
        />
        <TimePicker
          onClick={pickedTimeToggle}
          timeSelectionMap={timeSelectionMap}
          loadingTime={loadingTime}
          intervalTime={assignInterval}
          {...weekdaysActivityTime?.[date?.day()]}
          maxExceeded={maxExceededAppointment}
          arrayBusyHoursState={arrayBusyHoursState}
        />
      </div>
    )
  );
});
