import { TimeNavigatorOverlay } from "./TimeNavigatorOverlay";

export default {
  title: "Cubical/TimeNavigatorOverlay",
  component: TimeNavigatorOverlay
};

const Template = args => <TimeNavigatorOverlay {...args} />;

export const Default = Template.bind({});
Default.args = {
  outline: true,
  date: new Date(),
  onChange: () => {}
};
