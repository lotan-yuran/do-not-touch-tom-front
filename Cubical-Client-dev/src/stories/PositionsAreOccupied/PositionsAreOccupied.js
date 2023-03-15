// Style
import styles from "./positionsAreOccupied.module.scss";

// Icons
import { PositionsAreOccupiedImg } from "../../icons/PositionsAreOccupiedImg/PositionsAreOccupiedImg";

export const PositionsAreOccupied = () => (
  <div className={styles["positions-are-occupied"]}>
    <div className={styles["positions-are-occupied-query"]}>
      <p>
        <span>לא נמצאה שעה פנויה לביצוע הזמנה בתאריך זה</span>
      </p>
    </div>
    <PositionsAreOccupiedImg />
  </div>
);
