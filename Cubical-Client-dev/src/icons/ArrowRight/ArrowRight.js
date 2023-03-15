import style from "./arrowRight.module.scss";

export const ArrowRight = () => (
  <svg
  focusable="false"
  aria-hidden="true"
  viewBox="0 0 24 24"
  role="presentation"
  className={style["mui-svg-icon"]}
  >
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
    <path fill="none" d="M0 0h24v24H0V0z"></path>
  </svg>
);
