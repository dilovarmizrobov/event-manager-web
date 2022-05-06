import {createTheme, responsiveFontSizes} from "@mui/material/styles";
import {colors} from "@mui/material";
import {SettingsInterface} from "../context/SettingsContext";
import {ThemeModeEnum} from "../constants";
import {ThemeOptions} from "@mui/material/styles/createTheme";
import { deepmerge } from '@mui/utils';
import typography from "./typography";
import {softShadows, strongShadows} from "./shadows";
import {Shadows} from "@mui/material/styles/shadows";

const baseConfig: ThemeOptions = {
    direction: 'ltr',
    typography,
    components: {
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 3,
                    overflow: 'hidden'
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 32
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0,0,0,0.075)'
                }
            }
        }
    },
};

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        action: {
            active: colors.blueGrey[600]
        },
        background: {
            default: '#f4f6f8',
            paper: colors.common.white
        },
        primary: {
            main: colors.indigo[600]
        },
        secondary: {
            main: '#5850EC'
        },
        text: {
            primary: colors.blueGrey[900],
            secondary: colors.blueGrey[600]
        }
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    '&::placeholder': {
                        opacity: 1,
                        color: colors.blueGrey[600]
                    }
                }
            }
        },
    },
    shadows: softShadows as Shadows
})

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        action: {
            active: 'rgba(255, 255, 255, 0.54)',
            hover: 'rgba(255, 255, 255, 0.04)',
            selected: 'rgba(255, 255, 255, 0.08)',
            disabled: 'rgba(255, 255, 255, 0.26)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
            focus: 'rgba(255, 255, 255, 0.12)'
        },
        background: {
            default: '#1c2025',
            paper: '#282C34'
        },
        primary: {
            main: '#8a85ff'
        },
        secondary: {
            main: '#8a85ff'
        },
        text: {
            primary: '#e6e5e8',
            secondary: '#adb0bb'
        }
    },
    shadows: strongShadows as Shadows
})

const createGlobalTheme = (settings: SettingsInterface) => {
    let themeConfig = settings.theme === ThemeModeEnum.LIGHT ? lightTheme : darkTheme
    return responsiveFontSizes(createTheme(deepmerge(baseConfig, themeConfig)))
}

export default createGlobalTheme