// app/page.tsx

import TimerDisplay from '../components/TimerDisplay'; 
import { SettingsProvider } from '../components/SettingsContext'; 
import { HistoryProvider } from '../components/HistoryContext'; 
import HistoryView from '../components/HistoryView'; 

const HomePage = () => {
  return (
    <HistoryProvider> 
      <SettingsProvider> 
        <main style={{ 
          maxWidth: '600px', 
          margin: '0 auto',
          backgroundColor: '#1E1E1E', 
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
        }}>
          <header style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ color: '#FFFFFF' }}>Pomodoro Timer Online</h1> 
          </header>
          <TimerDisplay />
          <HistoryView />
        </main>
      </SettingsProvider>
    </HistoryProvider>
  );
};

export default HomePage;