import MuiTheme from "./MuiTheme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  Story => (
    <div dir="rtl" style={{direction: "rtl"}}>
      <MuiTheme>
        <Story />
      </MuiTheme>
    </div>
  )
];
