
import React from 'react';
import { useAppStore } from '../store';
import { Camera, Play } from 'lucide-react';

interface VideoGridProps {
  onChannelClick: (index: number) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({ onChannelClick }) => {
  const { rtspAddrs, videoType, selectedChannel } = useAppStore();

  const getVisibleChannels = () => {
    switch (videoType) {
      case '1':
        return [0];
      case '1_4':
        return [0, 1, 2, 3];
      case '1_9':
        return [0, 1, 2, 3, 4, 5, 6, 7, 8];
      case '16':
      default:
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    }
  };

  const visibleChannels = getVisibleChannels();

  const getGridClass = () => {
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
    <div className="h-full bg-gray-950 p-2">
      <div className={`grid ${getGridClass()} gap-2 h-full`}>
        {visibleChannels.map((index) => {
          const rtspAddr = rtspAddrs[index];
          const isSelected = selectedChannel === index;

          return (
            <div
              key={index}
              className={`relative bg-gray-800 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/50' : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => onChannelClick(index)}
            >
              <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-xs z-10">
                Channel {index + 1}
              </div>
              {rtspAddr ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <div className="text-center">
                    <Play className="w-12 h-12 mx-auto text-gray-500 mb-2" />
                    <p className="text-gray-500 text-sm">Loading...</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <Camera className="w-12 h-12 mx-auto text-gray-600 mb-2" />
                    <p className="text-gray-500 text-sm">Click to select</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoGrid;
