import React, {createContext, useState} from 'react';
import {ThemeModeEnum} from "../constants";
import {getSettingsFromSession, setSettingsToSession} from "../utils/settings";

export interface SettingsInterface {
    theme: ThemeModeEnum
}

const defaultSettings: SettingsInterface = getSettingsFromSession() || {
    theme: ThemeModeEnum.LIGHT
}

export interface SettingsContextInterface {
    settings: SettingsInterface;
    setSettings: (settings: SettingsInterface) => void;
}

const SettingsContext = createContext<SettingsContextInterface>({
    settings: defaultSettings,
    setSettings: () => {}
})

interface SettingsProviderProps {
    children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [currentSettings, setCurrentSettings] = useState<SettingsInterface>(defaultSettings);

    const handleSetSettings = (settings: SettingsInterface) => {
        setCurrentSettings(settings)
        setSettingsToSession(settings)
    };

    return (
        <SettingsContext.Provider
            value={{
                settings: currentSettings,
                setSettings: handleSetSettings
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export default SettingsContext
