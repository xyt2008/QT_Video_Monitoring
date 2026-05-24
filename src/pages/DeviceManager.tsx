import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { ArrowLeft, Plus, Edit2, Trash2, HardDrive, Camera } from 'lucide-react';

interface DeviceManagerProps {
  onNavigate: (page: string) => void;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({ onNavigate }) => {
  const { nvrs, ipcs, setNvrs, setIpcs } = useAppStore();
  const [activeTab, setActiveTab] = useState<'nvr' | 'ipc'>('nvr');

  useEffect(() => {
    const loadData = async () => {
      try {
        const resNvrs = await fetch('/api/nvrs');
        const dataNvrs = await resNvrs.json();
        setNvrs(dataNvrs);

        const resIpcs = await fetch('/api/ipcs');
        const dataIpcs = await resIpcs.json();
        setIpcs(dataIpcs);
      } catch (error) {
        console.error('Failed to load devices:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('main')}
            className="p-2 hover:bg-gray-700 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Device Management</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('nvr')}
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              activeTab === 'nvr' ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>NVR Management</span>
          </button>
          <button
            onClick={() => setActiveTab('ipc')}
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              activeTab === 'ipc' ? 'bg-cyan-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>IPC Management</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">
            {activeTab === 'nvr' ? 'NVR Devices' : 'IPC Cameras'}
          </h2>
          <div className="space-y-4">
            {(activeTab === 'nvr' ? nvrs : ipcs).map((device: any) => (
              <div
                key={device.NVRID || device.IPCID}
                className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {device.NVRName || device.IPCName}
                  </div>
                  <div className="text-sm text-gray-400">
                    {device.NVRIP || device.IPCIP}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-600 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-600 rounded text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceManager;
