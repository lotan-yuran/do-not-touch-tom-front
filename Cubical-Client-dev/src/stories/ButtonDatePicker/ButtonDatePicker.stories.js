import { ButtonDatePicker } from './ButtonDatePicker';

export default {
  title: 'DatePicker/ButtonDatePicker',
  component: ButtonDatePicker,
  argTypes: {
    color: { control: 'color' },
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <ButtonDatePicker {...args} />;

export const Default = Template.bind({});
Default.args = {
  labelOne: '17',
  labelTwo: "ה'"
};

export const Large = Template.bind({});
Large.args = {
  sizeButton: 'large',
  labelOne: '17',
  labelTwo: "ה'"
};

export const Small = Template.bind({});
Small.args = {
  sizeButton: 'small',
  labelOne: '17',
  labelTwo: "ה'"
};

export const Special = Template.bind({});
Special.args = {
  labelOne: '17',
  labelTwo: "ה'",
  color: 'special',
  sizeButton: 'small',
  sizeLabelOne: 'large',
  sizeLabelTwo: 'medium',
  backgroundColor: "rgba(128, 220, 202, 1)"
};