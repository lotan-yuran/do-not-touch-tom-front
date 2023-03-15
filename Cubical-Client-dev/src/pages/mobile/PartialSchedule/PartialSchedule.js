// Style
import styles from "./PartialSchedule.module.scss";

// Constants
import { dateFormat } from "../../../constants/date";

// Utilities
import { getDateWithFormat, getHourSpan } from "../../../utilities/date";

// Hooks
import { useAsyncThrowError } from "../../../hooks/useAsyncThrowError";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

// Services
import {
  createAppointment,
  getAssignIntervalByStation,
  getScheduleSettings
} from "../../../services/newAppointmentService";

// Components
import { Button, Typography } from "@material-ui/core";

const getDataForSchedule = async availableAppointment => {
  const [
    {
      data: { weekdaysActivityTime, maxMonthsFromNow }
    },
    { data: assignInterval }
  ] = await Promise.all([
    getScheduleSettings(availableAppointment?.complexId),
    getAssignIntervalByStation(availableAppointment?.stationTypeId)
  ]);
  return {
    ...availableAppointment,
    stationId: availableAppointment.stationTypeId,
    assignInterval,
    weekdaysActivityTime,
    maxMonthsFromNow
  };
};

export default forwardRef(function PartialSchedule(
  {
    setPropsButtonNext,
    failedAppointments,
    infoList,
    passComponent,
    availableAppointments,
    goBack,
    setPageData
  },
  ref
) {
  const { throwError } = useAsyncThrowError();
  const [loadingNext, setLoadingNext] = useState(false);
  const BASIC_DATA_APPOINTMENT = availableAppointments && availableAppointments[0];

  useImperativeHandle(ref, () => ({
    async onClickNext() {
      try {
        setLoadingNext(true);
        if (infoList?.length > 0) {
          return { addedAppointments: [...infoList] };
        }
        const { data } = await createAvailableAppointments();
        setLoadingNext(false);

        return data;
      } catch (e) {
        setLoadingNext(false);
        throwError(e);
      }
    }
  }));

  useEffect(() => {
    if (failedAppointments?.length === 0) {
      setLoadingNext(true);
      passComponent();
    }
    setPropsButtonNext({
      isDisabled: false,
      loading: loadingNext,
      textLabelLoading: "משריין עמדה",
      textLabel: "אישור"
    });
  }, [failedAppointments, infoList, ref]);

  const handleGoBack = async () => {
    const scheduleData = await getDataForSchedule(BASIC_DATA_APPOINTMENT);
    setPageData(scheduleData);
    goBack();
  };

  const createAvailableAppointments = async () => {
    return await createAppointment(
      BASIC_DATA_APPOINTMENT.userId,
      availableAppointments.map(({ start_datetime }) => start_datetime),
      BASIC_DATA_APPOINTMENT.stationTypeId,
      BASIC_DATA_APPOINTMENT.complexId,
      BASIC_DATA_APPOINTMENT.userInfo,
      BASIC_DATA_APPOINTMENT.reason
    );
  };

  return (
    <div className={styles["created-appointment-container"]}>
      {failedAppointments?.length > 0 && (
        <div>
          <Typography className={styles["title"]}>
            לא ניתן להזמין את העמדה לכל הזמן שנבחר בתאריך{" "}
            {getDateWithFormat(BASIC_DATA_APPOINTMENT?.start_datetime, dateFormat.DATE_DOTS_NO_YEAR)}
            <br />
            ניתן להזמין את העמדה לזמנים הבאים:
          </Typography>
          {availableAppointments?.map(appointment => {
            return (
              <div key={appointment.id}>
                <p className={styles["appointment-hours"]}>{getHourSpan(appointment)}</p>
                <br />
              </div>
            );
          })}
          <div className={styles["display-flex"]}>
            <Button className={styles["approve-button"]} onClick={passComponent}>
              אישור
            </Button>
            <Button className={styles["cancel-button"]} onClick={handleGoBack}>
              ביטול
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
