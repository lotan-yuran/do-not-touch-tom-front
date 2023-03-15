import { useState, useEffect, useImperativeHandle, forwardRef } from "react";

// Context
import { useMsal } from "../../../context/msalContext";
import { useCodes } from "../../../context/codesContext";

// Design component
import { Button } from "../../../stories/Button/Button";
import { Input } from "../../../stories/Input/Input";

// Style
import style from "./newAppointmentInfo.module.scss";
import { backgroundColor } from "../../../styles/colors";

// Hooks
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useAsyncThrowError } from "../../../hooks/useAsyncThrowError";

// SmartComponents
import { StationType } from "../../../smartComponents/StationType/StationType";
import { FormByOrderFor } from "../../../smartComponents/FormByOrderFor/FormByOrderFor";
import { ComplexDropList } from "../../../smartComponents/ComplexDropList/ComplexDropList";

// Services
import { getScheduleSettings, getAssignIntervalByStation } from "../../../services/newAppointmentService";

// util
import { isNullOrUndefinedOrEmpty } from "../../../utilities/general";

// Constants
import {
  titles,
  buttons,
  orderFor,
  propsDesignDropList,
  isThereValueNotValid,
  backgroundColorMobile
} from "../../../constants/newAppointment";
import { COMPONENT_IDS } from "../../../constants/componentIds";
import { getActiveAvailableStationsByComplex } from "../../../services/codesService";

const REASON_LENGTH = 50;

const getDefaultStationId = async (defaultOrganization, existStationId) => {
  if (existStationId) {
    return existStationId;
  }
  const { data } = await getActiveAvailableStationsByComplex(defaultOrganization.id);
  return data[0].id;
};

export default forwardRef(function NewAppointmentInfo({ setPropsButtonNext, ...props }, ref) {
  const { user } = useMsal();
  const { width } = useMediaQuery();
  const { throwError } = useAsyncThrowError("dialog");

  const [loadingNext, setLoadingNext] = useState(false);
  const [stationId, setStationId] = useState(props.stationId);
  const [complexId, setComplexId] = useState(props.complexId);
  const [orderForIndex, setOrderForIndex] = useState(props.orderForIndex || orderFor.me);
  const [reason, setReason] = useState(props.reason || "");
  const [userInfo, setUserInfo] = useState(props.userInfo || { id: user.id, fullName: "", phone: "" });
  const { organization } = useCodes();

  useEffect(() => {
    !props.stationId && organization && setStationId(getDefaultStationId(organization[0]));
    !props.complexId && organization && setComplexId(organization[0]?.Complexes[0]?.id);
  }, [organization]);

  useEffect(() => {
    const isDisabled =
      isThereValueNotValid(orderForIndex, userInfo) ||
      isNullOrUndefinedOrEmpty(complexId) ||
      isNullOrUndefinedOrEmpty(stationId);
    setPropsButtonNext({
      id: COMPONENT_IDS.CUSTOMER.BUTTONS.FIND_STATIONS,
      isDisabled,
      loading: loadingNext,
      textLabelLoading: "מחפשים זמנים פנויים...",
      textLabel:
        !isDisabled || isNullOrUndefinedOrEmpty(complexId) || isNullOrUndefinedOrEmpty(stationId)
          ? "מציאת עמדה פנויה"
          : orderForIndex === orderFor.me
          ? "יש למלא מספר טלפון"
          : "יש למלא את פרטי המוזמן"
    });
  }, [userInfo, orderForIndex, loadingNext, stationId, complexId]);

  const onChangeComplex = async id => {
    setStationId(null);
    setComplexId(id);
  };

  const onChangeStation = async id => {
    setStationId(id);
  };

  const onChangeReason = async event => {
    setReason(event.target.value);
  };

  const handleOrderForClick = i => {
    if (i !== orderForIndex) {
      if (i === orderFor.me) {
        setUserInfo({ id: user.id, fullName: "", phone: "" });
      } else {
        setUserInfo({ id: "", fullName: "", phone: "" });
      }
      setOrderForIndex(i);
    }
  };

  useImperativeHandle(ref, () => ({
    async onClickNext() {
      try {
        setLoadingNext(true);
        const [
          {
            data: { weekdaysActivityTime, maxMonthsFromNow }
          },
          { data: assignInterval }
        ] = await Promise.all([getScheduleSettings(complexId), getAssignIntervalByStation(stationId)]);
        setLoadingNext(false);
        return {
          userInfo,
          stationId,
          complexId,
          reason,
          orderForIndex,
          assignInterval,
          maxMonthsFromNow,
          weekdaysActivityTime
        };
      } catch (e) {
        setLoadingNext(false);
        throwError(e);
        throw e;
      }
    }
  }));

  return (
    <div className={style["page"]}>
      <ComplexDropList complexId={complexId} onChangeComplex={onChangeComplex} />
      <div className={style["title"]}>
        <p>
          <span>מהו סוג העמדה?</span>
        </p>
      </div>
      <StationType
        id={COMPONENT_IDS.CUSTOMER.DROPDOWNS.STATION_TYPE_MENU}
        complexId={complexId}
        isSendComplexId={true}
        onChange={onChangeStation}
        PropsSelect={propsDesignDropList}
      />
      <div className={style["title"]}>
        <p>
          <span>מהי מטרת ההזמנה?</span>
        </p>
      </div>
      <Input
        type="text"
        name="reason"
        value={reason}
        fullWidth={true}
        marginInput={"5px 25px"}
        onChange={onChangeReason}
        maxLength={{ length: REASON_LENGTH }}
        endAdornment={
          <div className={style["character-counter"]}>{`${reason.length}${`/${REASON_LENGTH}`}`}</div>
        }
        backgroundColor={backgroundColorMobile.normal}
      />
      <div className={style["title"]}>
        <p>
          <span>עבור מי ההזמנה?</span>
        </p>
      </div>
      <div className={style["button-group"]}>
        {buttons.map((button, i) => (
          <Button
            id={button.id}
            key={i}
            shape="full-square"
            size={width > 340 ? "medium" : width > 290 ? "small" : "x-small"}
            onClick={() => handleOrderForClick(i)}
            backgroundColor={orderForIndex === i ? backgroundColor.darkGreen : backgroundColor.brightGreen}
          >
            <div className={style["button-content"]}>
              {button.label}
              <br />
              <br />
              {button.image}
            </div>
          </Button>
        ))}
      </div>
      <div className={style["title"]}>
        <p>
          <span>{titles[orderForIndex]}</span>
        </p>
      </div>
      <FormByOrderFor
        fullWidth={true}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        orderForIndex={orderForIndex}
        backgroundColorObj={backgroundColorMobile}
      />
    </div>
  );
});
