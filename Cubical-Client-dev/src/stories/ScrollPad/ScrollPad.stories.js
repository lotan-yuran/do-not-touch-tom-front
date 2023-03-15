import { ScrollPad } from './ScrollPad';

export default {
  title: 'DatePicker/ScrollPad',
  component: ScrollPad,
  argTypes: {
    colorTextButton: { control: 'color' },
    backgroundColor: { control: 'color' },
    backgroundColorButton: { control: 'color' },
  },
};

const Template = (args) => <ScrollPad {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: [...Array(30).keys()].map(i => ({ labelOne: i, labelTwo: "ה'" }))
}

export const SpecialColor = Template.bind({});
SpecialColor.args = {
  indexClicked: 3,
  backgroundColor: "rgb(243 255 255)",
  colorTextButton: "rgba(95,94,94,1)",
  backgroundColorButton: "rgba(128, 220, 202, 1)",
  data: [...Array(30).keys()].map(i => ({ labelOne: i, labelTwo: "ה'" }))
};