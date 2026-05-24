
import React from 'react';
import { useAppStore } from '../store';
import {
  Monitor,
  Play,
  Square,
  Server,
  Camera,
  RotateCcw,
  Settings,
  Maximize2,
  Minimize2,
  LayoutGrid,
} from 'lucide-react';

interface ControlPanelProps {
  onFullscreenToggle: () =&gt; void;
  onLayoutChange: (layout: string) =&gt; void;
  onNavigate: (page: string) =&gt; void;
}

const ControlPanel: React.FC&lt;ControlPanelProps&gt; = ({
  onFullscreenToggle,
  onLayoutChange,
  onNavigate,
}) =&gt; {
  const { config, isFullscreen, isPolling, setIsPolling } = useAppStore();

  const layoutOptions = [
    { value: '1', label: '1画面' },
    { value: '1_4', label: '4画面' },
    { value: '1_9', label: '9画面' },
    { value: '16', label: '16画面' },
  ];

  return (
    &lt;div className="bg-gray-800 border-b border-gray-700 px-4 py-2"&gt;
      &lt;div className="flex items-center justify-between"&gt;
        &lt;div className="flex items-center space-x-4"&gt;
          &lt;h1 className="text-white font-semibold text-lg"&gt;
            {config.AppTitle || '智能视频监控系统'}
          &lt;/h1&gt;
        &lt;/div&gt;

        &lt;div className="flex items-center space-x-2"&gt;
          {/* 布局选择 */}
          &lt;div className="flex items-center space-x-1"&gt;
            &lt;LayoutGrid className="w-4 h-4 text-gray-400" /&gt;
            {layoutOptions.map((layout) =&gt; (
              &lt;button
                key={layout.value}
                onClick={() =&gt; onLayoutChange(layout.value)}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              &gt;
                {layout.label}
              &lt;/button&gt;
            ))}
          &lt;/div&gt;

          &lt;div className="h-6 w-px bg-gray-600" /&gt;

          {/* 全屏按钮 */}
          &lt;button
            onClick={onFullscreenToggle}
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
            title={isFullscreen ? '退出全屏' : '全屏'}
          &gt;
            {isFullscreen ? &lt;Minimize2 className="w-5 h-5" /&gt; : &lt;Maximize2 className="w-5 h-5" /&gt;}
          &lt;/button&gt;

          {/* 轮询按钮 */}
          &lt;button
            onClick={() =&gt; setIsPolling(!isPolling)}
            className={`p-2 rounded transition-colors flex items-center space-x-1
              ${isPolling ? 'bg-green-600 text-white' : 'hover:bg-gray-700 text-gray-300 hover:text-white'}
            `}
          &gt;
            {isPolling ? &lt;Square className="w-5 h-5" /&gt; : &lt;Play className="w-5 h-5" /&gt;}
            &lt;span className="text-sm"&gt;{isPolling ? '停止轮询' : '启动轮询'}&lt;/span&gt;
          &lt;/button&gt;

          &lt;div className="h-6 w-px bg-gray-600" /&gt;

          {/* 导航按钮 */}
          &lt;button
            onClick={() =&gt; onNavigate('devices')}
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
          &gt;
            &lt;Server className="w-5 h-5" /&gt;
            &lt;span className="text-sm"&gt;设备管理&lt;/span&gt;
          &lt;/button&gt;

          &lt;button
            onClick={() =&gt; onNavigate('config')}
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
          &gt;
            &lt;Settings className="w-5 h-5" /&gt;
            &lt;span className="text-sm"&gt;系统配置&lt;/span&gt;
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default ControlPanel;
