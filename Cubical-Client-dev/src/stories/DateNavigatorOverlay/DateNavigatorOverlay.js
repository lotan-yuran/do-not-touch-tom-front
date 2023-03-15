import { useState } from "react";
import { string, func, oneOfType, instanceOf, oneOf } from "prop-types";

// Utilities
import heLocale from "date-fns/locale/he";
import DateFnsUtils from "@date-io/date-fns";

// Design component
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";

// Material-ui
import { blue } from "@material-ui/core/colors";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme, Popover } from "@material-ui/core";
import { Calendar, MuiPickersUtilsProvider } from "@material-ui/pickers";

const defaultMaterialTheme = createTheme({
  palette: {
    primary: blue
  },
  "& .MuiPickersCalendar-week-516": {
    display: "none"
  },
  direction: "rtl"
});

const typeComponentDisplayObj = {
  Button: props => <Button {...props} />,
  Input: ({ children, ...props }) => <Input value={children} readOnly={true} {...props} />
};

export const DateNavigatorOverlay = ({
  date,
  label,
  onChange,
  PropsCalendar,
  PropsComponent,
  typeComponentDisplay,
  weekdaysActivityTime
}) => {
  const [anchorEl, setAnchorEl] = useState(false);

  const isOpen = Boolean(anchorEl);

  const disableWeekends = date => {
    if (weekdaysActivityTime) {
      return !weekdaysActivityTime.hasOwnProperty(date.getDay());
    }
    return false;
  };

  const handleChangeDate = date => {
    onChange(date);
    setAnchorEl(null);
  };

  const TypeComponentDisplay = typeComponentDisplayObj[typeComponentDisplay];

  return (
    <div>
      <TypeComponentDisplay {...PropsComponent} onClick={e => setAnchorEl(e.currentTarget)}>
        {label ||
          (date && Intl.DateTimeFormat(navigator.language, { dateStyle: "long" }).format(new Date(date)))}
      </TypeComponentDisplay>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        onClose={() => setAnchorEl(null)}
      >
        <ThemeProvider theme={defaultMaterialTheme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale}>
            <Calendar
              {...PropsCalendar}
              date={date || new Date()}
              onChange={handleChangeDate}
              shouldDisableDate={disableWeekends}
            />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </Popover>
    </div>
  );
};

DateNavigatorOverlay.propTypes = {
  labelButton: string,
  onChange: func.isRequired,
  PropsCalendar: "All options props of calender",
  typeComponentDisplay: oneOf(["Button", "Input"]),
  PropsComponent: "All options props of button or input",
  date: oneOfType([instanceOf(Date), string]).isRequired
};
