import React, { useState } from 'react';
import { LandingPage } from './components/Landing/LandingPage';

function App() {
  const [currentView, setCurrentView] = useState<'landing'>('landing');

  const handleGetStarted = () => {
    alert('Demo: This would open the login page');
  };

  return (
    <div className="app">
      <LandingPage onGetStarted={handleGetStarted} />
    </div>
  );
}

export default App;