
import React from 'react';
import { useAppStore } from '../store';
import { Camera, Play } from 'lucide-react';

interface VideoGridProps {
  onChannelClick: (index: number) =&gt; void;
}

const VideoGrid: React.FC&lt;VideoGridProps&gt; = ({ onChannelClick }) =&gt; {
  const { rtspAddrs, videoType, selectedChannel } = useAppStore();

  const getVisibleChannels = () =&gt; {
    switch (videoType) {
      case '1':
        return [0];
      case '1_4':
        return [0, 1, 2, 3];
      case '5_8':
        return [4, 5, 6, 7];
      case '1_9':
        return [0, 1, 2, 3, 4, 5, 6, 7, 8];
      case '8_16':
        return [7, 8, 9, 10, 11, 12, 13, 14, 15];
      case '16':
      default:
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    }
  };

  const visibleChannels = getVisibleChannels();

  const getGridClass = () =&gt; {
    switch (visibleChannels.length) {
      case 1:
        return 'grid-cols-1';
      case 4:
        return 'grid-cols-2';
      case 9:
        return 'grid-cols-3';
      case 16:
      default:
        return 'grid-cols-4';
    }
  };

  return (
    &lt;div className="h-full bg-gray-950 p-2"&gt;
      &lt;div className={`grid ${getGridClass()} gap-2 h-full`}&gt;
        {visibleChannels.map((index) =&gt; {
          const rtspAddr = rtspAddrs[index];
          const isSelected = selectedChannel === index;

          return (
            &lt;div
              key={index}
              className={`relative bg-gray-800 rounded-lg overflow-hidden border-2 transition-all cursor-pointer
                ${isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/50' : 'border-gray-700 hover:border-gray-600'}
              `}
              onClick={() =&gt; onChannelClick(index)}
            &gt;
              &lt;div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-xs z-10"&gt;
                通道 {index + 1}
              &lt;/div&gt;
              
              {rtspAddr ? (
                &lt;div className="w-full h-full flex items-center justify-center bg-black"&gt;
                  &lt;div className="text-center"&gt;
                    &lt;Play className="w-12 h-12 mx-auto text-gray-500 mb-2" /&gt;
                    &lt;p className="text-gray-500 text-sm"&gt;视频流加载中...&lt;/p&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              ) : (
                &lt;div className="w-full h-full flex items-center justify-center bg-gray-900"&gt;
                  &lt;div className="text-center"&gt;
                    &lt;Camera className="w-12 h-12 mx-auto text-gray-600 mb-2" /&gt;
                    &lt;p className="text-gray-500 text-sm"&gt;点击选择设备&lt;/p&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              )}
            &lt;/div&gt;
          );
        })}
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default VideoGrid;
