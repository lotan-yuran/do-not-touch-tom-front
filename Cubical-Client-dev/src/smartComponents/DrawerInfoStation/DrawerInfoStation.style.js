import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  datePicker: { marginTop: 26 },
  button: {
    position: "sticky",
    zIndex: 1
  },
  switch: {
    position: "sticky",
    zIndex: 1
  },
  dates: { display: "flex", flexDirection: "column" },
  disabledData: { display: "flex" }
});

export default useStyles;
