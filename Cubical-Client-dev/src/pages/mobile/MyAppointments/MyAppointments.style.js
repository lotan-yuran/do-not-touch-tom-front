import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(({ palette }) => ({
  myAppointmentsTitle: {
    fontSize: "23px !important",
    fontWeight: "700 !important",
    color: "#555555",
    borderWidth: "0px",
    fontStyle: "normal",
    paddingRight: "13px",
    backgroundColor: "white"
  },
  title: {
    margin: "calc(max(1.5vh, 6px)) 0 0 0"
  },
  noAppointments: {
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },

  prevOrders: {
    display: "flex"
  },

  showAll: {
    margin: "15px 20px",
    color: palette.text.main,
    textDecoration: "underline"
  },

  " @media (min-width: 768px)": {
    ".my-appointments": {
      padding: "1.5% 5% 1.5% 5%"
    }
  },

  "@media (min-width: 992px)": {
    ".my-appointments": {
      padding: "0% 15% 3% 15%"
    }
  }
}));

export default useStyles;
