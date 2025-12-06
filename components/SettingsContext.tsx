// components/SettingsContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect} from "react";

export interface PomodoroSettings {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
};

interface SettingsContextType {
    settings: PomodoroSettings;
    updateSettings: (newSettings: PomodoroSettings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'pomodoroSettings';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        const storedSettings = localStorage.getItem(STORAGE_KEY);
        if (storedSettings) {
            try {
                const parsedSettings = JSON.parse(storedSettings);
                setSettings(parsedSettings);
            } catch (e) {
                console.error("Erro ao carregar settings do localStorage:", e);
            }
        }
    }, []);

    const updateSettings = (newSettings: PomodoroSettings) => {
        setSettings(newSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
    }
    return context;
};