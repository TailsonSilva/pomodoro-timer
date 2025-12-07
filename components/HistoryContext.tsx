// components/HistoryContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SessionRecord {
    id: string;
    type: 'pomodoro' | 'shortBreak' | 'longBreak';
    durationMinutes: number;
    startTime: number;
    endTime: number;
}

interface HistoryContextType {
    history: SessionRecord[];
    addSession: (session: SessionRecord) => void;
    clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'pomodoroHistory';

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<SessionRecord[]>([]);
    
    useEffect(() => {
        const storedHistory = localStorage.getItem(STORAGE_KEY);
        if (storedHistory) {
            try {
                setHistory(JSON.parse(storedHistory));
            } catch (e) {
                console.error("Failed to parse history from localStorage", e);
                setHistory([]);
            }
        }
    }, []);

    const addSession = (session: SessionRecord) => {
        setHistory(prev => {
            const newHistory = [...prev, session];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
            
            // CORREÇÃO CRÍTICA: Retorna o novo estado (o novo array newHistory)
            return newHistory; 
        });
    };

    const clearHistory = () => {
        localStorage.removeItem(STORAGE_KEY);
        setHistory([]);
    };

    return (
        <HistoryContext.Provider value={{ history, addSession, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};