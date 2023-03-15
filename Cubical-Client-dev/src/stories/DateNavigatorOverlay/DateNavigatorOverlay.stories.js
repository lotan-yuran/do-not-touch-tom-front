import { DateNavigatorOverlay } from "./DateNavigatorOverlay";

export default {
  title: "Tom/DateNavigatorOverlay",
  component: DateNavigatorOverlay
};

const Template = args => <DateNavigatorOverlay {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "roni",
  outline: true,
  date: new Date(),
  typeComponentDisplay: "Button"
};
