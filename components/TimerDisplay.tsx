// components/TimerDisplay.tsx

'use client'

import React, { useState } from 'react';
import { usePomodoro, CycleType } from './hooks/usePomodoro';
import  { formatTime } from './utils/formatTimes'; 
import SettingsModal from './SettingsModal';

const getTitle = (cycle: CycleType) => {
    switch (cycle) {
        case 'pomodoro': return 'Tempo de Foco!';
        case 'shortBreak': return 'Pausa Curta';
        case 'longBreak': return 'Pausa Longa';
        default: return 'Pomodoro Timer';
    }
}

const TimerDisplay: React.FC = () => {

    const {
        timeInSeconds,
        status,
        start,
        pause,
        currentCycle,
        pomodorosCompleted,
        skipCycle,
    } = usePomodoro();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const formattedTime = formatTime(timeInSeconds);

    const cycleTitle = getTitle(currentCycle);
    
    const handleMainAction = () => {
        if (status === 'running') {
            pause();
        } else {
            start();
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#FFFFFF' }}> 
            
            <h2>{cycleTitle}</h2> 
            <p style={{ color: '#90CAF9' }}>Pomodoros Concluídos: **{pomodorosCompleted}**</p> 

            {/* CONTAINER DO CÍRCULO DO TEMPO */}
            <div style={{
                margin: '30px auto',
                width: '300px', // Voltou para 300px fixo, como você tinha
                height: '300px', // Voltou para 300px fixo, como você tinha
                borderRadius: '50%',
                border: `10px solid ${status === 'running' ? '#4CAF50' : '#424242'}`, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(0, 0, 0, 0.3)'
            }}>
                {/* Exibição do Tempo */}
                <h1 
                    style={{ 
                        fontSize: '6rem', // Voltou para 6rem fixo, como você tinha
                        fontWeight: 'bold', 
                        color: status === 'running' ? '#81C784' : '#E0E0E0', 
                        lineHeight: '1'
                    }}
                >
                    {formattedTime}
                </h1>
            </div>

            {/* Controles */}
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                {/* Botão Principal */}
                <button 
                    onClick={handleMainAction}
                    style={{ 
                        padding: '12px 25px', 
                        fontSize: '1.2rem', 
                        backgroundColor: status === 'running' ? '#F44336' : '#4CAF50', 
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {status === 'running' ? 'Pausar' : 
                     status === 'paused' ? 'Continuar' : 'Iniciar'}
                </button>

                {/* Botão Pular Ciclo */}
                <button 
                    onClick={() => skipCycle()} 
                    disabled={status === 'running'} 
                    style={{ 
                        padding: '12px 25px', 
                        fontSize: '1.2rem', 
                        backgroundColor: '#FF9800', 
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        opacity: status === 'running' ? 0.6 : 1
                    }}
                >
                    Pular Ciclo
                </button>
            </div>
            
            {/* Configurações */}
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    style={{ 
                        padding: '8px 15px', 
                        backgroundColor: '#424242', 
                        color: '#BDBDBD', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    ⚙️ Configurações
                </button>
            </div>
            
            <p style={{ marginTop: '15px', color: '#BDBDBD' }}>Status: **{status.toUpperCase()}**</p>
            
            {isSettingsOpen && (
                <SettingsModal onClose={() => setIsSettingsOpen(false)} />
            )}
        </div>
    );
};

export default TimerDisplay;