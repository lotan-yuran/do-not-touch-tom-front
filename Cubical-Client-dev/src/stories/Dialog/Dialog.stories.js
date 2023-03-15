import { Dialog } from "./Dialog";
// Img SVG
import { PositionsAreOccupiedImg } from "../../imgSvg/PositionsAreOccupiedImg/PositionsAreOccupiedImg";

export default {
  title: "Tom/Dialog",
  component: Dialog
};

const Template = args => <Dialog {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "תמונה",
  messages: { ok: "קיבלתי" },
  children: <PositionsAreOccupiedImg />,
  propsButtonOk: {
    backgroundColor: "rgba(128, 220, 202, 1)",
    fullWidth: true,
    color: "#fff",
    fontWeight: 400
  }
};

export const WhiteButtonClose = Template.bind({});
WhiteButtonClose.args = {
  title: "תמונה",
  isDisplayCloseButton: true,
  messages: { ok: "קיבלתי" },
  children: <PositionsAreOccupiedImg />,
  propsButtonOk: {
    backgroundColor: "rgba(128, 220, 202, 1)",
    fullWidth: true,
    color: "#fff",
    fontWeight: 400
  }
};

export const TwoButtons = Template.bind({});
TwoButtons.args = {
  title: "תמונה",
  messages: { ok: "קיבלתי", cancel: "הזמנה חדשה" },
  children: <PositionsAreOccupiedImg />,
  propsButtonOk: {
    backgroundColor: "rgba(128, 220, 202, 1)",
    fullWidth: true,
    color: "#fff",
    fontWeight: 400
  },
  propsButtonCancel: {
    outline: true,
    fullWidth: true,
    fontWeight: 400,
    backgroundColor: "#fff",
    color: "rgba(128, 220, 202, 1)",
    colorOutline: "rgba(128, 220, 202, 1)"
  }
};
