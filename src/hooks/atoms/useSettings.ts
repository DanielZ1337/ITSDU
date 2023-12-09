import { asyncSettingsAtom, settingsAtom } from '@/atoms/settings';
import { SettingsOptions } from '@/types/settings';
import { useAtom } from 'jotai';

export function useSettings() {
    const [settings, setSettings] = useAtom(settingsAtom);

    const updateSettings = async (newSettings: Partial<SettingsOptions>) => {
        try {
            // update using localStorage
            const mergedSettings = { ...settings, ...newSettings };
            localStorage.setItem('settings', JSON.stringify(mergedSettings));
            setSettings(mergedSettings);
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    return { settings, updateSettings };
}
