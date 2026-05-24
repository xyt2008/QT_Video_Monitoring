
import React, { useState } from 'react';
import { useAppStore } from '../store';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Image as ImageIcon,
  Play,
  Clock,
  Send,
  Trash2,
  Download
} from 'lucide-react';

interface AlarmDetailProps {
  onNavigate: (page: string) => void;
}

const AlarmDetail: React.FC<AlarmDetailProps> = ({ onNavigate }) => {
  const { currentAlarm, updateAlarm } = useAppStore();
  const [handleDesc, setHandleDesc] = useState('');
  const [isHandling, setIsHandling] = useState(false);

  if (!currentAlarm || !currentAlarm.alarm) {
    return (
      <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400">未找到报警信息</p>
          <button
            onClick={() => onNavigate('alarmList')}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            返回报警列表
          </button>
        </div>
      </div>
    );
  }

  const { alarm, images, videos } = currentAlarm;

  const getIPCName = (ipcId: string) => {
    const { ipcs } = useAppStore.getState();
    const ipc = ipcs.find(i => i.IPCID === ipcId);
    return ipc ? ipc.IPCName : ipcId;
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN');
  };

  const handleAlarm = async () => {
    if (!handleDesc.trim()) {
      alert('请填写处理说明');
      return;
    }

    setIsHandling(true);
    try {
      await fetch(`/api/alarm/${alarm.AlarmID}/handle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ HandleDesc: handleDesc })
      });
      
      updateAlarm(alarm.AlarmID, {
        HandleStatus: '已处理',
        HandleDesc: handleDesc
      });
      
      alert('处理成功');
      onNavigate('alarmList');
    } catch (error) {
      console.error('Error handling alarm:', error);
      alert('处理失败');
    } finally {
      setIsHandling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('确定要删除此报警记录吗？')) {
      return;
    }

    try {
      await fetch(`/api/alarm/${alarm.AlarmID}`, {
        method: 'DELETE'
      });
      onNavigate('alarmList');
    } catch (error) {
      console.error('Error deleting alarm:', error);
      alert('删除失败');
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('alarmList')} className="p-2 hover:bg-gray-700 rounded">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">报警详情</h1>
          </div>
          {alarm.HandleStatus === '未处理' && (
            <div className="flex items-center space-x-2">
              <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>删除</span>
            </button>
          </div>
          )}
        </div>
      </div>

      <div className="p-6 overflow-auto" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-lg ${
                  alarm.AlarmLevel === '紧急' ? 'bg-red-500' :
                  alarm.AlarmLevel === '重要' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}>
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{alarm.AlarmType}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    {alarm.HandleStatus === '已处理' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <div className="w-5 h-5 text-red-400 animate-pulse" />
                    )}
                    <span className="text-gray-400">{alarm.HandleStatus === '已处理' ? '已处理' : '未处理'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400">设备</label>
                  <p className="font-medium">{getIPCName(alarm.IPCID)}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">报警级别</label>
                  <p className="font-medium">{alarm.AlarmLevel}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">报警时间</label>
                  <p className="font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatTime(alarm.AlarmTime)}
                  </p>
                </div>
                {alarm.HandleTime && (
                  <div>
                    <label className="block text-sm text-gray-400">处理时间</label>
                    <p className="font-medium">{formatTime(alarm.HandleTime)}</p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-400">报警描述</label>
                <p className="text-gray-200">{alarm.AlarmDesc || '暂无描述'}</p>
              </div>
            </div>

            {alarm.HandleStatus === '未处理' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">处理报警</h3>
                <textarea
                  value={handleDesc}
                  onChange={(e) => setHandleDesc(e.target.value)}
                  placeholder="请输入处理说明..."
                  className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white mb-4 resize-none"
                />
                <button
                  onClick={handleAlarm}
                  disabled={isHandling}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-500 py-3 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>{isHandling ? '处理中...' : '提交处理'}</span>
                </button>
              </div>
            )}

            {alarm.HandleStatus === '已处理' && alarm.HandleDesc && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">处理记录</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-200">{alarm.HandleDesc}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {images.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>报警图片</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image) => (
                    <div
                      key={image.ImageID}
                      className="bg-gray-700 rounded-lg p-3 flex items-center justify-center h-32"
                    >
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                        <p className="text-sm text-gray-400">图片</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>报警视频</span>
                </h3>
                <div className="space-y-3">
                  {videos.map((video) => (
                    <div
                      key={video.VideoID}
                      className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-600 rounded-lg">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">回放录像</p>
                            <p className="text-sm text-gray-400">{video.VideoDuration}秒</p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {images.length === 0 && videos.length === 0 && (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-400">暂无报警图片和视频</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmDetail;
