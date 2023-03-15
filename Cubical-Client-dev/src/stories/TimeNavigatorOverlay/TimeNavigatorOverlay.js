import { useState } from "react";
import { string, func, oneOfType, instanceOf } from "prop-types";

// Utilities
import heLocale from "date-fns/locale/he";
import DateFnsUtils from "@date-io/date-fns";

// Design component
import { Button } from "../Button/Button";

// Styles
import style from "./timeNavigatorOverlay.module.scss";

// Material-ui
import { blue } from "@material-ui/core/colors";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme, Popover } from "@material-ui/core";
import { ClockView, MuiPickersUtilsProvider } from "@material-ui/pickers";

const defaultMaterialTheme = createTheme({
  palette: {
    primary: blue
  },
  "& .MuiPickersCalendar-week-516": {
    display: "none"
  },
  direction: "rtl"
});

export const TimeNavigatorOverlay = ({ labelButton, date, onChange, PropsButton }) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const [dateState, setDateState] = useState(date);
  const [typeClock, setTypeClock] = useState(null);

  const isOpen = Boolean(anchorEl);

  const handleOpen = e => {
    setTypeClock("hours");
    setAnchorEl(e.currentTarget);
  };

  const handleChangeHour = newDate => {
    setDateState(newDate);
    onChange(newDate);
    setTypeClock("minutes");
  };

  const handleChangeMinute = newDate => {
    setDateState(newDate);
    onChange(newDate);
  };

  return (
    <div>
      <Button {...PropsButton} onClick={e => handleOpen(e)}>
        {labelButton ||
          Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "numeric" }).format(
            new Date(dateState)
          )}
      </Button>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <div className={style["buttons-time"]} style={{ backgroundColor: "#2196f3", color: "#fff" }}>
          <button
            style={{ color: "#fff" }}
            className={style["button-time"]}
            onClick={() => setTypeClock("minutes")}
          >
            {Intl.DateTimeFormat(navigator.language, { minute: "numeric" }).format(new Date(dateState))}
          </button>
          <span>:</span>
          <button
            style={{ color: "#fff" }}
            className={style["button-time"]}
            onClick={() => setTypeClock("hours")}
          >
            {Intl.DateTimeFormat(navigator.language, { hour: "numeric" }).format(new Date(dateState))}
          </button>
        </div>
        <ThemeProvider theme={defaultMaterialTheme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale}>
            <ClockView
              ampm={false}
              date={dateState}
              type={typeClock}
              onHourChange={handleChangeHour}
              onMinutesChange={handleChangeMinute}
            />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </Popover>
    </div>
  );
};

Button.propTypes = {
  onChange: func,
  labelButton: string.isRequired,
  PropsButton: "all options props of button",
  date: oneOfType([instanceOf(Date), string]).isRequired
};
