import { Banner } from "./Banner";

export default {
  title: "Tom/Banner",
  component: Banner,
  argTypes: {
    color: { control: "color" },
    colorOutline: { control: "color" },
    backgroundColor: { control: "color" }
  }
};

const Template = args => <Banner {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "האם להתקין את האפלקציה?",
  massage: "זה יעזור לך לפתוח את המערכת בקלות בפעם הבאה",
  labelButton: "להתקין",
  PropsButton: {
    size: "x-small",
    outline: true,
    backgroundColor: "rgba(0,0,0,0)"
  }
};
