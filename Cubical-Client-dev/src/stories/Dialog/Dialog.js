import {
  func,
  bool,
  shape,
  oneOf,
  number,
  string,
  object,
  element,
  oneOfType,
  elementType
} from "prop-types";

import {
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  Dialog as DialogMaterial
} from "@material-ui/core";

import { Close } from "@material-ui/icons";

// Style
import styles from "./dialog.module.scss";

// Design component
import { Button } from "../Button/Button";

const DialogTitleWithClose = ({ children, onClose, propsClose, ...other }) => (
  <DialogTitle disableTypography classes={{ root: styles["title-dialog"] }} {...other}>
    {children && <Typography variant="h6">{children}</Typography>}
    <IconButton
      aria-label="close"
      classes={{ root: styles["close-button"] }}
      onClick={onClose}
      {...propsClose}
    >
      <Close />
    </IconButton>
  </DialogTitle>
);

export const Dialog = ({
  onOk,
  open,
  title,
  style,
  onClose,
  loading,
  children,
  messages,
  onCancel,
  maxWidth,
  fullWidth,
  fullScreen,
  propsClose,
  colorLoader,
  propsButtonOk,
  disabledButtonOk,
  propsButtonCancel,
  isDisplayCloseButton,
  ...props
}) => (
  <div>
    <DialogMaterial
      {...props}
      open={open}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      maxWidth={maxWidth ? maxWidth : "sm"}
      onClose={() => !loading && onClose?.()}
    >
      {isDisplayCloseButton ? (
        <DialogTitleWithClose onClose={onClose} propsClose={propsClose}>
          {title}
        </DialogTitleWithClose>
      ) : (
        title && <DialogTitle style={style}>{title}</DialogTitle>
      )}
      <DialogContent dividers style={style}>
        {children}
      </DialogContent>
      <DialogActions classes={{ root: messages?.cancel ? styles["buttons"] : styles["button-only"] }}>
        <div className={styles["button"]}>
          {messages?.cancel && (
            <Button {...propsButtonCancel} onClick={onCancel} disabled={loading}>
              {messages.cancel}
            </Button>
          )}
        </div>
        <div className={styles["button"]}>
          {onOk && (
            <Button {...propsButtonOk} onClick={onOk} disabled={loading || disabledButtonOk}>
              {loading ? (
                <CircularProgress size={15} style={{ color: colorLoader }} />
              ) : (
                messages?.ok || "הבנתי"
              )}
            </Button>
          )}
        </div>
      </DialogActions>
    </DialogMaterial>
  </div>
);

const propTypesButton = {
  onClick: func,
  color: string,
  outline: bool,
  disabled: bool,
  fullWidth: bool,
  colorOutline: string,
  backgroundColor: string,
  children: oneOfType([element, elementType, number, string]).isRequired,
  size: oneOf(["large", "medium", "small", "x-small", "xx-small"])
};

Dialog.propTypes = {
  onOk: func,
  open: bool,
  style: object,
  onClose: func,
  loading: bool,
  onCancel: func,
  fullWidth: bool,
  fullScreen: bool,
  maxWidth: number,
  isDisplayCloseButton: bool,
  title: oneOfType([number, string]),
  propsButtonOk: shape(propTypesButton),
  propsButtonCancel: shape(propTypesButton),
  children: oneOfType([element, elementType, number, string]),
  messages: shape({ cancel: oneOfType([number, string]), ok: oneOfType([number, string]) })
};
