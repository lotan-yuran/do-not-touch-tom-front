import { useEffect, useState, useCallback, useRef } from "react";
import moment from "moment";

// Material-ui
import { Paper, Grid, Divider } from "@material-ui/core";
import { Phone, PersonOutline, Face, InfoOutlined } from "@material-ui/icons";
import { ViewState, GroupingState, IntegratedGrouping } from "@devexpress/dx-react-scheduler";
import {
  DayView,
  Scheduler,
  Resources,
  Appointments,
  GroupingPanel,
  AppointmentTooltip
} from "@devexpress/dx-react-scheduler-material-ui";

// Context
import { useMsal } from "../../context/msalContext";

// Styles
import style from "./calendar.module.scss";
import { colorTypeStation } from "../../styles/colors";

// Hooks
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useAsyncThrowError } from "../../hooks/useAsyncThrowError";

// Smart components
import { Toolbar } from "../Toolbar/Toolbar";
import { DrawerInfoStation } from "../DrawerInfoStation/DrawerInfoStation";
import { CreateAppointmentAdmin } from "../CreateAppointmentAdmin/CreateAppointmentAdmin";
import { CalenderCell } from "./CalenderCell/CalenderCell";

// Services
import {
  cancelAppointmentAdmin,
  getAllActiveStationsAdmin,
  getActiveAppointmentsAdmin,
  getDisableStationsTimes
} from "../../services/appointmentManagementService";

// Design component
import { Button } from "../../stories/Button/Button";

// Utilities
import { isFutureDate } from "../../utilities/date";

//context
import { useCodes } from "../../context/codesContext";

