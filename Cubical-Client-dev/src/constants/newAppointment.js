import { backgroundColor, color, transparent } from "../styles/colors";

// Material-ui
import { CircularProgress } from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";

// Img SVG
import { COMPONENT_IDS } from "./componentIds";
import { OrderForMe } from "../imgSvg/OrderForMe/OrderForMe";
import { OrderForSomeone } from "../imgSvg/OrderForSomeone/OrderForSomeone";

export const propsDesignButton = {
  size: "medium",
  outline: false,
  color: color.text,
  backgroundColor: backgroundColor.brightGreen,
  backgroundColorClicked: backgroundColor.darkGreen
};

export const accentedButton = {
  clicked: {
    accented: true
  },
  notClicked: {
    accented: false,
    backgroundColor: "inherit"
  }
};

export const propsDesignDropList = {
  outline: false,
  backgroundColor: backgroundColor.brightGreen
};

export const sizeButton = {
  large: "small",
  small: "xx-small",
  medium: "x-small"
};

export const propsDesignScrollPad = {
  size: "small",
  colorTextButton: color.text,
  backgroundColor: backgroundColor.brightGreen,
  backgroundColorButton: backgroundColor.darkGreen
};

export const propsDesignNavigationPad = {
  size: "small",
  backgroundColor: backgroundColor.brightGreen
};

export const propsDesignDialog = {
  messages: { ok: "צפייה בהזמנות", cancel: "הזמנה חדשה" },
  propsButtonOk: {
    color: "#fff",
    fullWidth: true,
    fontWeight: 400,
    backgroundColor: backgroundColor.darkGreen
  },
  propsButtonCancel: {
    outline: true,
    fullWidth: true,
    fontWeight: 400,
    color: backgroundColor.darkGreen,
    colorOutline: backgroundColor.darkGreen,
    backgroundColor: transparent
  }
};

export const backgroundColorMobile = {
  normal: backgroundColor.brightGreen,
  disabled: backgroundColor.brightGreenDisabled
};

export const orderFor = { me: 0, someoneElse: 1 };

export const buttons = [
  {
    id: COMPONENT_IDS.CUSTOMER.BUTTONS.ORDER_FOR_ME,
    index: orderFor.me,
    label: "בשבילי",
    image: <OrderForMe />
  }
  // {
  //   id: COMPONENT_IDS.CUSTOMER.BUTTONS.ORDER_FOR_SOMEONE_ELSE,
  //   index: orderFor.someoneElse,
  //   label: "מישהו אחר",
  //   image: <OrderForSomeone />
  // }
];

export const ID_MAX_LENGTH = 9;
export const PHONE_MAX_LENGTH = 10;

export const titles = {
  [orderFor.me]: "הטלפון שלך",
  [orderFor.someoneElse]: "בשביל מי העמדה?"
};

const properKeysForID = new Set(["Backspace", "ArrowRight", "ArrowLeft"]);
const properKeysForPhone = new Set(["Backspace", "ArrowRight", "ArrowLeft", "-", ".", " "]);
const controls = new Set(["v", "c", "x", "z", "a", "ה", "ב", "ס", "ז"]);
const isCtrlKey = e => controls.has(e.key) && e.ctrlKey;

export const replaceByInput = {
  phone: /-|\.|\s/gi
};

export const inputs = {
  [orderFor.me]: [
    {
      type: "tel",
      name: "phone",
      autoComplete: "tel",
      placeholder: "טלפון",
      textError: "מספר טלפון חייב להכיל 10 ספרות",
      inputProps: { inputMode: "tel" },
      maxLength: { length: PHONE_MAX_LENGTH, replace: replaceByInput.phone },
      disabled: ({ loading, isIdProper }) => loading || !isIdProper,
      validation: value => /^\(?(05)([0-9]{1})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value),
      onKeyDown: e =>
        !properKeysForPhone.has(e.key) && !isCtrlKey(e) && isNaN(Number(e.key)) && e.preventDefault(),
      endAdornment: ({ loading }) => {
        if (loading) return <CircularProgress size={20} style={{ color: "#555555" }} />;
        else return null;
      }
    }
  ],
  [orderFor.someoneElse]: [
    {
      id: COMPONENT_IDS.GENERAL.INPUTS.ORDER_PERSONAL_ID,
      name: "id",
      type: "number",
      placeholder: "תעודת זהות",
      textError: "תעודת זהות חייבת להכיל 9 ספרות",
      inputProps: { inputMode: "numeric" },
      disabled: ({ loading }) => loading,
      maxLength: { length: ID_MAX_LENGTH },
      validation: value => !isNaN(Number(value)) && value?.length === 9,
      onKeyDown: e =>
        !properKeysForID.has(e.key) && !isCtrlKey(e) && isNaN(Number(e.key)) && e.preventDefault(),
      endAdornment: ({ loading, isIdProper, value }) => {
        if (!value || value.length < ID_MAX_LENGTH) return null;
        else if (loading) return <CircularProgress size={20} style={{ color: "#555555" }} />;
        else if (isIdProper) return <Check style={{ color: "#46b49f" }} />;
        else return <Close style={{ color: "#e95c5c" }} />;
      }
    },
    {
      name: "fullName",
      disabled: () => false,
      placeholder: "שם מלא",
      textError: "יש להזין שם מלא",
      validation: value => value?.length > 1 && /^[א-תa-zA-Z\s]+$/.test(value),
      onKeyDown: e => {
        !/^[א-תa-zA-Z\s]+$/.test(e.key) && e.preventDefault();
      }
    },
    {
      id: COMPONENT_IDS.GENERAL.INPUTS.ORDER_PHONE_NUMBER,
      type: "tel",
      name: "phone",
      autoComplete: "tel",
      placeholder: "טלפון",
      textError: "מספר טלפון חייב להכיל 10 ספרות",
      inputProps: { inputMode: "tel" },
      maxLength: { length: PHONE_MAX_LENGTH, replace: replaceByInput.phone },
      disabled: () => false,
      validation: value => /^\(?(05)([0-9]{1})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value),
      onKeyDown: e =>
        !properKeysForPhone.has(e.key) && !isCtrlKey(e) && isNaN(Number(e.key)) && e.preventDefault()
    }
  ]
};

export const isThereValueNotValid = (orderForIndex, objValues) => {
  return inputs[orderForIndex].some(input => input.validation && !input.validation?.(objValues[input.name]));
};
