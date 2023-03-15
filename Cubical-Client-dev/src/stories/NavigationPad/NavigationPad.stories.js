import { NavigationPad } from './NavigationPad';

export default {
  title: 'DatePicker/NavigationPad',
  component: NavigationPad,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <NavigationPad {...args} />;

export const Default = Template.bind({});
Default.args = {
  labelBetweenIcons: "דצמבר 2020",
};

export const SpecialColor = Template.bind({});
SpecialColor.args = {
  labelBetweenIcons: "דצמבר 2020",
  backgroundColor: "rgb(243 255 255)"
};