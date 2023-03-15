// Style
import styles from "./timePicker.module.scss";

// Constants
import { COMPONENT_IDS } from "../../constants/componentIds";
import { propsDesignButton } from "../../constants/newAppointment";

// Design component
import { GridButtons } from "../../stories/GridButtons/GridButtons";

// Img SVG
import { PositionsAreOccupiedImg } from "../../imgSvg/PositionsAreOccupiedImg/PositionsAreOccupiedImg";

// Utils
import { isTimeComparedSmallCurrentTime, getLastAppointmentTime } from "../../utilities/date";

const getUserMsg = ({ isMaxExceeded, maxNum, endHour }) => {
  if (isMaxExceeded) {
    return {
      title: (
        <span>
          לא ניתן לבצע יותר מ-{maxNum} הזמנות ביום. אפשר להזמין עמדה ליום אחר או לבטל את אחת ההזמנות של יום זה
        </span>
      )
    };
  } else if (isTimeComparedSmallCurrentTime(endHour)) {
    return { title: <span>עבר זמן פעילות</span>, img: <PositionsAreOccupiedImg /> };
  } else {
    // else
    return {
      title: <span>לא נמצאה שעה פנויה לביצוע הזמנה בתאריך זה</span>,
      img: <PositionsAreOccupiedImg />
    };
  }
};

const isAllTimesAreBusy = (busyTimes, potentialTimes) => {
  if (!busyTimes) return false;
  if (!potentialTimes) return true;

  const busyArray = Array.from(busyTimes);
  const potentialArray = Array.from(potentialTimes.keys());

  return potentialArray.every(potentialTime => busyArray.includes(potentialTime));
};

export const TimePicker = ({
  endHour,
  onClick,
  timeSelectionMap,
  loadingTime,
  intervalTime,
  maxExceeded: { isMaxExceeded, maxNum },
  arrayBusyHoursState
}) => {
  const userMsg = getUserMsg({
    isMaxExceeded,
    maxNum,
    endHour: getLastAppointmentTime(endHour, intervalTime)
  });
  return (
    <div className={styles["time-picker"]} id={COMPONENT_IDS.CUSTOMER.INPUTS.ORDER_TIME}>
      {(!isMaxExceeded && !isAllTimesAreBusy(arrayBusyHoursState, timeSelectionMap)) || loadingTime ? (
        <div>
          <div className={styles["empty-positions-query"]}>
            <p>
              <span>באיזו שעה?</span>
            </p>
          </div>
          <GridButtons
            onClick={onClick}
            {...propsDesignButton}
            lengthLabelSkeleton={4}
            isDisplaySkeleton={loadingTime}
            arrayDisabledItems={arrayBusyHoursState}
            itemSelectionMap={timeSelectionMap}
          />
          {!loadingTime && (
            <div>
              <p>
                <span>{`אורך תור הוא למשך ${intervalTime} דקות, במידה ויש צורך ביותר, ניתן לקבוע תור נוסף`}</span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className={styles["occupied-positions"]}>
          <div className={styles["occupied-positions-query"]}>
            <p>{userMsg.title}</p>
          </div>
          {userMsg.img}
        </div>
      )}
    </div>
  );
};
