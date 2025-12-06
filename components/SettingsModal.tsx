// components/SettingsModal.tsx

"use client";

import React, { useState } from 'react';
import { useSettings, PomodoroSettings } from './SettingsContext'; 

interface SettingsModalProps {
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const { settings, updateSettings } = useSettings();
    const [localSettings, setLocalSettings] = useState<PomodoroSettings>(settings);

    const handleChange = (type: keyof PomodoroSettings, value: string) => {
        const numValue = parseInt(value, 10);
        
        if (isNaN(numValue) || numValue <= 0) {
            return;
        } 
        
        setLocalSettings(prev => ({
            ...prev,
            [type]: numValue,
        }));
    };

    const handleSave = () => {
        updateSettings(localSettings);
        onClose();
    };

    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.8)', // Fundo mais escuro
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{ 
                backgroundColor: '#333333', // Fundo cinza escuro para o modal
                color: '#FFFFFF', // Texto branco para contraste
                padding: '30px', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.4)'
            }}>
                <h3>Ajustar Tempos (Minutos)</h3>
                <hr style={{ margin: '15px 0', borderColor: '#555' }} />

                {/* Input Pomodoro */}
                <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    Tempo de Foco (Pomodoro):
                    <input
                        type="number"
                        min="1"
                        value={localSettings.pomodoro}
                        onChange={(e) => handleChange('pomodoro', e.target.value)}
                        style={{ marginLeft: '10px', width: '60px', padding: '5px', backgroundColor: '#555', color: 'white', border: '1px solid #777' }}
                    />
                </label>
                
                <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    Pausa Curta (Short Break):
                    <input
                        type="number"
                        min="1"
                        value={localSettings.shortBreak}
                        onChange={(e) => handleChange('shortBreak', e.target.value)}
                        style={{ marginLeft: '10px', width: '60px', padding: '5px', backgroundColor: '#555', color: 'white', border: '1px solid #777' }}
                    />
                </label>

                <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    Pausa Longa (Long Break):
                    <input
                        type="number"
                        min="1"
                        value={localSettings.longBreak}
                        onChange={(e) => handleChange('longBreak', e.target.value)}
                        style={{ marginLeft: '10px', width: '60px', padding: '5px', backgroundColor: '#555', color: 'white', border: '1px solid #777' }}
                    />
                </label>

                <button 
                    onClick={handleSave} 
                    style={{ margin: '0 10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Salvar
                </button>
                <button 
                    onClick={onClose}
                    style={{ margin: '0 10px', padding: '10px 20px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;