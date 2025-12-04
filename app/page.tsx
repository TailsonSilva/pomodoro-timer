
import TimerDisplay from '../components/TimerDisplay';

const HomePage = () => {
  return (
    <main>
      <header style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Pomodoro Timer Online</h1>
      </header>
      <TimerDisplay />
    </main>
  );
};

export default HomePage;