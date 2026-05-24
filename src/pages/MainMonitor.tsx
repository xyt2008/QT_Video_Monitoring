import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import DeviceTree from '../components/DeviceTree';
import VideoGrid from '../components/VideoGrid';
import ControlPanel from '../components/ControlPanel';

interface MainMonitorProps {
  onNavigate: (page: string) => void;
}

const MainMonitor: React.FC<MainMonitorProps> = ({ onNavigate }) => {
  const {
    nvrs,
    ipcs,
    config,
    rtspAddrs,
    videoType,
    selectedChannel,
    isFullscreen,
    setNvrs,
    setIpcs,
    setConfig,
    setRtspAddrs,
    setVideoType,
    setSelectedChannel,
    setIsFullscreen,
    updateRtspAddr,
  } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resNvrs = await fetch('/api/nvrs');
        const dataNvrs = await resNvrs.json();
        setNvrs(dataNvrs);

        const resIpcs = await fetch('/api/ipcs');
        const dataIpcs = await resIpcs.json();
        setIpcs(dataIpcs);

        const resConfig = await fetch('/api/config');
        const dataConfig = await resConfig.json();
        setConfig(dataConfig);

        if (dataConfig.RtspAddr16) {
          setRtspAddrs(dataConfig.RtspAddr16.split('|'));
        }
        if (dataConfig.VideoType) {
          setVideoType(dataConfig.VideoType);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const saveConfig = async () => {
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          VideoType: videoType,
          RtspAddr16: rtspAddrs.join('|'),
        }),
      });
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  const handleLayoutChange = (layout: string) => {
    setVideoType(layout);
    saveConfig();
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log('Error attempting to enable fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {!isFullscreen && (
        <ControlPanel
          onFullscreenToggle={handleFullscreenToggle}
          onLayoutChange={handleLayoutChange}
          onNavigate={onNavigate}
        />
      )}
      <div className="flex-1 flex overflow-hidden">
        {!isFullscreen && (
          <div className="w-64 flex-shrink-0">
            <DeviceTree />
          </div>
        )}
        <div className="flex-1">
          <VideoGrid onChannelClick={setSelectedChannel} />
        </div>
      </div>
    </div>
  );
};

export default MainMonitor;
