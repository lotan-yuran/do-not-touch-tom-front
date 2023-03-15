import { DropList } from "./DropList";

export default {
  title: "Tom/DropList",
  component: DropList,
  argTypes: {
    color: { control: "color" },
    backgroundColor: { control: "color" }
  }
};

const Template = args => <DropList {...args} />;

const options = [
  { id: 1, name: "dev" },
  { id: 2, name: "test" },
  { id: 3, name: "prod" }
];

export const Default = Template.bind({});
Default.args = {
  options,
  outline: true
};

export const SpecialColor = Template.bind({});
SpecialColor.args = {
  options,
  outline: false,
  backgroundColor: "rgb(243,255,255)"
};

export const Large = Template.bind({});
Large.args = {
  options,
  size: "large",
  outline: true
};

export const Small = Template.bind({});
Small.args = {
  options,
  size: "small",
  outline: true
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  options,
  outline: true,
  fullWidth: true
};

export const WithoutOutline = Template.bind({});
WithoutOutline.args = {
  options,
  outline: false
};
