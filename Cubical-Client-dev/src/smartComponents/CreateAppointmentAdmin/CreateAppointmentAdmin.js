import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

// Material ui
import { Fab } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import moment from "moment";

// Context
import { useMsal } from "../../context/msalContext";

// Style
import style from "./createAppointmentAdmin.module.scss";

// Hooks
import { useAsyncThrowError } from "../../hooks/useAsyncThrowError";

// Smart components
import { Station } from "../Station/Station";
import { StationType } from "../StationType/StationType";
import { FormByOrderFor } from "../FormByOrderFor/FormByOrderFor";
import { TimePickerAdmin } from "../DateTimePickerAdmin/DateTimePickerAdmin";

// Services
import {
  // createAppointmentAdmin,
  getUnavailableHoursAdmin
} from "../../services/appointmentManagementService";
import { createAppointmentAdminNew } from "../../services/newAppointmentService";
import { getAssignIntervalByStation } from "../../services/newAppointmentService";

// Design component
import { Dialog } from "../../stories/Dialog/Dialog";

// Constants
import {
  propsDesignDialog,
  backgroundColorAdmin,
  messagesDialogCreateAppointment
} from "../../constants/schedule";
import { COMPONENT_IDS } from "../../constants/componentIds";
import { orderFor, ID_MAX_LENGTH, isThereValueNotValid } from "../../constants/newAppointment";

import { useCodes } from "../../context/codesContext";

export const CreateAppointmentAdmin = forwardRef(({ refreshAppointments }, ref) => {
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [stationId, setStationId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false);
  const [stationTypeId, setStationTypeId] = useState(null);
  const [assignInterval, setAssignInterval] = useState(null);
  const [unavailableHours, setUnavailableHours] = useState(null);
  const [savingAppointment, setSavingAppointment] = useState(false);
  const [userInfo, setUserInfo] = useState({ id: "", fullName: "", phone: "" });
  const [timesInterval, setTimesInterval] = useState([]);
  const { user } = useMsal();
  const { throwError } = useAsyncThrowError("dialog");

  const { complexes, currentComplex } = useCodes();
  const complexId = complexes[currentComplex]?.id;
  useEffect(() => {
    if (userInfo.id.length === ID_MAX_LENGTH && stationTypeId && date) {
      getUnavailableHoursData();
    }
  }, [userInfo.id, date, stationTypeId, stationId]);

  const getUnavailableHoursData = async () => {
    try {
      setLoadingTime(true);
      const { data: unavailableHoursData } = await getUnavailableHoursAdmin(
        complexId,
        date,
        stationId,
        stationTypeId,
        userInfo.id
      );
      setUnavailableHours(unavailableHoursData);
      setLoadingTime(false);
    } catch (e) {
      setLoadingTime(false);
      throwError(e);
      throw e;
    }
  };

  const dataReset = () => {
    setDate(null);
    setUnavailableHours(null);
    setUserInfo({ id: "", fullName: "", phone: "" });
  };

  const handleCancelDialog = () => {
    setOpenDialog(false);
    dataReset();
  };

  const handleOkDialog = async () => {
    try {
      setSavingAppointment(true);

      const datetimeList = timesInterval.map((currentTime, index) => {
        let timeAndDate = moment(date).format("YYYY-MM-DD") + " " + currentTime.name;
        timeAndDate = typeof timeAndDate === "object" ? timeAndDate : moment(timeAndDate);
        return timeAndDate;
      });

      const { data } = await createAppointmentAdminNew(
        user.id,
        datetimeList,
        stationId,
        complexId,
        userInfo,
        stationTypeId
      );

      await refreshAppointments();
      setOpenDialog(false);
      setSavingAppointment(false);
      dataReset();
    } catch (e) {
      setOpenDialog(false);
      setSavingAppointment(false);
      dataReset();
      throwError(e);
      throw e;
    }
  };

  const handleChangesStationType = async id => {
    setStationId(null);
    setStationTypeId(id);
    if (id) {
      try {
        const { data: assignInterval } = await getAssignIntervalByStation(id);
        setAssignInterval(assignInterval);
      } catch (e) {
        throwError(e);
        throw e;
      }
    }
  };

  useImperativeHandle(ref, () => ({
    openDialogByClickCalendar: (stationTypeId, stationId, startDate) => {
      handleChangesStationType(stationTypeId);
      setStationId(stationId);
      setDate(startDate);
      setOpenDialog(true);
    }
  }));

  return (
    <div>
      <Fab
        id={COMPONENT_IDS.ADMIN.BUTTONS.NEW_ORDER}
        className={style["icon-add"]}
        onClick={() => setOpenDialog(true)}
      >
        <Add />
      </Fab>
      <Dialog
        open={openDialog}
        colorLoader={"black"}
        onOk={handleOkDialog}
        {...propsDesignDialog}
        loading={savingAppointment}
        onClose={handleCancelDialog}
        onCancel={handleCancelDialog}
        {...messagesDialogCreateAppointment}
        className={style["create-appointment-admin-dialog"]}
        propsClose={{ id: COMPONENT_IDS.ADMIN.BUTTONS.EXIT_ORDER_WINDOW }}
        disabledButtonOk={loadingTime || !time || isThereValueNotValid(orderFor.someoneElse, userInfo)}
      >
        <div className={style["grid"]}>
          <StationType
            id={COMPONENT_IDS.ADMIN.DROPDOWNS.STATION_TYPE_MENU}
            stationId={stationTypeId}
            onChange={handleChangesStationType}
            PropsSelect={{
              shape: "square",
              backgroundColor: backgroundColorAdmin.normal
            }}
          />
          <Station
            stationId={stationId}
            stationTypeId={stationTypeId}
            onChange={id => setStationId(id)}
            PropsSelect={{
              id: COMPONENT_IDS.ADMIN.DROPDOWNS.STATTION_NUMBER,
              shape: "square",
              backgroundColor: backgroundColorAdmin.normal
            }}
          />
          <FormByOrderFor
            shape={"square"}
            fullWidth={true}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            orderForIndex={orderFor.someoneElse}
            backgroundColorObj={backgroundColorAdmin}
          />
          <TimePickerAdmin
            complexId={complexId}
            date={date}
            onChangeTime={setTime}
            onChangeDate={setDate}
            setTimesInterval={setTimesInterval}
            loadingTime={loadingTime}
            assignInterval={assignInterval}
            unavailableHours={unavailableHours || {}}
          />
        </div>
      </Dialog>
    </div>
  );
});
