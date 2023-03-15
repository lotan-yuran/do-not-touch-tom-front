import classNames from "clsx";

// Style
import style from "./loader.module.scss";

// Material-ui
import { CircularProgress } from "@material-ui/core";

export const Loader = ({ size }) => (
    <CircularProgress className={classNames(style["progress"])} size={size} />
);
