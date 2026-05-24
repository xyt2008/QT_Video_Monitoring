import { useState } from 'react';
import MainMonitor from './pages/MainMonitor';
import DeviceManager from './pages/DeviceManager';
import SystemConfig from './pages/SystemConfig';

export default function App() {
  const [currentPage, setCurrentPage] = useState('main');

  const renderPage = () => {
    switch (currentPage) {
      case 'main':
        return &lt;MainMonitor onNavigate={setCurrentPage} /&gt;;
      case 'devices':
        return &lt;DeviceManager onNavigate={setCurrentPage} /&gt;;
      case 'config':
        return &lt;SystemConfig onNavigate={setCurrentPage} /&gt;;
      default:
        return &lt;MainMonitor onNavigate={setCurrentPage} /&gt;;
    }
  };

  return renderPage();
}
