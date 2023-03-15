import rtl from "jss-rtl";
import { create } from "jss";
import { heIL } from "@material-ui/core/locale";
import { backgroundColor, text, transparent } from "./styles/colors";
import { StylesProvider, jssPreset, createTheme, ThemeProvider } from "@material-ui/core/styles";

const styleNode = document.createComment("jss-insertion-point");
document.head.insertBefore(styleNode, document.head.firstChild);

const jss = create({ plugins: [...jssPreset().plugins, rtl()], insertionPoint: "jss-insertion-point" });
const theme = createTheme(
  {
    direction: "rtl",
    palette: {
      primary: {
        main: backgroundColor.darkGreen,
        dark: backgroundColor.hoverGreen,
        light: backgroundColor.brightGreen,
        transparent: transparent
      },
      text: {
        main: text.main,
        borders: text.borders,
        titles: text.titles
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
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StylesProvider>
  );
};

export default MuiTheme;
