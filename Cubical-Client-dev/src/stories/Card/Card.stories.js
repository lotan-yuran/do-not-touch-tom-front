import { Card } from "./Card";
export default {
  title: "Tom/Card",
  component: Card,
  argTypes: {
    widthPercent: {
      control: { type: "range", min: 0, max: 100, step: 5 }
    },
    backgroundColor: { control: "color" }
  }
};
const Template = args => (
  <Card {...args}>
    <div>Hello World</div>
  </Card>
);

export const Default = Template.bind({});
Default.args = {
  outline: true,
  center: true
};

export const WithoutOutline = Template.bind({});
WithoutOutline.args = {
  outline: false
};
export const WithoutCenter = Template.bind({});
WithoutOutline.args = {
  center: false
};
