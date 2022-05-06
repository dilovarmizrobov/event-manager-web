import React from 'react';
import useSettings from "../../../hooks/useSettings";
import {ThemeModeEnum} from "../../../constants";
import {IconButton, SvgIcon, Tooltip} from "@mui/material";
import {FiMoon as MoonIcon, FiSun as SunIcon} from "react-icons/fi"

const ThemeMode: React.FC = () => {
    const { settings, setSettings } = useSettings()

    const handleChange = () => {
        setSettings({...settings, theme: settings.theme === ThemeModeEnum.LIGHT ? ThemeModeEnum.DARK : ThemeModeEnum.LIGHT})
    }

    return (
        <Tooltip title="Переключить светлую/темную тему">
            <IconButton color="inherit" onClick={handleChange}>
                <SvgIcon>
                    { settings.theme === ThemeModeEnum.LIGHT ? <MoonIcon /> : <SunIcon /> }
                </SvgIcon>
            </IconButton>
        </Tooltip>
    )
}

export default ThemeMode;