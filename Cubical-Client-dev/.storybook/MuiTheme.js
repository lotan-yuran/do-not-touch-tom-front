import rtl from "jss-rtl";
import { create } from "jss";
import { heIL } from "@material-ui/core/locale";
import { StylesProvider, jssPreset, createTheme, ThemeProvider } from "@material-ui/core/styles";
import { backgroundColor, transparent } from "../src/styles/colors";

// Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
const styleNode = document.createComment("jss-insertion-point");
document.head.insertBefore(styleNode, document.head.firstChild);
document.getElementById("docs-root").dir = "ltr";

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme(
  {
    direction: "rtl",
    palette: {
      primary: {
        main: backgroundColor.darkGreen,
        dark: backgroundColor.hoverGreen,
        light: backgroundColor.brightGreen,
        transparent: transparent
      }
    },
    typography: {
      fontFamily: "'Heebo Bold', 'Heebo Regular', 'Heebo', sans-serif"
    }
  },
  heIL
);

const MuiTheme = ({ children }) => {
  return (
    <StylesProvider injectFirst jss={jss}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StylesProvider>
  );
};

export default MuiTheme;