export const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [dataStations, setDataStations] = useState(null);
  const [searchMessage, setSearchMessage] = useState(null);
  const [visibleTooltip, setVisibleTooltip] = useState(false);
  const [dataAppointments, setDataAppointments] = useState([]);
  const [dataStationsObjFilter, setDataStationsObjFilter] = useState(null);
  const [disableStationsTimesState, setDisableStationsTimesState] = useState(null);

  const { complexes, currentComplex, newDisabled, setNewDisabled } = useCodes();

  const { user } = useMsal();
  const { height } = useMediaQuery();
  const createAppointmentRef = useRef();
  const { throwError } = useAsyncThrowError("dialog");
  const CELL_DURATION = 30;
  useEffect(() => {
    complexes &&
      (async () => {
        try {
          setLoading(true);
          const [{ data: stations }, { data: appointments }, { data: disableStationsTimes }] =
            await Promise.all([
              getAllActiveStationsAdmin(user.id, complexes[currentComplex]?.id),
              getActiveAppointmentsAdmin(date, user.id, complexes[currentComplex]?.id),
              getDisableStationsTimes({ date, complexId: complexes[currentComplex]?.id })
            ]);

          const objStations = {
            default: {}
          };

          stations.forEach(station => {
            const objStation = {
              ...station,
              text: station["StationType.name"],
              color: colorTypeStation[station.station_type_id]
            };
            objStations[station.station_type_id] = [
              ...(objStations[station.station_type_id] || []),
              { ...objStation }
            ];
            objStations.default[station.id] = {
              ...objStation,
              fieldNameOnObjFilter: station.station_type_id,
              indexOnObjFilter: objStations[station.station_type_id]?.length - 1 ?? 0
            };
          });

          setDisableStationsTimesState(disableStationsTimes);
          setDataStations(Object.values(objStations.default));
          setDataStationsObjFilter(objStations);

          setDataAppointments(
            appointments.map(appointment => ({
              ...appointment,
              title: getDataAppointmentTitle(appointment)
            }))
          );
        } catch (e) {
          throwError(e);
        }
      })();
  }, [currentComplex, complexes, newDisabled]);

  useEffect(() => {
    setLoading(false);
  }, [dataStations]);

  useEffect(() => {
    if (dataStations) {
      getActiveAppointments();
      getStationDisables();
    }
  }, [date, dataStationsObjFilter]);

  const getStationDisables = async () => {
    try {
      console.log("all params:", date, complexes[currentComplex]?.id);
      const { data } = await getDisableStationsTimes({ date, complexId: complexes[currentComplex]?.id });

      setDisableStationsTimesState(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      throwError(e);
    }
  };

  const getActiveAppointments = async () => {
    try {
      const { data } = await getActiveAppointmentsAdmin(date, user.id, complexes[currentComplex]?.id);

      setDataAppointments(
        data.map(appointment => ({
          ...appointment,
          title: getDataAppointmentTitle(appointment)
        }))
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
      throwError(e);
    }
  };

  const getDataAppointmentTitle = appointment => {
    if (appointment.userId === appointment["userInfo"].id) {
      return `${appointment.userInfo.fullName}`;
    } else {
      return `${appointment["User.firstName"]} ${appointment["User.lastName"]} עבור ${appointment.userInfo.fullName}`;
    }
  };

  const DayScaleCell = useCallback(
    ({ group, ...props }) => {
      if (group && dataStationsObjFilter?.default[group.id]) {
        const { text, id } = group;
        return (
          <td className={style["day-scale-cell"]}>
            <DrawerInfoStation
              setNewDisabled={setNewDisabled}
              nameStation={dataStations?.find(da => da.id == id)?.name}
              idStation={id}
              typStation={text}
              setLoading={setLoading}
              setStationsFilter={setDataStationsObjFilter}
              infoStation={dataStationsObjFilter.default[id]}
            />
          </td>
        );
      }
      return <GroupingPanel.Cell group={group} {...props} />;
    },
    [dataStationsObjFilter]
  );

  const handleClickTimeTableCell = ({ station_type_id: stationTypeid, id, startDate }) => {
    createAppointmentRef.current.openDialogByClickCalendar(stationTypeid, id, startDate);
  };

  const TimeTableCell = useCallback(
    ({ groupingInfo, ...props }) => {
      if (groupingInfo && dataStationsObjFilter?.default[groupingInfo[0].id]) {
        const { id } = groupingInfo[0];
        const startMeetingTime = moment(props.startDate).format();
        return (
          <CalenderCell
            key={`cell-${id}-${startMeetingTime}`}
            id={id}
            disableStationsTimesState={disableStationsTimesState}
            interval={CELL_DURATION}
            startMeetingTime={startMeetingTime}
          />
        );
      }
      return <DayView.TimeTableCell {...props} />;
    },
    [dataStationsObjFilter, disableStationsTimesState]
  );

  const handleCancelAppointment = async appointmentId => {
    try {
      toggleVisibility();
      setLoading(true);
      const { data } = await cancelAppointmentAdmin(appointmentId);
      data && setDataAppointments(prev => prev.filter(item => item.id !== appointmentId));

      setLoading(false);
    } catch (err) {
      setLoading(false);
      throwError(err);
    }
  };

  const toggleVisibility = () => {
    setVisibleTooltip(!visibleTooltip);
  };

  const Content = ({ appointmentData, ...restProps }) => (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
      <Grid container alignItems="center" className={style.gridContainer}>
        {appointmentData.reason && (
          <Grid item xs={12} className={style.textContainer}>
            <InfoOutlined className={style.icon} />
            <span className={style.text}>{appointmentData.reason}</span>
          </Grid>
        )}

        {appointmentData.userId !== appointmentData.userInfo.id && (
          <Grid item xs={6}>
            <div className={style.textContainer}>
              <Face className={style.icon} />
              <span className={style.text}>
                {appointmentData["User.firstName"]} {appointmentData["User.lastName"]}
              </span>
            </div>
            <div className={style.textContainer}>
              <PersonOutline className={style.icon} />
              <span className={style.text}>{appointmentData.userId}</span>
            </div>
            <div className={style.textContainer}>
              <Phone className={style.icon} />
              <span className={style.text}>{appointmentData["User.phone"]}</span>
            </div>
          </Grid>
        )}

        <Grid item xs={6}>
          {appointmentData.userId !== appointmentData.userInfo.id && (
            <div className={style.textContainer}>
              <Face className={style.icon} />
              <span className={style.text}>{appointmentData.userInfo.fullName}</span>
            </div>
          )}
          <div className={style.textContainer}>
            <PersonOutline className={style.icon} />
            <span className={style.text}>{appointmentData.userInfo.id}</span>
          </div>
          <div className={style.textContainer}>
            <Phone className={style.icon} />
            <span className={style.text}>{appointmentData.userInfo.phone}</span>
          </div>
        </Grid>
      </Grid>
      {isFutureDate(appointmentData.startDate) && (
        <>
          <Divider className={style.divider} />
          <Button
            outline={true}
            size={"large"}
            shape="square"
            backgroundColor={"rgba(0, 0, 0, 0)"}
            onClick={() => handleCancelAppointment(appointmentData["id"])}
            style={{ width: "calc(100% - 40px)", margin: "10px 20px 0 0" }}
          >
            ביטול הזמנה
          </Button>
        </>
      )}
    </AppointmentTooltip.Content>
  );

  return (
    <Paper>
      <Toolbar
        date={date}
        loading={loading}
        setDate={setDate}
        setDataStations={setDataStations}
        dataStationsObjFilter={dataStationsObjFilter}
        setSearchMessage={setSearchMessage}
      />
      {dataStationsObjFilter ? (
        dataStations?.length > 0 ? (
          <Scheduler data={dataAppointments} height={height - 100} locale={"he-IL"}>
            <ViewState onCurrentDateChange={setDate} currentDate={date} />
            <GroupingState grouping={[{ resourceName: "station_id" }]} />
            <DayView
              startDayHour={7}
              endDayHour={23}
              cellDuration={CELL_DURATION}
              dayScaleCellComponent={() => null}
              timeTableCellComponent={TimeTableCell}
            />
            <Appointments />
            <Resources
              data={[{ fieldName: "station_id", instances: dataStations }]}
              mainResourceName="station_id"
            />
            <IntegratedGrouping />
            <GroupingPanel cellComponent={DayScaleCell} />
            <AppointmentTooltip
              contentComponent={Content}
              visible={visibleTooltip}
              onVisibilityChange={toggleVisibility}
            />
            <CreateAppointmentAdmin ref={createAppointmentRef} refreshAppointments={getActiveAppointments} />
          </Scheduler>
        ) : (
          <div className={style["not-found"]} style={{ height: height - 100 }}>
            לא נמצאה עמדה {searchMessage}
          </div>
        )
      ) : null}
    </Paper>
  );
};
