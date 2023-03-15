import { DayView } from "@devexpress/dx-react-scheduler-material-ui";
import style from "./calendarCell.module.scss";
import moment from "moment";
import { useEffect, useState } from "react";
export const CalenderCell = ({ id, disableStationsTimesState, startMeetingTime, interval }) => {
  const [classCell, setClassCell] = useState(null);

  useEffect(() => {
    if (!disableStationsTimesState) return;
    const disableCell = disableStationsTimesState.find(item => {
      const endMeetingTime = moment(startMeetingTime)
        .add(interval, "minutes")
        .subtract(1, "minutes")
        .format();

      return (
        item.station_id === id &&
        moment(item.start_date).format() < endMeetingTime &&
        moment(item.end_date).format() > startMeetingTime
      );
    });
    const classSelected = disableCell ? style["time-cell-inactive"] : style["time-cell-active"];
    setClassCell(classSelected);
  }, [id, startMeetingTime, disableStationsTimesState]);

  return <DayView.TimeTableCell className={classCell} />;
};
