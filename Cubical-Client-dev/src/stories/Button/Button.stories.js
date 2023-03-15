import { Button } from "./Button";

export default {
  title: "Tom/Button",
  component: Button,
  argTypes: {
    color: { control: "color" },
    colorOutline: { control: "color" },
    backgroundColor: { control: "color" }
  }
};

const Template = args => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  outline: true,
  children: "Button"
};

export const Large = Template.bind({});
Large.args = {
  size: "large",
  outline: true,
  children: "Button",
  backgroundColor: "rgba(0,0,0,0)"
};

export const Small = Template.bind({});
Small.args = {
  size: "small",
  outline: true,
  children: "Button",
  backgroundColor: "rgba(0,0,0,0)"
};

export const WithoutOutline = Template.bind({});
WithoutOutline.args = {
  size: "large",
  outline: false,
  children: "Button",
  backgroundColor: "rgba(0,0,0,0)"
};

export const BackgroundColor = Template.bind({});
BackgroundColor.args = {
  size: "large",
  outline: false,
  children: "Button",
  backgroundColor: "rgb(128,220,202)"
};
