import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() => ({
  "@keyframes animation": {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  root: {
    zIndex: 100,
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0
  },
  logo: {
    width: "200px !important",
    height: "100px !important",
    animation: "$animation 3s infinite",
    fill: "none"
  }
}));
