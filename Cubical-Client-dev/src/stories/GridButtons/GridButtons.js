import { number, string, arrayOf, oneOfType, func, bool, oneOf } from "prop-types";

// Style
import styles from "./gridButtons.module.scss";

// Design component
import { Button } from "../Button/Button";
import { ButtonSkeleton } from "../ButtonSkeleton/ButtonSkeleton";
export const GridButtons = ({
  size = "medium",
  onClick,
  itemSelectionMap,
  backgroundColor,
  isDisplaySkeleton,
  arrayDisabledItems,
  lengthLabelSkeleton,
  backgroundColorClicked,
  ...props
}) => (
  <div className={styles["grid"]}>
    <div className={styles["grid-buttons"]}>
      {itemSelectionMap?.size &&
        Array.from(itemSelectionMap?.entries()).map(([item, isSelected], i) => (
          <div key={i} className={styles["grid-button"]}>
            {!isDisplaySkeleton ? (
              <Button
                {...props}
                onClick={() => onClick(item)}
                disabled={new Set(arrayDisabledItems).has(item)}
                backgroundColor={isSelected ? backgroundColorClicked : backgroundColor}
              >
                {item}
              </Button>
            ) : (
              <ButtonSkeleton lengthLabel={lengthLabelSkeleton || 4} size={size} />
            )}
          </div>
        ))}
    </div>
  </div>
);

GridButtons.propTypes = {
  onClick: func,
  color: string,
  outline: bool,
  indexClicked: number,
  isDisplaySkeleton: bool,
  backgroundColor: string,
  lengthLabelSkeleton: number,
  backgroundColorClicked: string,
  arrayDisabledItems: arrayOf(oneOfType([number, string])),
  itemSelectionMap: arrayOf(oneOfType([number, string])).isRequired,
  size: oneOf(["large", "medium", "small", "x-small", "xx-small"])
};
