import { COMPONENT_IDS } from "./componentIds";
import { admin, transparent } from "../styles/colors";

export const messagesDialogCancelStation = {
  messages: { ok: "כן, הקפאה", cancel: "לא להקפיא" },
  title: "להקפיא את העמדה?"
};
export const messagesDialogCreateAppointment = {
  messages: { ok: "שמירה", cancel: "ביטול" },
  title: "הזמנה חדשה"
};

export const backgroundColorAdmin = {
  normal: admin.brightGray,
  disabled: admin.brightGrayDisabled
};

export const propsDesignDialog = {
  fullWidth: true,
  isDisplayCloseButton: true,
  propsButtonOk: {
    id: COMPONENT_IDS.ADMIN.BUTTONS.PLACE_ORDER,
    color: "#fff",
    shape: "square",
    fullWidth: true,
    fontWeight: 400,
    backgroundColor: admin.blue
  },
  propsButtonCancel: {
    id: COMPONENT_IDS.ADMIN.BUTTONS.CANCEL_ORDER,
    outline: true,
    shape: "square",
    fullWidth: true,
    fontWeight: 400,
    color: admin.blue,
    colorOutline: admin.blue,
    backgroundColor: transparent
  },
  style: {
    textAlign: "center",
    fontFamily: "'Heebo Bold', 'Heebo Regular', 'Heebo', sans-serif"
  }
};
