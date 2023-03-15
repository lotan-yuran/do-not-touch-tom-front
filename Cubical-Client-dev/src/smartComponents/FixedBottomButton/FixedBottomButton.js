// Style
import style from "./fixedBottomButton.module.scss";
import { backgroundColor } from "../../styles/colors";

// Design component
import { Button } from "../../stories/Button/Button";
import { Loader } from "../../stories/Loader/Loader";

// Constants
import { propsDesignButton } from "../../constants/fixedBottomButton";

export const FixedBottomButton = ({
  textLabel,
  loading,
  textLabelLoading,
  isDisabled,
  onClick,
  ...props
}) => (
  <div className={style["fixed-bottom-button-base"]}>
    <div className={style["fixed-bottom-button"]}>
      <Button
        {...props}
        onClick={onClick}
        disabled={isDisabled}
        {...propsDesignButton}
        backgroundColor={loading || isDisabled ? backgroundColor.brightGreen : backgroundColor.darkGreen}
      >
        {loading ? textLabelLoading || <Loader size={20} /> : textLabel}
      </Button>
    </div>
  </div>
);
