import style from "./arrowLeft.module.scss";

export const ArrowLeft = () => (
  <svg
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    role="presentation"
    className={style["mui-svg-icon"]}
  >
    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path>
    <path fill="none" d="M0 0h24v24H0V0z"></path>
  </svg>
);
