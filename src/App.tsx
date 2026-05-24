
import React, { useState } from 'react';
import MainMonitor from './pages/MainMonitor';
import DeviceManager from './pages/DeviceManager';
import SystemConfig from './pages/SystemConfig';
import AlarmList from './pages/AlarmList';
import AlarmDetail from './pages/AlarmDetail';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('main');

  const renderPage = () => {
    switch (currentPage) {
      case 'main':
        return <MainMonitor onNavigate={setCurrentPage} />;
      case 'devices':
        return <DeviceManager onNavigate={setCurrentPage} />;
      case 'config':
        return <SystemConfig onNavigate={setCurrentPage} />;
      case 'alarmList':
        return <AlarmList onNavigate={setCurrentPage} />;
      case 'alarmDetail':
        return <AlarmDetail onNavigate={setCurrentPage} />;
      default:
        return <MainMonitor onNavigate={setCurrentPage} />;
    }
  };

  return <div className="min-h-screen">{renderPage()}</div>;
};

export default App;
