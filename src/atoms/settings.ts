import { SettingsOptions, defaultSettings } from '@/types/settings';
import { atom, useAtom } from 'jotai';

export const settingsAtom = atom<SettingsOptions>(
    localStorage.getItem('settings')
        ? { ...defaultSettings, ...JSON.parse(localStorage.getItem('settings')!) }
        : defaultSettings
);