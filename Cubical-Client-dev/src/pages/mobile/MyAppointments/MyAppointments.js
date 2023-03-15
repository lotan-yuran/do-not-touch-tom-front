import clsx from "clsx";
import history from "../../../router/history";
import useStyles from "./MyAppointments.style";
import { Typography } from "@material-ui/core";
import { useState, useEffect, useMemo } from "react";
import { useMsal } from "../../../context/msalContext";
import { isFutureDate } from "../../../utilities/date";
import { Button } from "../../../stories/Button/Button";
import { backgroundColor } from "../../../styles/colors";
import { COMPONENT_IDS } from "../../../constants/componentIds";
import { useAsyncThrowError } from "../../../hooks/useAsyncThrowError";
import { getUserAppointments } from "../../../services/appointmentService";
import { Appointments } from "../../../smartComponents/Appointments/Appointments";
import { NoAppointmentsImg } from "../../../imgSvg/NoAppointmentsImg/NoAppointmentsImg";
import { FixedBottomButton } from "../../../smartComponents/FixedBottomButton/FixedBottomButton";

const filterAppointments = (appointments, showAll) => {
  const pastAppointments = appointments?.filter(item => {
    return !isFutureDate(item?.start_datetime);
  });

  if (pastAppointments?.length === 0) {
    return [];
  }

  return showAll ? pastAppointments : [pastAppointments[0]];
};

export default function MyAppointments() {
  const classes = useStyles();
  const [appointments, setAppointments] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const pastAppointments = useMemo(() => filterAppointments(appointments, showAll), [appointments, showAll]);
  const [loading, setLoading] = useState(true);

  const { user } = useMsal();
  const { throwError } = useAsyncThrowError("dialog");

  useEffect(() => {
    (async () => {
      if (user?.id) {
        try {
          const { data } = await getUserAppointments(user.id);
          setAppointments(data);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          throwError(err);
        }
      }
    })();
  }, [user]);

  const onClick = () => {
    history.push("/new-appointment");
  };

  const toggleShowAll = () => {
    setShowAll(prev => !prev);
  };

  return (
    <div className={classes.myAppointments}>
      <Typography classes={{ root: clsx(classes.title, classes.myAppointmentsTitle) }}>
        ההזמנות שלי
      </Typography>

      {loading || appointments?.length > 0 ? (
        <div>
          {
            <Appointments
              loading={loading}
              appointments={appointments}
              // appointments={appointments.filter(item => isFutureDate(item.start_datetime))}
              setAppointments={setAppointments}
              canBeCanceled={true}
            />
          }

          {/* <div className={classes.prevOrders}>
            <Typography classes={{ root: clsx(classes.title, classes.myAppointmentsTitle) }}>
              הזמנות קודמות
            </Typography>

            <Typography onClick={toggleShowAll} classes={{ root: classes.showAll }}>
              הצג הכל
            </Typography>
          </div>
          {pastAppointments.length > 0 && (
            <Appointments
              loading={loading}
              appointments={pastAppointments}
              setAppointments={setAppointments}
              canBeCanceled={false}
            />
          )} */}
          <FixedBottomButton
            id={COMPONENT_IDS.CUSTOMER.BUTTONS.NEW_ORDER}
            isDisabled={loading}
            onClick={onClick}
            textLabel={" הזמנה חדשה"}
          />
        </div>
      ) : (
        <div className={classes.noAppointments}>
          <NoAppointmentsImg />
          <p>אין לך הזמנות כרגע, רוצה להזמין עמדה?</p>
          <br />
          <Button onClick={onClick} backgroundColor={backgroundColor.darkGreen} size={"large"}>
            הזמנת עמדה
          </Button>
        </div>
      )}
    </div>
  );
}
