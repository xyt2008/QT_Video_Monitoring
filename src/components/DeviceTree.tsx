
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ChevronDown, ChevronRight, Camera, HardDrive } from 'lucide-react';

const DeviceTree: React.FC = () =&gt; {
  const { nvrs, ipcs } = useAppStore();
  const [expandedNvrs, setExpandedNvrs] = useState&lt;Set&lt;string&gt;&gt;(new Set(nvrs.map((n: any) =&gt; n.NVRID)));

  const toggleNvr = (nvrId: string) =&gt; {
    const newExpanded = new Set(expandedNvrs);
    if (newExpanded.has(nvrId)) {
      newExpanded.delete(nvrId);
    } else {
      newExpanded.add(nvrId);
    }
    setExpandedNvrs(newExpanded);
  };

  const getIpcsForNvr = (nvrId: string) =&gt; {
    return ipcs.filter((ipc: any) =&gt; ipc.NVRID === nvrId &amp;&amp; ipc.IPCUse === '启用');
  };

  return (
    &lt;div className="h-full bg-gray-900 text-white overflow-y-auto border-r border-gray-700"&gt;
      &lt;div className="p-4 border-b border-gray-700"&gt;
        &lt;h3 className="text-lg font-semibold"&gt;设备列表&lt;/h3&gt;
      &lt;/div&gt;
      &lt;div className="p-2"&gt;
        {nvrs.length === 0 ? (
          &lt;div className="p-4 text-gray-400 text-center"&gt;暂无设备&lt;/div&gt;
        ) : (
          nvrs.map((nvr: any) =&gt; (
            &lt;div key={nvr.NVRID} className="mb-1"&gt;
              &lt;div
                className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() =&gt; toggleNvr(nvr.NVRID)}
              &gt;
                {expandedNvrs.has(nvr.NVRID) ? (
                  &lt;ChevronDown className="w-4 h-4 mr-2 text-gray-400" /&gt;
                ) : (
                  &lt;ChevronRight className="w-4 h-4 mr-2 text-gray-400" /&gt;
                )}
                &lt;HardDrive className="w-4 h-4 mr-2 text-cyan-400" /&gt;
                &lt;span className="text-sm"&gt;{nvr.NVRName}&lt;/span&gt;
              &lt;/div&gt;
              {expandedNvrs.has(nvr.NVRID) &amp;&amp; (
                &lt;div className="ml-4"&gt;
                  {getIpcsForNvr(nvr.NVRID).map((ipc: any) =&gt; (
                    &lt;div
                      key={ipc.IPCID}
                      className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
                    &gt;
                      &lt;Camera className="w-4 h-4 mr-2 text-green-400" /&gt;
                      &lt;span className="text-sm"&gt;{ipc.IPCName}&lt;/span&gt;
                    &lt;/div&gt;
                  ))}
                &lt;/div&gt;
              )}
            &lt;/div&gt;
          ))
        )}
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default DeviceTree;
