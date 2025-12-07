// components/hooks/useTimer.tsx

'use client'

import { useState, useRef, useEffect, useCallback } from "react";

export type TimerStatus = 'stopped' | 'running' | 'paused';

export const useTimer = (initialSeconds: number) => {
    // Inicializa o tempo apenas uma vez
    const [timeInSeconds, setTimeInSeconds] = useState(initialSeconds);
    const [status, setStatus] = useState<TimerStatus>('stopped');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const start = useCallback(() => {
        setStatus(prevStatus => {
            if (prevStatus !== 'running') {
                return 'running';
            }
            return prevStatus;
        });
    }, []); 

    const pause = useCallback(() => {
        if (status === 'running') {
            setStatus('paused');
        }
    }, [status]);

    const reset = useCallback((newTime: number) => {
        stopInterval();
        setTimeInSeconds(newTime);
        setStatus('stopped');
    }, []); 

    // Efeito principal para iniciar/parar o setInterval
    useEffect(() => {
        if (status === 'running') {
            stopInterval(); 

            intervalRef.current = setInterval(() => {
                setTimeInSeconds(prevTime => {
                    const newTime = prevTime - 1;
                    if (newTime <= 0) {
                        stopInterval();
                        setStatus('stopped'); 
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        } 
        // CORREÇÃO CRÍTICA: Use 'else' simples para limpar o intervalo se não estiver 'running'
        else if (intervalRef.current) {
            stopInterval();
        }

        return () => {
            stopInterval();
        };
    }, [status]); 

    // Efeito para sincronizar o tempo inicial APENAS na montagem
    useEffect(() => {
        setTimeInSeconds(initialSeconds);
    }, [initialSeconds]); 

    return {
        timeInSeconds,
        status,
        start,
        pause,
        reset,
    };
};