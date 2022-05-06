import {useContext} from 'react';
import SettingsContext, {SettingsContextInterface} from '../context/SettingsContext';

const useSettings = (): SettingsContextInterface => {
    return useContext(SettingsContext);
}

export default useSettings