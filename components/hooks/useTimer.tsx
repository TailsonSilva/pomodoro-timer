// components/hooks/useTimer.tsx

'use client'

import { useState, useRef, useEffect, useCallback } from "react";

export type TimerStatus = 'stopped' | 'running' | 'paused';

export const useTimer = (initialSeconds: number) => {
    // Inicializa o tempo com o valor inicial
    const [timeInSeconds, setTimeInSeconds] = useState(initialSeconds);
    const [status, setStatus] = useState<TimerStatus>('stopped');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Usado para garantir que o tempo só seja ajustado automaticamente na montagem
    const isMounted = useRef(false);

    // Efeito para garantir que o tempo inicial seja carregado corretamente
    useEffect(() => {
        if (!isMounted.current) {
            setTimeInSeconds(initialSeconds);
            isMounted.current = true;
        }
    }, [initialSeconds]); 

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // CORREÇÃO ESSENCIAL: Usa a forma funcional para garantir que o estado
    // de 'status' seja atualizado de forma síncrona, mesmo que 'start'
    // tenha sido criado há muito tempo (evita stale state).
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

    const reset = useCallback((newTime: number = initialSeconds) => {
        stopInterval();
        setTimeInSeconds(newTime);
        setStatus('stopped');
    }, [initialSeconds]); 

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
        } else if (intervalRef.current) {
            stopInterval();
        }

        return () => {
            stopInterval();
        };
    }, [status]); 


    return {
        timeInSeconds,
        status,
        start,
        pause,
        reset,
    };
};