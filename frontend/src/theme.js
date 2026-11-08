/* ----------------------------------------------------------------------------*/
/*   ( The Authentic JS/JAVA/PYTHON CodeBuff )
 ___ _                      _              _ 
 | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
 | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
 |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
                                        |__/ 
 */
/* --------------------------------------------------------------------------*/

import { createTheme } from "@mui/material/styles";

// Aurora palette (same colors as the Profile page)
const aurora = {
  teal: "#14B8A6",
  tealDark: "#0F766E",
  blue: "#3B82F6",
  violet: "#8B5CF6",
  ink: "#0B1020",
  muted: "#64748B",
  bg: "#F8FAFC",
};

const theme = createTheme({
  palette: {
    primary: {
      main: aurora.teal,
      dark: aurora.tealDark,
      contrastText: "#fff",
    },
    secondary: {
      main: aurora.violet,
      contrastText: "#fff",
    },
    info: {
      main: aurora.blue,
    },
    text: {
      primary: aurora.ink,
      secondary: aurora.muted,
    },
    background: {
      default: aurora.bg,
    },
  },
  typography: {
    fontFamily: "'Anton', sans-serif",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: aurora.teal,
            borderWidth: 2,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: aurora.tealDark,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
        },
      },
    },
  },
});

export default theme;