import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

// Context
import { useMsal } from "../../../context/msalContext";

// Style
import style from "./newAppointmentGuidelines.module.scss";

// Hooks
import { useAsyncThrowError } from "../../../hooks/useAsyncThrowError";

// Services
import {
  createAppointment,
  getScheduleSettings,
  getAssignIntervalByStation
} from "../../../services/newAppointmentService";

// Constants
import { COMPONENT_IDS } from "../../../constants/componentIds";
import { complexGuidelines } from "../../../constants/complexGuidelines";

export default forwardRef(function NewAppointmentGuidelines(
  { setPropsButtonNext, datetimeList, stationId, complexId, reason, userInfo, orderForIndex },
  ref
) {
  const [loadingNext, setLoadingNext] = useState(false);
  const [loadingBack, setLoadingBack] = useState(false);

  const { user } = useMsal();
  const { throwError } = useAsyncThrowError("dialog");

  useEffect(() => {
    setPropsButtonNext({
      id: COMPONENT_IDS.CUSTOMER.BUTTONS.AGREE_TO_GUIDLINES,
      isDisabled: false,
      loading: loadingNext,
      textLabelLoading: "מאשרים לך את ההזמנה...",
      textLabel: "קראתי והבנתי"
    });
  }, [loadingNext]);

  useEffect(() => {
    setPropsButtonNext({
      id: COMPONENT_IDS.CUSTOMER.BUTTONS.AGREE_TO_GUIDLINES,
      isDisabled: false,
      loading: loadingBack,
      textLabelLoading: "מחפשים זמנים פנויים...",
      textLabel: "קראתי והבנתי"
    });
  }, [loadingBack]);

  useImperativeHandle(ref, () => ({
    async onClickNext() {
      try {
        setLoadingNext(true);
        const { data } = await createAppointment(
          user.id,
          datetimeList,
          stationId,
          complexId,
          userInfo,
          reason
        );
        setLoadingNext(false);
        return data;
      } catch (e) {
        setLoadingNext(false);
        throwError(e);
        throw e;
      }
    },

    async onClickBack() {
      try {
        setLoadingBack(true);
        const [
          {
            data: { weekdaysActivityTime, maxMonthsFromNow }
          },
          { data: assignInterval }
        ] = await Promise.all([getScheduleSettings(complexId), getAssignIntervalByStation(stationId)]);
        setLoadingBack(false);
        return {
          userInfo,
          stationId,
          complexId,
          reason,
          assignInterval,
          weekdaysActivityTime,
          maxMonthsFromNow,
          orderForIndex
        };
      } catch (e) {
        setLoadingBack(false);
        throwError(e);
        throw e;
      }
    }
  }));

  return (
    <>
      <div className={style["guidlines"]}>
        {complexGuidelines(complexId)}
        {/* not show entryPermitsGuidelines in order to be generic 17/6/21 */}
        {/* {entryPermitsGuidelines(user.serviceType)} */}
      </div>
    </>
  );
});
