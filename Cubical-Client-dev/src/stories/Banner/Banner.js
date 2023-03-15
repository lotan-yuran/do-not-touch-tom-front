import { useState, useRef } from "react";
import classNames from "clsx";

// Style
import styles from "./banner.module.scss";

// Design component
import { Button } from "../Button/Button";

// Material-ui
import { Close } from "@material-ui/icons";
import { Typography, Container } from "@material-ui/core";

export const Banner = ({ open, title, massage, labelButton, PropsButton, onOK, onClose }) => {
  const [xOffset, setXOffset] = useState(0);
  const [active, setActive] = useState(false);
  const [currentX, setCurrentX] = useState(null);
  const [initialX, setInitialX] = useState(null);

  const dragItemRef = useRef(null);
  const el = dragItemRef.current;

  function dragStart(e) {
    el.style.transition = "transform 0s linear";
    if (e.type === "touchstart") {
      setInitialX(e.touches[0].clientX - xOffset);
    } else {
      setInitialX(e.clientX - xOffset);
    }

    setActive(true);
  }

  function dragEnd() {
    if (Math.abs(currentX) > 100) {
      el.style.transition = "transform 0.50s linear";
      el.style.transform = `translate3d(${currentX < 0 ? "-" : ""}400px, 0px, 0)`;
    } else {
      el.style.transition = "transform 0.50s linear";
      el.style.transform = `translate3d(0px, 0px, 0)`;
      setXOffset(0);
      setCurrentX(0);
    }

    setInitialX(currentX);
    setActive(false);
  }

  function drag(e) {
    if (active) {
      e.preventDefault();

      if (e.type === "touchmove") {
        setCurrentX(e.touches[0].clientX - initialX);
      } else {
        setCurrentX(e.clientX - initialX);
      }

      setXOffset(currentX);
      el.style.transform = `translate3d(${currentX}px, 0px, 0)`;
    }
  }

  return (
    <div
      ref={dragItemRef}
      onTouchMove={drag}
      onTouchEnd={dragEnd}
      onTouchStart={dragStart}
      className={styles["wrapper"]}
    >
      <footer className={classNames(styles["footer"], !open && styles["not-display"])}>
        <div className={styles["button"]}>
          <Button onClick={onOK} {...PropsButton}>
            {labelButton}
          </Button>
        </div>
        <Container maxWidth="sm">
          <Typography variant="body2" classes={{ root: styles["title"] }}>
            {title}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {massage}
          </Typography>
        </Container>
        <div className={styles["button"]}>
          <Button onClick={onClose} size="xx-small" backgroundColor="rgba(0,0,0,0)">
            <Close className={styles["close-button"]} />
          </Button>
        </div>
      </footer>
    </div>
  );
};
