import { Input } from "./Input";

export default {
  title: "Tom/Input",
  component: Input,
  argTypes: {
    backgroundColor: { control: "color" },
    color: { control: "color" }
  }
};

const Template = args => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Input",
  color: "rgb(0, 0, 0)"
};

export const Outlined = Template.bind({});
Outlined.args = {
  label: "outlined",
  variant: "outlined"
};

export const Filled = Template.bind({});
Filled.args = {
  label: "filled",
  variant: "filled"
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Disabled",
  disabled: true
};

export const MaxLength = Template.bind({});
MaxLength.args = {
  label: "label",
  maxLength: 10
};

export const Square = Template.bind({});
Square.args = {
  label: "square",
  shape: "square"
};
