import { styled, Typography } from "@material-ui/core";
import style from "./ComplexInfo.module.scss";
import { Close } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { days } from "../../../constants/general";

export const ComplexInfo = ({ setOpen, complexData, setComplexDataAfterUpdate }) => {
  const weeklySchedule = Object.values(complexData?.schedule).map((day, key) => {
    return (
      <Typography className={style["days"]} key={"day" + key}>
        <div className={style["day-name"]}>{` ${days[key].day}: `}</div>
        <div className={style["day-hours"]}>{` ${day.startHour} - ${day.endHour}`}</div>
      </Typography>
    );
  });

  return (
    <>
      <div className={style["title-div"]}>
        <Typography className={style.title}>{complexData?.name}</Typography>
        <div className={style["line"]}>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </div>
      </div>

      <br />
      <Typography className={style["info-name-and-value"]}>
        <u className={style["info-name"]}>טלפון:</u>
        {` ${complexData?.phone}`}
      </Typography>
      <Typography className={style["info-name-and-value"]}>
        <u className={style["info-name"]}>Waze:</u>
        {`${complexData?.waze_link} `}
      </Typography>

      <Typography className={style["info-name-and-value"]}>
        <u className={style["schedule-title"]}>שעות פעילות:</u>
        <div className={style["schedule"]}>{weeklySchedule}</div>
      </Typography>
    </>
  );
};
