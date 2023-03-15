import { TimeNavigatorOverlay } from "./TimeNavigatorOverlay";

export default {
  title: "Tom/TimeNavigatorOverlay",
  component: TimeNavigatorOverlay
};

const Template = args => <TimeNavigatorOverlay {...args} />;

export const Default = Template.bind({});
Default.args = {
  outline: true,
  date: new Date(),
  onChange: () => {}
};
