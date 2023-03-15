import classNames from "clsx";
import { useState } from "react";
import { Card } from "../../stories/Card/Card";
import styles from "./appointments.module.scss";
import { useMsal } from "../../context/msalContext";
import { Dialog } from "../../stories/Dialog/Dialog";
import { Button } from "../../stories/Button/Button";
import { backgroundColor } from "../../styles/colors";
import { COMPONENT_IDS } from "../../constants/componentIds";
import { propsDesignDialog } from "../../constants/appointments";
import { weekdaysShort, dateFormat } from "../../constants/date";
import { useAsyncThrowError } from "../../hooks/useAsyncThrowError";
import { getDateWithFormat, getHourSpan } from "../../utilities/date";
import { cancelAppointmentUser } from "../../services/appointmentService";

export const Appointments = ({ loading, appointments, setAppointments, canBeCanceled }) => {
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { user } = useMsal();
  const { throwError } = useAsyncThrowError("dialog");

  const handleClick = appointment => {
    setOpen(true);
    setSelectedAppointment(appointment);
  };

  const handleCancelAppointment = async () => {
    handleCancelDialog();
    try {
      const { data } = await cancelAppointmentUser(selectedAppointment.id, user.id);
      data &&
        setTimeout(() => {
          setAppointments(prev => prev.filter(item => item.id !== selectedAppointment.id));
        }, 200);
    } catch (err) {
      throwError(err);
    }
  };

  const handleCancelDialog = () => {
    setOpen(false);
    setSelectedAppointment(null);
  };

  const getDate = appointment => {
    return getDateWithFormat(appointment.start_datetime, dateFormat.DATE_DOTS);
  };

  const getCardTitle = appointment => {
    if (appointment["Station.name"]) {
      return ` - ${appointment["Station.name"]}`;
    } else {
      return `מספר ${appointment?.station_id}`;
    }
  };

  const card = appointment => {
    // TODO : REMOVE IF 1>2
    if (canBeCanceled && 1 > 2) {
      return (
        <div className={styles["grid-container"]}>
          <div className={styles["grid-item"]}>{cardContent(appointment)}</div>
          <div className={classNames(styles["grid-item"], styles["vl"], styles["centered"])} />
          <div className={classNames(styles["grid-item"], styles["centered"])}>
            המועד לא מתאים?
            <br />
            <Button
              id={COMPONENT_IDS.CUSTOMER.BUTTONS.CANCEL_ORDER}
              onClick={() => {
                handleClick(appointment);
              }}
              outline={false}
              color={backgroundColor.darkGreen}
            >
              ביטול הזמנה
            </Button>
          </div>
        </div>
      );
    } else {
      return cardContent(appointment);
    }
  };

  const cardContent = appointment => {
    return (
      <>
        <div className={styles["card-title"]}>
          {appointment["Station.StationType.name"]} {getCardTitle(appointment)}
        </div>
        <div>
          מתחם {appointment["Station.Complex.name"]} <br />
        </div>
        {/* todo : remove comment*/}
        {/* {user.id !== appointment["user_info"].id && (
          <div>
            עבור {appointment["user_info"].fullName} <br />
          </div>
        )} */}
        יום {weekdaysShort[new Date(appointment["start_datetime"]).getDay()]} {getDate(appointment)}
        <br />
        {getHourSpan(appointment)}
      </>
    );
  };

  return (
    <>
      <div className={styles["appointments-container"]}>
        {loading
          ? [...Array(8).keys()].map(i => (
              <Card key={i} outline={true} margin={"15px 0px"} padding={"10px 15px"} minHeight={77}>
                <div className={styles["grid-container"]}>
                  <div className={styles["grid-item"]}>
                    <div className={styles["card-skeleton"]} style={{ width: "125px" }} />
                    <div className={styles["card-skeleton"]} style={{ width: "120px" }} />
                    <div className={styles["card-skeleton"]} style={{ width: "90px" }} />
                  </div>
                </div>
              </Card>
            ))
          : appointments.map(appointment => (
              <Card key={appointment.id} outline={true} margin={"15px 0px"} padding={"10px 15px"}>
                {card(appointment)}
              </Card>
            ))}
      </div>
      {selectedAppointment && (
        <Dialog
          open={open}
          onOk={handleCancelAppointment}
          onCancel={handleCancelDialog}
          title={"לבטל את ההזמנה?"}
          {...propsDesignDialog}
        >
          ביטול ההזמנה לתאריך {getDate(selectedAppointment)} בין השעות {getHourSpan(selectedAppointment)}{" "}
          תאפשר לאנשים אחרים לשמור את העמדה במקומך
        </Dialog>
      )}
    </>
  );
};
