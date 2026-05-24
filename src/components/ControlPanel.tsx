
import React from 'react';
import { useAppStore } from '../store';
import {
  Maximize2,
  Minimize2,
  Play,
  Square,
  Server,
  Settings,
  LayoutGrid
} from 'lucide-react';

interface ControlPanelProps {
  onFullscreenToggle: () => void;
  onLayoutChange: (layout: string) => void;
  onNavigate: (page: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onFullscreenToggle,
  onLayoutChange,
  onNavigate
}) => {
  const { config, isFullscreen, isPolling, setIsPolling } = useAppStore();

  const layoutOptions = [
    { value: '1', label: '1' },
    { value: '1_4', label: '4' },
    { value: '1_9', label: '9' },
    { value: '16', label: '16' }
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-white font-semibold text-lg">
            {config.AppTitle || 'Video Monitor'}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <LayoutGrid className="w-4 h-4 text-gray-400" />
            {layoutOptions.map((layout) => (
              <button
                key={layout.value}
                onClick={() => onLayoutChange(layout.value)}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                {layout.label}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-gray-600" />
          <button
            onClick={onFullscreenToggle}
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsPolling(!isPolling)}
            className={`p-2 rounded flex items-center space-x-2 ${
              isPolling ? 'bg-green-600 text-white' : 'hover:bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            {isPolling ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span className="text-sm">{isPolling ? 'Stop' : 'Poll'}</span>
          </button>
          <div className="h-6 w-px bg-gray-600" />
          <button
            onClick={() => onNavigate('devices')}
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white flex items-center space-x-2"
          >
            <Server className="w-5 h-5" />
            <span className="text-sm">Devices</span>
          </button>
          <button
            onClick={() => onNavigate('config')}
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white flex items-center space-x-2"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Config</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
