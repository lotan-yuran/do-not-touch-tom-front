import moment from "moment";
import { dateFormat } from "../constants/date";

const NEW_HOUR = 60;

moment.locale("he");

export const getFullDate = date => moment(date).format("YYYY-MM-DD");

export const getHourSpan = appointment => {
  return `${getDateWithFormat(appointment?.end_datetime, dateFormat.TIME)} - 
  ${getDateWithFormat(appointment?.start_datetime, dateFormat.TIME)}`;
};

//Get time with format
export const getDateWithFormat = (date, format) => {
  return moment(date).format(format);
};

export const getStartAndEndDaily = (dateDaily, of = "month", format) => {
  const date = moment(dateDaily);
  let end = date.clone().endOf(of);
  let start = date.clone().startOf(of);
  if (format) {
    end = end.format(format);
    start = start.format(format);
  }
  return { start, end };
};

export const buildingArrayTimes = (startHour, endHour, intervalTime) => {
  const arrayHours = [];
  const [endH, endM] = endHour?.split(":");
  let [startH, startM] = startHour?.split(":");
  while (
    Number(endH) > Number(startH) ||
    (Number(endH) === Number(startH) && Number(endM) > Number(startM))
  ) {
    arrayHours.push(`${startH}:${startM}`);
    startH = (Number(startH) + getHourIncrement(startM, intervalTime)).toString().padStart(2, 0);
    startM = getMinuteIncrement(startM, intervalTime).toString().padStart(2, 0);
  }
  return arrayHours;
};

export const isFutureDate = date => {
  return moment(date).isAfter();
};

export const isToday = date => new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);

export const isTimeComparedSmallCurrentTime = time => {
  if (!time) return false;
  const currentTime = Date.now();
  const [hour, minute] = time.split(":");
  const timeCompared = new Date().setHours(hour, minute);
  return currentTime > timeCompared;
};

export const getLastAppointmentTime = (endTimeActivity, intervalTime) => {
  let [endH, endM] = endTimeActivity?.split(":");
  endH = (Number(endH) + getHourDecrement(endM, intervalTime)).toString().padStart(2, 0);
  endM = getMinuteDecrement(endM, intervalTime).toString().padStart(2, 0);
  return `${endH}:${endM}`;
};

export const getDateActiveIncrement = (arrDatesActive, date) => {
  const setDatesActive = new Set(arrDatesActive);
  while (setDatesActive.size > 0 && !setDatesActive.has(date.getDay().toString())) {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

export const getDateActiveDecrement = (arrDatesActive, date) => {
  const setDatesActive = new Set(arrDatesActive);
  while (setDatesActive.size > 0 && !setDatesActive.has(date.getDay().toString())) {
    date.setDate(date.getDate() - 1);
  }
  return date;
};

export const padTo2Digits = num => num.toString().padStart(2, "0");

export const formatDate = date => {
  return date._i
    ? `${date._i.split("T")[1]?.split(".")[0]} ${date._i?.split("T")[0]}`
    : date.includes("T")
    ? `${date.split("T")[1]?.split("+")[0]?.split("Z")[0]} ${date?.split("T")[0]}`
    : date;
};

export const FORMAT = "en-US";

export const getMaxDate = () => {
  const MAX_DATE = new Date("31 Dec 9999 00:00:00 GMT");
  return `${MAX_DATE?.toLocaleTimeString(FORMAT).split(" ")[0]} ${MAX_DATE?.toLocaleDateString(FORMAT)}`;
};

const getHourIncrement = (minutesExist, newMinutes) =>
  Number.parseInt((Number(minutesExist) + Number(newMinutes)) / NEW_HOUR);
const getMinuteIncrement = (minutesExist, newMinutes) =>
  Number.parseInt((Number(minutesExist) + Number(newMinutes)) % NEW_HOUR);

const getHourDecrement = (minutesExist, newMinutes) =>
  Number.parseInt((Number(minutesExist) - Number(newMinutes)) / NEW_HOUR);
const getMinuteDecrement = (minutesExist, newMinutes) =>
  Number.parseInt((Number(minutesExist) - Number(newMinutes)) % NEW_HOUR);
