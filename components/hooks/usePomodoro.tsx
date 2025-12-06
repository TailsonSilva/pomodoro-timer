// components/hooks/usePomodoro.tsx

'use client';

import { useState, useCallback, useEffect, useRef } from "react";
import { useTimer } from "./useTimer";
import { useSettings } from "../SettingsContext";
import { useHistory, SessionRecord } from "../HistoryContext";

export type CycleType = 'pomodoro' | 'shortBreak' | 'longBreak';

const LONG_BREAK_INTERVAL = 4;

export const usePomodoro = () => {
    
    const { settings } = useSettings();
    const { addSession } = useHistory();

    const [currentCycle, setCurrentCycle] = useState<CycleType>('pomodoro');
    const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
    const [cycleStartTime, setCycleStartTime] = useState(Date.now()); 
    const isMounted = useRef(false);

    // O tempo inicial é sempre baseado no ciclo atual
    const initialTimeInSeconds = settings[currentCycle] * 60;
    const timer = useTimer(initialTimeInSeconds);

    const startNewCycle = useCallback((newCycle: CycleType) => {
        const newTimeInSeconds = settings[newCycle] * 60; 
        setCycleStartTime(Date.now()); 
        
        timer.reset(newTimeInSeconds);
        setCurrentCycle(newCycle); 
    }, [settings, timer]); 

    const nextCycle = useCallback(() => {
        // 1. Salva a sessão anterior se for Pomodoro
        if ( currentCycle === 'pomodoro') {
            const session: SessionRecord = {
                id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                type: 'pomodoro',
                durationMinutes: settings.pomodoro,
                startTime: cycleStartTime,
                endTime: Date.now(),
            };
            addSession(session);
            setPomodorosCompleted(prev => prev + 1);
        }

        // 2. Define o próximo ciclo
        let nextCycleType: CycleType = 'pomodoro';
        if (currentCycle === 'pomodoro') {
            if ((pomodorosCompleted + 1) % LONG_BREAK_INTERVAL === 0){
                nextCycleType = 'longBreak';
            } else {
                nextCycleType = 'shortBreak';
            }
        }
        
        // 3. Inicia o novo ciclo
        startNewCycle(nextCycleType);
        timer.start();
        
    }, [currentCycle, pomodorosCompleted, settings, addSession, cycleStartTime, timer, startNewCycle]); 

    // Efeito 1: Transição automática para o próximo ciclo quando o tempo zera
    // *** MANTER ATIVO: ESSENCIAL PARA AUTOMAÇÃO ***
    useEffect (() => {
        if (timer.status === 'stopped' && timer.timeInSeconds === 0 && isMounted.current) {
            nextCycle();
        }
    }, [timer.status, timer.timeInSeconds, nextCycle]); 

    // Efeito 2: Resetar o tempo quando as configurações ou o ciclo mudam
    // *** DESATIVADO TEMPORARIAMENTE: SUSPEITO DE INTERFERÊNCIA INICIAL ***
    /*
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const timeInSeconds = settings[currentCycle] * 60;
        timer.reset(timeInSeconds);
    }, [settings, currentCycle, timer]);
    */

    return{
        ...timer,
        currentCycle,
        pomodorosCompleted,
        // Ao pular, pausa o timer atual e vai para o próximo
        skipCycle: () => {
            timer.pause();
            nextCycle();
        },
    };
};