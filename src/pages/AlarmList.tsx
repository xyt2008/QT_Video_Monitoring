
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Eye,
  Play,
  Image as ImageIcon,
  Clock
} from 'lucide-react';

interface AlarmListProps {
  onNavigate: (page: string) => void;
}

const AlarmList: React.FC<AlarmListProps> = ({ onNavigate }) => {
  const { alarms, setAlarms, ipcs } = useAppStore();
  const [searchParams, setSearchParams] = useState({
    startTime: '',
    endTime: '',
    alarmType: '',
    ipcId: '',
    handled: undefined as boolean | undefined
  });
  const [showFilters, setShowFilters] = useState(false);

  const getIPCName = (ipcId: string) => {
    const ipc = ipcs.find(i => i.IPCID === ipcId);
    return ipc ? ipc.IPCName : ipcId;
  };

  const getAlarmLevelColor = (level: string) => {
    switch (level) {
      case '紧急':
        return 'bg-red-500';
      case '重要':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN');
  };

  useEffect(() => {
    fetchAlarms();
    const interval = setInterval(fetchAlarms, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlarms = async () => {
    try {
      const response = await fetch('/api/alarm/list');
      const data = await response.json();
      setAlarms(data.alarms);
    } catch (error) {
      console.error('Error fetching alarms:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (searchParams.startTime) params.append('startTime', searchParams.startTime);
      if (searchParams.endTime) params.append('endTime', searchParams.endTime);
      if (searchParams.alarmType) params.append('alarmType', searchParams.alarmType);
      if (searchParams.ipcId) params.append('ipcId', searchParams.ipcId);
      if (searchParams.handled !== undefined) params.append('handled', String(searchParams.handled));

      const response = await fetch(`/api/alarm/search/query?${params.toString()}`);
      const data = await response.json();
      setAlarms(data.alarms);
    } catch (error) {
      console.error('Error searching alarms:', error);
    }
  };

  const handleAlarmClick = async (alarmId: string) => {
    try {
      const response = await fetch(`/api/alarm/${alarmId}`);
      const data = await response.json();
      useAppStore.getState().setCurrentAlarm(data);
      onNavigate('alarmDetail');
    } catch (error) {
      console.error('Error fetching alarm details:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => onNavigate('main')} className="p-2 hover:bg-gray-700 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-red-400" />
            <h1 className="text-xl font-semibold">报警管理</h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            <Filter className="w-4 h-4" />
            <span>筛选</span>
          </button>
          <button
            onClick={handleSearch}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            <Search className="w-4 h-4" />
            <span>搜索</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-300">开始时间</label>
              <input
                type="datetime-local"
                value={searchParams.startTime}
                onChange={(e) => setSearchParams({ ...searchParams, startTime: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-300">结束时间</label>
              <input
                type="datetime-local"
                value={searchParams.endTime}
                onChange={(e) => setSearchParams({ ...searchParams, endTime: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-300">报警类型</label>
              <select
                value={searchParams.alarmType}
                onChange={(e) => setSearchParams({ ...searchParams, alarmType: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="">全部</option>
                <option value="移动侦测">移动侦测</option>
                <option value="越界检测">越界检测</option>
                <option value="区域入侵">区域入侵</option>
                <option value="物品遗留">物品遗留</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-300">处理状态</label>
              <select
                value={searchParams.handled === undefined ? '' : String(searchParams.handled)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchParams({
                    ...searchParams,
                    handled: value === '' ? undefined : value === 'true'
                  });
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="">全部</option>
                <option value="false">未处理</option>
                <option value="true">已处理</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 overflow-auto" style={{ height: 'calc(100vh - 160px)' }}>
        <div className="space-y-4">
          {alarms.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>暂无报警记录</p>
            </div>
          ) : (
            alarms.map((alarm) => (
              <div
                key={alarm.AlarmID}
                onClick={() => handleAlarmClick(alarm.AlarmID)}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 cursor-pointer transition-colors border-l-4"
                style={{ borderLeftColor: alarm.HandleStatus === '未处理' ? '#ef4444' : '#22c55e' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getAlarmLevelColor(alarm.AlarmLevel)}`}>
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{alarm.AlarmType}</span>
                        {alarm.HandleStatus === '已处理' && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        {getIPCName(alarm.IPCID)} · {alarm.AlarmDesc}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {formatTime(alarm.AlarmTime)}
                    </div>
                    <div className="flex items-center space-x-2">
                      {alarm.ImagePath && (
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      )}
                      {alarm.VideoPath && (
                        <Play className="w-4 h-4 text-gray-400" />
                      )}
                      <Eye className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmList;
