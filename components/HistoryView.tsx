// components/HistoryView.tsx

"use client";

import React, { useMemo } from 'react';
import { useHistory } from './HistoryContext';

const HistoryView: React.FC = () => {
    const { history, clearHistory } = useHistory();

    // 1. Cálculo de Métricas (useMemo para performance)
    const metrics = useMemo(() => {
        // Filtra apenas as sessões de foco (pomodoro)
        const workSessions = history.filter(s => s.type === 'pomodoro');
        
        const totalPomodoros = workSessions.length;
        // Soma as durações em minutos de todas as sessões de foco
        const totalWorkMinutes = workSessions.reduce((sum, session) => sum + session.durationMinutes, 0);
        const totalWorkHours = (totalWorkMinutes / 60).toFixed(1); // Converte para horas

        // Acompanhamento diário (simples)
        const today = new Date().toDateString();
        const pomodorosToday = workSessions.filter(s => new Date(s.endTime).toDateString() === today).length;

        return { totalPomodoros, totalWorkHours, pomodorosToday };
    }, [history]);


    // 2. Formatação de data simples
    const formatDateTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    }

    // 3. Renderização
    return (
        <div style={{ padding: '20px', marginTop: '30px', borderTop: '1px solid #424242', color: '#FFFFFF' }}>
            <h2>📈 Histórico de Produtividade</h2>

            {/* Métrica */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-around', 
                margin: '20px 0', 
                backgroundColor: '#2C2C2C', // Fundo das métricas mais claro que o principal
                padding: '15px', 
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}>
                <div style={{ textAlign: 'center', color: '#BDBDBD' }}> 
                    <strong>Focos Concluídos (Total):</strong> 
                    <p style={{ fontSize: '1.5rem', margin: '5px 0', color: '#FFFFFF', fontWeight: 'bold' }}>{metrics.totalPomodoros}</p>
                </div>
                <div style={{ textAlign: 'center', color: '#BDBDBD' }}>
                    <strong>Total de Horas Focadas:</strong> 
                    <p style={{ fontSize: '1.5rem', margin: '5px 0', color: '#FFFFFF', fontWeight: 'bold' }}>{metrics.totalWorkHours}h</p>
                </div>
                <div style={{ textAlign: 'center', color: '#BDBDBD' }}>
                    <strong>Concluídos Hoje:</strong> 
                    <p style={{ fontSize: '1.5rem', margin: '5px 0', color: '#FFFFFF', fontWeight: 'bold' }}>{metrics.pomodorosToday}</p>
                </div>
            </div>

            {/* Lista Detalhada */}
            <h3>Detalhes das Sessões</h3>
            
            {history.length === 0 ? (
                <p style={{ color: '#BDBDBD' }}>Nenhuma sessão concluída ainda.</p>
            ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {history.slice().reverse().map(session => ( // Inverte para mostrar o mais recente primeiro
                            <li key={session.id} style={{ 
                                borderBottom: '1px dotted #424242', 
                                padding: '10px 0',
                                color: session.type === 'pomodoro' ? '#81C784' : '#FFB74D' // Cores de destaque
                            }}>
                                **{session.type === 'pomodoro' ? 'Foco' : 'Pausa'}** ({session.durationMinutes}min)
                                <span style={{ float: 'right', color: '#BDBDBD', fontSize: '0.9rem' }}>
                                    {formatDateTime(session.endTime)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Botão de Limpeza */}
            {history.length > 0 && (
                <button 
                    onClick={clearHistory} 
                    style={{ 
                        marginTop: '15px', 
                        padding: '8px 15px', 
                        backgroundColor: '#D32F2F', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Limpar Histórico
                </button>
            )}
        </div>
    );
};

export default HistoryView;