import { GridButtons } from "./GridButtons";

export default {
  title: "Tom/GridButtons",
  component: GridButtons,
  argTypes: {
    color: { control: "color" },
    backgroundColor: { control: "color" },
    backgroundColorClicked: { control: "color" }
  }
};

const Template = args => <GridButtons {...args} />;

export const Default = Template.bind({});
Default.args = {
  arrayItems: [...Array(10).keys()]
};

export const SpecialColor = Template.bind({});
SpecialColor.args = {
  size: "medium",
  outline: false,
  indexClicked: 3,
  color: "rgba(95,94,94,1)",
  backgroundColor: "rgb(243,255,255)",
  backgroundColorClicked: "rgb(128,220,202)",
  arrayItems: [...Array(20).keys()].map(() => "AAAA")
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  size: "medium",
  outline: false,
  lengthLabelSkeleton: 3,
  isDisplaySkeleton: true,
  arrayItems: [...Array(20).keys()]
};
