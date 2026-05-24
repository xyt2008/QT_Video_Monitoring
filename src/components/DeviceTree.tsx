
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ChevronDown, ChevronRight, Camera, HardDrive } from 'lucide-react';

const DeviceTree: React.FC = () => {
  const { nvrs, ipcs } = useAppStore();
  const [expandedNvrs, setExpandedNvrs] = useState<Set<string>>(
    new Set(nvrs.map((n: any) => n.NVRID))
  );

  const toggleNvr = (nvrId: string) => {
    const newExpanded = new Set(expandedNvrs);
    if (newExpanded.has(nvrId)) {
      newExpanded.delete(nvrId);
    } else {
      newExpanded.add(nvrId);
    }
    setExpandedNvrs(newExpanded);
  };

  const getIpcsForNvr = (nvrId: string) => {
    return ipcs.filter((ipc: any) => ipc.NVRID === nvrId && ipc.IPCUse === '启用');
  };

  return (
    <div className="h-full bg-gray-900 text-white overflow-y-auto border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Devices</h3>
      </div>
      <div className="p-2">
        {nvrs.length === 0 ? (
          <div className="p-4 text-gray-400 text-center">No devices</div>
        ) : (
          nvrs.map((nvr: any) => (
            <div key={nvr.NVRID} className="mb-1">
              <div
                className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => toggleNvr(nvr.NVRID)}
              >
                {expandedNvrs.has(nvr.NVRID) ? (
                  <ChevronDown className="w-4 h-4 mr-2 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-2 text-gray-400" />
                )}
                <HardDrive className="w-4 h-4 mr-2 text-cyan-400" />
                <span className="text-sm">{nvr.NVRName}</span>
              </div>
              {expandedNvrs.has(nvr.NVRID) && (
                <div className="ml-4">
                  {getIpcsForNvr(nvr.NVRID).map((ipc: any) => (
                    <div
                      key={ipc.IPCID}
                      className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
                    >
                      <Camera className="w-4 h-4 mr-2 text-green-400" />
                      <span className="text-sm">{ipc.IPCName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeviceTree;
