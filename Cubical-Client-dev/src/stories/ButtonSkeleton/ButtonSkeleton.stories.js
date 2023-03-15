import { ButtonSkeleton } from "./ButtonSkeleton";

export default {
  title: "Tom/ButtonSkeleton",
  component: ButtonSkeleton,
  argTypes: {
    color: { control: "color" },
    backgroundColor: { control: "color" }
  }
};

const Template = args => <ButtonSkeleton {...args} />;

export const Default = Template.bind({});
Default.args = {
  lengthLabel: 6
};

export const Large = Template.bind({});
Large.args = {
  size: "large",
  lengthLabel: 6
};

export const Small = Template.bind({});
Small.args = {
  size: "small",
  lengthLabel: 6
};

export const fullWidth = Template.bind({});
fullWidth.args = {
  size: "large",
  lengthLabel: 6,
  fullWidth: true
};
