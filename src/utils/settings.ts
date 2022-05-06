import {SettingsInterface} from "../context/SettingsContext";

export const getSettingsFromSession = (): SettingsInterface | null => {
    const settings = localStorage.getItem('settings')
    return settings ? JSON.parse(settings) as SettingsInterface : null
}

export const setSettingsToSession = (settings: SettingsInterface) => {
    localStorage.setItem('settings', JSON.stringify(settings))
}
