'use client'

import { useState, useEffect, useRef } from 'react';

// Tipos para o estado do Timer
type TimerStatus = 'stopped' | 'running' | 'paused';

interface TimerReturn {
  timeInSeconds: number;
  status: TimerStatus;
  start: () => void;
  pause: () => void;
  reset: (newTimeInSeconds?: number) => void;
}

const DEFAULT_TIME = 25 * 60; // 25 minutos em segundos

export const useTimer = (initialTime: number = DEFAULT_TIME): TimerReturn => {
  const [timeInSeconds, setTimeInSeconds] = useState(initialTime);
  const [status, setStatus] = useState<TimerStatus>('stopped');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Função para iniciar a contagem
  const start = () => {
    if (status !== 'running' && timeInSeconds > 0) {
      setStatus('running');
    }
  };

  // Função para pausar
  const pause = () => {
    if (status === 'running') {
      setStatus('paused');
    }
  };

  // Função para resetar
  const reset = (newTimeInSeconds: number = DEFAULT_TIME) => {
    // Limpa qualquer intervalo ativo
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    
    // Define o novo tempo e o status inicial
    setTimeInSeconds(newTimeInSeconds);
    setStatus('stopped');
  };

  // Lógica principal do temporizador usando useEffect
  useEffect(() => {
    // 1. Condição para rodar o Timer
    if (status === 'running') {
      // 2. Cria o intervalo
      intervalRef.current = setInterval(() => {
        setTimeInSeconds((prevTime) => {
          if (prevTime <= 1) {
            // Se o tempo acabar, limpa o intervalo e define o status como 'stopped'
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setStatus('stopped');
            // Retorna 0 para a exibição final
            return 0; 
          }
          // Decrementa 1 segundo
          return prevTime - 1; 
        });
      }, 1000);
    } else if (status !== 'running' && intervalRef.current) {
      // Se o status não for 'running' (pausado ou parado), limpa o intervalo
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 3. Função de limpeza: Importante para parar o Timer quando o componente for desmontado
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]); // Dependência: só roda quando o status muda

  return { timeInSeconds, status, start, pause, reset };
};