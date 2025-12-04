'use client'

import React from 'react';
import { useTimer } from './hooks/useTimer';
import  { formatTime } from '../components/utils/formatTimes'; 

const TimerDisplay: React.FC = () => {
  // Use o hook para obter o estado e os controles
  const { timeInSeconds, status, start, pause, reset } = useTimer();

  const formattedTime = formatTime(timeInSeconds);

  // Texto do botão principal (dinâmico)
  const buttonText = status === 'running' ? 'Pausar' : 
                     status === 'paused' ? 'Continuar' : 'Iniciar';

  // Handler do botão principal
  const handleMainAction = () => {
    if (status === 'running') {
      pause();
    } else {
      start();
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {/* Exibição do Tempo */}
      <h1 
        style={{ 
          fontSize: '8rem', 
          fontWeight: 'bold', 
          color: status === 'running' ? '#4CAF50' : '#333'
        }}
      >
        {formattedTime}
      </h1>

      {/* Controles */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handleMainAction}
          style={{ 
            padding: '10px 20px', 
            fontSize: '1.5rem', 
            marginRight: '10px',
            backgroundColor: status === 'running' ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {buttonText}
        </button>

        <button 
          onClick={() => reset(25 * 60)} 
          disabled={status === 'running'} 
          style={{ 
            padding: '10px 20px', 
            fontSize: '1.5rem', 
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            opacity: status === 'running' ? 0.6 : 1
          }}
        >
          Resetar
        </button>
      </div>
      <p style={{ marginTop: '10px' }}>Status: **{status.toUpperCase()}**</p>
    </div>
  );
};

export default TimerDisplay;